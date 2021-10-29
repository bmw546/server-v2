import {BaseTable} from '../codeModules/coreBaseTable';
const PostGres = require('modules/postGres/postGresManager.js');
export class permissionTable implements BaseTable{
    tableName: string = "Permission";
    /**
     * Function that will create the table needed for the permission
     * @param conn PostGres
     */
    createTable(conn: typeof PostGres): void {
        conn.executeQuery("CREATE TABLE "+ this.tableName +" (id int NOT NULL AUTO_INCREMENT,"+
        "read boolean, write boolean, delete boolean, userId int, groupId int, giveAccessToId int, applicationId int)");
    }

    /**
     * Function that will drop the table needed for the permission
     * @param conn PostGres
     */
    dropTable(conn: typeof PostGres): void {
        conn.executeQuery("DROP TABLE "+ this.tableName);
    }

}