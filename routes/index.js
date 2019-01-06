const express     = require('express'),
    passport    = require('passport'),
    User        = require('../models/user');

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
            console.logi;
            return res.render('register')
        }
        passport.authenticate('local')(req, res, () => res.redirect('/campgrounds'));
    });
});

//Login
router.get('/login', (req, res) => res.render('login'));
router.post('/login',
    passport.authenticate('local', { failureRedirect: '/register' }),
    (req, res) => res.redirect('/campgrounds')
);

//Logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;