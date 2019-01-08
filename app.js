const express       = require('express'),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    passport        = require('passport'),
    localStrategy   = require('passport-local'),
    methodOverride  = require('method-override'),
    User            = require('./models/user'),
    flash           = require('connect-flash');
    
var seedDB          = require("./seed");

const commentRoutes = require('./routes/comments'),
    campgroundRoutes = require('./routes/campgrounds'),
    indexRoutes = require('./routes/index');

var app = express();

// mongoose config and seeding
mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });
mongoose.set('useFindAndModify', false);
// seedDB();

//express config
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");
app.use(methodOverride('_method'));
app.use(flash());

//express-session/passport config
app.use(require('express-session')({
    secret: "Bentley is the cutest",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.locals.currUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
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