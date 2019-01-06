if (__dirname) {
    process.chdir(__dirname);
}

import { Container } from 'aurelia-dependency-injection';
import 'aurelia-polyfills';
import * as bodyParser from 'body-parser';
import { Logger } from 'bunyan-log';
import * as compression from 'compression';
import * as cors from 'cors';
import * as express from 'express';
import { Router } from 'express';
import * as helmet from 'helmet';
import { Server } from 'http';
import * as StatusCodes from 'http-status-codes';
import { AppConfig } from 'node-app-config';
import * as path from 'path';
import { Options as DbOptions } from 'sequelize';
import { Database } from './database/Database';
import * as errorHandlers from './middleware/errorHandlers';
import * as queryHandlers from './middleware/queryHandlers';
import * as requestHandlers from './middleware/requestHandlers';
import { ServiceManager } from './services/ServiceManager';
import './utils/ObjectExtensions'; // add object extension methods;

const env = process.env.NODE_ENV || 'dev';

const PUBLIC_DIRECTORY = 'www';
const PORT_KEY = 'port';
const DEFAULT_PORT = 443;

// set up the dependency injection container
const container: Container = new Container();
container.makeGlobal();

const appConfig: any = new AppConfig('./config.json');
container.registerInstance(AppConfig, appConfig);

/*******  set up logging   ********/
const logOptions = appConfig.logging;
logOptions.name = appConfig.name;

const log = new Logger(logOptions);

container.registerInstance(Logger, log);
/********* end set up logging   ********/

let options: DbOptions = appConfig.database;

const database = new Database(options);
container.registerInstance(Database, database);
database.connect().then((success) => {
    if (success === true) {
        log.info('database connected');
        try {
            // setup express application and middlewares
            const app: express.Application = express();
            container.registerInstance(express, app);
            container.registerTransient(Router);

            app.use(compression());
            app.use(helmet());

            app.use(requestHandlers.headersToLower);
            app.use(requestHandlers.remoteAddressAppender);

            // TODO: configure cors correctly for security concerns
            app.use(cors());

            // add necessary headers
            app.use((req, res, next) => {
                res.header('Content-*', '*');
                res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
                res.header('Pragma', 'no-cache');
                res.header('Expires', '0');
                next();
            });

            app.use(queryHandlers.toLower);

            app.use(bodyParser.json({ type: '*/json', limit: '1Mb' }));

            app.set(PORT_KEY, appConfig.server.port || DEFAULT_PORT);

            // fulfil pre-flight promise request
            app.options('*', (req, res) => {
                if (appConfig.server.allowPreFlightRequest === true) {
                    res.status(StatusCodes.OK).json({
                        success: true
                    });
                } else {
                    res.status(StatusCodes.FORBIDDEN).json({
                        success: false
                    });
                }
            });

            if (appConfig.server.enableTestEndpoint === true) {
                app.get('/api/test', (req, res) => {
                    res.json({
                        message: 'hello beowulf'
                    });
                });
            }

            // START SERVICES HERE
            const svcManager: ServiceManager = container.get(ServiceManager);
            svcManager.startServices();

            app.use(express.static(path.join(__dirname, PUBLIC_DIRECTORY)));

            // notify of bad request
            const requestLogger = new requestHandlers.RequestLogger(log);
            app.use(requestLogger.unhandled);

            // log unhandled errors
            const errorLogger = new errorHandlers.ErrorMiddleware(log);
            app.use(errorLogger.log);

            const httpServer: Server = app.listen(app.get('port'), (error: Error) => {
                if (error != null) {
                    log.error(error);
                } else {
                    log.info('server listening over insecure http on port ' + app.get(PORT_KEY));

                    // we have to start active platforms
                    log.info('starting active platforms');
                }

            });
        } catch (ex) {
            (log as any).fatal(ex, 'fatal error in server start up');
            database.close();
            process.exit(1);
        }
    } else {
        log.error('database connection failed');
        return;
    }
}).catch((err) => {
    log.error(err);
    return;
});