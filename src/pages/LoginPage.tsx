import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { LogIn } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-28 pb-20 px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full glass-panel p-8 md:p-12 text-center"
      >
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 text-gold">
          <LogIn size={32} />
        </div>
        
        <h1 className="text-3xl font-serif font-medium text-charcoal mb-4">
          {t('login.welcome', 'Welcome Back')}
        </h1>
        
        <p className="text-charcoal-muted mb-8 font-light">
          {t('login.sign_in', 'Sign in to your account to continue.')}
        </p>

        <button 
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-charcoal py-3 px-6 rounded-full font-semibold hover:bg-gray-50 transition-colors shadow-sm"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
          {t('login.google', 'Sign in with Google')}
        </button>
      </motion.div>
    </div>
  );
}
