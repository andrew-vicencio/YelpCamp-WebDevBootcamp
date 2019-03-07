var express = require('express'),
    Campground = require('../models/campground'),
    middleware = require('../middleware');
var router = express.Router();

//INDEX
router.get('/', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            req.flash('error', 'Error. Unable to find campgrounds.');
            res.redirect('back');
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds, user: req.user });
        }
    });
});

//CREATE
router.post('/', middleware.isLoggedIn, function (req, res) {
    req.body.camp.author = {
        id: req.user._id,
        username: req.user.username
    };
    Campground.create(req.body.camp,
        function (err, campground) {
            if (err) {
                req.flash('error', 'Error. Unable to create campground.');
                res.redirect('back');
            } else {
                req.flash('success', 'Successfully created campground')
                res.redirect('/campgrounds');
            }
        });
});

//NEW
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
})

//SHOW
router.get('/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err || !campground) {
            req.flash('error', 'Error. Unable to find campground.');
                res.redirect('back');
        } else {
            res.render('campgrounds/show', { campground: campground });
        }
    });
});

//EDIT
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err || !campground) {
            req.flash('error', 'Error. Unable to edit campground.');
            res.redirect('back');
        } else {
            res.render('campgrounds/edit', { campground: campground });
        }
    })
});

//UPDATE
router.put('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, (err, camp) => {
        if (err || !camp) {
            req.flash('error', 'Error. Unable to update campground.');
            res.redirect('back');
        } else {
            req.flash('success', 'Successfully edited campground')
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    })
})

//DELETE
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            req.flash('error', 'Error. Unable to delete campground.');
                res.redirect('back');
        } else {
            req.flash('success', 'Successfully deleted campground')
            res.redirect('/campgrounds');
        }
    });
});



module.exports = router;