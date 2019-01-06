var express = require('express'),
    Campground = require('../models/campground');
var router = express.Router();

//INDEX
router.get('/', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds, user: req.user });
        }
    });
});

//CREATE
router.post('/', isLoggedIn, function (req, res) {
    req.body.camp.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.camp,
    function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//NEW
router.get('/new', isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
})

//SHOW
router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/show', { campground: campground });
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}

module.exports = router;