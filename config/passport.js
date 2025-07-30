const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const {OAuthCredential, User,Wallet} = require('../models');
const { v4: uuidv4 } = require("uuid");
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'http://localhost:2025/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const provider = 'google';
    const providerId = profile.id;

    
    const existingOAuth = await OAuthCredential.findOne({
      where: { provider, providerId },
      include: User
    });

    if (existingOAuth) {
      return done(null, existingOAuth.User);
    }

    const email = profile.emails?.[0]?.value;
    const [first_name, ...rest] = profile.displayName.split(' ');
    const last_name = rest.join(' ');

   
    let user = await User.findOne({ where: { email } });

    if (!user) {
     
      user = await User.create({
        first_name,
        last_name,
        email,
        email_verified: true,
        password_hash: '',
        password_salt: ''
      });

      

      
       await Wallet.create({
            wallet_id: uuidv4(),
            user_id: user.user_id,
            balance: 0,
          });
    }

    await OAuthCredential.create({
      provider,
      providerId,
      userId: user.user_id
    });

    return done(null, user);
  } catch (err) {
    console.error('Google Strategy Error:', err);
    return done(err, null);
  }
}));

module.exports = passport;
