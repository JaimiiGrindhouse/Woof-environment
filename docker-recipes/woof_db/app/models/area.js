const db = require('./../services/db');

class Area {
    // Area ID
    id;
    // Area name
    name;
    
    constructor(id) {
        this.id = id;
    }

    async getAreaName() {
        if (typeof this.name !== 'string');
        var sql = 'SELECT * from areas where area_ID = ?'
        const result = await db.query(sql, [this.id]);
        this.name = results[0].name;
        }
    
}

module.exports = {
    Area
}