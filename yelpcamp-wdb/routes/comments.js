const express = require('express'),
    Campground = require('../models/campground'),
    Comment = require('../models/comment'),
    middleware = require('../middleware');

var router = express.Router({mergeParams: true});

//Create
router.post("/", middleware.isLoggedIn, (req, res) => {
    Campground
        .findById(req.params.id)
        .exec()
        .then((campground, err) => {
            if (err || !campground) {
                req.flash('error', 'Error. Unable to find campground.');
                res.redirect('back');
            } else {
                return campground;
            }
        })
        .then(campground => {
            Comment
                .create(req.body.comment)
                .then((comment, err) => {
                    if (err) {
                        req.flash('error', 'Error. Unable to created comment.');
                        res.redirect('back');
                    }
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    req.flash('success', 'Successfully created comment');
                    res.redirect('/campgrounds/' + campground._id);
                });
        });
});

//New
router.get("/new", middleware.isLoggedIn, (req, res) => {
    Campground
    .findById(req.params.id)
    .exec()
    .then(campground => {
        if (!campground) {
            req.flash('error', 'Error. Unable to find campground.');
            res.redirect('back');
        } else {
            res.render("comments/new", { campground: campground });
        }
    })
    .catch(err => {
        req.flash('error', 'Error. Unable to find campground.');
        return res.redirect('back');
    });
});

//Edit
router.get('/:comment_id/edit', middleware.checkCommentOwnership, (req, res) => {
    Campground
        .findById(req.params.id)
        .exec()
        .then(campground => {
            if (!campground){
                req.flash('error', 'Invalid campground')
                return res.redirect('back');
            } else {
                return campground;
            }
        })
        .then(campground => {
            Comment
                .findById(req.params.comment_id)
                .exec()
                .then(comment => {
                    if (!comment){
                        req.flash('error', 'Error. Unable to find comment.');
                        return res.redirect('back');
                    } else {
                        res.render('comments/edit', {comment: comment, campground_id: req.params.id})
                    }
                })
                .catch(err => {
                    req.flash('error', 'Error. Unable to find comment.');
                    return res.redirect('back');
                });
        })
        .catch(err => {
            req.flash('error', 'Invalid campground')
            return res.redirect('back');
        });
});

router.put('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Campground
        .findById(req.params.id)
        .exec()
        .then(campground => {
            if (!campground){
                req.flash('error', 'Invalid campground')
                return res.redirect('back');
            } else {
                return campground
            }
        })
        .then(campground => {
            Comment
                .findByIdAndUpdate(req.params.comment_id, req.body.comment)
                .exec()
                .then(comment => {
                    if (!comment) {
                        req.flash('error', 'Error. Unable to update comment.');
                        res.redirect('back');
                    } else {
                        req.flash('success', 'Successfully edited comment');
                        res.redirect(`/campgrounds/${req.params.id}`)
                    }
                })
                .catch(err => {
                    req.flash('error', 'Error. Unable to update comment.');
                    res.redirect('back');
                });
        })
        .catch(err => {
            req.flash('error', 'Invalid campground')
            return res.redirect('back');
        });
});

//Delete
router.delete('/:comment_id', middleware.checkCommentOwnership, (req, res) => {
    Campground
        .findById(req.params.id)
        .exec()
        .then(campground => {
            if (!campground){
                req.flash('error', 'Invalid campground')
                return res.redirect('back');
            } else {
                return campground;
            }
        })
        .then(campground => {  
            Comment
                .findByIdAndRemove(req.params.comment_id)
                .exec()
                .then(success => {
                    req.flash('success', 'Successfully deleted comment');
                    res.redirect(`/campgrounds/${req.params.id}`);
                })
                .catch(err => {
                    req.flash('error', 'Error. Unable to delete comment.');
                    res.redirect('back');
                });
        })
        .catch(err => {
            req.flash('error', 'Invalid campground')
            return res.redirect('back');
        });
});

module.exports = router;