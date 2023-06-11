import _ from 'lodash';
import chalk from 'chalk';
import {
    LogAction,
    ConsoleLogColor,
    ConsoleLogMethod,
    LogTimestampFormat,
} from './index';
import { padZeros } from '@winkgroup/misc';
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

export class ConsoleLogLevel {
    options: ConsoleLogLevelOptions;

    constructor(options?: PartialDeep<ConsoleLogLevelOptions>) {
        this.options = _.defaults(options, {
            action: LogAction.CONSOLE,
        });
    }

    protected buildTimestamp() {
        const format = this.options.timestampFormat || LogTimestampFormat.NONE;
        let result = '';
        if (format === LogTimestampFormat.NONE) return result;
        const now = new Date();

        switch (format) {
            case LogTimestampFormat.FULL:
                result = now.toString();
                break;
            case LogTimestampFormat.TIME:
                result = now.toTimeString().substring(0, 8);
                break;
            case LogTimestampFormat.MILLISECONDS:
                result = now.toTimeString().substring(0, 8);
                result += '.' + padZeros(now.valueOf() % 1000, 4);
                break;
            default:
                throw new Error(`unrecognized timestampFormat "${format}"`);
        }
        return result;
    }

    protected prepareMessage() {
        let timestamp = this.buildTimestamp();
        if (this.options.prefix === undefined) return `[${timestamp}] `;
        if (timestamp) timestamp += ' ';
        if (this.options.id)
            return `[${timestamp}${this.options.prefix} (${this.options.id})] `;
        return `[${timestamp}${this.options.prefix}] `;
    }

    protected runActionConsole(message: string) {
        const method =
            this.options.consoleOptions && this.options.consoleOptions.method
                ? this.options.consoleOptions.method
                : ConsoleLogMethod.INFO;
        const color =
            this.options.consoleOptions && this.options.consoleOptions.color
                ? this.options.consoleOptions.color
                : ConsoleLogColor.DEFAULT;
        let text = this.prepareMessage() + message;

        switch (color) {
            case ConsoleLogColor.GREEN:
                text = chalk.green(text);
                break;
            case ConsoleLogColor.YELLOW_BRIGHT:
                text = chalk.yellowBright(text);
                break;
            case ConsoleLogColor.RED:
                text = chalk.red(text);
                break;
        }

        switch (method) {
            case ConsoleLogMethod.DEBUG:
                console.debug(text);
                break;
            case ConsoleLogMethod.INFO:
                console.info(text);
                break;
            case ConsoleLogMethod.WARN:
                console.warn(text);
                break;
            case ConsoleLogMethod.ERROR:
                console.error(text);
                break;
            default:
                throw new Error(`unrecognized consoleLogMethod "${method}"`);
        }
    }

    protected runActionThrowError(message: string) {
        const text = this.prepareMessage() + message;
        throw new Error(text);
    }

    log(message: string) {
        switch (this.options.action) {
            case LogAction.CONSOLE:
                this.runActionConsole(message);
                break;
            case LogAction.THROW_ERROR:
                this.runActionThrowError(message);
                break;
            case LogAction.NONE:
                break;
            default:
                throw new Error(
                    `unrecognized log action "${this.options.action}"`
                );
        }
    }
}
