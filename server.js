/**
 * Created by ben on 6/7/15.
 */
var express = require('express');
var path = require('path');
var bunyan = require('bunyan');
var compression = require('compression');
var fs = require('fs');
var cluster = require('cluster');
var DataManager = require('./data/dataManager');
var ServiceManager = require('./services/serviceManager');
var appConfig = require('./config');
process.appConfig = appConfig;

var log = null;
var defaultLogging = {
    name: 'default' + '.dev',
    serializers: bunyan.stdSerializers,
    streams: [
        {
            level: 'info',
            stream: process.stdout
        },
        {
            level: 'info',
            path: 'application.log'
        }
    ]
};

if(appConfig.logging != null) {
    if(process.env.NODE_ENV === 'development') {
        log = bunyan.createLogger(appConfig.logging.dev || defaultLogging);
    } else {
        log = bunyan.createLogger(appConfig.logging.prod || defaultLogging);
    }
}else {
    log = bunyan.createLogger(defaultLogging);
}


process.logger = log;

if(cluster.isMaster) {
    var numCpu = appConfig.forks || require('os').cpus().length;

    if(numCpu <= 0) {
        numCpu = 1;
    }

    for(var i = 0; i < numCpu; i++) {
        cluster.fork({WORKER_ID: i});
    }

    cluster.on('exit', function(deadWorker, code, signal){
        log.fatal('Process ' + deadWorker.process.pid + '(id: ' + parseInt(deadWorker.id % numCpu) + ') died. Exit Code: ' + code);
        //we will try n times for each fork to restart
        if(deadWorker.id / numCpu >= appConfig.forkRecoveryAttempts) {
            log.fatal('process died and recovery attempts exceeded');
        } else {
            cluster.fork({WORKER_ID: parseInt(deadWorker.id % numCpu)});
        }
    });
} else {
    var app = express();
    app.logger = log;

    app.set('port', process.env.PORT || appConfig.port);

    app.use(express.static(path.join(__dirname, 'www')));

    app.use(compression());

    if(appConfig.requestLogging == true) {
        app.use(function(req, res, next){
            var time = process.hrtime();
            res.on('finish', function(){
                var timeDiff = process.hrtime(time);
                var totalTimeDiffMs = timeDiff[0] * 1000;
                totalTimeDiffMs += timeDiff[1] / 1000000;
                log.info({req: req, delay: totalTimeDiffMs}, 'processed request from ' + req.connection.remoteAddress + '/' + req.headers['x-forwarded-for']);
            });
            next();
        });
    }

    if(appConfig.uppercaseQueries == true) {
        app.use(function(req, res, next){
            // make query string case insensitive
            for(var key in req.query){
                req.query[key.toUpperCase()] = req.query[key];
            }
            next();
        });
    }

    if(appConfig.allowCors == true) {
        // apply this rule to all requests accessing any URL/URI, this allows CORS
        app.all('*', function (req, res, next) {
            // add details of what is allowed in HTTP request headers to the response headers
            res.header('Access-Control-Allow-Origin', req.headers.origin);
            res.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE, OPTIONS');
            res.header('Access-Control-Allow-Credentials', false);
            res.header('Access-Control-Max-Age', '86400');
            res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept, Authorization');
            next();
        });

        // fulfils pre-flight/promise request
        app.options('*', function (req, res) {
            res.status(200).send('ok');
        });
    }

    var dm = new DataManager(null);  //TODO: init database
    var sm = new ServiceManager(app, dm);

    //express bad request handling
    app.use(function(req, res){
        res.status(404).send({error: 'why are you snooping?'});
    });

    //express error handling
    app.use(function(err, req, res, next){
        log.error(err);
        res.status(500).send({error: 'something went terribly wrong'});
    });

    app.listen(app.get('port'), function () {
        log.info('Express server listening on port ' + app.get('port'));
    });
}