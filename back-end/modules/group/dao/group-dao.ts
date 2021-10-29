
const PostgresQueryEntity = require('../../entities/postgres-query-entity');
const postGres = require('modules/postGres/postGresManager');
const JsUtil = require('modules/core/util/js-util');

import {GroupEntity} from '../entities/groupEntities';

/** @description The name of this dao table */
const tableName = require('../group-table').tableName;
const tableAssoc = require('../group-table').tableAssoc;
class GroupDao{
    // ======================== CRUD =============================
    // CREATE
    async createGroup(group: GroupEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableName} (string, description)` + 
            'VALUES ($1, $2)',
            parameters: [group.name, group.description]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // READ
    async getGroupFromId(id: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getGroupFromName(name: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE name = $1`,
            parameters: [name]
        })).rows[0];
        return this._buildEntity(result);
    }  
    // UPDATE
    async updateGroup(group: GroupEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `UPDATE ${tableName} SET (name, description)` + 
            'VALUES ($1, $2) WHERE id = $3',
            parameters: [group.name, group.description, group.id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // DELETE
    async deleteId(id: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tableName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return this._buildEntity(result);
    } 

    // =================== SPECIAL SQL REQUEST ===================
    /**
     * @param {string} name - The name to check if it exists
     */
    async doesNameExist(name: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE name = $1`,
            parameters: [name]
        })).rows[0];

        if(JsUtil.isNill(result) || result === 0){
            return false;
        } else if (result !== 1){
            return true;
        }
        
        throw Error();  // Something wrong happen !
    }

    // =================== SPECIAL Association REQUEST ===================
    // CREATE
    async createAssoGroup(idGroup: number, idUser: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableAssoc} (idGroup, idUser)` + 
            'VALUES ($1, $2)',
            parameters: [idGroup, idUser]
        })).rows[0];
        return this._buildEntity(result);
    }

    async getAssocGroupUserId(idGroup: number, idUser: number){
        let results = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableAssoc} WHERE idUser = $1`,
            parameters: [idUser]
        }));
        let resultsBuilded = results.map((x: any) => this._buildEntity(x));
        return resultsBuilded;
    }

    async getAssocGroupGroupId(idGroup: number, idUser: number){
        let results = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableAssoc} WHERE idGroup = $1`,
            parameters: [idGroup]
        }));
        let resultsBuilded = results.map((x: any) => this._buildEntity(x));
        return resultsBuilded;
    }

    async deleteAssocGroupUserId(idGroup: number){
        let results = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tableName} WHERE idGroup = $1`,
            parameters: [idGroup]
        }));
        return results;
    } 

    async deleteAssocGroupGroupId(idUser: number){
        let results = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tableName} WHERE idUser = $1`,
            parameters: [idUser]
        }));
        return results;
    } 
    // ======================= USEFUL THING ================
    /**
     * @description build an User entity from an postgres result.
     * @param {*} result 
     */
    _buildEntity(result: any): GroupEntity|undefined{
        if(JsUtil.isNill(result))
            return undefined;

        let group = new GroupEntity();
        group.id = result.id;
        group.name = result.name;
        group.description = result.description;

        
        return group;
    }
}

module.exports = GroupDao;