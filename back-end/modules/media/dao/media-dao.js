const IBaseDao = require('servercore/dao/i-base-dao');

const {postGres} = require('servercore/postgres/postgresPipe');
const PostgresQueryEntity = require('servercore/entities/postgres-query-entity');

const MediaEntity = require('../entities/media-entity');

const MediaTypeEntity = require('../entities/media-type-entity');

const AuthorizationEntity = require('back-end/modules/authorization/entities/authorization-entity');
const TagsEntity = require('../entities/tags-entity');
const { user } = require('servercore/postgres/post-gres-config');


/** @description The name of this dao table */
const name = "media";

// We use the media type to filter the type when pulling some mediaInfo.

// Add the media type tables and populates it with some base info.
require('./media-type-dao');

// --------------- Let add the basic table --------------------
// Maybe ask for a better generated ID
postGres.addCreateTable(
    `CREATE TABLE IF NOT EXISTS ${name} (
        id serial primary key,
        title VARCHAR(150),
        description TEXT,
        creatorId INT,
        size INT,
        fileName TEXT,
        rating INT,
        numberRating INT,
        numberView INT,
        mediaTypeId INT,
        FOREIGN KEY (mediaTypeId) REFERENCES media_type (id) ON UPDATE CASCADE ON DELETE SET NULL
        
    )`
);

//might delete the media type not really usefull to be honest
// ------------- And then let modify them ------------------------

postGres.addModifyTable(
    `CREATE INDEX ON ${name} (mediaTypeId)`
);

// Add a tags association table
postGres.addModifyTable(
    `CREATE TABLE IF NOT EXISTS tags_media (
        fk_media int,
        fk_tags int,
        FOREIGN KEY (fk_media) REFERENCES ${name}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_tags) REFERENCES tag(id) ON UPDATE CASCADE ON DELETE SET NULL
    )`
);

// Add authorization association table
postGres.addModifyTable(
    `CREATE TABLE IF NOT EXISTS authorization_media (
        media_id int,
        fk_authorization int,
        FOREIGN KEY (media_id) REFERENCES ${name}(id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (fk_authorization) REFERENCES authorization_table(id) ON UPDATE CASCADE ON DELETE CASCADE
    )`
);


class MediaDao extends IBaseDao{


    /**
     * @description Help to make get sql from association with media
     * @param {string} table 
     * @param {number} id 
     */
    async _getAssociationMediaTable(table, id){
        return await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.selectQuery(table)} media_id = $id`,
            parameters: [id]
        }));
    }

    /**
     * @description Help to make push sql from association with media
     * @param {string} tableName 
     * @param {number} id 
     * @param {*} object 
     */
    async _pushAssociationMediaTable(tableName, id, object){
        await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.insertQuery(tableName)}`,
            parameters: [id, object]
        }));
    }

    /**
     * @description Help to make delete sql from association with media
     * @param {string} tableName 
     * @param {number} id 
     */
    async _deleteAssociationMediaTable(tableName, id){
        await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.deleteQuery(tableName)} media_id = $id`,
            parameters: [id]
        })); 
    }

    // ========================= MEDIA TAGS ============================================

    /**
     * @description Retrieve the list of tags setting for a specific media from the data store.
     * @param {MediaEntity} media 
     */
    async getMediaTags(media){
        let result = await this._getAssociationMediaTable('tags_media', media.id);

        for(let row of result.row){
            media.tags.push(new TagsEntity({id: row}));
        }
        
        return media;
    }

    /**
     * @description Insert a association in the associative table of media - tags.
     * @param {MediaEntity} media 
     */
    async insertMediaTags(media){
        for(let tag of media.tags){
            await this._pushAssociationMediaTable('tags_media', media.id, tag);
        }
    }

    /**
     * @description  Deletes to the associative table all the association of media - tags
     * @param {MediaEntity} media - The media to delete its tags.
     */
    async deleteMediaTags(media){
        await this._deleteAssociationMediaTable('tags_media', media.id);
    }

    // ================================ Authorization ====================================

    /**
     * @description Retrieve the list of authorization setting for a specific media from the data store.
     * 
     * @param {MediaEntity} media 
     */
    async getMediaAuthorizations(media){
        let result = await this._getAssociationMediaTable('authorization_media', media.id);
        
        for(let authorization of result.row){
            media.authorization.push(new AuthorizationEntity({id: authorization}));
        }

        return media;
    }

    /**
     * @description Insert a association in the associative table of media - authorization.
     * 
     * @param {MediaEntity} media  - The media that contain every authorization to add.
     */
    async insertMediaAuthorizations(media){
        for(let authorization of media.authorization){
            await this._pushAssociationMediaTable('authorization_media', media.id, authorization);
        }
    }

    /**
     * @description  Deletes to the associative table all the association of media - authorization
     * 
     * @param {MediaEntity} media - The media to delete its authorization.
     */
    async deleteMediaAuthorizations(media){
        await this._deleteAssociationMediaTable('authorization_media', media.id);
    }

    // ===================================================================================

    /**
     * @description prepare an media entity to send it to the data store.
     * @param {MediaEntity} media 
     */
    _prepare(media){
        
        media.mediaTypeId = media.mediaTypeEntity.id;
        media.mediaTypeEntity = null;

        // delete see this: https://stackoverflow.com/questions/208105/how-do-i-remove-a-property-from-a-javascript-object
        delete media.mediaTypeEntity;

        return media;
    }


    /**
     * @description build an media entity from a postgres result.
     * @param {*} result 
     */
    _buildEntity(result){
        let media = new MediaEntity(commitResult.rows[0]);
        media.mediaTypeEntity = new MediaTypeEntity({id:commitResult.rows[0].mediaTypeId});

        return media;
    }
}

module.exports = MediaDao;