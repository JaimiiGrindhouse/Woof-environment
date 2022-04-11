// Import express.js
const express = require("express");

// Create express app
var app = express();

// Set the sessions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// Add static files location
app.use(express.static("static"));

// Make sure we get the POST parameters
app.use(express.urlencoded({ extended: true }));

// Use the Pug templating engine
app.set('view engine', 'pug');
app.set('views', './app/views');

// Get the functions in the db.js file to use
const db = require('./services/db');

// Import models from models folder
const { Owner } = require('./models/owner');
const { Area_Parks } = require("./models/area_parks");
const { Dog } = require("./models/dog");
const { User } = require("./models/user");
const getarea = require("./models/area");

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
    // Create an owner class with the ID passed
    var owner = new Owner(ownerId);
    var dog = new Dog(ownerId);
    // Create a Dog class with the ID as an argument 

    //The function will wait for these functions to take the information through SQL queries
    await owner.getOwnerName();
    await owner.getOwnerEmail();
    await owner.getOwnerPhone();
    await owner.getOwnerArea();
    await dog.getDogName();
    await dog.getDogAge();
    await dog.getDogSize();
    await dog.getDogBreed();

    

    res.render('owner', {owner:owner, dog:dog});
   
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
    // Create a park class with the ID passed
    var parks = new Area_Parks(parkId);
    await parks.getParkName();
    await parks.getAreaID();
    await parks.getAreaName();


    //console.log(parks);
    res.render('parks', {parks:parks});
});

// Register
app.get('/register', function (req, res) {
    res.render('register');
});
app.post('/set-password', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            // If a valid, existing user is found, set the password and redirect to the users single-owner page
            await user.setUserPassword(params.password);
            res.redirect('/single-owner/' + uId);
        }
        else {
            // If no existing user is found, add a new one
            newId = await user.addUser(params.email);
            uId = await user.getIdFromEmail();
            res.redirect("/set-profile/" + uId);
            //res.send('set a profile'+uId)
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Create a set-profile route  - /set-profile
app.get("/set-profile/:id", async function(req, res) {
    var userId = req.params.id;
    var user = new User(userId);
    var areas = await getarea.getAllAreas();
    //res.send('set a profile');
    res.render('profile', {areas:areas, user:user});
});

// Login
app.get('/login', function (req, res) {
    res.render('login');
});

// Create a post route to handle the form submission of the option list
app.post('/area-select', function (req, res) {
    // Retrieve the parameter and redirect to the single student page
    id = req.body.studentParam;
    res.redirect('/single-owner/' + id);
});


// Check submitted email and password pair
app.post('/authenticate', async function (req, res) {
    params = req.body;
    var user = new User(params.email);
    try {
        uId = await user.getIdFromEmail();
        if (uId) {
            match = await user.authenticate(params.password);
            if (match) {
                res.redirect('/single-owner/' + uId);
            }
            else {
                // TODO improve the user journey here
                res.send('invalid password');
            }
        }
        else {
            res.send('invalid email');
        }
    } catch (err) {
        console.error(`Error while comparing `, err.message);
    }
});

// Logout
app.get('/logout', function (req, res) {
    req.session.destroy();
    res.redirect('/login');
});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});