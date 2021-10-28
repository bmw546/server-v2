import { BaseIdEntity } from './base-id-entity';
//const ImageEntity = require('modules/image/entities/image-entity');
import { ImageEntity }from 'modules/image/entities/image-entity'
/**
 * @description entity for making module.
 */ 
//TODO explain this better !
export interface ModuleEntity extends BaseIdEntity{

    title: string;
    description?: string;
    logo?: ImageEntity;

}