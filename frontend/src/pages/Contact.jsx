import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import api from '../utils/api';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';
import LoadingSpinner from '../components/LoadingSpinner';
import emailjs from '@emailjs/browser';

const Contact = () => {
  const [content, setContent] = useState({
    contactText: '',
    email: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/pages');
        setContent(res.data);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const [formStatus, setFormStatus] = useState('idle'); // idle, sending, success, error
  const form = React.useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('sending');

    emailjs.sendForm('service_gjzbb28', 'template_s7ektgw', form.current, '4ygEef9q2Zhhw0_NM')
      .then((result) => {
          console.log(result.text);
          setFormStatus('success');
          setFormData({ name: '', email: '', subject: '', message: '' });
          setTimeout(() => setFormStatus('idle'), 3000);
      }, (error) => {
          console.log(error.text);
          setFormStatus('error');
      });
  };

  if (loading) return <LoadingSpinner />;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="container mx-auto px-4 py-12 space-y-12"
    >
      <motion.div variants={itemVariants} className="text-center">
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-4">İletişim</h1>
        <p className="text-slate-600 dark:text-slate-300 text-lg">Sorularınız ve önerileriniz için bizimle iletişime geçin</p>
      </motion.div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <Mail size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">E-posta</h3>
          <p className="text-slate-500 dark:text-slate-400">{content.email || "ravzanur.drn@gmail.com"}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <Phone size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Telefon</h3>
          <p className="text-slate-500 dark:text-slate-400">{content.phoneNumber || "+90 (362) 313 00 55"}</p>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center">
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
            <MapPin size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Adres</h3>
          <p className="text-slate-500 dark:text-slate-400">{content.contactText || "İstiklal Mahallesi Tekel Cad. No:2 Ballıca Kampüsü 19 Mayıs/SAMSUN"}</p>
        </motion.div>
      </div>

      {/* Form & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Mesaj Gönder</h3>
          
          {formStatus === 'success' && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              Mesajınız başarıyla iletildi!
            </div>
          )}
          
          {formStatus === 'error' && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              Mesaj gönderilemedi. Lütfen tekrar deneyin.
            </div>
          )}

          <form ref={form} className="space-y-4" onSubmit={handleSubmit}>
            <Input 
              name="user_name"
              label="Adınız Soyadınız" 
              placeholder="Adınız ve soyadınız" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
            <Input 
              name="user_email"
              label="E-posta Adresiniz" 
              type="email" 
              placeholder="ornek@email.com" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <Input 
              name="subject"
              label="Konu" 
              placeholder="Mesajınızın konusu" 
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              required
            />
            <Textarea 
              name="message"
              label="Mesajınız" 
              placeholder="Mesajınızı buraya yazın..." 
              rows={6} 
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              required
            />
            <Button type="submit" className="w-full" isLoading={formStatus === 'sending'}>
              <Send size={18} className="mr-2" /> Gönder
            </Button>
          </form>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 h-[600px] lg:h-auto">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3015.5!2d36.117000!3d41.509472!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDMwJzM0LjEiTiAzNsKwMDcnMDEuMiJF!5e0!3m2!1sen!2str!4v1698765432100!5m2!1sen!2str" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
            title="Samsun Üniversitesi Ballıca Kampüsü"
          ></iframe>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
