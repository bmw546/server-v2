import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description This is the dto that will contain the type of media (image,video,etc ...)
 */
export interface MediaTypeEntity extends BaseIdEntity{
    name: string;
}