import { Console } from 'console';
import {BaseTable} from '../codeModules/coreBaseTable';
const PostGres = require('modules/postGres/postGresManager.js');

export const tableName = 'Media'
export const tableTypeName = 'MediaType'
export const tablePermissionAsso = 'AssoPermissionMedia'


export class permissionTable implements BaseTable{

    /**
     * Function that will create the table needed for the permission
     * @param conn PostGres
     */
    createTable(conn: typeof PostGres): void {
        conn.executeQuery("CREATE TABLE " + tableTypeName + "(id int NOT NULL AUTO_INCREMENT, "+
        "name string, description string)");

        conn.executeQuery("CREATE TABLE "+ tableName +" (id int NOT NULL AUTO_INCREMENT, "+
        "createdDate date, size int, length int, thumbnailId int, name string, mediaPath string, " +
        "creatorId int)");

        conn.executeQuery("CREATE TABLE "+ tablePermissionAsso + "(id int NOT NULL AUTO_INCREMENT, "+
        "mediaId int, permissionId int)");


        // Let add base type !! here we add the 'general' type so we don't need to actually need to know
        // if it a png or jpeg, a mp4 or mkv, etc ... The format can be know with the path.
        conn.executeQuery("INSERT INTO " + tableTypeName + "(name, description) "+
        "VALUES(`video`, `Is a video, must use a video player to read it !`)");

        conn.executeQuery("INSERT INTO " + tableTypeName + "(name, description) "+
        "VALUES(`image`, `Is a image file, can use a normal image viewer / browser`)");

        conn.executeQuery("INSERT INTO " + tableTypeName + "(name, description) "+
        "VALUES(`audio`, `Is a audio, must use a audio player for it`)");
        
        conn.executeQuery("INSERT INTO " + tableTypeName + "(name, description) "+
        "VALUES(`pdf`, `Is a pdf file, can be used to read book, etc ...`)");
    }

    /**
     * Function that will drop the table needed for the permission
     * @param conn PostGres
     */
    dropTable(conn: typeof PostGres): void {
        conn.executeQuery("DROP TABLE "+ this.tableName);
        conn.executeQuery("DROP TABLE " + this.tableTypeName);
        conn.executeQuery("DROP TABLE " + this.tablePermissionAsso);
    }

}