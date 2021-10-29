import {BaseTable} from '../codeModules/coreBaseTable';
const PostGres = require('modules/postGres/postGresManager.js');
export class userTable implements BaseTable{
    tableName: string = "Group";
    tableAssoc: string = "UserGroup";
    /**
     * Function that will create the table needed for the user
     * @param conn PostGres
     */
    createTable(conn: typeof PostGres): void {
        conn.executeQuery("CREATE TABLE "+ this.tableName +" (id int NOT NULL AUTO_INCREMENT, name string, description string)");
        conn.executeQuery("CREATE TABLE "+ this.tableAssoc +" (idGroup int, idUser int)");
    }

    /**
     * Function that will drop the table needed for the user
     * @param conn PostGres
     */
    dropTable(conn: typeof PostGres): void {
        conn.executeQuery("DROP TABLE "+ this.tableName);
        conn.executeQuery("DROP TABLE "+ this.tableAssoc);
    }

}