import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, MapPin, Send } from 'lucide-react';
import { FaInstagram, FaWhatsapp } from 'react-icons/fa';
import AnimatedSection from '../components/common/AnimatedSection';
import toast from 'react-hot-toast';

const CONTACT_EMAIL = 'aswincse2@gmail.com';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone / WhatsApp',
    detail: '+91 6374923162',
    link: 'tel:+916374923162',
    color: 'from-green-500/20 to-emerald-500/20',
  },
  {
    icon: Mail,
    title: 'Email',
    detail: CONTACT_EMAIL,
    link: `mailto:${CONTACT_EMAIL}`,
    color: 'from-blue-500/20 to-cyan-500/20',
  },
  {
    icon: Clock,
    title: 'Working Hours',
    detail: '10 AM – 9 PM, Every Day',
    link: null,
    color: 'from-amber-500/20 to-yellow-500/20',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Invalid email';
    if (!formData.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, '')))
      errs.phone = 'Enter a valid 10-digit number';
    if (!formData.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    const subject = encodeURIComponent(`Sharp SK Brownies enquiry from ${formData.name}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    toast.success('Opening your email app with the message ready to send.');
    setFormData({ name: '', email: '', phone: '', message: '' });
    setSubmitting(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <main className="pt-24 pb-20 min-h-screen">
      {/* Header */}
      <div className="text-center px-4 mb-16">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-gold-500 text-sm tracking-[0.3em] uppercase mb-3 font-medium"
        >
          Get In Touch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-cream mb-4"
        >
          Contact <span className="gold-gradient-text">Us</span>
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="w-24 h-0.5 bg-gradient-to-r from-gold-500 to-gold-400 mx-auto mb-4"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-cream-dark/50 max-w-lg mx-auto"
        >
          Have questions about our brownies or want to place a custom order? We'd love to hear from you!
        </motion.p>
      </div>

      {/* Contact Info Cards */}
      <AnimatedSection>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6 }}
                className="glass-card p-8 text-center group hover:border-gold-500/20 transition-all duration-500"
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${info.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-500`}
                >
                  <info.icon size={24} className="text-gold-500" />
                </div>
                <h3 className="text-cream font-heading font-semibold mb-2">
                  {info.title}
                </h3>
                {info.link ? (
                  <a
                    href={info.link}
                    className="text-cream-dark/60 hover:text-gold-500 transition-colors text-sm"
                  >
                    {info.detail}
                  </a>
                ) : (
                  <p className="text-cream-dark/60 text-sm">{info.detail}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Contact Form + Map */}
      <AnimatedSection>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Form */}
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-2xl font-heading font-bold text-cream mb-2">
                Send Us a Message
              </h2>
              <p className="text-cream-dark/50 text-sm mb-8">
                Fill out the form and we'll get back to you within 24 hours.
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-cream/70 text-sm mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className={`w-full px-4 py-3 rounded-xl bg-chocolate-800/50 border ${
                      errors.name ? 'border-red-400/50' : 'border-chocolate-700/50'
                    } text-cream placeholder:text-cream-dark/30 text-sm transition-all duration-300`}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-cream/70 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className={`w-full px-4 py-3 rounded-xl bg-chocolate-800/50 border ${
                        errors.email ? 'border-red-400/50' : 'border-chocolate-700/50'
                      } text-cream placeholder:text-cream-dark/30 text-sm transition-all duration-300`}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-cream/70 text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="10-digit number"
                      className={`w-full px-4 py-3 rounded-xl bg-chocolate-800/50 border ${
                        errors.phone ? 'border-red-400/50' : 'border-chocolate-700/50'
                      } text-cream placeholder:text-cream-dark/30 text-sm transition-all duration-300`}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-cream/70 text-sm mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us what you need..."
                    rows={4}
                    className={`w-full px-4 py-3 rounded-xl bg-chocolate-800/50 border ${
                      errors.message ? 'border-red-400/50' : 'border-chocolate-700/50'
                    } text-cream placeholder:text-cream-dark/30 text-sm transition-all duration-300 resize-none`}
                  />
                  {errors.message && (
                    <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-chocolate-900 font-bold text-base shadow-lg shadow-gold-500/20 hover:shadow-xl hover:shadow-gold-500/30 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-chocolate-900/30 border-t-chocolate-900 rounded-full animate-spin" />
                  ) : (
                    <>
                      <Send size={18} />
                      <span>Send Message</span>
                    </>
                  )}
                </motion.button>
              </form>
            </div>

            {/* Map + Delivery Info */}
            <div className="space-y-6">
              {/* Map */}
              <div className="glass-card overflow-hidden h-72 lg:h-80">
                <iframe
                  title="Location"
                  src="https://www.google.com/maps?q=Puducherry,%20India&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(0.85)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              {/* Delivery Info */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-heading font-semibold text-cream mb-4 flex items-center gap-2">
                  <MapPin size={20} className="text-gold-500" />
                  Delivery Information
                </h3>
                <p className="text-cream-dark/70 text-sm mb-4">
                  Currently available only in Pondicherry. Soon we will be in more places.
                </p>
                <ul className="space-y-3 text-cream-dark/60 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 mt-2 flex-shrink-0" />
                    Delivery available in Pondicherry from 10 AM to 9 PM
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 mt-2 flex-shrink-0" />
                    Average delivery time: 30-45 minutes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 mt-2 flex-shrink-0" />
                    Free delivery on orders above ₹200
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500/50 mt-2 flex-shrink-0" />
                    Special packaging for gift orders
                  </li>
                </ul>
              </div>

              {/* Social Links */}
              <div className="glass-card p-8">
                <h3 className="text-lg font-heading font-semibold text-cream mb-4">
                  Follow Us
                </h3>
                <div className="flex items-center gap-3">
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="https://www.instagram.com/__.sharp__.sk/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-cream hover:border-purple-500/40 transition-all"
                  >
                    <FaInstagram size={18} />
                    <span className="text-sm">@__.sharp__.sk</span>
                  </motion.a>
                  <motion.a
                    whileHover={{ scale: 1.1 }}
                    href="https://wa.me/916374923162"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20 text-cream hover:border-green-500/40 transition-all"
                  >
                    <FaWhatsapp size={18} />
                    <span className="text-sm">WhatsApp</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </main>
  );
}
