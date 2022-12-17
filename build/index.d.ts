import { ConsoleLogLevel, ConsoleLogLevelOptions } from "./level";
import type { PartialDeep } from 'type-fest';
export declare enum LogLevel {
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    NONE = 0
}
export declare enum LogAction {
    CONSOLE = "console",
    THROW_ERROR = "error",
    NONE = "none"
}
export declare enum LogTimestampFormat {
    FULL = "full",
    TIME = "time",
    MILLISECONDS = "milliseconds",
    NONE = "none"
}
export declare enum ConsoleLogColor {
    GREEN = "green",
    YELLOW_BRIGHT = "yellowBright",
    RED = "red",
    DEFAULT = "default"
}
export declare enum ConsoleLogMethod {
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error"
}
export interface ConsoleLogGeneralOptions {
    id?: string;
    prefix?: string;
    verbosity?: LogLevel;
}
export default class ConsoleLog {
    generalOptions: ConsoleLogGeneralOptions;
    levelOptions: {
        [key: string]: PartialDeep<ConsoleLogLevelOptions>;
    };
    constructor(generalOptions?: ConsoleLogGeneralOptions, levelOptions?: {
        [key: string]: PartialDeep<ConsoleLogLevelOptions>;
    });
    protected getLogLevelObj(level: LogLevel): ConsoleLogLevel;
    print(message: string, level?: LogLevel): void;
    debug(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    spawn(inputGeneralOptions?: ConsoleLogGeneralOptions, inputLevelOptions?: {
        [key: string]: PartialDeep<ConsoleLogLevelOptions>;
    }): ConsoleLog;
}
