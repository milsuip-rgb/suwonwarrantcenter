import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface CaseItem {
  id: string;
  station: string;
  charge: string;
  fact: string;
  defense: string;
  result: string;
  status: string;
  image?: string;
  order?: number;
  createdAt: number;
  updatedAt: number;
}

export default function AdminCases() {
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    station: "", charge: "", fact: "", defense: "", result: "", status: "공개", image: "", order: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "cases"), (snapshot) => {
      const data: CaseItem[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as CaseItem);
      });
      setCases(data.sort((a,b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.createdAt - a.createdAt;
      }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "cases");
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (item?: CaseItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({
        station: item.station, charge: item.charge, fact: item.fact, 
        defense: item.defense, result: item.result, status: item.status, 
        image: item.image || "",
        order: item.order || 0
      });
    } else {
      setEditingId(null);
      setFormData({
        station: "", charge: "", fact: "", defense: "", result: "", status: "공개", image: "", order: 0
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      console.error("이미지 크기는 5MB 이하로 업로드해주세요.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          
          const MAX_SIZE = 800;
          if (width > height && width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          } else if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
            setFormData(prev => ({ ...prev, image: compressedBase64 }));
          }
        };
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = Date.now();
      if (editingId) {
        await updateDoc(doc(db, "cases", editingId), {
          ...formData,
           updatedAt: now
        });
      } else {
        await addDoc(collection(db, "cases"), {
          ...formData,
          createdAt: now,
          updatedAt: now
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "cases");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "cases", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "cases");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F17] p-6 rounded-xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">성공사례 관리</h2>
          <p className="text-sm text-gray-400">웹사이트에 표시될 성공사례를 추가하거나 수정할 수 있습니다.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#2D7DFF] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1A63DC] transition-colors">
          <Plus size={16} /> 신규 등록
        </button>
      </div>

      <div className="bg-[#0B0F17] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">순서</th>
              <th className="px-6 py-4">경찰서/법원</th>
              <th className="px-6 py-4">죄명(분류)</th>
              <th className="px-6 py-4">결과</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {cases.map((item) => (
              <tr key={item.id} className="hover:bg-white-[0.02] transition-colors">
                <td className="px-6 py-4">{item.order || 0}</td>
                <td className="px-6 py-4">
                   <span className="bg-white/10 text-xs px-2 py-1 rounded text-white">{item.station}</span>
                </td>
                <td className="px-6 py-4 font-medium text-white">{item.charge}</td>
                <td className="px-6 py-4 font-bold text-[#2D7DFF]">{item.result}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === '공개' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-500/10'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleOpenModal(item)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors" title="수정">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors" title="삭제">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {cases.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">등록된 성공사례가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F17] border border-white/10 rounded-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-white/10 shrink-0">
              <h3 className="text-lg font-bold text-white">{editingId ? "성공사례 수정" : "성공사례 등록"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="overflow-y-auto p-5">
              <form id="case-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">관할 기관 (예: 수원지방법원, 경기남부경찰서)</label>
                  <input 
                    type="text" 
                    value={formData.station} 
                    onChange={e => setFormData({...formData, station: e.target.value})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">죄명 / 사건 분류 (예: 마약류 관리법 위반)</label>
                  <input 
                    type="text" 
                    value={formData.charge} 
                    onChange={e => setFormData({...formData, charge: e.target.value})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">범죄사실 요지 (사건의 발단)</label>
                  <textarea 
                    rows={3}
                    value={formData.fact} 
                    onChange={e => setFormData({...formData, fact: e.target.value})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF] resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">사건의 핵심 및 방어논리</label>
                  <textarea 
                    rows={3}
                    value={formData.defense} 
                    onChange={e => setFormData({...formData, defense: e.target.value})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF] resize-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">최종 결과 (예: 구속영장 기각, 무혐의 처분)</label>
                  <input 
                    type="text" 
                    value={formData.result} 
                    onChange={e => setFormData({...formData, result: e.target.value})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">증빙 자료 이미지 (영장청구서 등)</label>
                   <div className="flex items-center gap-4">
                    <div className="w-20 h-20 bg-white/5 rounded flex items-center justify-center border border-white/10 overflow-hidden shrink-0">
                      {formData.image ? <img src={formData.image} className="w-full h-full object-cover" /> : <ImageIcon size={24} className="text-gray-500" />}
                    </div>
                    <div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          ref={fileInputRef} 
                          onChange={handleImageUpload} 
                          className="hidden" 
                        />
                        <button 
                          type="button" 
                          onClick={() => fileInputRef.current?.click()}
                          className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
                        >
                          내 컴퓨터에서 사진 업로드
                        </button>
                        <p className="text-[10px] text-gray-500 mt-1">최대 1MB 이하로 압축된 이미지 권장</p>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">노출 순서 (숫자가 작을수록 먼저 표시됩니다)</label>
                  <input 
                    type="number" 
                    value={formData.order} 
                    onChange={e => setFormData({...formData, order: parseInt(e.target.value) || 0})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">상태</label>
                  <select 
                    value={formData.status} 
                    onChange={e => setFormData({...formData, status: e.target.value})} 
                    className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                  >
                    <option value="공개">공개</option>
                    <option value="비공개">비공개</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="p-5 border-t border-white/10 shrink-0 flex justify-end gap-2 bg-[#0B0F17]">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded text-sm text-gray-400 hover:text-white transition-colors"
              >
                취소
              </button>
              <button 
                type="submit" 
                form="case-form"
                className="px-4 py-2 rounded text-sm font-bold bg-[#2D7DFF] text-white hover:bg-[#1A63DC] transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
