/**
 * Created by Ben on 6/13/2015.
 */
function logsService(application, logManager){
    var app = application;
    var lm = logManager;
    var log = process.logger;

    function start(){

        app.get('/api/10/100/logs', function(req, res){
            try {
                lm.getLogFileNames().then(function(files){
                    res.status(200).send({files: files});
                }, function(error) {
                    res.status(400).send({error: err});
                });
            } catch(e) {
                log.error(e);
            }
        });

        app.get('/api/10/100/logs/:filename', function(req, res){
            try {
                var filename = req.params.filename;

                lm.getLogFile(filename, res).then(function(filestream){
                    filestream.pipe(res);
                }, function(error){
                    res.status(400).send({error: error});
                });
            } catch(e) {
                log.error(e);
            }
        });
    }

    return {
        start: start
    };
}

module.exports = logsService;