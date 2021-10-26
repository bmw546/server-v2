
const {postGres} = require('servercore/postgres/postgresPipe');
const dbConfigs = require('servercore/postgres/post-gres-config');

const {Pool } = require('pg');

const postgresDb = ({...dbConfigs,
    database: undefined
});

const pool = new Pool(postgresDb);

// Database require
const CoreDaos = require('servercore/core-daos');
const AuthentificationDaos = require('module/authentification/authentification-daos');
const AuthorizationDaos = require('module/authorization/authorization-daos');
const ImageDaos = require('module/image/image-daos');
const MediaDaos = require('module/media/media-daos');
const UserDaos = require('module/user/user-daos');
// -----------------

async function build(){   
    try{
        await postGres.executeQuery({command: 'DROP SCHEMA public CASCADE;'});
        await postGres.executeQuery({command: 'CREATE SCHEMA public;'});
        
        await postGres.executeTableQueries();
    } catch(e) {
        console.log(e);
    }
}

build();