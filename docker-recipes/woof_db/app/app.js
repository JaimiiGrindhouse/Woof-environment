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

const { Owner } = require('./models/owner');

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

 // this part is not working yet
app.get("/single-owner/:id", async function (req, res) {
    var ownerId = req.params.id;
    // Create a student class with the ID passed
    var owner = new Owner(ownerId);
    await owner.getOwnerName();
    await owner.getOwnerEmail();
    await owner.getOwnerPhone();
    await owner.getOwnerArea();


    console.log(owner);
    res.render('owner', {owner:owner});
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});