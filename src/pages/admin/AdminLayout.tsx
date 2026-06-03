import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Scale, UserCircle, MessageSquare, AppWindow, LogOut, Key } from "lucide-react";
import { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "../../lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export default function AdminLayout() {
  const location = useLocation();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) return <div className="h-screen bg-[#070B13] flex items-center justify-center text-white">Loading...</div>;

  if (!user) {
    return (
      <div className="h-screen bg-[#070B13] flex items-center justify-center flex-col gap-6 text-white text-center px-4">
        <h1 className="text-3xl font-bold">관리자 로그인</h1>
        <p className="text-gray-400 max-w-md break-keep">관리자 페이지는 구글 계정 로그인이 필요합니다. 접근 권한이 있는 계정으로 로그인해 주세요.</p>
        <button 
          onClick={signInWithGoogle}
          className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
        >
          <Key size={18} />
          구글 계정으로 로그인
        </button>
        <Link to="/" className="text-sm text-gray-500 hover:text-white underline mt-4">사이트로 돌아가기</Link>
      </div>
    );
  }

  const navItems = [
    { path: "/admin", name: "대시보드", icon: LayoutDashboard },
    { path: "/admin/cases", name: "성공사례 관리", icon: Scale },
    { path: "/admin/lawyer", name: "변호사 소개 관리", icon: UserCircle },
    { path: "/admin/reviews", name: "의뢰인 후기 관리", icon: MessageSquare },
    { path: "/admin/popups", name: "팝업창 관리", icon: AppWindow },
  ];

  return (
    <div className="flex h-screen bg-[#070B13] text-white font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0B0F17] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h1 className="text-xl font-bold tracking-tighter text-white">
            법진 <span className="text-[#2D7DFF]">관리자</span>
          </h1>
          <p className="text-xs text-gray-500 mt-2 truncate">{user.email}</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-[#2D7DFF] text-white" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={20} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 flex flex-col gap-2">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-white/5 hover:text-red-300 transition-colors text-left"
          >
            <LogOut size={20} />
            <span className="font-medium text-sm">로그아웃</span>
          </button>
          <Link 
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
          >
            <AppWindow size={20} />
            <span className="font-medium text-sm">사이트로 돌아가기</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-white/10 bg-[#0B0F17] flex items-center px-8">
          <h2 className="text-lg font-bold text-gray-200">
            {navItems.find(item => item.path === location.pathname)?.name || "관리자 모드"}
          </h2>
        </header>
        <div className="flex-1 overflow-auto p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
