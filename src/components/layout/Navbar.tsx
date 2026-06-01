import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../ui/LanguageSwitcher';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user, profile, signOut } = useAuth();
  const { t } = useTranslation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: t('nav.home', 'Home'), path: '/' },
    { name: t('nav.properties', 'Properties'), path: '/properties' },
    { name: t('nav.emi', 'EMI Calc'), path: '/emi-calculator' },
    { name: t('nav.about', 'About Us'), path: '/about' },
    { name: t('nav.contact', 'Contact'), path: '/contact' },
    ...(profile?.role === 'admin' ? [{ name: t('nav.admin', 'Admin'), path: '/admin' }] : []),
  ];

  const solidNav = isScrolled || !isHome;

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className={clsx(
        'transition-all duration-500 w-full',
        solidNav
          ? 'bg-[#1A1A1A]/97 backdrop-blur-md border-b border-[#C9A84C]/15 shadow-[0_1px_24px_rgba(0,0,0,0.25)]'
          : 'bg-transparent'
      )}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-10 py-4">
          
          {/* Logo */}
          <Link to="/" className="z-50 shrink-0">
            <Logo className="drop-shadow-md" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={clsx(
                    'relative text-xs font-semibold uppercase tracking-[0.14em] transition-colors duration-200 group',
                    isActive
                      ? 'text-[#E8D08A]'
                      : 'text-white/75 hover:text-white'
                  )}
                >
                  {link.name}
                  {/* Active/hover underline */}
                  <span className={clsx(
                    'absolute -bottom-1 left-0 h-px transition-all duration-300',
                    isActive
                      ? 'w-full bg-[#C9A84C]'
                      : 'w-0 group-hover:w-full bg-[#C9A84C]/60'
                  )} />
                </Link>
              );
            })}

            {/* Auth */}
            {user ? (
              <button
                onClick={signOut}
                className="text-xs font-bold uppercase tracking-[0.14em] text-white/60 hover:text-white transition-colors border-l border-white/10 pl-6 ml-1"
              >
                {t('nav.sign_out', 'Sign Out')}
              </button>
            ) : (
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-[0.14em] text-white/60 hover:text-white transition-colors border-l border-white/10 pl-6 ml-1"
              >
                {t('nav.login', 'Login')}
              </Link>
            )}
            <LanguageSwitcher />
          </nav>

          {/* Mobile hamburger */}
          <button
            className={clsx(
              'md:hidden z-50 w-10 h-10 flex items-center justify-center rounded-full transition-all',
              isMobileMenuOpen
                ? 'bg-[#C9A84C]/10 text-[#E8D08A]'
                : 'text-white'
            )}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-[#1A1A1A]"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
              {/* Gold line decoration */}
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent mb-4" />
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link
                    to={link.path}
                    className={clsx(
                      'text-3xl font-serif transition-colors',
                      location.pathname === link.path
                        ? 'text-[#E8D08A]'
                        : 'text-white/80 hover:text-[#E8D08A]'
                    )}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.07 }}
                className="flex flex-col items-center gap-4 mt-4"
              >
                {user ? (
                  <button onClick={signOut} className="btn-gold mt-2">
                    {t('nav.sign_out', 'Sign Out')}
                  </button>
                ) : (
                  <Link to="/login" className="btn-gold mt-2">
                    {t('nav.login', 'Login')}
                  </Link>
                )}
                <div className="mt-4 flex justify-center">
                  <LanguageSwitcher />
                </div>
              </motion.div>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#C9A84C]/50 to-transparent mt-4" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
