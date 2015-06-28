/**
 * Created by Ben on 6/14/2015.
 */
function logs(){
    var q = require('q');
    var fs = require('fs');
    var path = require('path');
    var config = process.appConfig;
    var log = process.logger;
    var logDirectory = path.resolve(config.logging.directory);

    function getLogFileNames() {
        var deferred = q.defer();
        try {
            fs.readdir(logDirectory, function(error, files){
                if(error != null) {
                    log.error(error);
                    deferred.reject(error);
                } else {
                    deferred.resolve(files);
                }
            });
        } catch(e) {
            log.error(e);
            deferred.reject(e || 'error getting log files');
        }

        return deferred.promise;
    }

    function getLogFile(filename){
        var deferred = q.defer();
        try {
            var file = path.join(logDirectory, filename);

            fs.stat(file, function(err, stat){
                if(err == null && stat.isFile() == true) {
                    var filestream = fs.createReadStream(file);
                    deferred.resolve(filestream);
                } else {
                    deferred.reject('file does not exist');
                }
            });

        } catch(e) {
            log.error(e || 'error reading log file: ' + filename);
            deferred.reject(e || 'error reading log file: ' + filename);
        }

        return deferred.promise;
    }

    return {
        getLogFileNames: getLogFileNames,
        getLogFile: getLogFile
    };
}

module.exports = logs;