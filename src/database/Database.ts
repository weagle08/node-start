import { DestroyOptions, Model, Models, Options, Sequelize } from 'sequelize';
import SequelizeDb = require('sequelize');

/**
 * represents an instance of the application database
 */
export class Database {
    private _db: Sequelize;

    /**
     * constructor
     * @param config database config options
     */
    public constructor(config: Options) {
        config.operatorsAliases = {};
        this._db = new SequelizeDb(config);
    }

    /**
     * initiates the database connection
     */
    public connect(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this._db.authenticate().then(() => {
                // initialize models


                // create model associations

                this._db.sync().then(() => {
                    resolve(true);
                }).catch((ex: Error) => {
                    reject(ex);
                });
            }).catch((ex: Error) => {
                reject(ex);
            });
        });
    }

    /**
     * closes the database connection
     */
    public close(): Promise<void> {
        return new Promise((resolve, reject) => {
            this._db.close().then(() => {
                resolve();
            }).catch((ex: Error) => {
                reject(ex);
            });
        });
    }

    /**
     * truncates all tables in the database
     */
    public truncate(options: DestroyOptions): Promise<void> {
        return new Promise((resolve, reject) => {
            this._db.truncate(options).then(() => {
                resolve();
            }).catch((ex) => {
                reject(ex);
            });
        });
    }

    private _checkIfTableNull(table: Model<any, any>): void {
        if (table == null) { throw new Error('database not initialized'); }
    }
}