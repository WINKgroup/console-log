# console-log
enhanced logging library

## Install
```bash
npm install @winkgroup/console-log
```

## Usage
```js
import ConsoleLog from '@winkgroup/console-log'

consoleLog = new ConsoleLog()
consoleLog.print('hello world!')
```

you can set `prefix` and `id` properties that will become part of header of each log:
```js
import ConsoleLog from '@winkgroup/console-log'

consoleLog = new ConsoleLog({prefix: 'CoolLog', id: '1'})
consoleLog.print('hello world!')

// will print: CoolLog (1): hello world!
```

## API
### ConsoleLog(GeneralOptions, SpecificOptions)
`GeneralOptions` and `SpecificOptions` are two optional objects.

methods:
- `ConsoleLog.print(message, [logLevel])`: `message` is a string; `logLevel` is a value from [LogLevel](#loglevel)
- `ConsoleLog.debug(message)`: shortcut of `print` method with DEBUG [LogLevel](#loglevel)
- `ConsoleLog.warn(message)`: shortcut of `print` method with WARN [LogLevel](#loglevel)
- `ConsoleLog.error(message)`: shortcut of `print` method with ERROR [LogLevel](#loglevel)
- `ConsoleLog.spawn(GeneralOptions)`: it generates a new `ConsoleLog` object that inherits same options of original with some updates according with parameters passed

### GeneralOptions
all the attributes of this object are optional:
- GeneralOptions.id: an id that will be shown for each log
- GeneralOptions.prefix: a prefix that will be shown for each log
- GeneralOptions.timestampFormat: a timestamp with these possible values: 'full', 'time', 'milliseconds', 'none' (default)
- GeneralOptions.verbosity: every log that is below this [LogLevel](#loglevel) will have no action

### SpecificOptions
all the attributes of this object are optional, all those not declared will be inherited by [GeneralOptions](#GeneralOptions):
- SpecificOptions.id: an id that will be shown for each log
- SpecificOptions.prefix: a prefix that will be shown for each log
- SpecificOptions.timestampFormat: a timestamp with these possible values: 'full', 'time', 'milliseconds', 'none' (default)
- SpecificOptions.levels: [LogLevel](#loglevel) to those this option has to be applied, single level can be expressed. If this attribute is not set, then these options will be applied to any [LogLevel](#loglevel)
- SpecificOptions.action: object containing one of these actions: 'console' | 'file' | 'error' | 'none'

### LogLevel
ConsoleLog comes with five verbosity levels:
* DEBUG = 4
* INFO = 3
* WARN = 2
* ERROR = 1
* NONE = 0

### Tips
chalk v5 does't work properly in commonjs. To upgrade to minor version with ncu the command is

```bash
ncu -u -t minor
```

## Maintainers
* [fairsayan](https://github.com/fairsayan)