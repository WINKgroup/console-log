import _ from 'lodash';
import { ConsoleLogLevel, ConsoleLogLevelOptions } from './level';
import type { PartialDeep } from 'type-fest';

export enum LogLevel {
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    NONE = 0,
}

export enum LogAction {
    CONSOLE = 'console',
    THROW_ERROR = 'error',
    NONE = 'none',
}

export enum LogTimestampFormat {
    FULL = 'full',
    TIME = 'time',
    MILLISECONDS = 'milliseconds',
    NONE = 'none',
}

export enum ConsoleLogColor {
    GREEN = 'green',
    YELLOW_BRIGHT = 'yellowBright',
    RED = 'red',
    DEFAULT = 'default',
}

export enum ConsoleLogMethod {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error',
}

export interface ConsoleLogGeneralOptions {
    id?: string;
    prefix?: string;
    verbosity?: LogLevel;
}

export default class ConsoleLog {
    generalOptions: ConsoleLogGeneralOptions;
    levelOptions: { [key: string]: PartialDeep<ConsoleLogLevelOptions> };

    constructor(
        generalOptions?: ConsoleLogGeneralOptions,
        levelOptions?: { [key: string]: PartialDeep<ConsoleLogLevelOptions> }
    ) {
        this.generalOptions = generalOptions || {};
        this.levelOptions = levelOptions || {};
    }

    protected getLogLevelObj(level: LogLevel) {
        const levelOptions = this.levelOptions[level];
        if (levelOptions) return new ConsoleLogLevel(levelOptions);

        const options = {
            id: this.generalOptions.id,
            prefix: this.generalOptions.prefix,
            action: LogAction.CONSOLE,
        } as PartialDeep<ConsoleLogLevelOptions>;

        const verbosity =
            this.generalOptions.verbosity !== undefined
                ? this.generalOptions.verbosity
                : LogLevel.INFO;
        if (verbosity < level || level === LogLevel.NONE) {
            options.action = LogAction.NONE;
            return new ConsoleLogLevel(options);
        }

        switch (level) {
            case LogLevel.DEBUG:
                options.consoleOptions = {
                    method: ConsoleLogMethod.DEBUG,
                };
                break;
            case LogLevel.INFO:
                options.consoleOptions = {
                    method: ConsoleLogMethod.INFO,
                    color: ConsoleLogColor.GREEN,
                };
                break;
            case LogLevel.WARN:
                options.consoleOptions = {
                    method: ConsoleLogMethod.WARN,
                    color: ConsoleLogColor.YELLOW_BRIGHT,
                };
                break;
            case LogLevel.ERROR:
                options.consoleOptions = {
                    method: ConsoleLogMethod.ERROR,
                    color: ConsoleLogColor.RED,
                };
                break;
        }
        return new ConsoleLogLevel(options);
    }

    print(message: string, level = LogLevel.INFO) {
        const levelObj = this.getLogLevelObj(level);
        levelObj.log(message);
    }

    debug(message: string) {
        this.print(message, LogLevel.DEBUG);
    }

    warn(message: string) {
        this.print(message, LogLevel.WARN);
    }

    error(message: string) {
        this.print(message, LogLevel.ERROR);
    }

    spawn(
        inputGeneralOptions?: ConsoleLogGeneralOptions,
        inputLevelOptions?: {
            [key: string]: PartialDeep<ConsoleLogLevelOptions>;
        }
    ) {
        const generalOptions = _.defaultsDeep(
            inputGeneralOptions,
            this.generalOptions
        );
        const levelOptions = _.defaults(inputLevelOptions, this.levelOptions);

        return new ConsoleLog(generalOptions, levelOptions);
    }
}

export { ConsoleLogLevel, ConsoleLogLevelOptions };
