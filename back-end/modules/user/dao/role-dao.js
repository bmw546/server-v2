// Check if the variable is there if no then declare it.
const RoleEntity = require('../entities/role-entity');
const IBaseDao = require('servercore/dao/i-base-dao');
const {postGres} = require('servercore/postgres/postgresPipe');


/** @description The name of this dao table */
const tableName = "role";

// --------------- Let add the basic table --------------------
// Mayby ask for a better generated ID
postGres.addCreateTable(
    `CREATE TABLE IF NOT EXISTS ${tableName} (
        id serial primary key,
        title VARCHAR(50),
        description VARCHAR(150)
    )`
);

// Adding some data
postGres.addCreateTable(
    `INSERT INTO ${tableName} (title, description)
    VALUES ('root', 'The root system'), 
    ('admin', 'The system admin'),
    ('user', 'A registered user'),
    ('guest', 'A non registered user')`
);

class RoleDao extends IBaseDao{

    /**
     * @description Create an role entity from an postgres result.
     * @param {RoleEntity} result 
     */
    _buildEntity(result){
        return new RoleEntity(result);
    }
}

module.exports = RoleDao;