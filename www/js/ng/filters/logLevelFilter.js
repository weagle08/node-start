/**
 * Created by ben on 6/12/15.
 */
loggingApp.filter('logLevelFilter', function(){
    var logLevels = {
        10: 'trace',
        20: 'debug',
        30: 'info',
        40: 'warning',
        50: 'error',
        60: 'fatal'
    };

    return function(level) {
        return logLevels[level] || 'UNDEFINED';
    };
});