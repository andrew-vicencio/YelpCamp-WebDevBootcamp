var express = require('express');
var app = express();

var campgrounds = 
[
    {name: 'muskoka', image: 'https://upload.wikimedia.org/wikipedia/commons/6/6d/Lake_Muskoka.jpg'},
    {name: 'simcoe', image: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Lake_Simcoe.JPG'},
    {name: 'algonquin', image: 'https://upload.wikimedia.org/wikipedia/commons/3/33/ON_-_Algonquin_Provincial_Park.jpg'},
];

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', function(req, res){
    res.render("landing");
});

app.get('/campgrounds', function(req, res){
    res.render("campgrounds", {camps: campgrounds});
})

app.listen(3000, function(){
    console.log('YelpCamp started on port 3000');
});