# ora

> Elegant terminal spinner

<img src="https://raw.githubusercontent.com/sindresorhus/ora/HEAD/screenshot.svg" title="" alt="" data-align="center">

## Install

```shell
npm install ora
```

## Usage

```js
import ora from 'ora';

const spinner = ora('Loading unicorns').start();

setTimeout(() => {
    spinner.color = 'yellow';
    spinner.text = 'Loading rainbows';
}, 1000);
```
