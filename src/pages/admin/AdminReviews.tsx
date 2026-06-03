import { Plus, Edit2, Trash2, X, Check } from "lucide-react";
import React, { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface ReviewItem {
  id: string;
  writer: string;
  result: string;
  title: string;
  content: string;
  image?: string;
  status: string;
  createdAt: number;
  updatedAt: number;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ writer: "", result: "", title: "", content: "", image: "", status: "승인됨" });

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "reviews"), (snapshot) => {
      const data: ReviewItem[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as ReviewItem);
      });
      setReviews(data.sort((a,b) => b.createdAt - a.createdAt));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "reviews");
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (item?: ReviewItem) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ writer: item.writer, result: item.result || "", title: item.title || "", content: item.content, image: item.image || "", status: item.status });
    } else {
      setEditingId(null);
      setFormData({ writer: "", result: "", title: "", content: "", image: "", status: "승인됨" });
    }
    setIsModalOpen(true);
  };

  const handleApprove = async (item: ReviewItem) => {
    try {
      await updateDoc(doc(db, "reviews", item.id), {
        status: "승인됨",
        updatedAt: Date.now()
      });
    } catch (error) {
       handleFirestoreError(error, OperationType.UPDATE, "reviews");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const now = Date.now();
      if (editingId) {
        await updateDoc(doc(db, "reviews", editingId), {
          ...formData,
           updatedAt: now
        });
      } else {
        await addDoc(collection(db, "reviews"), {
          ...formData,
          createdAt: now,
          updatedAt: now
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "reviews");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "reviews");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F17] p-6 rounded-xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">의뢰인 후기 관리</h2>
          <p className="text-sm text-gray-400">웹사이트에 접수된 후기를 승인하거나 직접 작성할 수 있습니다.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 bg-[#2D7DFF] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1A63DC] transition-colors">
          <Plus size={16} /> 후기 직접 작성
        </button>
      </div>

      <div className="bg-[#0B0F17] rounded-xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-sm text-gray-300">
          <thead className="bg-white/5 text-gray-400 font-medium">
            <tr>
              <th className="px-6 py-4">작성자</th>
              <th className="px-6 py-4">결과</th>
              <th className="px-6 py-4">제목</th>
              <th className="px-6 py-4">이미지</th>
              <th className="px-6 py-4">내용</th>
              <th className="px-6 py-4">상태</th>
              <th className="px-6 py-4 text-right">관리</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {reviews.map((item) => (
              <tr key={item.id} className="hover:bg-white-[0.02] transition-colors">
                <td className="px-6 py-4 font-medium text-white">{item.writer}</td>
                <td className="px-6 py-4">{item.result}</td>
                <td className="px-6 py-4">{item.title}</td>
                <td className="px-6 py-4">
                  {item.image ? (
                    <div className="w-10 h-10 rounded border border-white/10 overflow-hidden bg-white/5">
                      <img src={item.image} alt="review" className="w-full h-full object-cover" />
                    </div>
                  ) : <span className="text-gray-500">-</span>}
                </td>
                <td className="px-6 py-4 max-w-sm"><p className="truncate block">{item.content}</p></td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${item.status === '승인됨' ? 'text-green-400 bg-green-400/10' : 'text-amber-400 bg-amber-400/10'}`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    {item.status === '대기중' && (
                      <button onClick={() => handleApprove(item)} className="p-1.5 text-[#2D7DFF] hover:bg-[#2D7DFF]/10 rounded transition-colors" title="승인">
                        <Check size={16} />
                      </button>
                    )}
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
            {reviews.length === 0 && (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">등록된 후기가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

       {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F17] border border-white/10 rounded-xl w-full max-w-md overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-white/10">
              <h3 className="text-lg font-bold text-white">{editingId ? "후기 수정" : "새 후기 작성"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">작성자 (익명 처리 권장)</label>
                <input 
                  type="text" 
                  value={formData.writer} 
                  onChange={e => setFormData({...formData, writer: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">결과 (예: 구속영장 기각)</label>
                <input 
                  type="text" 
                  value={formData.result} 
                  onChange={e => setFormData({...formData, result: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                  required
                />
              </div>
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
                <label className="block text-sm text-gray-400 mb-1">내용</label>
                <textarea 
                  rows={4}
                  value={formData.content} 
                  onChange={e => setFormData({...formData, content: e.target.value})} 
                  className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF] resize-none"
                  required
                ></textarea>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">참고 이미지 첨부</label>
                {formData.image && (
                  <div className="mb-2 relative w-32 h-32 rounded border border-white/10 overflow-hidden">
                    <img src={formData.image} alt="preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFormData({...formData, image: ""})} 
                      className="absolute top-1 right-1 bg-black/60 p-1 rounded-full hover:bg-black/80"
                    >
                      <X size={14} className="text-white" />
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
                            const MAX_DIM = 800; // max dimension

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
                              const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
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
                  <option value="승인됨">승인됨</option>
                  <option value="대기중">대기중</option>
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
