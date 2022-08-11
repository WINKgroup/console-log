"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLogMethod = exports.ConsoleLogColor = exports.LogTimestampFormat = exports.LogAction = exports.LogLevel = void 0;
var lodash_1 = __importDefault(require("lodash"));
var level_1 = require("./level");
var LogLevel;
(function (LogLevel) {
    LogLevel[LogLevel["DEBUG"] = 4] = "DEBUG";
    LogLevel[LogLevel["INFO"] = 3] = "INFO";
    LogLevel[LogLevel["WARN"] = 2] = "WARN";
    LogLevel[LogLevel["ERROR"] = 1] = "ERROR";
    LogLevel[LogLevel["NONE"] = 0] = "NONE";
})(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
var LogAction;
(function (LogAction) {
    LogAction["CONSOLE"] = "console";
    LogAction["THROW_ERROR"] = "error";
    LogAction["NONE"] = "none";
})(LogAction = exports.LogAction || (exports.LogAction = {}));
var LogTimestampFormat;
(function (LogTimestampFormat) {
    LogTimestampFormat["FULL"] = "full";
    LogTimestampFormat["TIME"] = "time";
    LogTimestampFormat["MILLISECONDS"] = "milliseconds";
    LogTimestampFormat["NONE"] = "none";
})(LogTimestampFormat = exports.LogTimestampFormat || (exports.LogTimestampFormat = {}));
var ConsoleLogColor;
(function (ConsoleLogColor) {
    ConsoleLogColor["GREEN"] = "green";
    ConsoleLogColor["YELLOW_BRIGHT"] = "yellowBright";
    ConsoleLogColor["RED"] = "red";
    ConsoleLogColor["DEFAULT"] = "default";
})(ConsoleLogColor = exports.ConsoleLogColor || (exports.ConsoleLogColor = {}));
var ConsoleLogMethod;
(function (ConsoleLogMethod) {
    ConsoleLogMethod["DEBUG"] = "debug";
    ConsoleLogMethod["INFO"] = "info";
    ConsoleLogMethod["WARN"] = "warn";
    ConsoleLogMethod["ERROR"] = "error";
})(ConsoleLogMethod = exports.ConsoleLogMethod || (exports.ConsoleLogMethod = {}));
var ConsoleLog = /** @class */ (function () {
    function ConsoleLog(generalOptions, levelOptions) {
        this.generalOptions = generalOptions || {};
        this.levelOptions = levelOptions || {};
    }
    ConsoleLog.prototype.getLogLevelObj = function (level) {
        var levelOptions = this.levelOptions[level];
        if (levelOptions)
            return new level_1.ConsoleLogLevel(levelOptions);
        var options = {
            id: this.generalOptions.id,
            prefix: this.generalOptions.prefix,
            action: LogAction.CONSOLE
        };
        var verbosity = this.generalOptions.verbosity !== undefined ? this.generalOptions.verbosity : LogLevel.INFO;
        if (verbosity < level) {
            options.action = LogAction.NONE;
            return new level_1.ConsoleLogLevel(options);
        }
        switch (level) {
            case LogLevel.DEBUG:
                options.consoleOptions = {
                    method: ConsoleLogMethod.DEBUG
                };
                break;
            case LogLevel.INFO:
                options.consoleOptions = {
                    method: ConsoleLogMethod.INFO,
                    color: ConsoleLogColor.GREEN
                };
                break;
            case LogLevel.WARN:
                options.consoleOptions = {
                    method: ConsoleLogMethod.WARN,
                    color: ConsoleLogColor.YELLOW_BRIGHT
                };
                break;
            case LogLevel.ERROR:
                options.consoleOptions = {
                    method: ConsoleLogMethod.ERROR,
                    color: ConsoleLogColor.RED
                };
                break;
        }
        return new level_1.ConsoleLogLevel(options);
    };
    ConsoleLog.prototype.print = function (message, level) {
        if (level === void 0) { level = LogLevel.INFO; }
        var levelObj = this.getLogLevelObj(level);
        levelObj.log(message);
    };
    ConsoleLog.prototype.debug = function (message) {
        this.print(message, LogLevel.DEBUG);
    };
    ConsoleLog.prototype.warn = function (message) {
        this.print(message, LogLevel.WARN);
    };
    ConsoleLog.prototype.error = function (message) {
        this.print(message, LogLevel.ERROR);
    };
    ConsoleLog.prototype.spawn = function (inputGeneralOptions, inputLevelOptions) {
        var generalOptions = lodash_1.default.defaultsDeep(inputGeneralOptions, this.generalOptions);
        var levelOptions = lodash_1.default.defaults(inputLevelOptions, this.levelOptions);
        return new ConsoleLog(generalOptions, levelOptions);
    };
    return ConsoleLog;
}());
exports.default = ConsoleLog;
