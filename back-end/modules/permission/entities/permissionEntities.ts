import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description Entity that will hold the permissions.
 */
export class PermissionEntity extends BaseIdEntity{
    read: boolean;
    write: boolean;
    delete: boolean;
    userId: number | undefined;
    groupId: number | undefined;
    giveAccessToId: number; // Here is the id associate when the what it give permission
    applicationId: number; // And here is what the application give access to !
}