const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const errorHandler = require('./src/middleware/errorHandler');
const { doubleCsrfProtection, generateToken } = require('./src/middleware/csrfMiddleware');

// Route files
const authRoutes = require('./src/routes/authRoutes');
const newsRoutes = require('./src/routes/newsRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const galleryRoutes = require('./src/routes/galleryRoutes');
const pageRoutes = require('./src/routes/pageRoutes');
const visitorRoutes = require('./src/routes/visitorRoutes');
const statsRoutes = require('./src/routes/statsRoutes');
const activityRoutes = require('./src/routes/activityRoutes');

const app = express();

// Trust proxy - enables correct IP detection behind proxies (Vercel, Nginx, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Frontend origin
  credentials: true, // Allow cookies and credentials
}));
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
});
app.use(limiter);

// CSRF token endpoint - Public route for getting CSRF token
app.get('/csrf-token', (req, res) => {
  const token = generateToken(req, res);
  res.json({ token });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true });
});

// Routes - CSRF protection applied at route handler level for admin operations only
app.use('/auth', authRoutes);
app.use('/news', newsRoutes);
app.use('/announcements', announcementRoutes);
app.use('/gallery', galleryRoutes);
app.use('/pages', pageRoutes);
app.use('/visitors', visitorRoutes);
app.use('/stats', statsRoutes);
app.use('/clubs', require('./src/routes/clubRoutes'));
app.use('/users', require('./src/routes/userRoutes'));
app.use('/activities', activityRoutes);

// Error Handler
app.use(errorHandler);

module.exports = app;
