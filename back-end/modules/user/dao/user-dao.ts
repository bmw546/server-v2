const IBaseDao = require('servercore/dao/i-base-dao');

const UserEntity = require('../entities/user-entity');
const RoleEntity = require('../entities/role-entity');

const PageSettingEntity = require('servercore/entities/page-setting-entity');
const PostgresQueryEntity = require('servercore/entities/postgres-query-entity');

const JsUtil = require('servercore/util/js-util');

/** @description The name of this dao table */
const tableName = "user_table";

// --------------- Let add the basic table --------------------
// Maybe ask for a better generated ID
postGres.addCreateTable(
    `CREATE TABLE IF NOT EXISTS ${tableName} (
        id serial primary key,
        username VARCHAR(50),
        avatarImageId INT,
        saltedUserNamePassword VARCHAR(150),
        auth0Id INT,
        email VARCHAR(100),
        lastMediaId INT,
        lastMediaTime INT,
        role INT
    )`
);

// ------------- And then let modify them ------------------------

// Create an userPageSetting association table.
postGres.addModifyTable(
    `CREATE TABLE IF NOT EXISTS user_page_setting (
        user_id int,
        page_setting int,
        FOREIGN KEY (user_id) REFERENCES ${tableName} (id) ON UPDATE CASCADE ON DELETE CASCADE,
        FOREIGN KEY (page_setting) REFERENCES page_setting (id) ON UPDATE CASCADE ON DELETE SET NULL
    )`
);

postGres.addModifyTable(
    `ALTER TABLE ${tableName}
        ADD FOREIGN KEY (role) REFERENCES role(id) ON UPDATE CASCADE ON DELETE SET NULL
    `
);
class UserDao extends IBaseDao{

    // ========================== UserPageSetting ================================

    /**
     * @description Retrieve the list of user page setting for a specific user from the data store.
     * @param {UserEntity} user - The user to populate the page setting array. 
     * @returns {UserEntity} The same user entity as the one passed but with its selectedPageSettings populated.
     */
    async getUserPageSetting(user){
        let result = await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.selectQuery('userPageSetting')} userId = $id`,
            parameters: [user.id]
        }));
        for(let row of result.row){
            user.selectedPageSettings.push(new PageSettingEntity({id: row}));
        }
    }


    /**
     * @description  Deletes to the associative table all the association of user - userPageSetting
     * 
     * @param {UserEntity} user - The user to delete its userPageSetting.
     */
    async deleteUserPageSetting(user){
        return await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.deleteQuery('userPageSetting')} userId = $id`,
            parameters: [user.id]
        }));    
    }

    /**
     * @description Add to the associative table all the association of user - userPageSetting
     * 
     * @param {UserEntity} user - The user with its page setting
     */
    async addUsePageSetting(user){
        var result: Array<any> = new Array<any>();

        for(let setting of user.selectedPageSettings){
            result.push(await postGres.executeQuery(new PostgresQueryEntity({
                command: `${this.insertQuery('userPageSetting')}`,
                parameters: [user.id, user.setting]
            })));
        }
        return result;
    }
    
    
    // ===============================================================================
    async getFromUserPw(username, hashedPassword){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `${this.selectQuery()} username = $1 AND saltedUserNamePassword = $2`,
            parameters: [username, hashedPassword]
        })).rows[0];
        return this._buildEntity(result);
    }  

    /**
     * 
     * @param {string} username - The name to check if it exists
     */
    async doesUsernameNameExist(username){
        let result = await postGres.selectQuery(new PostgresQueryEntity({
            command: `select exists (${this.selectQuery()} username = $1 )`,
            parameters: [username]
        })).rows[0];

        if(JsUtil.isNill(result) || result === 0){
            return false;
        } else if (result !== 1){
            return true;
        }
        
        throw Error();
    }
    /**
     * @description Prepare an user entity for sending it to the database.
     * @param {UserEntity} user 
     */
    _prepare(user){
        user.role = user.role.id;
        user.avatarImageId = user.avatarImage.id;

        delete user.avatarImage;

        return user;
    }

    /**
     * @description build an User entity from an postgres result.
     * @param {*} result 
     */
    _buildEntity(result){
        if(JsUtil.isNill(result))
            return undefined;

        let user = new UserEntity(result);
        user.role = new RoleEntity(result.role);
        user.avatarImage.id = result.avatarImageId;
        

        //TODO check this if we can even do this (so  we do like await selectById())
        return this.getUserPageSetting(user);
    }
}

module.exports = UserDao;