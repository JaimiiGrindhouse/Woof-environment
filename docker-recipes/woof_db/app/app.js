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
app.use(express.json());

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
const getParks = require("./models/area_parks")
const getOwners = require('./models/owner')






// handler 1 - Create a route for root - /
app.get("/", function(req, res) {
    res.send("Oh hey there world");
});


 // function to test owner model
app.get("/single-owner/:id", async function (req, res) {

    var ownerId = req.params.id;
    // Create an owner class with the ID passed
    var owner = new Owner(ownerId);
    // Create a Dog class with the ID as an argument 
    var dog = new Dog(ownerId);
    
    

    var areas = await getarea.getAllAreas(ownerId);
    var allParks = await getParks.getAllParks();

    
    //The function will wait for these functions to take the information through SQL queries
    await owner.getOwnerName();
    await owner.getOwnerEmail();
    await owner.getOwnerPhone();
    await owner.getOwnerArea();
    await dog.getDogName();
    await dog.getDogAge();
    await dog.getDogSize();
    await dog.getDogBreed();

   
    //handling function for the front end
    res.render('owner', {owner:owner, dog:dog, dbAreas:areas,allParks:allParks});
   
});

app.get("/dog-owner/:id", async function (req, res) {
    var ownerId = req.params.id;

    var dog = new Dog(ownerId);

    await dog.getDogName();
    await dog.getDogAge();
    await dog.getDogSize();
    await dog.getDogBreed();

    //console.log(dog);
    //console.log('THE AGE OF THE DOG IS: ' + dog.age);

    res.render('dog', {dog:dog});

});



app.post('/matches' , (req,res) => {
    const park =    req.body.park
    const ownerID = req.body.ownerID
    const dogSize = req.body.dogSize

    
    res.json({
            status: 'success',
            park:park, 
            ownerID:ownerID,
            dogSize:dogSize
        });
});

app.get('/matches/:park/:ownerID/:dogSize', async function (req,res) {

    var allOwners = await getOwners.getAllOwners();
    let ownersNoUser = []
    
   
   //Deletes current user 
    for(let i=0; i<allOwners.length; i++){
        if(allOwners[i].person_ID == req.params.ownerID ){
            allOwners.splice(i,1);
        }
        ownersNoUser = allOwners
    }
    //Filters users that are in the same park
    function filterParks(element){
        if (element.park == req.params.park){
            return element
        }
    }
    let filteredParks = ownersNoUser.filter(filterParks)

    function filterSizes(element){
        if (element.dog_size == req.params.dogSize){
            return element
        }
    }
    let filteredParksnSize = filteredParks.filter(filterSizes)

    console.log(filteredParksnSize)

    res.render('matches', {filtered:filteredParksnSize})
})


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
            res.send('Perhaps a page where a new user sets a programme would be good here');
        }
    } catch (err) {
        console.error(`Error while adding password `, err.message);
    }
});

// Login
app.get('/login', function (req, res) {
    res.render('login');
});

// Handling unexisting directions
app.all('*', (req,res) => {
    res.status(404).send('<h1>Page not found</h1>')
})

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