const db = require('./../services/db');

const { area, Area } = require('./area')

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

    async getParkName() {
        if (typeof this.name !== 'string') {
            var sql = "SELECT * from area_parks where park_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.name = results[0].park_name;
        }
    }

    // Not sure if this sql query is correct. 
    async getAreaID() {
        if (typeof this.area_ID !== Area) {
            var sql = "SELECT * from areas, area_parks \
            where areas.area_ID = area_parks.area_ID"
            const results = await db.query(sql, [this.id]);
            this.area_ID = results[0].area_ID;
        }
    }

    async getAreaName() {
        if (typeof this.area_name !== 'string') {
            var sql = "SELECT * from area_parks where park_ID = ?"
            const results = await db.query(sql, [this.id]);
            this.area_name = results[0].area_name;
        }
    }

}
module.exports = {
    Area_Parks
}