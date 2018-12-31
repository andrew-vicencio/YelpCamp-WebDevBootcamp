var express         = require('express'),
    app             = express(),
    bodyParser      = require('body-parser'),
    mongoose        = require('mongoose'),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    seedDB          = require("./seed");

mongoose.connect("mongodb://localhost:27017/yelpcamp", { useNewUrlParser: true });
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
// seedDB();

app.get('/', function (req, res) {
    res.render("landing");
});

//INDEX
app.get('/campgrounds', function (req, res) {
    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
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
            res.render('campgrounds/show', { campground: campground });
        }
    });
});

app.post("/campgrounds/:id/comments", (req, res) => {
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

app.get("/campgrounds/:id/comments/new", (req, res) => {
    Campground.findById(req.params.id, function (err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render("comments/new", { campground: campground });
        }
    });
});

app.listen(3000, function () {
    console.log('YelpCamp started on port 3000');
});