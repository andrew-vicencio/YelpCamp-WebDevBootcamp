var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seed"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('./models/user'),
    passportLocalMongoose = require('passport-local-mongoose');

// mongoose config and seeding
mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });
// seedDB();

//express config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(require('express-session')({
    secret: "Bentley is the cutest",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

//passport config
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.get('/', function (req, res) {
    res.render("landing");
});

//INDEX
app.get('/campgrounds', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds, user: req.user });
        }
    });
});

//CREATE
app.post('/campgrounds', function (req, res) {
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    Campground.create({
        name: name,
        image: image,
        description: description
    }, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

//NEW
app.get('/campgrounds/new', function (req, res) {
    res.render("campgrounds/new");
})

//SHOW
app.get('/campgrounds/:id', function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, campground) {
        if (err) {
            console.log(err)
        } else {
            res.render('campgrounds/show', { campground: campground});
        }
    });
});

app.post("/campgrounds/:id/comments", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, (err, comment) => {
                if (err) {
                    console.log(err);
                } else {
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }

            });
        }
    });
});

app.get("/campgrounds/:id/comments/new", isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.get('/register', (req, res) => res.render('register'));
app.post('/register', (req, res) => {
    var newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, function (err, user) {
        if (err) {
            console.logi;
            return res.render('register')
        }
        passport.authenticate('local')(req, res, () => res.redirect('/campgrounds'));
    });
});

app.get('/login', (req, res) => res.render('login'));
app.post('/login',
    passport.authenticate('local', { failureRedirect: '/register' }),
    (req, res) => res.redirect('/campgrounds')
);

app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
} 

app.listen(3000, function () {
    console.log('YelpCamp started on port 3000');
});