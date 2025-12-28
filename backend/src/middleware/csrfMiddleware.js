const { doubleCsrf } = require('csrf-csrf');

// CSRF configuration
const {
  generateToken, // Token oluşturma fonksiyonu
  validateRequest, // Request doğrulama middleware'i
  doubleCsrfProtection, // Koruma middleware'i
} = doubleCsrf({
  getSecret: () => process.env.CSRF_SECRET || 'super-secret-csrf-key-change-in-production',
  cookieName: '__Host-psifi.x-csrf-token',
  cookieOptions: {
    sameSite: 'strict',
    path: '/',
    secure: process.env.NODE_ENV === 'production', // HTTPS'de true olacak
    httpOnly: true,
  },
  size: 64,
  ignoredMethods: ['GET', 'HEAD', 'OPTIONS'],
  getTokenFromRequest: (req) => req.headers['x-csrf-token'], // Header'dan token al
});

module.exports = {
  generateToken,
  validateRequest,
  doubleCsrfProtection,
};
