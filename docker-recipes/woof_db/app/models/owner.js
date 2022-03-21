const db = require('./../services/db');

const { Dog } = require('./dog');
const { Area } = require('./area');

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

    async getOwnerName() {
        if (typeof this.name !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.name = results[0].person_name;
        }
    }

    async getOwnerEmail() {
        if (typeof this.email !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.email = results[0].email;
        }
    }

    async getOwnerPhone() {
        if (typeof this.phone !== 'string') {
            var sql = "SELECT * from owners where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.phone = results[0].phone_no;
        }
    }

    // This might not work lol. 
    async getOwnerArea() {
        if (typeof this.area !== Area) {
            var sql = "SELECT * from areas a \
            JOIN owners o ON a.area_ID = o.area_ID \
            where person_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.area = new Area(results[0].programme);
            this.owner_area = results[0].area;
        }
    }

    // LEAVING THIS FUNCTION EMPTY FOR NOW.
    async getOwnerPicture() {

    }
}

module.exports = {
    Owner
}