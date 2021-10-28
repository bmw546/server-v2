const PostGres = require("./postgres-adapter");

/** @property {postGres} PostGres */
module.exports = {
    postGres: new PostGres(),
}