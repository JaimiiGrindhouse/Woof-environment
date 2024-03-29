const db = require('./../services/db');
//const { Owner } = require('./owner');
//const { Dog } = require('./dog');
const { Area } = require('./area');

// Defines the Owner class
class Owner {
    // Owner ID
    id;
    // Owner name
    name;
    // Owner e-mail
    email;
    // Owner phone number
    phone;
    // Owner area
    area;
    // Owner picture
    picture;

    constructor(id) {
        this.id = id;
    }

      
    // Set Owner name method
    setOwnerName(name) {
        this.name = name;
    }

    // Set Owner email method
    setOwnerEmail(email) {
        this.email = email;
    }    

    // Set Owner phone method
    setOwnerPhone(phone) {
        this.phone = phone;
    }     

  // Add a new record to the owners table (**Depricated**)
  async addOwner(id) {
    var sql = "INSERT INTO Owners (id, email) VALUES (? , ?)";
    const result = await db.query(sql, [this.email, id]);
    this.id = result.insertId;
    this.email = result.insertEmail;
    return true;
    }  

    // Pulls owner name from db
    async getOwnerName() {
        if (typeof this.name !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.name = results[0].person_name;
        }
    }

    // Pulls owner email address from db
    async getOwnerEmail() {
        if (typeof this.email !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.email = results[0].email;
        }
    }

    // Pulls owner phone number from db
    async getOwnerPhone() {
        if (typeof this.phone !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.phone = results[0].phone_no;
        }
    }

    // Pulls owner area from db
    async getOwnerArea() {
        if (typeof this.area !== Area) {
            var sql = "SELECT * from areas a \
            JOIN owners o ON a.area_ID = o.area_ID \
            where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.area = new Area(results[0].area_name);
            this.area = results[0].area_name;
            console.log('getownwerarea',results)
        }
    }

    // Add Owner Details to Profile
    async addOwnerDetails(name, email, phone, area) {
        var sql = "INSERT INTO Owners (person_name, area_id, email, phone_no, person_id) VALUES (?, ?, ?, ?, ?)";
        const result = await db.query(sql, [name, area, email, phone, this.id]);
        // Ensure the Owner properties in the model is up to date
        this.id = result.insertId;
        return result;
    }
    
    // Add Dog Details to Profile
    async addDogDetails(dogname, dogbreed, dogsize, dogage) {
        var sql = "INSERT INTO dogs (dog_name, dog_breed, dog_size, dog_age, person_id) VALUES (?, ?, ?, ?, ?)";
        const result = await db.query(sql, [dogname, dogbreed, dogsize, dogage, this.id]);
        // Ensure the Dog properties in the model is up to date
        this.id = result.insertId;
        return result;
    }
}

async function getAllMatches(areaselect) {
    var sql = sql = "select * from owners where area_ID = ?";
    const results = await db.query(sql, [areaselect]);
    var owners = [];
    for (var row of results) {
        var owner = new Owner (row.person_ID);
        owner.setOwnerName(row.person_name)
        owner.setOwnerEmail(row.email)
        owner.setOwnerPhone(row.phone_no)
        owners.push(owner);
    } 
    // Return the array of all matching owners
    return owners;
}    


module.exports = {
    Owner,
    getAllMatches
    
}