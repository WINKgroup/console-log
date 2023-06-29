import _ from 'lodash';
import { padZeros } from '@winkgroup/misc';
import chalk from 'chalk';
import fs from 'fs';

export enum ConsoleLogLevel {
    DEBUG = 4,
    INFO = 3,
    WARN = 2,
    ERROR = 1,
    NONE = 0,
}

export type ConsoleLogAction = 'console' | 'file' | 'error' | 'none';
export type ConsoleLogTimestampFormat =
    | 'full'
    | 'time'
    | 'milliseconds'
    | 'none';
export type ConsoleLogColor = 'green' | 'yellowBright' | 'red' | 'default';
export type ConsoleLogMethod = 'debug' | 'info' | 'warn' | 'error' | 'none';

export interface ConsoleLogGeneralOptions {
    id?: string;
    prefix?: string;
    timestampFormat?: ConsoleLogTimestampFormat;
    verbosity?: ConsoleLogLevel;
}

export interface ConsoleLogActionConsoleOptions {
    name: 'console';
    color?: ConsoleLogColor;
    method?: ConsoleLogMethod;
}

export interface ConsoleLogActionFileOptions {
    name: 'file';
    fullPath: string;
    maxBytes?: number;
}

export interface ConsoleLogActionOtherOptions {
    name: 'error' | 'none';
}

export type ConsoleLogActionOptions =
    | ConsoleLogActionConsoleOptions
    | ConsoleLogActionFileOptions
    | ConsoleLogActionOtherOptions;

export interface ConsoleLogSpecificOptions {
    id?: string;
    prefix?: string;
    timestampFormat?: ConsoleLogTimestampFormat;
    levels?: ConsoleLogLevel | ConsoleLogLevel[];
    action: ConsoleLogActionOptions;
}

export function buildTimestamp(format?: ConsoleLogTimestampFormat) {
    let result = '';
    if (!format || format === 'none') return result;
    const now = new Date();

    switch (format) {
        case 'full':
            result = now.toString();
            break;
        case 'time':
            result = now.toTimeString().substring(0, 8);
            break;
        case 'milliseconds':
            result = now.toTimeString().substring(0, 8);
            result += '.' + padZeros(now.valueOf() % 1000, 4);
            break;
        default:
            throw new Error(`unrecognized timestampFormat "${format}"`);
    }
    return result;
}

export function preMessage(input: {
    timestampFormat?: ConsoleLogTimestampFormat;
    id?: string;
    prefix?: string;
}) {
    let timestamp = buildTimestamp(input.timestampFormat);
    if (input.prefix === undefined) return timestamp ? `[${timestamp}]` : '';
    if (timestamp) timestamp += ' ';
    if (input.id) return `[${timestamp}${input.prefix} (${input.id})]`;
    return `[${timestamp}${input.prefix}]`;
}

export function printLogConsole(
    stringifible: any,
    preMessage: string,
    options: ConsoleLogActionConsoleOptions,
    level: ConsoleLogLevel
) {
    let method = options.method;
    let color = options.color;
    const message =
        stringifible instanceof Error ? stringifible.stack : stringifible;

    if (!options.method) {
        switch (level) {
            case ConsoleLogLevel.DEBUG:
                method = 'debug';
                break;
            case ConsoleLogLevel.INFO:
                method = 'info';
                if (!color) color = 'green';
                break;
            case ConsoleLogLevel.WARN:
                method = 'warn';
                if (!color) color = 'yellowBright';
                break;
            case ConsoleLogLevel.ERROR:
                method = 'error';
                if (!color) color = 'red';
                break;
            default:
                // e.g. LogLevel.NONE
                return;
        }
    }

    let text = '';
    switch (color) {
        case 'green':
            text = chalk.green(preMessage, message);
            break;
        case 'yellowBright':
            text = chalk.yellowBright(preMessage, stringifible);
            break;
        case 'red':
            text = chalk.red(preMessage, message);
            break;
        default:
            text = chalk.gray(preMessage, message);
    }

    switch (method) {
        case 'debug':
            console.debug(text);
            break;
        case 'info':
            console.info(text);
            break;
        case 'warn':
            console.warn(text);
            break;
        case 'error':
            console.error(text);
            break;
        default:
            throw new Error(`unrecognized consoleLog method "${method}"`);
    }
}

export function printLogError(stringifible: any, preMessage: string) {
    const message =
        stringifible instanceof Error ? stringifible.stack : stringifible;
    const text = preMessage ? preMessage + ' ' + message : message;
    throw new Error(text);
}

export function printLogFile(
    stringifible: any,
    preMessage: string,
    options: ConsoleLogActionFileOptions
) {
    const message =
        stringifible instanceof Error ? stringifible.stack : stringifible;
    const text = (preMessage ? preMessage + ' ' + message : message) + '\n';
    fs.appendFile(options.fullPath, text, 'utf8', () => {
        if (options.maxBytes && options.maxBytes > 0) {
            let stats = fs.statSync(options.fullPath);
            if (stats.size > options.maxBytes) {
                let newContent = fs.readFileSync(options.fullPath, 'utf8');
                const lines = newContent.split('\n');
                const maxLinesToDelete = 10;
                while (
                    Buffer.byteLength(newContent, 'utf8') > options.maxBytes
                ) {
                    const linesToDelete = Math.min(
                        maxLinesToDelete,
                        lines.length
                    );
                    for (let i = 0; i < linesToDelete; i++) lines.shift();
                    newContent = lines.join('\n');
                }
                fs.writeFileSync(options.fullPath, newContent);
            }
        }
    });
}

export default class ConsoleLog {
    generalOptions: ConsoleLogGeneralOptions;
    specificOptions?: ConsoleLogSpecificOptions[];

    constructor(
        generalOptions?: ConsoleLogGeneralOptions,
        specificOptions?: ConsoleLogSpecificOptions[]
    ) {
        this.generalOptions = generalOptions || {};
        this.specificOptions = specificOptions;
    }

    protected applyPolicyNoLevelCheck(
        stringifible: any,
        policy: ConsoleLogSpecificOptions,
        level: ConsoleLogLevel
    ) {
        const prefixMessage = preMessage(policy);

        switch (policy.action.name) {
            case 'console':
                printLogConsole(
                    stringifible,
                    prefixMessage,
                    policy.action,
                    level
                );
                break;
            case 'error':
                printLogError(stringifible, prefixMessage);
                break;
            case 'file':
                printLogFile(stringifible, prefixMessage, policy.action);
                break;
            case 'none':
                break;
        }
    }

    print(stringifible: any, level = ConsoleLogLevel.INFO) {
        const verbosity =
            this.generalOptions.verbosity !== undefined
                ? this.generalOptions.verbosity
                : ConsoleLogLevel.INFO;
        if (verbosity < level || level === ConsoleLogLevel.NONE) return;

        let anyPolicyApplied = false;
        if (this.specificOptions) {
            for (const specificOption of this.specificOptions) {
                let levels = Array.isArray(specificOption.levels)
                    ? specificOption.levels
                    : typeof specificOption.levels !== 'undefined'
                    ? [specificOption.levels]
                    : undefined;
                if (levels && levels.indexOf(level) === -1) continue;
                anyPolicyApplied = true;
                const policy = _.defaults(specificOption, {
                    id: this.generalOptions.id,
                    prefix: this.generalOptions.prefix,
                    timestampFormat: this.generalOptions.timestampFormat,
                });
                this.applyPolicyNoLevelCheck(stringifible, policy, level);
            }
        }

        if (!anyPolicyApplied)
            this.applyPolicyNoLevelCheck(
                stringifible,
                {
                    id: this.generalOptions.id,
                    prefix: this.generalOptions.prefix,
                    timestampFormat: this.generalOptions.timestampFormat,
                    action: { name: 'console' },
                },
                level
            );
    }

    debug(stringifible: any) {
        this.print(stringifible, ConsoleLogLevel.DEBUG);
    }

    warn(stringifible: any) {
        this.print(stringifible, ConsoleLogLevel.WARN);
    }

    error(stringifible: any) {
        this.print(stringifible, ConsoleLogLevel.ERROR);
    }

    spawn(inputGeneralOptions?: ConsoleLogGeneralOptions) {
        const generalOptions = _.defaults(
            inputGeneralOptions,
            this.generalOptions
        );

        return new ConsoleLog(
            generalOptions,
            _.cloneDeep(this.specificOptions)
        );
    }
}
