import { PhoneCall, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#070B13] flex h-[70px] shadow-[0_-10px_30px_rgba(0,0,0,0.8)] border-t border-white/10">
      <Link to="/contact#consultation-form" className="flex-1 flex gap-2 items-center justify-center bg-[#0B0F17] hover:bg-white/5 transition-colors text-white">
        <Send size={18} />
        <span className="text-sm font-bold tracking-tight">상담신청</span>
      </Link>
      <a href="tel:031-214-5566" className="flex-1 flex gap-2 items-center justify-center bg-[#2D7DFF] hover:bg-[#1A63DC] transition-colors text-white shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]">
        <PhoneCall size={18} className="animate-pulse" />
        <span className="text-sm font-bold tracking-tight">즉시 전화상담</span>
      </a>
    </div>
  );
}
