const db = require('./../services/db');
const { Owner } = require('./owner');

class Dog {
    // Dog name
    name;
    // Dog size
    size;
    // Dog age
    age;
    //Dog breed
    breed;
    // Dog picture
    picture;

    constructor(id) {
        this.id = id;
    }

    async getDogName() {
        if (typeof this.name !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = result[0].dog_name;
        }
    }

    async getDogAge() {
        if (typeof this.age !== 'number') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.age = result[0].dog_age;
        }
    }

    async getDogSize() {
        if (typeof this.size !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.size = result[0].dog_size;
        }
    }

    async getDogBreed() {
        if (typeof this.breed !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.breed = result[0].dog_breed;
        }
    }

    //FUTURE IMPLEMENTATION 
    /*async getPicture() {

    }*/

}

module.exports = {
    Dog
}