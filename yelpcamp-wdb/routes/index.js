const express = require('express'),
    passport = require('passport'),
    User = require('../models/user');

var router = express.Router();

//Landing page
router.get('/', function (req, res) {
    res.render("landing");
});

//Register
router.get('/register', (req, res) => res.render('register'));
router.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            req.flash('error', 'Error. Unable to register. Username is already taken.');
            return res.redirect('back');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', `Welcome to YelpCamp, ${user.username}`);
            res.redirect('/campgrounds');
        });
    });
});

//Login
router.get('/login', (req, res) => res.render('login'));
router.post('/login',
    passport.authenticate('local', { 
        failureRedirect: '/register',
        failureFlash: 'Unable to login. Invalid username or password. Please try again.'
    }),
    (req, res) => {
        // req.flash('error', 'Error. Unable to delete comment.');
        res.redirect('/campgrounds')
});

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;