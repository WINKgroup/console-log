import _ from "lodash"
import { ConsoleLogLevel, ConsoleLogLevelOptions } from "./level"
import type { PartialDeep } from 'type-fest'

export enum LogLevel {
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    NONE = 0
}

export enum LogAction {
    CONSOLE = 'console',
    THROW_ERROR = 'error',
    NONE = 'none'
}

export enum LogTimestampFormat {
    FULL = 'full',
    TIME = 'time',
    MILLISECONDS = 'milliseconds',
    NONE = 'none'
}

export enum ConsoleLogColor {
    GREEN = 'green',
    YELLOW_BRIGHT = 'yellowBright',
    RED = 'red',
    DEFAULT = 'default'
}

export enum ConsoleLogMethod {
    DEBUG = 'debug',
    INFO = 'info',
    WARN = 'warn',
    ERROR = 'error'
}

export interface GeneralOptions {
    id?: string
    prefix?: string
    verbosity?: LogLevel
}

export interface LevelOption {
    level: LogLevel
    options: PartialDeep<ConsoleLogLevelOptions>
}

export default class ConsoleLog {
    generalOptions:GeneralOptions
    levelOptions:LevelOption[]

    constructor(generalOptions?:GeneralOptions, levelOptions?:LevelOption[]) {
        this.generalOptions = generalOptions || {}
        this.levelOptions = levelOptions || []
    }

    protected getLogLevelObj(level:LogLevel) {
        for (const levelOptions of this.levelOptions)
            if (levelOptions.level == level) {
                const options = _.defaultsDeep(levelOptions.options, {
                    id: this.generalOptions.id,
                    prefix: this.generalOptions.prefix
                })
                return new ConsoleLogLevel(options)
            }
        
        const options = {
            id: this.generalOptions.id,
            prefix: this.generalOptions.prefix,
            action: LogAction.CONSOLE
        } as PartialDeep<ConsoleLogLevelOptions>
    
        if (this.generalOptions.verbosity && this.generalOptions.verbosity < level) {
            options.action = LogAction.NONE
            return new ConsoleLogLevel(options)
        }

        switch(level) {
            case LogLevel.DEBUG:
                options.consoleOptions = {
                    method: ConsoleLogMethod.DEBUG
                }
                break
            case LogLevel.INFO:
                options.consoleOptions = {
                    method: ConsoleLogMethod.INFO,
                    color: ConsoleLogColor.GREEN
                }
                break
            case LogLevel.WARN:
                options.consoleOptions = {
                    method: ConsoleLogMethod.WARN,
                    color: ConsoleLogColor.YELLOW_BRIGHT
                }
                break
            case LogLevel.ERROR:
                options.consoleOptions = {
                    method: ConsoleLogMethod.ERROR,
                    color: ConsoleLogColor.RED
                }
                break
        }
        return new ConsoleLogLevel(options)
    }

    print(message:string, level = LogLevel.INFO) {
        const levelObj = this.getLogLevelObj(level)
        levelObj.log(message)
    }

    debug(message:string) {
        this.print(message, LogLevel.DEBUG)
    }

    warn(message:string) {
        this.print(message, LogLevel.WARN)
    }

    error(message:string) {
        this.print(message, LogLevel.ERROR)
    }
}