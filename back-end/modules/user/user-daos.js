// This file exists to facilitate the create table / update table for this module.
const RoleDao = require('./dao/role-dao');
const UserDao = require('./dao/user-dao.js');


module.exports = {
    roleDao: RoleDao,
    userDao: UserDao,
};