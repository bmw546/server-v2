
// test for each base daos.

// we won't do the session here since 
const daos = [
    {name: "authorization", dao:},
    {name: "role", dao:},
    {name: "user", dao:},
    {name: "module", dao:},
    {name: "pageSetting", dao:},
    {name: "module", dao:},
    
];

describe('test all daos of this project', () => {
    
    before(() => {
        // init a new test database (and open it).
    })

    after(() => {
        // delete the test database.
    })


    for(let dao of daos){
        it(`should add/selectById/delete a ${dao.name} to the database`, async() => {
        
        });

        it(`should update a ${dao.name} to the database`, async() => {
            
        });
    }
    
});