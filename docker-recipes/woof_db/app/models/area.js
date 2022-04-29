const db = require('./../services/db');

// Defines the Area class
class Area {
    // Area ID
    id;
    // Area name
    name;
    
    constructor(id) {
        this.id = id;
    }

     // Set owner's area method
     setOwnerArea(area) {
        this.area = area;
    }
    // Pulls area name from db
    async getAreaName() {
        if (typeof this.name !== 'string');
        var sql = 'SELECT * from areas where area_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = result[0].name;
        }
    
}
// Gets list of all areas
async function getAllAreas() {
    var sql = "SELECT area_ID, area_name from areas"
    const results = await db.query(sql);
    var areas = [];
    for (var row of results) {
        // Use our Area class to neatly format the object going to the template
        var area = new Area (row.area_ID);
        // Set the area name
        area.setOwnerArea(row.area_name);
        // Push the area class onto area array
        areas.push(area);
    }    
    // Return the array of all areas
    return areas;
}

module.exports = {
    Area,
    getAllAreas
}