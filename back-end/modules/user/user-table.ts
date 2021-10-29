import {BaseTable} from '../codeModules/coreBaseTable';
const PostGres = require('modules/postGres/postGresManager.js');
export class userTable implements BaseTable{
    tableName: string = "User";
    /**
     * Function that will create the table needed for the user
     * @param conn PostGres
     */
    createTable(conn: typeof PostGres): void {
        conn.executeQuery("CREATE TABLE "+ this.tableName +" (id int NOT NULL AUTO_INCREMENT, username string, password string, "+
        "email string, auth0Id string, imageId int, lastMediaId int, lastMediaTime int)");
    }

    /**
     * Function that will drop the table needed for the user
     * @param conn PostGres
     */
    dropTable(conn: typeof PostGres): void {
        conn.executeQuery("DROP TABLE "+ this.tableName);
    }

}