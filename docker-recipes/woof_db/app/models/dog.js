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
        this.id = person_ID;
    }

    async getDogName() {
        if (typeof this.name !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = results[0].dog_name;
        }
    }

    async getDogAge() {
        if (typeof this.age !== 'number') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.age = results[0].dog_age;
        }
    }

    async getDogSize() {
        if (typeof this.size !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.size = results[0].dog_size;
        }
    }

    async getDogBreed() {
        if (typeof this.breed !== 'string') {
        var sql = 'SELECT * from dogs where person_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.breed = results[0].dog_breed;
        }
    }

    async getPicture() {

    }

}

module.exports = {
    Dog
}