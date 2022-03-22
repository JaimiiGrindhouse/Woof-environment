// Import express.js
const express = require("express");

// Create express app
var app = express();


// Add static files location
app.use(express.static("static"));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');




// Get the functions in the db.js file to use
const db = require('./services/db');

// Import models from models folder
const { Owner } = require('./models/owner');
const { Area_Parks } = require("./models/area_parks");
const { Dog } = require("./models/dog");

// handler 1 - Create a route for root - /
app.get("/", function(req, res) {
    res.send("Oh hey there world");
});

// handler 2 - all areas in a json format
app.get("/all-areas", function(req, res) {
    sql = 'select * from areas';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results);
    });
});

//handler 3 - all areas formatted in a nice table. 
app.get("/all-areas-formatted", function(req, res) {
    sql = 'select * from areas';
    var output = '<table border="1px">';
    db.query(sql).then(results => {
        for (var row of results) {
            output += '<tr>';
            output += '<td>' + row.area_ID + '</td>';
            output += '<td>' + row.area_name + '</td>';
            output += '</tr>'
        }
        output += '</table>';
        console.log(output);
        res.send(output);
    });
});

//handler 4 - all owners formatted in a  table. 
app.get("/all-owners-formatted", function(req, res) {
    sql = 'select * from owners';
    var output = '<table border="1px">';
    db.query(sql).then(results => {
        for (var row of results) {
            output += '<tr>';
            output += '<td>' + row.person_ID + '</td>';
            output += '<td>' + row.person_name + '</td>';
            output += '<td>' + row.email + '</td>';
            output += '<td>' + row.phone_no + '</td>';
            output += '</tr>'
        }
        output += '</table>';
        console.log(output);
        res.send(output);
    });
});

/*// this part is not working yet
app.get("/single-owner/:id", async function (req, res) { // '/:id' has to be :id and not person_ID. I checked it in the console. 
    var ownerId = req.params.id; // it has to be .id and not person_ID. 
    var ownerSql = 'SELECT * from owners where person_ID = ?'
    db.query(ownerSql, [ownerId]).then(results => {
        console.log(results);
        res.send(results);
    });


}); 
*/

 // function to test owner model
app.get("/single-owner/:id", async function (req, res) {
    var ownerId = req.params.id;
    // Create a student class with the ID passed
    var owner = new Owner(ownerId);
    
    // Create a Dog class with the ID as an argument 

    //The function will wait for this functions to take the information through SQL queries
    await owner.getOwnerName();
    await owner.getOwnerEmail();
    await owner.getOwnerPhone();
    await owner.getOwnerArea();

    

    res.render('owner', {owner:owner});
    
});

app.get("/dog-owner/:id", async function (req, res) {
    var ownerId = req.params.id;

    var dog = new Dog(ownerId);

    await dog.getDogName();
    await dog.getDogAge();
    await dog.getDogSize();
    await dog.getDogBreed();

    console.log(dog);
    console.log('THE AGE OF THE DOG IS: ' + dog.age);

    res.render('dog', {dog:dog});

});



 // function to test parks model
 app.get("/parks/:id", async function (req, res) {
    var parkId = req.params.id;
    // Create a student class with the ID passed
    var parks = new Area_Parks(parkId);
    await parks.getParkName();
    await parks.getAreaID();
    await parks.getAreaName();


    //console.log(parks);
    res.render('parks', {parks:parks});
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});