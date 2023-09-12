import { Injectable, LoggerService } from '@nestjs/common';
import * as log4js from 'log4js';
import { AppConsts } from 'src/app-consts';

@Injectable()
export class AppLogger implements LoggerService {

    public static LOG_CATEGORY = 'UrlShortener';

    constructor() {

        const file_path = AppConsts.PROJECT_DIR + '/log';
        log4js.configure({
            appenders: {
                console: { type: 'console' },
                file: { type: 'file', filename: `UrlShortener.log` }
            },
            categories: {
                default: { appenders: ['console', 'file'], level: 'info' }
            }
        });
    }

    log(message: string, ...args: any[]) {
        log4js.getLogger(AppLogger.LOG_CATEGORY).info(message, args);
    }

    error(message: string, ...args: any[]) {
        log4js.getLogger(AppLogger.LOG_CATEGORY).error(message, args);
    }

    warn(message: string, ...args: any[]) {
        log4js.getLogger(AppLogger.LOG_CATEGORY).warn(message, args);
    }

    debug(message: string, ...args: any[]) {
        log4js.getLogger(AppLogger.LOG_CATEGORY).debug(message, args);
    }

    verbose(message: string, ...args: any[]) {
        log4js.getLogger(AppLogger.LOG_CATEGORY).trace(message, args);
    }

    getLogLevel() {
        return log4js.getLogger(AppLogger.LOG_CATEGORY).level;
    }
}