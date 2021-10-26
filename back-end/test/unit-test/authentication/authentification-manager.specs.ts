import('sinon');
import('chai');
const expect = chai.expect;
const should = chai.should();
import {stub as stub} from 'sinon';

//const { v4: uuidv4 } = require('uuid');
import { v4 } from 'uuid';
//see https://www.npmjs.com/package/uuid

const AuthenticationManager = require('module/authentification/manager/authentification-manager');
const authenticationManager = new AuthenticationManager();

const UserEntity = require('module/user/entities/user-entity');

const SessionEntity = require('module/authentification/entities/session-entity');

const UserDao = require('module/user/dao/user-dao');
const {sessionDao} = require('module/authentification/injector');

const AlreadyExistsError = require('servercore/errors/already-exists-error');
const InvalidArgumentTypeError = require('servercore/errors/invalid-argument-type-error');
const NotFoundError = require('servercore/errors/not-found-error');
const UnauthorizedError = require('servercore/errors/unauthorized-error');

let userTest = new UserEntity({
    username: 'test',
    password: 'pass'
});

describe('module/authentification/manager/authentification-manager : classicSignup()', async() => {

    it('should use the correct params to create a user', async() => {
        let commitReturn = new UserEntity({...userTest, id: uuidv4()});

        //create stub
        stub(UserDao.prototype, 'commit').resolves(commitReturn);
        let userNameStub = stub(AuthenticationManager.prototype, 'doesUsernameNameExist').resolves(false);
        let createSessionStub = stub(AuthenticationManager.prototype, 'createSession').resolves();

        let userSignUp = JSON.parse(JSON.stringify(userTest));
        userSignUp.password = authenticationManager._hashPassword(userTest.username, userTest.password);

        await authenticationManager.classicSignup(userTest);       

        expect(userNameStub.getCall(0).args[0]).to.equal(userTest.username);
        expect(createSessionStub.getCall(0).args[0]).to.equal(commitReturn);

        // Restore stub
        UserDao.commit.restore();
        AuthenticationManager.doesUsernameNameExist.restore();
        AuthenticationManager.createSession.restore();
    });

    it(`should throw if the username exist`, async() => {
        stub(AuthenticationManager.prototype, 'doesUsernameNameExist').resolves(true);

        await expect(authenticationManager.classicSignup(userTest)).to.eventually.be.rejectedWith(AlreadyExistsError);

        AuthenticationManager.doesUsernameNameExist.restore();
    });

    it(`should throw if the password is no present`, async() => {
        stub(AuthenticationManager.prototype, 'doesUsernameNameExist').resolves(false);

        await expect(authenticationManager.classicSignup(({username: 'username'}))).to.eventually.be.rejectedWith(InvalidArgumentTypeError);

        AuthenticationManager.doesUsernameNameExist.restore();
    });

    it(`should throw if the user is not found on the database after the commit`, async() => {
        stub(AuthenticationManager.prototype, 'doesUsernameNameExist').resolves(false);
        stub(UserDao.prototype, 'commit').resolves();

        await expect(authenticationManager.classicSignup(({username: 'username'}))).to.eventually.be.rejectedWith(NotFoundError);

        AuthenticationManager.doesUsernameNameExist.restore();
        UserDao.commit.restore();
    });

    
});


describe('module/authentification/manager/authentification-manager : classicLogin()', () => {

    it('should login a user', async() => {
        // Create stub
        let userDaoStub = stub(UserDao.prototype, 'getFromUserPw').resolves(userTest);
        let createSessionStub = stub(AuthenticationManager.prototype, 'createSession').resolves();

        await authenticationManager.classicLogin(userTest.username, userTest.password);

        // Expect we use the right args
        expect(userDaoStub.getCall(0).args[0]).to.equal(userTest.username, authenticationManager._hashPassword(userTest.username, userTest.password));
        expect(createSessionStub.getCall(0).args[0]).to.equal(userTest);

        // Restore stub
        UserDao.getFromUserPw.restore();
        AuthenticationManager.createSession.restore();
    });

    it('should reject wrong credential', async() => {
        // Create stub
        stub(UserDao.prototype, 'getFromUserPw').resolves();

        await expect(authenticationManager.classicLogin(userTest.username, userTest.password)).to.eventually.be.rejectedWith(UnauthorizedError);

        // Restore stub
        UserDao.getFromUserPw.restore();
    });

});

describe('module/authentification/manager/authentification-manager : createSession()', async() => {
    it('should create a session', async() => {
        let commitSessionStub = stub(sessionDao, 'commit').resolves();

        let user = JSON.parse(JSON.stringify(userTest));
        user.id = uuidv4();
        let session = new SessionEntity({
            userId: user.id,
            uuid: uuidv4(),
            rawAccessToken: 'token',
            ip: '192.168.0.101'
        });

        await authenticationManager.createSession(user, session.rawAccessToken, session.ip);

        let args = commitSessionStub.getCall(0).args[0];
        args.creationTime = undefined;
        args.uuid = session.uuid;

        expect(session).to.equal(args);
    });
});
