const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Club = require('./src/models/Club');
const News = require('./src/models/News'); // For favorites reference if needed, though we won't seed favorites here

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'Admin123!',
    role: 'admin'
  },
  {
    name: 'Ravza',
    email: 'ravza@example.com',
    password: 'Ravza123!',
    role: 'user'
  },
  {
    name: 'Test User 1',
    email: 'test1@example.com',
    password: 'Test123!',
    role: 'user'
  },
  {
    name: 'Demo User',
    email: 'demo@example.com',
    password: 'Demo123!',
    role: 'user'
  }
];

const clubsData = [
  {
    name: "Yazılım Kulübü",
    description: "Yazılım geliştirme üzerine etkinlikler yapılan topluluk.",
    leaderEmail: "admin@example.com",
    memberEmails: ["ravza@example.com", "test1@example.com"],
    coverImage: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: "GDG Campus",
    description: "Google Developer Groups öğrenci topluluğu.",
    leaderEmail: "ravza@example.com",
    memberEmails: ["demo@example.com"],
    coverImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  },
  {
    name: "Teknoloji ve Yapay Zeka Topluluğu",
    description: "AI, ML ve teknoloji üzerine paylaşımlar.",
    leaderEmail: "test1@example.com",
    memberEmails: ["ravza@example.com", "demo@example.com"],
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // 1. Upsert Users
    const createdUsers = [];
    for (const userData of users) {
      // Check if user exists
      let user = await User.findOne({ email: userData.email });
      if (user) {
        // Update role and password if needed (password hashing happens in pre-save)
        user.name = userData.name;
        user.role = userData.role;
        user.password = userData.password; // Will be re-hashed
        await user.save();
        console.log(`User updated: ${user.email}`);
      } else {
        user = await User.create(userData);
        console.log(`User created: ${user.email}`);
      }
      createdUsers.push(user);
    }

    // 2. Upsert Clubs
    const createdClubs = [];
    for (const clubData of clubsData) {
      const leader = await User.findOne({ email: clubData.leaderEmail });
      if (!leader) {
        console.error(`Leader not found for club ${clubData.name}: ${clubData.leaderEmail}`);
        continue;
      }

      const members = [];
      for (const email of clubData.memberEmails) {
        const member = await User.findOne({ email });
        if (member) members.push(member._id);
      }
      // Add leader to members as well if not already there (logic depends on requirements, usually leaders are members)
      if (!members.some(id => id.equals(leader._id))) {
        members.push(leader._id);
      }

      let club = await Club.findOne({ name: clubData.name });
      if (club) {
        club.description = clubData.description;
        club.leaders = [leader._id];
        club.members = members;
        club.coverImage = clubData.coverImage;
        await club.save();
        console.log(`Club updated: ${club.name}`);
      } else {
        club = await Club.create({
          name: clubData.name,
          description: clubData.description,
          leaders: [leader._id],
          members: members,
          coverImage: clubData.coverImage,
          events: []
        });
        console.log(`Club created: ${club.name}`);
      }
      createdClubs.push(club);

      // Update User references (clubsJoined, clubsLeading)
      // Clear previous references for these specific clubs to avoid duplicates/stale data would be complex, 
      // but for seeding we can just push if not present.
      
      // Update Leader
      if (!leader.clubsLeading.includes(club._id)) {
        leader.clubsLeading.push(club._id);
        await leader.save();
      }
      if (!leader.clubsJoined.includes(club._id)) {
        leader.clubsJoined.push(club._id);
        await leader.save();
      }

      // Update Members
      for (const memberId of members) {
        const member = await User.findById(memberId);
        if (!member.clubsJoined.includes(club._id)) {
          member.clubsJoined.push(club._id);
          await member.save();
        }
      }
    }

    console.log('Seeding completed successfully');
    
    // Output for the user report
    const report = {
      users: createdUsers.map(u => ({ id: u._id, email: u.email, role: u.role })),
      communities: createdClubs.map(c => ({ id: c._id, name: c.name })),
      notes: "Tüm işlemler tamamlandı."
    };
    
    console.log('JSON_REPORT_START');
    console.log(JSON.stringify(report, null, 2));
    console.log('JSON_REPORT_END');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
