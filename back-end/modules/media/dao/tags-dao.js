const IBaseDao = require('servercore/dao/i-base-dao');

const TagsEntity = require('../entities/tags-entity');

const {postGres} = require('servercore/postgres/postgresPipe');

/** @description The name of this dao table */
const name = "tag";

// --------------- Let add the basic table --------------------
// Maybe ask for a better generated ID
postGres.addCreateTable(
    `CREATE TABLE IF NOT EXISTS ${name} (
        id serial primary key,
        name VARCHAR(50),
        fk_creator int
    )`
);

// ------------- And then let modify them ------------------------
postGres.addModifyTable(
    `ALTER TABLE ${name} ADD FOREIGN KEY (fk_creator) REFERENCES user_table(id) ON UPDATE CASCADE ON DELETE SET NULL`
);
class TagsDao extends IBaseDao{

    /**
     * @description Convert an postgres result to an tags entity.
     * @param {*} result 
     */
    _buildEntity(result){
        let tagEntity = new TagsDao(result);
        tagEntity.creator = result.fk_creator;
        
        return tagEntity;
    }

    /**
     * @description Prepare an Tags entity for the data store.
     * @param {TagsDao} tags 
     */
    _prepare(tags){
        tags.fk_creator = tags.creator.id;
        delete tags.creator;
        return tags;
    }
}

module.exports = TagsDao;