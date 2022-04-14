// Get the functions in the db.js file to use
const db = require('../services/db');

const all_areas = (req, res) => {
    sql = 'select * from areas';
    db.query(sql).then(results => {
        console.log(results);
        res.send(results);
    });
};

const single_owner = async function (req, res) {
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
   
};



module.exports = {
    all_areas,
    single_owner
}