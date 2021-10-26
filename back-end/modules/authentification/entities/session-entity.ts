import { BaseIdEntity } from "modules/core/entities/base-id-entity";

/**
 * @description Entity for an session.
 */
export interface SessionEntity extends BaseIdEntity{
    uuid: string;
    ip: string;
    userId: number;
    rawAccessToken: string;
    isCancelled: Boolean;
    creationTime: number;
    timeToLive: number;
}