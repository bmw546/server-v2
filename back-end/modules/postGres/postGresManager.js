/**
 * This is a little class to facilitate the use of postgres.
 */
const PostGresError = require('../errors/post-gres-error');

// postgres
 // postgres info --> https://stackoverflow.com/questions/4482239/postgresql-database-service
const { Client, Pool } = require('pg');

const dbConfigs = require('./post-gres-config');

const PostgresQueryEntity = require('./entities/postgres-query-entity');

const pool = new Pool(dbConfigs);

class PostGres{

    
    //@see : https://node-postgres.com/
    // use transaction ?

    constructor(){
        /**@description A list of function to execute to create table */
        this.tableToCreate = [];

        /**@description A list of function to execute to create the foreign key*/
        this.tableToModify = [];
    }

    // -------------------- 'NORMAL QUERY' ----------------------- //
    /**
     * @description Used for straight forward (without transaction) e.g: Create table ;
     * 
     * @param {PostgresQueryEntity} query - The query and its parameter to execute
     */
    async executeQuery(query, values){
        let res;

        try{
            console.log('========================');
            console.log(JSON.stringify(query));
            console.log('========================');

            res = await pool.query(query.command, query.parameters);
        }catch(e){
            // TODO add some error handling
            console.log(e);
            throw new PostGresError(query);
        }
        
        return res; 
    }

    // -------------------- Transaction -------------------------- //
    /** 
     * @notes only use with multiple query
     * @private
     * @description Execute a transaction query. Roll back if it collide with another client. 
     * @see https://node-postgres.com/features/transactions
     * @see  https://www.postgresql.org/docs/8.3/tutorial-transactions.html
     * @param {PostgresQueryEntity} query - The query and its parameter to execute
     */
    async executeTransactionQuery(query){
        // If the connection fail it will throw and we won't need to dispose the transactionClient.
        const transactionClient = await pool.connect();

        let res;
        
        try{
            await transactionClient.query('BEGIN');

            res = await transactionClient.query(query.command, query.parameters);

            await transactionClient.query('COMMIT');

        } catch(e) {
            // Transaction fail rollback
            await transactionClient.query('ROLLBACK'); 
            console.log(query);
            throw new PostGresError(query);

        } finally {
            transactionClient.release();
        }
        return res;
    }



    async shutdownPool(){
        await pool.end();
    }
}

module.exports = PostGres;