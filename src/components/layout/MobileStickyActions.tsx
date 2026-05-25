import { Phone, MessageCircle, Mail } from 'lucide-react';
import { useState, useEffect } from 'react';
import clsx from 'clsx';

export default function MobileStickyActions() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={clsx(
        'fixed bottom-0 left-0 right-0 z-40 md:hidden transition-transform duration-300',
        isVisible ? 'translate-y-0' : 'translate-y-full'
      )}
    >
      {/* Gold top border */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      <div className="bg-charcoal flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.15)]">
        <a
          href="tel:+919166798906"
          className="flex flex-col items-center justify-center py-3.5 flex-1 text-white/70 hover:text-gold transition-colors border-r border-white/8 text-center"
        >
          <Phone size={20} className="mb-1" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Call</span>
        </a>
        <a
          href="https://wa.me/919166798906"
          target="_blank"
          rel="noreferrer"
          className="flex flex-col items-center justify-center py-3.5 flex-1 text-white/70 hover:text-green-400 transition-colors border-r border-white/8 text-center"
        >
          <MessageCircle size={20} className="mb-1" />
          <span className="text-[9px] uppercase tracking-widest font-bold">WhatsApp</span>
        </a>
        <a
          href="mailto:ngbuild@gmail.com"
          className="flex flex-col items-center justify-center py-3.5 flex-1 text-white/70 hover:text-gold transition-colors text-center"
        >
          <Mail size={20} className="mb-1" />
          <span className="text-[9px] uppercase tracking-widest font-bold">Email</span>
        </a>
      </div>
    </div>
  );
}
