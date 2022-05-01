const db = require('./../services/db');

const { area, Area } = require('./area')

// Defines the Area_Parks class
class Area_Parks {
    //park ID
    id;
    //park name
    park;
    //area ID
    area_ID;
    //area name
    area_name;
    

    constructor(id) {
        this.id = id;
    }
     // Method to set park name into the area_parks class
     setParkName(park) {
        this.park = park;
    }

    // Method to set park's area_ID into the area_parks class
    setParkArea(area_ID){
        this.area_ID = area_ID;
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
    // Gets list of all parks based on area selection
    async function getAllParks() {
        var sql = "SELECT area_ID, park_ID, park_name from area_parks"
        const results = await db.query(sql);
        var parks = [];
        for (var row of results) {
            // Use our area_parks class to neatly format the object going to the template
            var park = new Area_Parks (row.park_ID);
            // Set the area name
            park.setParkName(row.park_name);//call method to set park name into this class
            park.setParkArea(row.area_ID);//call method to set area ID into this class 
            // Push the area_parks class onto area_parks array
            parks.push(park);
           
        }    
        // Return the array of all parks
        return parks;
    }


module.exports = {
    Area_Parks,
    getAllParks
}