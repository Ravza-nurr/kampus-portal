const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Create a new club (Admin)
// @route   POST /clubs
// @access  Private/Admin
const createClub = async (req, res) => {
  try {
    const { name, description, coverImage, leaderEmails } = req.body;

    let leaders = [];
    if (leaderEmails && leaderEmails.length > 0) {
      if (leaderEmails.length > 3) {
        return res.status(400).json({ message: 'En fazla 3 lider seçilebilir.' });
      }

      for (const email of leaderEmails) {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: `Belirtilen kullanıcı bulunamadı: ${email}` });
        }
        if (user.role === 'admin') {
          return res.status(400).json({ message: 'Admin kullanıcılar topluluk lideri olamaz.' });
        }
        leaders.push(user._id);
      }
    }

    const club = await Club.create({
      name,
      description,
      coverImage,
      leaders,
      members: leaders, // Leaders are automatically members
    });

    // Update users
    for (const leaderId of leaders) {
      await User.findByIdAndUpdate(leaderId, {
        $addToSet: { clubsLeading: club._id, clubsJoined: club._id }
      });
    }

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a club (Admin)
// @route   PUT /clubs/:id
// @access  Private/Admin
const updateClub = async (req, res) => {
  try {
    const { name, description, coverImage, leaderEmails } = req.body;
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    // Check authorization: Admin OR Club Leader
    if (req.user.role !== 'admin' && !club.leaders.some(leaderId => leaderId.toString() === req.user._id.toString())) {
      return res.status(403).json({ message: 'Bu topluluğu düzenleme yetkiniz yok' });
    }

    club.name = name || club.name;
    club.description = description || club.description;
    club.coverImage = coverImage || club.coverImage;

    if (leaderEmails) {
      // Remove old leaders from clubLeading
      for (const oldLeaderId of club.leaders) {
        await User.findByIdAndUpdate(oldLeaderId, {
          $pull: { clubsLeading: club._id }
        });
      }

      let newLeaders = [];
      for (const email of leaderEmails) {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: `Belirtilen kullanıcı bulunamadı: ${email}` });
        }
        if (user.role === 'admin') {
          return res.status(400).json({ message: 'Admin kullanıcılar topluluk lideri olamaz.' });
        }
        newLeaders.push(user._id);
      }
      
      club.leaders = newLeaders;

      // Add new leaders to clubLeading and members
      for (const newLeaderId of newLeaders) {
        await User.findByIdAndUpdate(newLeaderId, {
          $addToSet: { clubsLeading: club._id, clubsJoined: club._id }
        });
        // Ensure leader is in members list
        if (!club.members.includes(newLeaderId)) {
          club.members.push(newLeaderId);
        }
      }
    }

    const updatedClub = await club.save();
    res.json(updatedClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a club (Admin)
// @route   DELETE /clubs/:id
// @access  Private/Admin
const deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    // Remove references from users
    await User.updateMany(
      { _id: { $in: club.members } },
      { $pull: { clubsJoined: club._id, clubsLeading: club._id } }
    );

    await club.deleteOne();
    res.json({ message: 'Topluluk silindi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all clubs (Public)
// @route   GET /clubs
// @access  Public
const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({})
      .select('name description coverImage leaders members events')
      .populate('leaders', 'name email');
    
    // Transform for list view
    const clubsList = clubs.map(club => ({
      _id: club._id,
      name: club.name,
      description: club.description,
      coverImage: club.coverImage,
      leaders: club.leaders,
      memberCount: club.members.length,
      eventCount: club.events.length
    }));

    res.json(clubsList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get club by ID (Public)
// @route   GET /clubs/:id
// @access  Public
const getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id)
      .populate('leaders', 'name email')
      .populate('members', 'name email'); // Optional: limit member info if privacy needed

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    res.json({
      ...club.toObject(),
      memberCount: club.members.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Request to join a club (User)
// @route   POST /clubs/:id/request
// @access  Private
const requestJoinClub = async (req, res) => {
  try {
    // Admin users cannot join clubs - they are supervisors only
    if (req.user.role === 'admin') {
      return res.status(403).json({ 
        message: 'Admin kullanıcılar topluluklara katılamaz. Admin kullanıcılar sadece denetleyici rolündedir.' 
      });
    }

    const club = await Club.findById(req.params.id);

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    if (club.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Zaten üyesiniz' });
    }

    if (club.requests.includes(req.user._id)) {
      return res.status(400).json({ message: 'Zaten istekte bulundunuz' });
    }

    club.requests.push(req.user._id);
    await club.save();

    res.json({ message: 'Katılım isteği gönderildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get club requests (Leader)
// @route   GET /clubs/:id/requests
// @access  Private/Leader
const getClubRequests = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('requests', 'name email');

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    // Check if user is leader
    if (!club.leaders.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    res.json(club.requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve join request (Leader)
// @route   POST /clubs/:id/approve/:userId
// @access  Private/Leader
const approveRequest = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const userId = req.params.userId;

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    if (!club.leaders.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    if (!club.requests.includes(userId)) {
      return res.status(400).json({ message: 'İstek bulunamadı' });
    }

    // Check if the user to be approved is an admin
    const userToApprove = await User.findById(userId);
    if (userToApprove && userToApprove.role === 'admin') {
      return res.status(400).json({ message: 'Admin kullanıcılar topluluklara eklenemez.' });
    }

    // Remove from requests, add to members
    club.requests = club.requests.filter(id => id.toString() !== userId);
    club.members.push(userId);
    await club.save();

    // Update user
    await User.findByIdAndUpdate(userId, {
      $addToSet: { clubsJoined: club._id }
    });

    res.json({ message: 'İstek onaylandı' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject join request (Leader)
// @route   POST /clubs/:id/reject/:userId
// @access  Private/Leader
const rejectRequest = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const userId = req.params.userId;

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    if (!club.leaders.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    club.requests = club.requests.filter(id => id.toString() !== userId);
    await club.save();

    res.json({ message: 'İstek reddedildi' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add event (Leader)
// @route   POST /clubs/:id/events
// @access  Private/Leader
const addEvent = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const { title, description, date } = req.body;

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    if (!club.leaders.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    club.events.push({ title, description, date });
    await club.save();

    res.status(201).json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event (Leader)
// @route   DELETE /clubs/:id/events/:eventId
// @access  Private/Leader
const deleteEvent = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const eventId = req.params.eventId;

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    if (!club.leaders.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    club.events = club.events.filter(event => event._id.toString() !== eventId);
    await club.save();

    res.json(club);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove member from club (Leader)
// @route   DELETE /clubs/:id/members/:userId
// @access  Private/Leader
const removeMember = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const userId = req.params.userId;

    if (!club) {
      return res.status(404).json({ message: 'Topluluk bulunamadı' });
    }

    // Check if user is leader
    if (!club.leaders.includes(req.user._id) && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Yetkiniz yok' });
    }

    // Check if the user to be removed is a leader
    if (club.leaders.some(leaderId => leaderId.toString() === userId)) {
      return res.status(400).json({ message: 'Yöneticiler topluluktan çıkarılamaz.' });
    }

    // Check if user is a member
    if (!club.members.includes(userId)) {
      return res.status(400).json({ message: 'Kullanıcı bu topluluğun üyesi değil' });
    }

    // Remove from members
    club.members = club.members.filter(id => id.toString() !== userId);
    await club.save();

    // Update user
    await User.findByIdAndUpdate(userId, {
      $pull: { clubsJoined: club._id }
    });

    res.json({ message: 'Üye çıkarıldı' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createClub,
  updateClub,
  deleteClub,
  getClubs,
  getClubById,
  requestJoinClub,
  getClubRequests,
  approveRequest,
  rejectRequest,
  addEvent,
  deleteEvent,
  removeMember
};
