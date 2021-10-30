
const PostgresQueryEntity = require('../../entities/postgres-query-entity');
const postGres = require('modules/postGres/postGresManager');
const JsUtil = require('modules/core/util/js-util');

import {PermissionEntity} from '../entities/permissionEntities';

/** @description The name of this dao table */
import { tableName } from '../permission-table'
class PermissionDao{
    // ======================== CRUD =============================
    // CREATE
    async createPermission(permission: PermissionEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableName} (read, write, delete, userId, groupId, giveAccessToId, applicationId)` + 
            'VALUES ($1, $2, $3, $4, $5, $6, $7)',
            parameters: [permission.read, permission.write, permission.delete, permission.userId,
                permission.groupId, permission.giveAccessToId, permission.applicationId]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // READ
    async getPermissionFromId(id: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getPermissionFromUserAndAccess(idUser: number, idAccess: number, idApp: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE idUser = $1 AND giveAccessToId = $2 AND applicationId = $3`,
            parameters: [idUser, idAccess, idApp]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getPermissionFromGroupAndAccess(groupId: number, idAccess: number, idApp: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE groupId = $1 AND giveAccessToId = $2 AND applicationId = $3`,
            parameters: [groupId, idAccess, idApp]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getPermissionFromAppAndAccess(idAccess: number, idApp: number){
        let results = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE giveAccessToId = $2 AND applicationId = $3`,
            parameters: [idAccess, idApp]
        }));
        let resultsBuilded = results.map((x: any) => this._buildEntity(x));
        return resultsBuilded;
    }  

    // UPDATE
    async updateGroup(permission: PermissionEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `UPDATE ${tableName} SET (read, write, delete, userId, groupId, giveAccessToId, applicationId)` + 
            'VALUES ($1, $2, $3, $4, $5, $6, $7) WHERE id = $8',
            parameters: [permission.read, permission.write, permission.delete, permission.userId,
                permission.groupId, permission.giveAccessToId, permission.applicationId, permission.id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // DELETE
    async deleteId(id: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tableName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return result
    } 

    // ======================= USEFUL THING ================
    /**
     * @description build an User entity from an postgres result.
     * @param {*} result 
     */
    _buildEntity(result: any): PermissionEntity|undefined{
        if(JsUtil.isNill(result))
            return undefined;

        let group = new PermissionEntity();
        group.id = result.id;
        group.read = result.read;
        group.write = result.write;
        group.delete = result.delete;
        group.userId = result.userId;
        group.groupId = result.groupId;
        
        return group;
    }
}

module.exports = PermissionDao;