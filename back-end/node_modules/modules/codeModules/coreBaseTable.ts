import PostGres from "../postGres/postGresManager";
export interface BaseTable {
    /**
     * A function to be overwritten that create a <create table>
     * @param conn PostGres
     */
    createTable(conn): void;

    /**
     * A function to be overwritten that create a <drop table>
     * @param conn PostGres
     */
    dropTable(conn): void;
}