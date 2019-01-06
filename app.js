const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    seedDB = require("./seed"),
    passport = require('passport'),
    localStrategy = require('passport-local'),
    User = require('./models/user');

const commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

// mongoose config and seeding
mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });
// seedDB();

//express config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//express-session/passport config
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

//Routing
app.use('/', indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(3000, function () {
    console.log('YelpCamp started on port 3000');
});