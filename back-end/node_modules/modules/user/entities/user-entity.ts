import {SessionEntity}  from "modules/authentification/entities/session-entity";
import { ImageEntity } from "modules/image/entities/image-entity";
import { BaseIdEntity } from "modules/core/entities/base-id-entity";



//TODO selectedPageSettingDto, ImageDto, SessionDto

/**
 * @description Entity that will hold the user.
 */
export class UserEntity extends BaseIdEntity{
    username: string | undefined;
    password: string| undefined;
    
    email: string| undefined;
    auth0Id: string| undefined;
    imageId: number| undefined;


    // -------------- Here will be what the user last saw ------------------ //
    lastMediaId: number| undefined;
    lastMediaTime: number| undefined;

    // ------------- Here what is not on the DATABASE ---------------------- //
    avatarImage: ImageEntity| undefined;
    session: SessionEntity| undefined;

}