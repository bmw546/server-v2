
const PostgresQueryEntity = require('../../entities/postgres-query-entity');
const postGres = require('modules/postGres/postGresManager');
const JsUtil = require('modules/core/util/js-util');

import {MediaEntity} from '../entities/mediaEntities';

/** @description The name of this dao table */
import { tableName } from '../media-table'
import { tableTypeName } from '../media-table'
import { tablePermissionAsso } from '../media-table'

class MediaDao{
    // ======================== CRUD table MEDIA =============================
    // CREATE
    async createMedia(media: MediaEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableName} (createdDate, size, length, thumbnailId, name, mediaPath, ` + 
            'creatorId) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            parameters: [media.createdDate, media.size, media.length, media.thumbnail, media.name,
            media.mediaPath, media.creatorId]
        })).rows[0];
        return this._buildEntity(result);
    }  

    // READ
    async getMediaFromId(id: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return this._buildEntity(result);
    }  

    async getMediasFromCreatorId(creatorId: number){
        let results = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableName} WHERE creatorId = $1`,
            parameters: [creatorId]
        }));
        let resultsBuilded = results.map((x: any) => this._buildEntity(x));
        return resultsBuilded;
    }  

    // UPDATE
    async updateMedia(media: MediaEntity){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `UPDATE ${tableName} SET (createdDate, size, length, thumbnailId, name, mediaPath, ` + 
            'creatorId) VALUES ($1, $2, $3, $4, $5, $6, $7) WHERE id = $8',
            parameters: [media.createdDate, media.size, media.length, media.thumbnail, media.name,
                media.mediaPath, media.creatorId, media.id]
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

    // ======================== CRD table Type (no update)=============================

    // Create
    async createMediaType(type: string, description: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableTypeName} (name, description) VALUES ($1, $2)`,
            parameters: [type, description]
        })).rows[0];
        return result;
    } 

    // Get
    async getMediaTypeFromId(id: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableTypeName}  WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return result;
    }  

    async getMediaTypeFromName(name: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tableTypeName}  WHERE name = $1`,
            parameters: [name]
        })).rows[0];
        return result;
    }  

    // Delete
    async deleteTypeId(id: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tableTypeName} WHERE id = $1`,
            parameters: [id]
        })).rows[0];
        return result
    } 

    async deleteTypeName(name: string){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tableTypeName} WHERE name = $1`,
            parameters: [name]
        })).rows[0];
        return result
    } 
    // ======================== CRD table association (no update)=============================
    async createMediaAssoc(mediaId: number, permissionId: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `INSERT INTO ${tableTypeName} (mediaId, permissionId) VALUES ($1, $2)`,
            parameters: [mediaId, permissionId]
        })).rows[0];
        return result;
    } 

    async getMediaPermissionAssocFromMediaId(mediaId: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `SELECT * FROM ${tablePermissionAsso} WHERE mediaId = $1`,
            parameters: [mediaId]
        }));
        return result;
    }  

    async deleteMediaPermAssocMediaId(mediaId: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tablePermissionAsso} WHERE mediaId = $1`,
            parameters: [mediaId]
        })).rows[0];
        return result;
    } 
    async deleteMediaPermAssocPermId(permissionId: number){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `DELETE FROM ${tablePermissionAsso} WHERE permissionId = $1`,
            parameters: [permissionId]
        })).rows[0];
        return result;
    } 

    // ======================= USEFUL THING ================
    /**
     * @description build an User entity from an postgres result.
     * @param {*} result 
     */
    _buildEntity(result: any): MediaEntity|undefined{
        if(JsUtil.isNill(result))
            return undefined;

        let media = new MediaEntity();
        media.createdDate = result.createdDate;
        media.id = result.id;
        media.size = result.size;
        media.length = result.length;
        if(!(JsUtil.isNill(result.thumbnail))){
            media.thumbnail = new MediaEntity();
            media.thumbnail.id = result.thumbnail;
        }
        media.name = result.name;
        media.mediaPath = result.mediaPath;
        media.creatorId = result.creatorId;         
        return media;
    }
}

module.exports = MediaDao;