// This file exists to facilitate the create table / update table for this module.
const ModuleDao = require('./dao/module-dao.ts');
const PageSettingDao = require('./dao/page-setting-dao');

module.exports = {
    moduleDao: ModuleDao,
    pageSettingDao: PageSettingDao
};