import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../ui/Logo';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Properties', path: '/properties' },
    { name: 'Partners', path: '/partners' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const solidNav = isScrolled || !isHome;

  return (
    <header className="fixed left-0 right-0 top-0 z-50">
      <div className={clsx(
        'transition-all duration-500',
        solidNav
          ? 'mx-4 md:mx-8 mt-3 rounded-2xl glass-panel px-6 py-3'
          : 'container mx-auto px-6 py-6'
      )}>
        <div className="flex justify-between items-center">
          <Link to="/" className="z-50">
            <Logo className={solidNav ? 'text-charcoal' : 'text-white drop-shadow-lg'} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={clsx(
                  'text-xs font-semibold uppercase tracking-[0.12em] transition-colors duration-200 relative group',
                  solidNav
                    ? location.pathname === link.path
                      ? 'text-gold'
                      : 'text-charcoal/70 hover:text-charcoal'
                    : location.pathname === link.path
                      ? 'text-gold-glow'
                      : 'text-white/85 hover:text-white'
                )}
              >
                {link.name}
                <span className={clsx(
                  'absolute -bottom-1 left-0 h-px w-0 group-hover:w-full transition-all duration-300',
                  solidNav ? 'bg-gold' : 'bg-gold-glow'
                )} />
              </Link>
            ))}
            <Link
              to="/contact"
              className={clsx(
                'btn-gold text-xs py-2.5 px-6',
                !solidNav && 'shadow-[0_4px_20px_rgba(0,0,0,0.25)]'
              )}
            >
              Inquire Now
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className={clsx(
              'md:hidden z-50 w-10 h-10 flex items-center justify-center rounded-full transition-colors',
              isMobileMenuOpen
                ? 'bg-gold/10 text-charcoal'
                : solidNav
                  ? 'text-charcoal'
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-ivory-50"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8">
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
                        ? 'text-gold'
                        : 'text-charcoal hover:text-gold'
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
              >
                <Link to="/contact" className="btn-gold mt-4">
                  Inquire Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
