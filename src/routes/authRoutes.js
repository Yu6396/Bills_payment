const express = require('express');
const passport = require('passport');
const router = express.Router();
const { googleCallback } = require('../controllers/authController');

// Initiate Google login
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
   prompt: "select_account"
}));

// Callback after Google login
router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/dashboard' }),
  googleCallback
);

module.exports = router;
