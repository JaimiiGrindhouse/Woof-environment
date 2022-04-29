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

      
    // Set student name method
    setOwnerName(name) {
        this.name = name;
    }

  // Add a new record to the owners table
  async addOwner(id) {
    var sql = "INSERT INTO Owners (id, email) VALUES (? , ?)";
    const result = await db.query(sql, [this.email, id]);
    console.log(result.insertId);
    this.id = result.insertId;
    this.email = result.insertEmail;
    return true;
    }  

    // Pulls owner name from db
    async getOwnerName() {
        if (typeof this.name !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.name = results[0].name;
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
            console.log(results);
            this.area = new Area(results[0].area_name);
            this.area = results[0].area_name;
            console.log(results)
        }
    }

    // Add Owner Details to Profile
    async addOwnerDetails(name, email, phone) {
        var sql = "INSERT INTO Owners (person_name, area_id, email, phone_no, person_id) VALUES (?, '4', ?, ?, ?)";
        const result = await db.query(sql, [name, email, phone, this.id]);
        // Ensure the Owner properties in the model is up to date
        this.id = result.insertId;
        console.log(result)
        return result;
    }
    
    // Add Dog Details to Profile
    async addDogDetails(dogName, dogage, dogsize, dogbreed) {
        var sql = "INSERT INTO Owners (person_name, area_id, email, phone_no, person_id) VALUES (?, '4', ?, ?, ?)";
        const result = await db.query(sql, [name, email, phone, this.id]);
        // Ensure the Owner properties in the model is up to date
        this.id = result.insertId;
        console.log(result)
        return result;
    }

}
    /*
    // LEAVING THIS FUNCTION EMPTY FOR NOW.
    async getOwnerPicture() {

    }
    */
    



module.exports = {
    Owner
    
}