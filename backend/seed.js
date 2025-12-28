const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/db');
const AdminUser = require('./src/models/AdminUser');
const News = require('./src/models/News');
const Announcement = require('./src/models/Announcement');
const Gallery = require('./src/models/Gallery');
const Page = require('./src/models/Page');

dotenv.config();

connectDB();

const sampleNews = [
  {
    title: "Bahar Şenlikleri Başlıyor!",
    summary: "Bu yılki bahar şenlikleri 20-25 Mayıs tarihleri arasında kampüs ana meydanında yapılacak.",
    content: "Öğrencilerimizin yıl boyunca beklediği bahar şenlikleri bu yıl her zamankinden daha renkli geçecek. Ünlü sanatçıların konserleri, spor turnuvaları ve çeşitli atölye çalışmaları ile dolu dolu bir hafta bizi bekliyor.",
    imageUrl: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    slug: "bahar-senlikleri-basliyor"
  },
  {
    title: "Teknoloji Zirvesi 2023",
    summary: "Sektörün önde gelen isimleri üniversitemizde buluşuyor.",
    content: "Yapay zeka, blokzincir ve siber güvenlik konularının ele alınacağı Teknoloji Zirvesi'nde sektörün öncüleri öğrencilerimizle bir araya gelecek. Kariyer fırsatları için kaçırılmayacak bir etkinlik.",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    slug: "teknoloji-zirvesi-2023"
  },
  {
    title: "Kütüphane Çalışma Saatleri Güncellendi",
    summary: "Vize haftası boyunca kütüphanemiz 7/24 hizmet verecektir.",
    content: "Öğrencilerimizin sınavlarına daha rahat hazırlanabilmeleri için kütüphanemiz vize haftası boyunca kesintisiz hizmet verecektir. Çay ve çorba ikramlarımız da olacaktır.",
    imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    slug: "kutuphane-calisma-saatleri"
  }
];

const sampleAnnouncements = [
  {
    title: "Ders Kayıtları Hakkında",
    description: "Ders kayıtları 15 Eylül'de başlayacaktır. Öğrenci bilgi sistemi üzerinden kayıtlarınızı yapabilirsiniz.",
    isImportant: true,
    slug: "ders-kayitlari-hakkinda"
  },
  {
    title: "Erasmus Başvuruları",
    description: "Erasmus+ başvuruları için son gün 30 Ekim. Detaylı bilgi için Dış İlişkiler Ofisi'ni ziyaret ediniz.",
    isImportant: false,
    slug: "erasmus-basvurulari"
  },
  {
    title: "Yemekhane Menüsü",
    description: "Ekim ayı yemek listesi yayınlandı. Web sitemizden ve mobil uygulamamızdan menüye ulaşabilirsiniz.",
    isImportant: false,
    slug: "yemekhane-menusu"
  }
];

const sampleGallery = [
  {
    url: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    caption: "Kampüs Girişi"
  },
  {
    url: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    caption: "Kütüphane"
  },
  {
    url: "https://images.unsplash.com/photo-1592280771884-131116297d99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    caption: "Mezuniyet Töreni"
  },
  {
    url: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    caption: "Öğrenci Merkezi"
  }
];

const samplePage = {
  homeText: "Üniversitemiz, bilimsel araştırmalar ve kaliteli eğitim ile geleceği şekillendiriyor.",
  aboutText: "Köklü geçmişimiz ve modern vizyonumuz ile öğrencilerimizi hayata hazırlıyoruz. 50 yılı aşkın tecrübemizle, uluslararası standartlarda eğitim veriyoruz.",
  contactText: "Kampüs Mah. Üniversite Cad. No:1, 34000 İstanbul\nTel: +90 212 123 45 67\nEmail: info@campus.edu"
};

const importData = async () => {
  try {
    // Clear existing data
    await AdminUser.deleteMany();
    await News.deleteMany();
    await Announcement.deleteMany();
    await Gallery.deleteMany();
    await Page.deleteMany();

    console.log('Data Cleared...');

    // Create Admin
    const adminUser = new AdminUser({
      email: 'admin@campus.edu',
      password: 'admin123',
      role: 'admin',
    });
    await adminUser.save();
    console.log('Admin User Created');

    // Create News
    await News.insertMany(sampleNews);
    console.log('News Imported');

    // Create Announcements
    await Announcement.insertMany(sampleAnnouncements);
    console.log('Announcements Imported');

    // Create Gallery
    await Gallery.insertMany(sampleGallery);
    console.log('Gallery Imported');

    // Create Page Content
    await Page.create(samplePage);
    console.log('Page Content Imported');

    console.log('All Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

importData();
