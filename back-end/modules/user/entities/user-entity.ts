import {SessionEntity}  from "modules/authentification/entities/session-entity";
import { PageSettingEntity } from "modules/core/entities/page-setting-entity";
import { ImageEntity } from "modules/image/entities/image-entity";
import { BaseIdEntity } from "modules/core/entities/base-id-entity";


//TODO selectedPageSettingDto, ImageDto, SessionDto

/**
 * @description Entity that will hold the user.
 */
export interface UserEntity extends BaseIdEntity{
    username: string;
    selectedPageSetting: PageSettingEntity[];
    avatarImage: ImageEntity;
    session: SessionEntity;
    saltedUserNamePassword: string;
    auth0Id: number;
    email: string;

    // -------------- Here will be what the user last saw ------------------ //
    lastMediaId: number;
    lastMediaTime: number;
    // --------------------- Should not be in DB -------------------------- //
    password: string;
}