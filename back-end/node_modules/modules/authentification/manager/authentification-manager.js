const { v4: uuidv4 } = require('uuid');
//see https://www.npmjs.com/package/uuid

const CryptoJS = require ('crypto-js');

const JsUtil = require('servercore/util/js-util');

const UserDao = require('back-end/modules/user/dao/user-dao');
const userDao = new UserDao();

const UserEntity = require('back-end/modules/user/entities/user-entity');

const SessionEntity = require('../entities/session-entity');
const {sessionDao} = require('../injector');

const UnauthorizedError = require('servercore/errors/unauthorized-error');
const InvalidArgumentTypeError = require('servercore/errors/invalid-argument-type-error');

const AlreadyExistsError = require('servercore/errors/already-exists-error');
const NotFoundError = require('servercore/errors/not-found-error');

const key = 'b55e1e9a7c794e58d53347ff3ce9251d';

class AuthenticationManager {
    
    loginByAuth(){
        //TODO WIP
    }

    _hashPassword(username, password){
        let saltedMessage = password + username + 'xXx_SaltTheMediaServer_xXx';
        return CryptoJS.HmacSHA256(saltedMessage, key).toString();
    }
    /**
     * @description Connected a user with username + password only.
     * @param {string} username - The username of the user to log in.
     * @param {string} password - The password (clear) of the user to log in.
     */
    async classicLogin(username, password){

        // Create a user entity and hash the password.
        let user = userDao.getFromUserPw(username, _hashPassword(username, password));

        if(user){
            // create session and returns it.
            return await this.createSession(user);
        }

        // Throw since user cannot be found / password is wrong !
        throw UnauthorizedError(`user ${username}`, `The username-password doesn't match any user in the database !`);
    }

    // 
    /** 
     * @description A classical sign up with a user. It need at least an username and an password.
     * @param {UserEntity} user 
     */
    async classicSignup(user){

        if(userDao.doesUsernameNameExist(user.username)){
            // Username exist cannot create this account !
            throw new AlreadyExistsError('username', `This username already exists!`);
        }        

        if(JsUtil.isNill(user.username) || JsUtil.isNill(user.password)){
            // make a better error here.
            throw new InvalidArgumentTypeError('user.username, user.password', `'string' and 'string'`, `both are 'null'`);
        }

        // Hash the password for security
        user.password = this._hashPassword(user.username, user.password);

        user = userDao.commit(user);
        if(user){
            // create session and returns it.
            return await this.createSession(user);
        }

        throw new NotFoundError('user', `The server cannot find the created user !`);
    }

    async disconnect(uuid){
        await sessionDao.delete(uuid);
    }

    async createSession(user, token, ip){
        sessionDao.create(new SessionEntity({
            userId: user.id,
            uuid: uuidv4(),
            rawAccessToken: token,
            ip: ip,
            creationTime: Date.now(),

        }));
    }

    async getSession(uuid, renew = false){
        return await sessionDao.get(uuid, renew);
    }

    async renewSession(session){
        await sessionDao.get(session.uuid, true);
    }
}

exports.module = AuthenticationManager;