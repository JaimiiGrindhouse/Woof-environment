// Import express.js
const express = require("express");
const multer  = require('multer')

// Create express app
var app = express();

// Add static files location
app.use(express.static("static"));

// Set the sessions
var session = require('express-session');
app.use(session({
  secret: 'secretkeysdfjsflyoifasd',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

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
const getparks = require("./models/area_parks");
const getowners = require("./models/owner");


// Multi file upload configuration using multer
// Set up destination and file name for image upload directory
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './static/images/' + file.fieldname); //fieldname property in the form field in pug, used as dest folder
    },
    filename: function (req, file, cb) {
        cb(null, req.body.id + ".jpg");//using user id for file naming
    }
})
//setting up handle to call multer with parameters set under storage
const upload = multer({
    storage: storage,
    //error handling to restrict file size and mimetype to jpegs, no ux behind it
    limits: {
        fileSize: 1024 * 1024 * 2 //set limit to 2 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true);
        } else {
            return cb(new Error('Invalid mime type'));
        }
    }
});
// Setting up array for multi-image array upload from profile set up, 'fields' method resp for multi-upload
const cpUpload = upload.fields([{ name: 'owners', maxCount: 1 }, { name: 'dogs', maxCount: 1 }])


// handler 1 - Create a route for root - /
app.get("/", function(req, res) {
    res.render('register')
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

 // Single owner page
app.get("/single-owner/:id", async function (req, res) {
    var ownerId = req.params.id;
    // Create an Owner and Dog objects with the ID passed
    var owner = new Owner(ownerId);
    var dog = new Dog(ownerId);
    var areas = await getarea.getAllAreas();
    var parks = await getparks.getAllParks();
    //The function will wait for these functions to take the information through SQL queries
    await owner.getOwnerName();
    await owner.getOwnerEmail();
    await owner.getOwnerPhone();
    await owner.getOwnerArea();
    await dog.getDogName();
    await dog.getDogAge();
    await dog.getDogSize();
    await dog.getDogBreed();
    res.render('owner', {owner:owner, areas:areas, dog:dog, parks:parks});   
});


// Route for finding matches
app.post('/matches/', async function (req, res) {
    // Get the submitted values
    var params = req.body;
    var matchedAreas = await getowners.getAllMatches(params.areaselect);
    //console.log ('matches', params, params.areaselect, matchedAreas);
    res.render('matcheslist', {matchedAreas:matchedAreas});
});


app.get("/dog-owner/:id", async function (req, res) {
    var ownerId = req.params.id;
    var dog = new Dog(ownerId);
    await dog.getDogName();
    await dog.getDogAge();
    await dog.getDogSize();
    await dog.getDogBreed();
    res.render('dog', {dog:dog});
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
            // If no existing user is found, add a new one and redirect to Profile detail page
            await user.addUser(params.password);
            var newID = await user.getIdFromEmail();
            var areas = await getarea.getAllAreas();
            useremail = params.email;
            res.render('profile', {areas:areas, useremail, newID});
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Login
app.get('/login', function (req, res) {
    res.render('login');
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

// Route for adding owner details on the profile page
// subsequently posting into database and static (cpUpload,images)
app.post('/add-details/', cpUpload, async function (req, res) {
     // Get the submitted values
    params = req.body;
    // Note that we need the id to get update the correct owner
    var owner = new Owner(params.id)
    // Adding a try/catch block which will be useful later when we add to the database
    try {
        owner.addOwnerDetails(params.name, params.email, params.phone, params.areaselect);
        owner.addDogDetails(params.dogname, params.dogbreed, params.dogsize, params.dogage).then(result => {
            res.redirect('/single-owner/' + params.id);
        })
     } catch (err) {
         console.error(`Error while adding note `, err.message);
     }
});


 // function to test parks model
 app.get("/parks/:id", async function (req, res) {
    var parkId = req.params.id;
    // Create a park class with the ID passed
    var parks = new Area_Parks(parkId);
    await parks.getParkName();
    await parks.getAreaID();
    await parks.getAreaName();
    res.render('parks', {parks:parks});
});


// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});