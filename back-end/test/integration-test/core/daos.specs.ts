// Old daos tester here.
require('sinon');
require('chai');
const expect = chai.expect;
const should = chai.should();

const ModuleEntity = require('servercore/entities/module-entity');
const ImageEntity = require('module/image/entities/image-entity');

const ModuleDao = require('servercore/dao/module-dao');
const moduleDao = new ModuleDao();

const { v4: uuidv4 } = require('uuid');

function moduleGenerator() {
    return new ModuleEntity({
        title: uuidv4(),
        description: 'Test To Delete !',
    });
}

// Here we gonna use the module-dao.js to test the base dao object
describe('core/dao/i-base-dao.ts', () => {

    it('should add/selectById/delete a module to the database', async() => {
        let module = moduleGenerator();

        let commitModule = await moduleDao.commit(module);

        module.id = commitModule.id;
        module.logo = new ImageEntity();

        expect(module).to.eql(commitModule, `The module has been changed when it was committed to the database! Was suppose to be ${module} but was ${commitModule} !`);

        let getModule = await moduleDao.selectById(module.id);

        expect(module).to.eql(getModule, `The module has been changed when in the database since it was committed! Was suppose to be ${module} but was ${commitModule} !`);

        await moduleDao.delete(module.id);

        getModule = await moduleDao.selectById(module.id);

        expect(getModule).to.eql(new ModuleEntity(), `The module has not been deleted!`);
    });

    it('should update a module to the database', async() => {
        let module = moduleGenerator();

        let commitModule = await moduleDao.commit(module);

        module.id = commitModule.id;
        module.logo = new ImageEntity();

        expect(module).to.eql(commitModule, `The module has been changed when it was committed to the database !`);

        module.description = 'New description to delete';

        await moduleDao.modify(module);

        let getModule = await moduleDao.selectById(module.id);

        expect(module).to.eql(getModule, `The module should have been modified but it didn't !`);

        await moduleDao.delete(commitModule.id);
    });

});