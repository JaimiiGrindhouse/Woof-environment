const db = require('./../services/db');

const { area, Area } = require('./area')

// Defines the Area_Parks class
class Area_Parks {
    //park ID
    id;
    //park name
    name;
    //area ID
    area_ID;
    //area name
    area_name;
    constructor(id) {
        this.id = id;
    }

    

    // Pulls park name from db
    async getParkName() {
        if (typeof this.name !== 'string') {
            var sql = "SELECT * from area_parks where park_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.name = results[0].park_name;
        }
    }

    // Pulls area ID from db
    async getAreaID() {
        if (typeof this.area_ID !== Area) {
            var sql = "SELECT * from areas, area_parks \
            where areas.area_ID = area_parks.area_ID"
            const results = await db.query(sql, [this.id]);
            this.area_ID = results[0].area_ID;
        }
    }

    // Pulls area name from db
    async getAreaName() {
        if (typeof this.area_name !== 'string') {
            var sql = "SELECT * from area_parks where park_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.area_name = results[0].area_name;
        }
    }

}

//New function implementation

async function getAllParks(){
    var sql = 'SELECT area_name, park_name FROM area_parks;'
    const results = await db.query(sql);
    return JSON.stringify(results)
}








module.exports = {
    Area_Parks,
    getAllParks

}
