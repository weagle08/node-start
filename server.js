/**
 * Created by ben on 6/7/15.
 */
var express = require('express');
var path = require('path');
var bunyan = require('bunyan');
var compression = require('compression');
var fs = require('fs');
var cluster = require('cluster');

var appConfig = require('./config');
process.appConfig = appConfig;

var log = null;
if(process.env.NODE_ENV === 'development') {
    log = bunyan.createLogger(appConfig.logging.dev);
} else {
    log = bunyan.createLogger(appConfig.logging.prod);
}

process.logger = log;

if(cluster.isMaster) {
    var numCpu = appConfig.threads || require('os').cpus().length;

    for(var i = 0; i < numCpu; i++) {
        cluster.fork({WORKER_ID: i});
    }

    cluster.on('exit', function(deadWorker, code, signal){
        log.fatal('Process ' + deadWorker.process.pid + ' died. Exit Code: ' + code);
        var newWorker = cluster.fork({WORKER_ID: deadWorker.process.env.WORKER_ID});
        log.info('Started new worker ' + newWorker.process.pid);
    });
} else {
    throw Error('test');
}