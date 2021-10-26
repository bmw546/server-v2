const IBaseDao = require('servercore/dao/i-base-dao');

const ResolutionEntity = require('../entities/resolution-entity');

const {postGres} = require('servercore/postgres/postgresPipe');
const PostgresQueryEntity = require('servercore/entities/postgres-query-entity');

/** @description The name of this dao table */
const name = 'resolution';

// --------------- Let add the basic table --------------------
// Maybe ask for a better generated ID
postGres.addCreateTable(
    `CREATE TABLE IF NOT EXISTS ${name} (
        id serial primary key,
        height INT,
        width INT
    )`
);

class ResolutionDao extends IBaseDao{
    
    /**
     * @description make an resolution entity from an postgres result.
     * @param {*} result 
     */
    _buildEntity(result){
        return new ResolutionEntity(commitResult); 
    }

}

module.exports = ResolutionDao; 