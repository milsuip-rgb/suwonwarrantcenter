import { Plus, Edit2, Trash2, X, Image as ImageIcon } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

interface Lawyer {
  id: string;
  name: string;
  role: string;
  type: string;
  image?: string;
  order?: number;
  badges?: string;
  createdAt: number;
  updatedAt: number;
}

export default function AdminLawyers() {
  const [lawyers, setLawyers] = useState<Lawyer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", role: "", type: "", image: "", order: 0, badges: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "lawyers"), (snapshot) => {
      const data: Lawyer[] = [];
      snapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() } as Lawyer);
      });
      setLawyers(data.sort((a,b) => {
        const orderA = a.order || 0;
        const orderB = b.order || 0;
        if (orderA !== orderB) return orderA - orderB;
        return b.createdAt - a.createdAt;
      }));
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, "lawyers");
    });
    return () => unsub();
  }, []);

  const handleOpenModal = (lawyer?: Lawyer) => {
    if (lawyer) {
      setEditingId(lawyer.id);
      setFormData({ name: lawyer.name, role: lawyer.role, type: lawyer.type, image: lawyer.image || "", order: lawyer.order || 0, badges: lawyer.badges || "" });
    } else {
      setEditingId(null);
      setFormData({ name: "", role: "", type: "", image: "", order: 0, badges: "" });
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
          
          // Max dimension 800px
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
        await updateDoc(doc(db, "lawyers", editingId), {
          ...formData,
           updatedAt: now
        });
      } else {
        await addDoc(collection(db, "lawyers"), {
          ...formData,
          createdAt: now,
          updatedAt: now
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "lawyers");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "lawyers", id));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "lawyers");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#0B0F17] p-6 rounded-xl border border-white/5">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">변호사 소개 관리</h2>
          <p className="text-sm text-gray-400">웹사이트에 표시될 변호사 프로필을 관리합니다.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-[#2D7DFF] text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-[#1A63DC] transition-colors"
        >
          <Plus size={16} /> 신규 등록
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lawyers.map(lawyer => (
          <div key={lawyer.id} className="bg-[#0B0F17] border border-white/5 rounded-xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-start">
               <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center text-gray-400 overflow-hidden shrink-0 border border-white/10">
                 {lawyer.image ? <img src={lawyer.image} alt={lawyer.name} className="w-full h-full object-cover" /> : <ImageIcon size={24} />}
               </div>
               <div className="flex gap-2">
                 <button onClick={() => handleOpenModal(lawyer)} className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded transition-colors"><Edit2 size={16} /></button>
                 <button onClick={() => handleDelete(lawyer.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-400/10 rounded transition-colors"><Trash2 size={16} /></button>
               </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-gray-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                  순서: {lawyer.order || 0}
                </span>
                <h3 className="text-lg font-bold text-white">{lawyer.name}</h3>
                <span className="text-xs text-[#2D7DFF] bg-[#2D7DFF]/10 px-2 py-0.5 rounded">{lawyer.role}</span>
              </div>
              <p className="text-xs text-gray-400">{lawyer.type}</p>
            </div>
          </div>
        ))}
        {lawyers.length === 0 && (
          <div className="col-span-full py-12 text-center text-gray-500 bg-[#0B0F17] rounded-xl border border-white/5">
            등록된 변호사가 없습니다.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0B0F17] border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden relative flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-4 right-4 text-white/50 hover:text-white p-2 hover:bg-white/5 rounded-full transition-colors z-30 bg-black/20 backdrop-blur-md"
            >
              <X size={20} />
            </button>

            <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden">
              <div className="overflow-y-auto">
                {/* LIVE PREVIEW HEADER */}
                <div className="h-72 w-full relative group">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-opacity group-hover:opacity-40"
                    style={{ backgroundImage: `url(${formData.image || "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=800&q=80"})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-transparent pointer-events-none" />
                  
                  {/* UPLOAD BUTTON OVERLAY */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                     <input 
                       type="file" 
                       accept="image/*" 
                       ref={fileInputRef} 
                       onChange={handleImageUpload} 
                       className="hidden" 
                     />
                     <div className="flex flex-col items-center gap-2 bg-black/50 hover:bg-black/70 text-white px-5 py-4 rounded-xl backdrop-blur-sm transition-all pointer-events-none">
                       <ImageIcon size={28} />
                       <span className="text-sm font-bold">이미지 변경 (클릭)</span>
                       <span className="text-[10px] text-gray-400">자동 최적화 적용</span>
                     </div>
                  </div>

                  <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col items-center translate-y-2 pointer-events-none text-center">
                    <div className="flex flex-col gap-1.5 mb-3 items-center">
                      {formData.badges ? (
                        formData.badges.split(',').map((badge, idx) => {
                          const b = badge.trim();
                          if (!b) return null;
                          return (
                            <span key={idx} className={`bg-transparent border ${b.includes('형사전문') ? 'border-[#D4AF37]/30 text-[#D4AF37]' : b.includes('전담') ? 'border-[#FF5A5A]/40 text-[#FF5A5A]' : 'border-white/20 text-white'} text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide`}>
                              {b}
                            </span>
                          );
                        })
                      ) : (
                        <span className="bg-transparent border border-white/20 text-white text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide">
                          배지 미리보기
                        </span>
                      )}
                    </div>
                    <h2 className="text-2xl font-black text-white tracking-tight">{formData.role || "직책"} {formData.name || "이름"}</h2>
                  </div>
                </div>

                <div className="p-6 md:p-8 pt-6 space-y-4 bg-[#0B0F17]">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">이름</label>
                    <input 
                      type="text" 
                      value={formData.name} 
                      onChange={e => setFormData({...formData, name: e.target.value})} 
                      className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                      placeholder="예: 홍길동"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">직책</label>
                    <input 
                      type="text" 
                      value={formData.role} 
                      onChange={e => setFormData({...formData, role: e.target.value})} 
                      className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                      placeholder="예: 대표 변호사"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">배지 (쉼표(,)로 구분)</label>
                    <input 
                      type="text" 
                      value={formData.badges} 
                      onChange={e => setFormData({...formData, badges: e.target.value})} 
                      className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF]"
                      placeholder="예: 영장실질심사 전담, 대한변호사협회 형사전문변호사"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">전문 분야 / 주요 약력 (줄바꿈으로 구분)</label>
                    <textarea 
                      rows={5}
                      value={formData.type} 
                      onChange={e => setFormData({...formData, type: e.target.value})} 
                      className="w-full bg-[#070B13] border border-white/10 rounded px-3 py-2 text-white outline-none focus:border-[#2D7DFF] resize-none"
                      required
                    />
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
                </div>
              </div>

              <div className="p-5 border-t border-white/10 bg-[#0B0F17] shrink-0 flex justify-end gap-2">
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
