import { AuthorizationEntity } from "modules/authorization/entities/authorization-entity";
import { BaseIdEntity } from "modules/core/entities/base-id-entity";
import {UserEntity} from "modules/user/entities/user-entity";
import {MediaTypeEntity} from "./media-type-entity";
import {TagsEntity} from "./tags-entity";

/**
 * @description This is the 'main' dto for all media (image/video/music)
 */
export interface MediaEntity extends BaseIdEntity{
    title: string;
    description: string;
    creator: UserEntity;
    authorization: AuthorizationEntity;
    size: Number;
    fileName: string;
    tags: TagsEntity[];
    rating: Number;
    numberRating: Number;
    numberView: Number;

    // The type of the media only here to help query get faster.
    mediaTypeEntity: MediaTypeEntity;
}