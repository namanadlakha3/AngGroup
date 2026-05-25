import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ChevronDown } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="container mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <p className="section-label justify-center mb-5">
            <span>Get in Touch</span>
          </p>
          <h1 className="text-5xl md:text-6xl font-serif font-medium text-charcoal mb-5 leading-tight">
            Contact Us
          </h1>
          <p className="text-charcoal-muted text-lg font-light">
            Whether you are looking for your dream home or a lucrative investment, our team of experts is ready to assist you.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-10">

          {/* Contact Info */}
          <div className="lg:w-2/5 space-y-5">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-charcoal rounded-2xl p-8 text-white space-y-8 relative overflow-hidden"
            >
              {/* Gold glow */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gold/10 blur-[60px] rounded-full pointer-events-none" />

              <div>
                <h2 className="text-2xl font-serif text-white mb-1">Contact Information</h2>
                <p className="text-white/50 text-sm">Reach us anytime — we're always here to help.</p>
              </div>

              {[
                {
                  icon: <MapPin size={18} />,
                  title: 'Corporate Office',
                  content: 'Second Floor, C/15, Ganga Marg, Indra Gandhi Nagar, Sector-1, Jagatpura, Jaipur, Rajasthan 302017',
                },
                {
                  icon: <Phone size={18} />,
                  title: 'Phone',
                  content: '+91 84420 83670\n+91 94608 02222',
                },
                {
                  icon: <Mail size={18} />,
                  title: 'Email',
                  content: 'ngbuild@gmail.com',
                },
                {
                  icon: <Clock size={18} />,
                  title: 'Working Hours',
                  content: 'Monday – Saturday\n10:00 AM – 7:00 PM',
                },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 relative z-10">
                  <div className="w-10 h-10 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-white/50 text-xs uppercase tracking-widest font-bold mb-1">{item.title}</p>
                    <p className="text-white/85 text-sm leading-relaxed whitespace-pre-line">{item.content}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Contact Form */}
          <div className="lg:w-3/5">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl border border-black/8 shadow-[0_4px_32px_rgba(0,0,0,0.06)] p-8 md:p-12"
            >
              <h2 className="text-3xl font-serif font-medium text-charcoal mb-8">Send an Inquiry</h2>
              <form className="space-y-6" onSubmit={e => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-2">Full Name</label>
                    <input type="text" className="form-input" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-2">Phone Number</label>
                    <input type="tel" className="form-input" required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-2">Email Address</label>
                    <input type="email" className="form-input" required />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-2">Inquiry Type</label>
                    <div className="relative">
                      <select className="form-input appearance-none pr-10">
                        <option>Buy a Property</option>
                        <option>Schedule a Site Visit</option>
                        <option>General Inquiry</option>
                        <option>Careers</option>
                      </select>
                      <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-muted pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-charcoal-muted mb-2">Message</label>
                  <textarea rows={5} className="form-input resize-none" required />
                </div>

                <button type="submit" className="btn-gold w-full md:w-auto">
                  Submit Inquiry
                </button>
              </form>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}
