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

    // Pulls area name from db
    async getAreaName() {
        if (typeof this.name !== 'string');
        var sql = 'SELECT * from areas where area_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = result[0].name;
        }
    
}

module.exports = {
    Area
}