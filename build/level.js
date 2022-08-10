"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogLevel = void 0;
var lodash_1 = __importDefault(require("lodash"));
var chalk_1 = __importDefault(require("chalk"));
var index_1 = require("./index");
var misc_1 = require("@winkgroup/misc");
var ConsoleLogLevel = /** @class */ (function () {
    function ConsoleLogLevel(options) {
        this.options = lodash_1.default.defaults(options, {
            action: index_1.LogAction.CONSOLE
        });
    }
    ConsoleLogLevel.prototype.buildTimestamp = function () {
        var format = this.options.timestampFormat || index_1.LogTimestampFormat.NONE;
        var result = '';
        if (format === index_1.LogTimestampFormat.NONE)
            return result;
        var now = new Date();
        switch (format) {
            case index_1.LogTimestampFormat.FULL:
                result = now.toString();
                break;
            case index_1.LogTimestampFormat.TIME:
                result = now.toTimeString().substring(0, 8);
                break;
            case index_1.LogTimestampFormat.MILLISECONDS:
                result = now.toTimeString().substring(0, 8);
                result += '.' + (0, misc_1.padZeros)(now.valueOf() % 1000, 4);
                break;
            default:
                throw new Error("unrecognized timestampFormat \"".concat(format, "\""));
        }
        return result;
    };
    ConsoleLogLevel.prototype.prepareMessage = function () {
        var timestamp = this.buildTimestamp();
        if (timestamp)
            timestamp += ' ';
        if (this.options.prefix === undefined)
            return timestamp;
        return this.options.id ? timestamp + this.options.prefix + " (".concat(this.options.id, "): ") : timestamp + this.options.prefix + ': ';
    };
    ConsoleLogLevel.prototype.runActionConsole = function (message) {
        var method = (this.options.consoleOptions && this.options.consoleOptions.method ? this.options.consoleOptions.method : index_1.ConsoleLogMethod.INFO);
        var color = (this.options.consoleOptions && this.options.consoleOptions.color ? this.options.consoleOptions.color : index_1.ConsoleLogColor.DEFAULT);
        var text = this.prepareMessage() + message;
        switch (color) {
            case index_1.ConsoleLogColor.GREEN:
                text = chalk_1.default.green(text);
                break;
            case index_1.ConsoleLogColor.YELLOW_BRIGHT:
                text = chalk_1.default.green(text);
                break;
            case index_1.ConsoleLogColor.RED:
                text = chalk_1.default.green(text);
                break;
        }
        switch (method) {
            case index_1.ConsoleLogMethod.DEBUG:
                console.debug(text);
                break;
            case index_1.ConsoleLogMethod.INFO:
                console.info(text);
                break;
            case index_1.ConsoleLogMethod.WARN:
                console.warn(text);
                break;
            case index_1.ConsoleLogMethod.ERROR:
                console.error(text);
                break;
            default:
                throw new Error("unrecognized consoleLogMethod \"".concat(method, "\""));
        }
    };
    ConsoleLogLevel.prototype.runActionThrowError = function (message) {
        var text = this.prepareMessage() + message;
        throw new Error(text);
    };
    ConsoleLogLevel.prototype.log = function (message) {
        switch (this.options.action) {
            case index_1.LogAction.CONSOLE:
                this.runActionConsole(message);
                break;
            case index_1.LogAction.THROW_ERROR:
                this.runActionThrowError(message);
                break;
            case index_1.LogAction.NONE:
                break;
            default:
                throw new Error("unrecognized log action \"".concat(this.options.action, "\""));
        }
    };
    return ConsoleLogLevel;
}());
exports.ConsoleLogLevel = ConsoleLogLevel;
