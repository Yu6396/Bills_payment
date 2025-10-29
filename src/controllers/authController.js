const jwt = require("jsonwebtoken");

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;

    const token = jwt.sign(
      { user_id: user.user_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Redirect to frontend with token & user
    const frontendUrl = "http://localhost:5173" ;
    const redirectUrl = `${frontendUrl}/auth/google-success?token=${token}&user=${encodeURIComponent(
      JSON.stringify(user)
    )}`;

    res.redirect(redirectUrl);
  } catch (error) {
    console.error("Google callback error:", error);
    res.status(500).json({ message: "Google login failed", error });
  }
};
