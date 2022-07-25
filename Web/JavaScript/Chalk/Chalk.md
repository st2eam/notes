<img src="https://raw.githubusercontent.com/chalk/chalk/HEAD/media/logo.svg" title="" alt="Chalk" data-align="center"> 

## Install

```shell
npm install chalk
```

**IMPORTANT:** Chalk 5 is ESM. If you want to use Chalk with TypeScript or a build tool, you will probably want to use Chalk 4 for now. [Read more.](https://github.com/chalk/chalk/releases/tag/v5.0.0)

## [Usage](https://www.npmjs.com/package/chalk#usage)

```ts
  let temp = /\x1B.*?m/g  //正则匹配其前后缀规则
  
  let str = '中123文'

  console.log(str.length) //5

  console.log(chalk.cyan(str).length) //15

  console.log(chalk.cyan(str).replace(temp, '').length) //5

  console.log(chalk.cyan(chalk.white(str)).split("'"))
  //[ '\x1B[36m\x1B[37m中123文\x1B[39m\x1B[36m\x1B[39m' ]

  console.log(chalk.bgBlue(str).split("'"))
  //[ '\x1B[44m中123文\x1B[49m' ]
```

Chalk comes with an easy to use composable API where you just chain and nest the styles you want.

```js
import chalk from 'chalk';

const log = console.log;

// Combine styled and normal strings
log(chalk.blue('Hello') + ' World' + chalk.red('!'));

// Compose multiple styles using the chainable API
log(chalk.blue.bgRed.bold('Hello world!'));

// Pass in multiple arguments
log(chalk.blue('Hello', 'World!', 'Foo', 'bar', 'biz', 'baz'));

// Nest styles
log(chalk.red('Hello', chalk.underline.bgBlue('world') + '!'));

// Nest styles of the same type even (color, underline, background)
log(chalk.green(
    'I am a green line ' +
    chalk.blue.underline.bold('with a blue substring') +
    ' that becomes green again!'
));

// ES2015 template literal
log(`
CPU: ${chalk.red('90%')}
RAM: ${chalk.green('40%')}
DISK: ${chalk.yellow('70%')}
`);

// Use RGB colors in terminal emulators that support it.
log(chalk.rgb(123, 45, 67).underline('Underlined reddish color'));
log(chalk.hex('#DEADED').bold('Bold gray!'));
```

Easily define your own themes:

```js
import chalk from 'chalk';

const error = chalk.bold.red;
const warning = chalk.hex('#FFA500'); // Orange color

console.log(error('Error!'));
console.log(warning('Warning!'));
```

Take advantage of console.log [string substitution](https://nodejs.org/docs/latest/api/console.html#console_console_log_data_args):

```js
import chalk from 'chalk';

const name = 'Sindre';
console.log(chalk.green('Hello %s'), name);
// => 'Hello Sindre'
```
