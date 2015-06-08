/**
 * Created by ben on 6/4/15.
 */
var fs = require('fs');
var path = require('path');
var bunyan = require('bunyan');
var mkdirp = require('mkdirp');

var pkgJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
var logLevel = 'info';
var appId = process.env.WORKER_ID || 'main';
var logsDir = './logs';

logsDir = path.resolve(logsDir);
mkdirp.sync(logsDir);

var applicationConfig = {
    threads: 1,
    logging: {
        directory: logsDir,
        dev: {
            name: pkgJson.name,
            serializers: bunyan.stdSerializers,
            streams: [
                {
                    level: logLevel,
                    stream: process.stdout
                },
                {
                    level: logLevel,
                    path: path.join(logsDir, pkgJson.name + '.' + appId  +'.dev.log')
                }
            ]
        },
        prod: {
            name: pkgJson.name,
            serializers: bunyan.stdSerializers,
            streams:[
                {
                    type: 'rotating-file',
                    path: path.join(logsDir, pkgJson.name + '.'+ appId +'.prod.log'),
                    level: logLevel,
                    period: '1d',
                    count: 10
                }
            ]
        }
    }
};

module.exports = applicationConfig;