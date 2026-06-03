import { Plus, Edit2, Trash2, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface PopupItem {
  id: string;
  title: string;
  date: string;
  status: string;
  content: string;
  image?: string;
  createdAt: number;
  updatedAt: number;
}

export default function AdminPopups() {
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", date: "", status: "활성", content: "", image: "" });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "popups"), (snapshot) => {
      const data: PopupItem[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as PopupItem);
      });
      setPopups(data.sort((a,b) => b.createdAt - a.createdAt));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "popups");
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (item?: PopupItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ title: item.title, date: item.date, status: item.status, content: item.content, image: item.image || "" });
    } else {
      setEditingId(null);
      setFormData({ title: "", date: "상시", status: "활성", content: "", image: "" });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = Date.now();
      if (editingId) {
        await updateDoc(doc(db, "popups", editingId), {
          ...formData,
           updatedAt: now
        });
      } else {
        await addDoc(collection(db, "popups"), {
          ...formData,
          createdAt: now,
          updatedAt: now
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "popups");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "popups", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "popups");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F17] p-6 rounded-xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">팝업창 관리</h2>
          <p className="text-sm text-gray-400">웹사이트 접속 시 띄울 팝업창을 설정합니다.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#2D7DFF] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1A63DC] transition-colors">
          <Plus size={16} /> 신규 팝업
        </button>
      </div>

      <div className="bg-[#0B0F17] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">이미지</th>
              <th className="px-6 py-4">제목</th>
              <th className="px-6 py-4">노출 기간</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {popups.map((item) => (
              <tr key={item.id} className="hover:bg-white-[0.02] transition-colors">
                <td className="px-6 py-4">
                  {item.image ? (
                    <div className="w-16 h-16 rounded border border-white/10 overflow-hidden bg-white/5">
                      <img src={item.image} alt="popup" className="w-full h-full object-cover" />
                    </div>
                  ) : <span className="text-gray-500">-</span>}
                </td>
                <td className="px-6 py-4 font-medium text-white">{item.title}</td>
                <td className="px-6 py-4 text-gray-400">{item.date}</td>
                <td className="px-6 py-4">
                   <span className={`text-xs px-2 py-1 rounded-full ${item.status === '활성' ? 'text-green-400 bg-green-400/10' : 'text-gray-400 bg-gray-500/10'}`}>
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
            {popups.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">등록된 팝업이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F17] border border-white/10 rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">{editingId ? "팝업 수정" : "새 팝업 등록"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">제목</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">내용 (안내문구)</label>
                <textarea 
                  rows={4}
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF] resize-none"
                  required
                ></textarea>
              </div>
               <div>
                <label className="block text-sm text-gray-400 mb-1">노출 기간 (예: 2023-11-01 ~ 상시)</label>
                <input 
                  type="text" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">팝업 이미지 (선택)</label>
                {formData.image && (
                  <div className="mb-2 relative w-full h-32 rounded border border-white/10 overflow-hidden bg-white/5 flex items-center justify-center">
                    <img src={formData.image} alt="preview" className="max-w-full max-h-full object-contain" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image: ""})} 
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full hover:bg-black/80 transition-colors"
                    >
                      <X size={16} className="text-white" />
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        if (event.target && event.target.result) {
                          const img = new Image();
                          img.onload = () => {
                            const canvas = document.createElement("canvas");
                            let width = img.width;
                            let height = img.height;
                            const MAX_DIM = 1200; // max dimension for popup might be larger

                            if (width > height) {
                              if (width > MAX_DIM) {
                                height *= MAX_DIM / width;
                                width = MAX_DIM;
                              }
                            } else {
                              if (height > MAX_DIM) {
                                width *= MAX_DIM / height;
                                height = MAX_DIM;
                              }
                            }

                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext("2d");
                            if (ctx) {
                              ctx.drawImage(img, 0, 0, width, height);
                              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.9);
                              setFormData(prev => ({ ...prev, image: compressedBase64 }));
                            }
                          };
                          img.src = event.target.result as string;
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF] text-sm file:mr-4 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#2D7DFF]/10 file:text-[#59C7FF] hover:file:bg-[#2D7DFF]/20"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">상태</label>
                <select 
                  value={formData.status} 
                  onChange={e => setFormData({...formData, status: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                >
                  <option value="활성">활성</option>
                  <option value="비활성">비활성</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded text-sm text-gray-400 hover:text-white transition-colors"
                >
                  취소
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded text-sm font-bold bg-[#2D7DFF] text-white hover:bg-[#1A63DC] transition-colors"
                >
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
