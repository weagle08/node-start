import {Logger} from 'bunyan-log';
import {Router} from 'express';

/**
 * base class for all services
 */
export class ServiceBase {
    protected _log: Logger;

    private _router: Router;
    private _started: boolean = false;

    /**
     * constructor
     * @param router express router
     * @param log application logger
     */
    public constructor(router: Router, log: Logger) {
        this._log = log.child({class: this.constructor.name});
        this._router = router;

        if (this.constructor === ServiceBase) {
            throw new Error('cannot construct ServiceBase instances directly');
        }
    }

    /**
     * Instance of the Express Router
     */
    public get router(): Router {
        return this._router;
    }

    /**
     * Start the service
     */
    public start(): void {
        if (this.constructor === ServiceBase) {
            throw new Error('method must be implemented in inheriting class');
        } else if (this._started === true) {
            throw new Error(`${this.constructor.name} has already been started`);
        } else {
            this._log.info(`${this.constructor.name} started`);
        }

        this._started = true;
    }
}