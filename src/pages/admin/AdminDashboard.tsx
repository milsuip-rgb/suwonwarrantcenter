import { Activity, FileText, Users, Eye } from "lucide-react";
import { useState, useEffect } from "react";
import { db, handleFirestoreError, OperationType } from "../../lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";

export default function AdminDashboard() {
  const [counts, setCounts] = useState({ cases: 0, lawyers: 0, reviews: 0, popups: 0 });

  useEffect(() => {
    const unsubCases = onSnapshot(collection(db, "cases"), (snap) => setCounts(prev => ({...prev, cases: snap.size})), (err) => handleFirestoreError(err, OperationType.GET, "cases"));
    const unsubLawyers = onSnapshot(collection(db, "lawyers"), (snap) => setCounts(prev => ({...prev, lawyers: snap.size})), (err) => handleFirestoreError(err, OperationType.GET, "lawyers"));
    const unsubReviews = onSnapshot(collection(db, "reviews"), (snap) => setCounts(prev => ({...prev, reviews: snap.size})), (err) => handleFirestoreError(err, OperationType.GET, "reviews"));
    const unsubPopups = onSnapshot(collection(db, "popups"), (snap) => {
      let active = 0;
      snap.forEach(doc => { if (doc.data().status === '활성') active++; });
      setCounts(prev => ({...prev, popups: active}));
    }, (err) => handleFirestoreError(err, OperationType.GET, "popups"));

    return () => { unsubCases(); unsubLawyers(); unsubReviews(); unsubPopups(); }
  }, []);

  const stats = [
    { name: "총 성공사례", value: counts.cases, icon: FileText, color: "text-[#2D7DFF]", bg: "bg-[#2D7DFF]/10" },
    { name: "등록된 변호사", value: counts.lawyers, icon: Users, color: "text-green-500", bg: "bg-green-500/10" },
    { name: "의뢰인 후기", value: counts.reviews, icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10" },
    { name: "활성 팝업", value: counts.popups, icon: Activity, color: "text-amber-500", bg: "bg-amber-500/10" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-[#0B0F17] p-6 rounded-xl border border-white/5 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-medium mb-1">{stat.name}</p>
              <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
            </div>
            <div className={`w-12 h-12 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#0B0F17] rounded-xl border border-white/5 p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-gray-500 text-sm">관리자 대시보드에 오신 것을 환영합니다.</p>
      </div>
    </div>
  );
}
