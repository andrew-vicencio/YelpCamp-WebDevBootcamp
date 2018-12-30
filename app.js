var express      = require('express'),
    app          = express(),
    bodyParser   = require('body-parser'),
    mongoose     = require('mongoose');

mongoose.connect("mongodb://localhost:27017/yelpcamp", {useNewUrlParser: true});

var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    desc: String
});

var Campground = mongoose.model("Campground", campgroundSchema);
// Campground.create({
//     name: "Algonquin",
//     image: "https://upload.wikimedia.org/wikipedia/commons/3/33/ON_-_Algonquin_Provincial_Park.jpg",
//     desc: "A national tresure"
// }, function(err, camp){
//     if (err) {
//         console.log(err);
//     } else {
//         console.log(camp);
//     }
// });

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', function(req, res){
    res.render("landing");
});

//INDEX
app.get('/campgrounds', function(req, res){
    Campground.find({}, function (err, campgrounds){
        if (err) {
            console.log(err);
        } else {
            res.render("index", {campgrounds: campgrounds});
        }
    });
});

//NEW
app.get('/campgrounds/new', function(req, res){
    res.render("new");
})

//SHOW
app.get('/campgrounds/:id', function(req, res){
    Campground.findById(req.params.id, function(err, campground){
        if (err) {
            console.log(err)
        } else {
            res.render('show', {campground: campground});
        }
    });
});

//CREATE
app.post('/campgrounds', function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    Campground.create({
        name: name,
        image: image,
        desc: desc
    }, function(err, campground){
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
        }
    });
});

app.listen(3000, function(){
    console.log('YelpCamp started on port 3000');
});