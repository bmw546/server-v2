import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description Entity that will hold the group.
 */
export class GroupEntity extends BaseIdEntity{
    name: string | undefined;
    description: string| undefined;
}