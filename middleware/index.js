var Campground = require('../models/campground'),
    Comment = require('../models/comment');

var middlewareObj = {}

middlewareObj.checkCampgroundOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, campground) => {
            if (err) {
                req.flash('error', 'Error in database. Campground not found.');
                res.redirect('back');
            } else if (campground) {
                if (campground.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'Permission denied. Not the owner of this campground');
                    res.redirect('back');
                }
            } else {
                req.flash('error', '400 Bad Request. Campground not found')
                res.redirect('back');
            }
        })
    } else {
        req.flash('error', 'Please login first!');
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = (req, res, next) => {
    if (req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, comment) => {
            if (err) {
                req.flash('error', 'Error in database. Comment not found.');
                res.redirect('back');
            } else if (comment) {
                if (comment.author.id.equals(req.user._id)){
                    next();
                } else {
                    req.flash('error', 'Permission denied. Not the owner of this comment');
                    res.redirect('back');
                }
            } else {
                req.flash('error', '400 Bad Request. Comment not found.')
                res.redirect('back');
            }
        })
    } else {
        req.flash('error', 'Please login first!');
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Please login first!');
    res.redirect('/login');
}

module.exports = middlewareObj;