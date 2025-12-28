import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Award, Globe } from 'lucide-react';
import api from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const About = () => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.get('/pages');
        setContent(res.data.aboutText);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { value: "15,000+", label: "Öğrenci" },
    { value: "500+", label: "Akademisyen" },
    { value: "100+", label: "Program" },
    { value: "50+", label: "Ülke" },
  ];

  const features = [
    { icon: BookOpen, title: "Kaliteli Eğitim", description: "Uzman akademik kadromuz ve modern eğitim altyapımızla en iyi eğitimi sunuyoruz." },
    { icon: Users, title: "Güçlü Topluluk", description: "Binlerce öğrenci ve mezunumuzla güçlü bir ağ oluşturduk." },
    { icon: Award, title: "Başarı Odaklı", description: "Öğrencilerimizin başarısı bizim en büyük ödülümüz." },
    { icon: Globe, title: "Uluslararası Görüş", description: "Dünya çapında işbirliklerimiz ve değişim programlarımız var." },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
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
      className="container mx-auto px-4 py-12 space-y-16"
    >
      {/* Header & Intro */}
      <motion.div variants={itemVariants} className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-heading font-bold text-slate-900 dark:text-white mb-6">Hakkımızda</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {content || "Üniversitemiz, 1980 yılından bu yana kaliteli eğitim anlayışı ve öncü akademik çalışmalarıyla öne çıkmaktadır."}
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="bg-blue-600 text-white p-8 rounded-xl text-center shadow-lg transform hover:scale-105 transition-transform duration-300"
          >
            <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
            <div className="text-blue-100 font-medium">{stat.label}</div>
          </div>
        ))}
      </motion.div>

      {/* Mission & Vision */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Misyonumuz</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            En yüksek akademik standartlarda eğitim vererek, topluma ve bilime katkı sağlayan, araştırma ve geliştirme odaklı, yenilikçi düşünebilen, girişimci mezunlar yetiştirmek.
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Vizyonumuz</h2>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            Uluslararası standartlarda eğitim ve araştırma faaliyetleriyle öncü, toplumsal gelişime katkı sağlayan, tercih edilen bir yükseköğretim kurumu olmak.
          </p>
        </div>
      </motion.div>

      {/* Why Choose Us */}
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Neden Bizi Seçmelisiniz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 text-center transition-all duration-300 cursor-pointer hover:-translate-y-2 hover:shadow-lg"
            >
              <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600 dark:text-blue-400">
                <feature.icon size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* History */}
      <motion.div 
        variants={itemVariants}
        className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
      >
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">Tarihçemiz</h2>
        <div className="space-y-4 text-slate-600 dark:text-slate-300 leading-relaxed">
          <p>
            Üniversitemiz, 1980 yılında kurulmuştur ve o günden bugüne eğitime olan bağlılığını hiç kaybetmemiştir. Küçük bir akademik kadro ve sınırlı sayıda programla başlayan yolculuk, bugün 100'ün üzerinde lisans ve lisansüstü program, 500'den fazla akademisyen ve 15,000'i aşkın öğrenciyle devam etmektedir.
          </p>
          <p>
            Yıllar içinde modern tesisler, ileri teknoloji donanımlı laboratuvarlar ve kapsamlı kütüphane kaynaklarıyla gelişen kampüsümüz, öğrencilerimize en iyi eğitim ortamını sunmayı hedeflemektedir.
          </p>
          <p>
            Bugün, dünyanın dört bir yanından öğrenciler ağırlayan uluslararası bir üniversiteyiz. 50'den fazla ülkeyle işbirliği anlaşmalarımız ve aktif değişim programlarımızla global bir akademik topluluğun parçasıyız.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default About;
