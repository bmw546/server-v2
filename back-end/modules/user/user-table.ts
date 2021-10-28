import {BaseTable} from '../codeModules/coreBaseTable';
import PostGres from '../postGres/postGresManager';
export class userTable implements BaseTable{

    /**
     * Function that will create the table needed for the user
     * @param conn PostGres
     */
    createTable(conn: PostGres): void {
        conn.executeQuery("CREATE TABLE User (id int NOT NULL AUTO_INCREMENT, username string, password string, "+
        "email string, auth0Id string, imageId int, lastMediaId int, lastMediaTime int)");
    }

    /**
     * Function that will drop the table needed for the user
     * @param conn PostGres
     */
    dropTable(conn): void {
        conn.executeQuery("DROP TABLE User");
    }

}