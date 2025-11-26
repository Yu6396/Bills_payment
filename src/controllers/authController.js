const jwt = require("jsonwebtoken");
const { Session} = require("../../models");

const googleCallback = async (req, res) => {
  try {
    const user = req.user; // From passport
    const token = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await Session.create({ token, user_id: user.user_id, expires_at: expiresAt });

    res.cookie('session_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.redirect('http://localhost:5173/dashboard');
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Google login failed' });
  }
};


module.exports = { googleCallback };
