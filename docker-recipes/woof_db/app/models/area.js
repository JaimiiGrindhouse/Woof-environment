const db = require('./../services/db');

class Area {
    // Area ID
    id;
    // Area name
    name;
    
    constructor(id) {
        this.id = area_ID;
    }

    async getAreaName() {
        if (typeof this.name !== 'string');
        var sql = 'SELECT * from areas where area_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = results[0].area_name;
        }
    
}

module.exports = {
    Area
}