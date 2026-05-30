import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Share2, ExternalLink } from 'lucide-react';
import Logo from '../ui/Logo';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-charcoal text-white/70 relative overflow-hidden">
      {/* Subtle gold glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-gold/6 blur-[80px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">

          {/* Brand */}
          <div className="space-y-5 md:col-span-1">
            <Logo className="text-white" />
            <p className="text-sm leading-relaxed text-white/50 max-w-xs mt-2">
              {t('footer.brand_desc', 'Crafting timeless spaces inspired by the royal heritage of Jaipur. Where luxury meets legacy.')}
            </p>
            <div className="flex gap-4 pt-1">
              <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                <Globe size={14} />
              </a>
              <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                <Share2 size={14} />
              </a>
              <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-gold/50 hover:text-gold transition-all">
                <ExternalLink size={14} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-6">{t('footer.quick_links', 'Quick Links')}</h3>
            <ul className="space-y-3 text-sm">
              {[
                { label: t('nav.home', 'Home'), path: '/' },
                { label: t('nav.properties', 'Properties'), path: '/properties' },
                { label: t('nav.about', 'About Us'), path: '/about' },
                { label: t('nav.contact', 'Contact'), path: '/contact' },
              ].map(l => (
                <li key={l.path}>
                  <Link to={l.path} className="hover:text-gold transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Properties */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-6">{t('footer.properties', 'Properties')}</h3>
            <ul className="space-y-3 text-sm">
              {[
                t('footer.prop_luxury', 'Luxury Villas'),
                t('footer.prop_premium', 'Premium Apartments'),
                t('footer.prop_commercial', 'Commercial Spaces'),
                t('footer.prop_ready', 'Ready to Move')
              ].map(item => (
                <li key={item}>
                  <Link to="/properties" className="hover:text-gold transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-widest mb-6">{t('footer.get_in_touch', 'Get in Touch')}</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span className="leading-relaxed">Second Floor, C/15, Ganga Marg,<br/>Indra Gandhi Nagar, Sector-1, Jagatpura<br/>Jaipur, Rajasthan, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="text-gold shrink-0" />
                <span>+91 84420 83670 / +91 94608 02222</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="text-gold shrink-0" />
                <span>ngbuild@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="gold-divider mb-8" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/35">
          <p>© {new Date().getFullYear()} AngGroup Real Estate. {t('footer.rights', 'All rights reserved.')}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold transition-colors">{t('footer.privacy', 'Privacy Policy')}</Link>
            <Link to="/terms" className="hover:text-gold transition-colors">{t('footer.terms', 'Terms of Service')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
