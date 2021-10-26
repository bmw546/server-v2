import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description
 */
export interface ResolutionEntity extends BaseIdEntity{

    height: Number;
    width: Number;
}