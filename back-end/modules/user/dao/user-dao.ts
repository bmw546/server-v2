
const PostgresQueryEntity = require('../../entities/postgres-query-entity');
const postGres = require('modules/postGres/postGresManager');

const JsUtil = require('modules/core/util/js-util');

import {UserEntity} from '../entities/user-entity';

/** @description The name of this dao table */
import { tableName } from '../user-table'
class UserDao{
    // ======================== CRUD =============================

    // CREATE
    async createUser(user: UserEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableName} (username, password, email, auth0Id, imageId, lastMediaId, lastMediaTime)` + 
            'VALUES ($1, $2, $3, $4, $5, $6, $7)',
            parameters: [user.username, user.password, user.email, user.auth0Id,
            user.imageId, user.lastMediaId, user.lastMediaTime]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // READ
    async getUserFromId(id: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getUserUsername(username: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE username = $1`,
            parameters: [username]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getUserAuth0(auth0Id: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE auth0Id = $1`,
            parameters: [auth0Id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // UPDATE
    async updateUser(user: UserEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `UPDATE ${tableName} SET (username, password, email, auth0Id, imageId, lastMediaId, lastMediaTime)` + 
            'VALUES ($1, $2, $3, $4, $5, $6, $7) WHERE id = $8',
            parameters: [user.username, user.password, user.email, user.auth0Id,
            user.imageId, user.lastMediaId, user.lastMediaTime, user.id]
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
    async getFromUserPw(username:string, hashedPassword:string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE username = $1 AND password = $2`,
            parameters: [username, hashedPassword]
        })).rows[0];
        return this._buildEntity(result);
    }  

    /**
     * 
     * @param {string} username - The name to check if it exists
     */
    async doesUsernameNameExist(username: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE username = $1`,
            parameters: [username]
        })).rows[0];

        if(JsUtil.isNill(result) || result === 0){
            return false;
        } else if (result !== 1){
            return true;
        }
        
        throw Error();  // Something wrong happen !
    }


    // ======================= USEFULL THING ================
    /**
     * @description build an User entity from an postgres result.
     * @param {*} result 
     */
    _buildEntity(result: any): UserEntity|undefined{
        if(JsUtil.isNill(result))
            return undefined;

        let user = new UserEntity();
        user.id = result.id;
        user.username = result.username;
        user.password = ""; // We do not get the password (even if hash it will stay in SQL)
        user.email = result.email;
        user.auth0Id = result.auth0Id;
        user.avatarImage = null; //TODO result.avatarImageId
        user.lastMediaId = result.lastMediaId;
        user.lastMediaTime = result.lastMediaTime;
        
        return user;
    }
}

module.exports = UserDao;