
const {postGres} = require('servercore/postgres/postgresPipe');
const dbConfigs = require('servercore/postgres/post-gres-config');

const {Pool } = require('pg');

const postgresDb = ({...dbConfigs,
    database: undefined
});

const pool = new Pool(postgresDb);

// Database require

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