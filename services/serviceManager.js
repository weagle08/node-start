/**
 * Created by Ben on 6/13/2015.
 */
function serviceManager(app, dataManager) {
    try{
        var dm = dataManager;
        var logService = require('./logsService')(app, dataManager.logs);

        var roles = {

        };

        app.use('/api/:minRole/:maxRole', function (req, res, next) {
            //TODO: authentication and role management
            next();
        });

        logService.start();
    }catch(e){
        process.logger.error(e);
    }

}

module.exports = serviceManager;