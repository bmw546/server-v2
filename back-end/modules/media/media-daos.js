// This file exists to facilitate the create table / update table for this module.
const MediaDao = require('./dao/media-dao');
const MediaTypeDao = require('./dao/media-type-dao');
const TagsDao = require('./dao/tags-dao');
const ResolutionDao = require(`back-end/modules/media/dao/resolution-dao`);


module.exports = {
    mediaDao: MediaDao,
    mediaTypeDao: MediaTypeDao,
    tagsDao: TagsDao,
    resolutionDao: ResolutionDao
};