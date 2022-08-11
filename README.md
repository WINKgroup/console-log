# console-log
enhanced logging library

## Install
```
npm install @winkgroup/console-log
```

## Usage
```
import ConsoleLog from '@winkgroup/console-log'

consoleLog = new ConsoleLog()
consoleLog.print('hello world!')
```

you can set `prefix` and `id` properties that will become part of header of each log:
```
import ConsoleLog from '@winkgroup/console-log'

consoleLog = new ConsoleLog({prefix: 'CoolLog', id: '1'})
consoleLog.print('hello world!')

// will print: CoolLog (1): hello world!
```

## API
### ConsoleLog(GeneralOptions, LogLevelOptions)
`GeneralOptions` and `LogLevelOptions` are two optional objects.

methods:
- `ConsoleLog.print(message, logLevel)`: `message` is a string; `logLevel` is a value from [LogLevel](#loglevel)
- `ConsoleLog.debug(message)`: shortcut of `print` method with DEBUG [LogLevel](#loglevel)
- `ConsoleLog.warn(message)`: shortcut of `print` method with WARN [LogLevel](#loglevel)
- `ConsoleLog.error(message)`: shortcut of `print` method with ERROR [LogLevel](#loglevel)
- `ConsoleLog.spawn(GeneralOptions, LogLevelOptions)`: it generates a new `ConsoleLog` object that inherits same options of original with some updates according with parameters passed


### GeneralOptions
all the attributes of this object are optional:
- GeneralOptions.id: an id that will be shown for each log
- GeneralOptions.prefix: a prefix that will be shown for each log
- GeneralOptions.verbosity: every log that is below this [LogLevel](#loglevel) will have [LogAction](#logaction) = NONE

### LogAction
enum collection of possible actions to perform when a method of `ConsoleLog` object is called
- CONSOLE: print something in the console
- THROW_ERROR: throw a new error instead of printing it
- NONE: do nothing

### LogLevel
ConsoleLog comes with five verbosity levels:
* DEBUG = 4
* INFO = 3
* WARN = 2
* ERROR = 1
* NONE = 0

## Maintainers
* [fairsayan](https://github.com/fairsayan)