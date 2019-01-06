import { Container } from 'aurelia-dependency-injection';
import { Logger } from 'bunyan-log';
import * as express from 'express';
import { Application } from 'express';
import { Server } from 'ws';
import { ServiceBase } from './ServiceBase';

const API_BASE = '/api';
const MISSION_BASE = `${API_BASE}/missions`;
const PREFERENCE_BASE = `${API_BASE}/preferences`;
const PLATFORM_BASE = `${API_BASE}/platforms`;
const TARGET_BASE = `${API_BASE}/targets`;
const SUPPORTED_DEVICE_BASE = `${API_BASE}/supportedDevices`;
const POI_BASE = `${API_BASE}/poi`;

/**
 * manages starting the services for the application
 */
export class ServiceManager {
    public static inject() { return [express, Logger]; }

    private _app: Application;
    private _log: Logger;
    private _started: boolean = false;
    private _services: Set<ServiceBase>;

    /**
     * constructor
     * @param app express application
     */
    public constructor(app: Application, log: Logger) {
        this._app = app;
        this._log = log;
        this._services = new Set<ServiceBase>();
    }

    /**
     * starts all services
     */
    public startServices(): void {
        if (this._started !== true) {
            this._started = true;
            const container = Container.instance;

        }
    }
}
