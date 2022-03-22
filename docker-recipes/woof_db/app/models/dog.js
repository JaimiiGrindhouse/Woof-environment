const db = require('./../services/db');
const { Owner } = require('./owner');

// Defines the Dog class
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

    // Pulls dog name from db
    async getDogName() {
        if (typeof this.name !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = result[0].dog_name;
        }
    }

    // Pulls dog age from db
    async getDogAge() {
        if (typeof this.age !== 'number') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.age = result[0].dog_age;
        }
    }

    // Pulls dog size from db
    async getDogSize() {
        if (typeof this.size !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.size = result[0].dog_size;
        }
    }

    // Pulls dog breed from db
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