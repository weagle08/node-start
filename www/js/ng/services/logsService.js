/**
 * Created by ben on 6/12/15.
 */
loggingApp.factory('logsService', function($http, $resource, $q){
    function getLogFileNames(){
        var deferred = $q.defer();

        var url = settings.localServer + settings.logsEndpoint;

        $http.get(url).success(function(result){
            deferred.resolve(result);
        }).error(function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    function getLogFile(filename) {
        var deferred = $q.defer();

        var url = settings.localServer + settings.logEndpoint;
        var logs = $resource(url, {filename: '@filename'}, {query: {
            method: 'GET',
            isArray: true,
            transformResponse: function(data, header){
                var logEntries = data.split(/\n/);
                var tData = [];
                logEntries.forEach(function(entry){
                    if(entry){
                        var val = angular.fromJson(entry);
                        tData.push(val);
                    }
                });
                return tData;
            }}});
        logs.query({filename: filename}, function(data, headers){
            deferred.resolve(data);
        }, function(error){
            deferred.reject(error);
        });

        return deferred.promise;
    }

    return {
        getLogFileNames: getLogFileNames,
        getLogFile: getLogFile
    }
});