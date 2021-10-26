import {UserEntity} from "modules/user/entities/user-entity";
import { BaseEntity } from "modules/core/entities/base-entity";

/**
 * @description entity for tags
 */
export interface TagsEntity extends BaseEntity{
    creator: UserEntity;
    name: string;
}