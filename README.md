# hash.js

Hash library created zbfe

[![code style fecs](https://img.shields.io/badge/code%20style-fecs-brightgreen.svg)](https://github.com/ecomfe/fecs)
[![Build Status](https://travis-ci.org/zbfe/hash.js.svg?branch=master)](https://travis-ci.org/zbfe/hash.js)
[![Test Coverage](https://img.shields.io/coveralls/zbfe/hash.js/master.svg)](https://coveralls.io/r/zbfe/hash.js)
[![DevDependencies](https://img.shields.io/david/dev/zbfe/hash.js.svg?style=flat)](https://david-dm.org/zbfe/hash.js#info=devDependencies)

## 说明

在移动端开发中，很多时候要做单应用，比如使用`fullpage`插件等，但又有需要要保留页面的状态，那么如何控制呢？

如果使用`GET`参数可以解决这个问题，但问题是`GET`参数可能又跟后端挂勾，并且使用参数形式就得使用`history.pushState`方式来操作，因为要不刷新，然而`history.pushState`的整个前端、后端联动成本略大，就考虑使用`hash`来解决。


使用`#key=value&key2=value`后可以解决刷新保留参数的作用，并且还有`hashchange`事件来解决浏览器的前进后退事件。但在实际场景应用中发现，有的移动设备浏览器会对`#`后的内容进行编码，但你还不知道他有没有编码。。。经定位发现，`|`符号可以检测是否编码了，那么就可以使用`|`来分隔参数，并且在`#`后就设置一个`|`来判断当前浏览器是否编码了。

然后使用`hash lib`来统一处理`hash`的参数，并且不能使用页面中的锚点功能。

当然要感谢一些前辈留下的经验，不然这个坑确实很大～
## Api

## Hash.on

```js
/**
 * 绑定事件
 *
 * @param  {string} name 需要监听的名称
 * @param  {Function} callback 事件回调
 *
 * @return {Object}            Hash
 */
```

## Hash.one

```js
/**
 * 绑定事件 - 一次性
 *
 * @param  {string} name 需要监听的名称
 * @param  {Function} callback 事件回调
 *
 * @return {Object}            Hash
 */
```

## Hash.off

```js
/**
 * 删除事件
 *
 * @param  {string} name 需要监听的名称
 * @param  {Function|undefined} callback 事件回调，如果为空则删除整个事件
 *
 * @return {Object}            Hash
 */
    ```

## Hash.set

```js
/**
 * 设置hash
 *
 * @param {string} key 单个hash的key
 * @param {string} value 值
 * @param {Boolean} [ignore=false] 忽略事件触发
 *
 * @return {Object} Hash
 */
```

## Hash.get

```js
/**
 * 获取hash
 *
 * @param  {string|undefined} key，如果为空则获取各个hash对象
 *
 * @return {string|Object}     结果
 */
```

## Hash.remove

```js
/**
 * 删除hash
 *
 * @param  {string} key 单个hash的key
 * @param {Boolean} [ignore=false] 忽略事件触发
 *
 * @return {Object}     Hash
 */
```

### Hash.stringify

```js
/**
 * 解析hash对象为字符串
 *
 * @param  {Object} obj 需要设置为hash的对象
 *
 * @return {string}     字符串
 */
```

### Hash.parse

```js
/**
 * 解析字符串为hash对象
 *
 * @param  {string|undefined} str hash字符串，如果为空则获取当前url中的hash
 *
 * @return {Object}     hash对象
 */
```

## Develop

```shell
git clone https://github.com/zbfe/hash.js.git

cd hash.js

npm install

# 安装push前检查代码勾子
npm run hook-install
```

## Test

> Test case by [jasmine](https://jasmine.github.io/), test environment by [karma](https://karma-runner.github.io/)、[phantomjs](http://phantomjs.org/)

```shell
# 运行测试
npm run test

# 运行测试覆盖率
npm run test-cov

# 运行代码检查
npm run check
```