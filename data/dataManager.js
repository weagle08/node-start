/**
 * Created by Ben on 6/13/2015.
 */
function Data(mongodb) {
    var db = mongodb;
    var logs = require('./logs')();

    return {
        logs: logs
    };
}

module.exports = Data;