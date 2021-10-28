import {BaseEntity} from "../entities/base-entity";
import {BaseIdEntity} from "../entities/base-id-entity";

const {postGres} = require('back-end/modules/core/postgres/postgresPipe');
const PostgresQueryEntity = require('back-end/modules/core/entities/postgres-query-entity');

const JsUtil = require('back-end/modules/core/util/js-util');

const NotImplementedError = require('back-end/modules/core/errors/not-implemented-error');

/**
 * see hopchild/file-management/daos/file-info-daos
 * @abstract
 * 
 * @description Handles the communication with the database
 */
export class IBaseDao{

    /** @description The name of this dao table */
    private _name: string = '';

    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    
    //------------------- Base Function that everyone should have ----------------------------- //

    /**
     * @protected
     * @description Prepare an entity for an db query.
     * @param {*} entity 
     */
    _prepare(entity: BaseEntity): BaseEntity{
        return entity;
    }

    /**
     * @protected
     * @description Transform an query result to an entity.
     * @param {*} result 
     */
    _buildEntity(result: any): BaseEntity{
        return result;
    }

    // -------------------------------------- Query keyword shortcut --------------------------
    selectQuery(tableName: string = this.name):string {
        return `SELECT * FROM ${tableName} WHERE`;
    }

    deleteQuery(tableName: string = this.name):string {
        return `DELETE FROM ${tableName} WHERE`;
    }

    updateQuery(update: string, tableName:string = this.name):string {
        return `UPDATE ${tableName} SET ${update} WHERE`;
    }

    insertQuery(columns: string, tableName:string = this.name):string {
        return `INSERT INTO ${tableName} (${columns}) VALUES`;
    }

    //------------------------------ Base Query --------------------------------------

    prepareObjectForInsert(obj: BaseIdEntity):BaseIdEntity {
        // Copy the objet (so we won't modify the original one).
        let object = JSON.parse(JSON.stringify(obj));
        object = this._prepare(object);

        // Delete the id since it an insert.
        delete object.id;

        return object;
    }

    parametrizeObject(obj:BaseEntity):string {
        let i = 0;
        return Object.keys(obj).map((key) => (key + ` = $`+(i = i+1))).toString();
    }

    async selectById(id: number):Promise<BaseIdEntity> {

        let result = await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.selectQuery()} id = $1`,
            parameters: [id]
        }));
        return this._buildEntity(result.rows[0]);
    }

    /**
     * @description
     * @param object
     */
    async modify(object: BaseIdEntity):Promise<BaseIdEntity>{
        let id = object!.id;
        let obj = this.prepareObjectForInsert(this._prepare(object));

        Object.keys(obj).map((key) => {
            if(JsUtil.isNil(obj[key])) {
                delete obj[key]
            }
        });

        let result = await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.updateQuery(this.parametrizeObject(obj) as string)}` +
                ` id = $`+ ( Object.keys(obj).length + 1 ),
            parameters: Object.keys(obj).map((key) => `${obj[key]}`)
        }));
        return this._buildEntity(result.rows[0]);
    }

    prepareObjectForInsertUpdate(obj: BaseIdEntity): BaseIdEntity{
        let object = JSON.parse(JSON.stringify(obj));
        object = this._prepare(object);
        delete object.id;
        
        return object
    }

    generateQueryForCommit(obj: BaseIdEntity): BaseIdEntity {
        return new PostgresQueryEntity({
            // build query for commit
            command: `${this.insertQuery(Object.keys(obj).toString())}`+
                    `(`+ this.parametrizeObject(obj) + `) RETURNING *`,
            parameters: Object.values(obj)
        });
    }
    /**
     * @description Base object to create a commit.
     * @param {*} obj
     */
    async commit(obj: {}){
        
        let preparedObject = this.prepareObjectForInsert(obj);
    
        let results = await postGres.executeQuery(this.generateQueryForCommit(preparedObject), Object.values(preparedObject));

        return this._buildEntity(results.rows[0]);
    }

    // protect those function and keep tem like 'delete'
    async delete(id: number){
        await postGres.executeQuery(new PostgresQueryEntity({
            command: `${this.deleteQuery()} id = $1`,
            parameters: [id]
        }));
    }
}

module.exports = IBaseDao;