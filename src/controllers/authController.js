const { User, OAuthCredential, Wallet } = require('../../models');
const jwt = require('jsonwebtoken');

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Google login successful',
      token,
      user: {
        user_id: user.user_id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name
      }
    });

    res.redirect(
      `http://localhost:5173/auth/success?token=${token}&email=${user.email}`
    );
  } catch (error) {
    console.error('Google callback error:', error);
        res.redirect("http://localhost:5173/auth/failure");

  }
};
