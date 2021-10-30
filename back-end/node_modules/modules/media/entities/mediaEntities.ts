import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description Entity that will hold the media
 */
export class MediaEntity extends BaseIdEntity{
    thumbnail: MediaEntity|undefined; // thumbnail
    length: number|undefined;
    size: number;
    type: string;
    createdDate: Date;
    mediaPath: string;
    name: string;
    creatorId: int;
}