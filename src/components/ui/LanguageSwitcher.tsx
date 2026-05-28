import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-charcoal/10 hover:border-gold/50 bg-white/50 backdrop-blur-sm transition-all duration-300"
        title="Switch Language"
      >
        <Globe className="w-4 h-4 text-charcoal/70" />
        <span className="text-xs font-sans font-medium uppercase text-charcoal">
          {i18n.language.startsWith('hi') ? 'HI' : 'EN'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-32 rounded-xl bg-white/90 backdrop-blur-xl border border-gold/10 shadow-lg overflow-hidden z-50">
          <div className="flex flex-col py-1">
            <button
              onClick={() => toggleLanguage('en')}
              className={`px-4 py-2 text-sm text-left transition-colors font-sans ${
                i18n.language.startsWith('en')
                  ? 'bg-gold/10 text-gold font-medium'
                  : 'text-charcoal hover:bg-black/5'
              }`}
            >
              English
            </button>
            <button
              onClick={() => toggleLanguage('hi')}
              className={`px-4 py-2 text-sm text-left transition-colors font-sans ${
                i18n.language.startsWith('hi')
                  ? 'bg-gold/10 text-gold font-medium'
                  : 'text-charcoal hover:bg-black/5'
              }`}
            >
              हिंदी (Hindi)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
