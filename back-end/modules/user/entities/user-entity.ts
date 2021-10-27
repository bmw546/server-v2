import {SessionEntity}  from "modules/authentification/entities/session-entity";
import { ImageEntity } from "modules/image/entities/image-entity";
import { BaseIdEntity } from "modules/core/entities/base-id-entity";


//TODO selectedPageSettingDto, ImageDto, SessionDto

/**
 * @description Entity that will hold the user.
 */
export interface UserEntity extends BaseIdEntity{
    username: string;
    password: string;
    
    email: string;
    auth0Id: string;
    imageId: number;


    // -------------- Here will be what the user last saw ------------------ //
    lastMediaId: number;
    lastMediaTime: number;

    // ------------- Here what is not on the DATABASE ---------------------- //
    avatarImage: ImageEntity;
    session: SessionEntity;
}