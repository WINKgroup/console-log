import { LogAction, ConsoleLogColor, ConsoleLogMethod, LogTimestampFormat } from "./index";
import type { PartialDeep } from 'type-fest';
export interface ConsoleLogLevelOptions {
    id?: string;
    prefix?: string;
    action: LogAction;
    timestampFormat?: LogTimestampFormat;
    consoleOptions?: {
        color?: ConsoleLogColor;
        method?: ConsoleLogMethod;
    };
}
export declare class ConsoleLogLevel {
    options: ConsoleLogLevelOptions;
    constructor(options?: PartialDeep<ConsoleLogLevelOptions>);
    protected buildTimestamp(): string;
    protected prepareMessage(): string;
    protected runActionConsole(message: string): void;
    protected runActionThrowError(message: string): void;
    log(message: string): void;
}
