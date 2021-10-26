import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description Dto that will hold the info for each role.
 */
export interface RoleEntity extends BaseIdEntity{
    title: string;
    description: string;
}