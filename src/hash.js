/**
 * @file hash lib
 * @author xiaowu
 */

(function () {
    'use strict';

    /**
     * 给window上暴露Hash对象
     *
     * @type {Object}
     */
    var Hash = window.Hash = {};

    /**
     * 标识，为false时hashchange事件有效，为true时不触发事件
     *
     * @type {Boolean}
     */
    var flag = false;

    /**
     * 当前hash数据对象，会在底部进行初始化，存着这个是为了在hashchange时做diff
     *
     * @type {Object}
     */
    var currentHash = {};

    /**
     * 事件缓存
     *
     * @private
     * @type {Object}
     */
    Hash._listener = {};

    /**
     * 获取事件空间
     *
     * @private
     * @param  {string} name 需要监听的名称
     *
     * @return {Array}       事件空间队列数组
     */
    Hash._getListener = function (name) {
        // 如果没有事件名
        if (!name || 'string' !== typeof name) {
            return [];
        }

        // 如果为新事件
        if (!Hash._listener[name]) {
            Hash._listener[name] = [];
        }

        return Hash._listener[name];
    };

    /**
     * 绑定事件
     *
     * @param  {string} name 需要监听的名称
     * @param  {Function} callback 事件回调
     *
     * @return {Object}            Hash
     */
    Hash.on = function (name, callback) {
        if ('function' === typeof callback) {
            Hash._getListener(name).push(callback);
        }

        return Hash;
    };

    /**
     * 绑定事件 - 一次性
     *
     * @param  {string} name 需要监听的名称
     * @param  {Function} callback 事件回调
     *
     * @return {Object}            Hash
     */
    Hash.one = function (name, callback) {
        var fn = function (data) {
            Hash.off(name, fn);
            callback.call(this, data);
        };
        return Hash.on(name, fn);
    };

    /**
     * 删除事件
     *
     * @param  {string} name 需要监听的名称
     * @param  {Function|undefined} callback 事件回调，如果为空则删除整个事件
     *
     * @return {Object}            Hash
     */
    Hash.off = function (name, callback) {
        var listeners = Hash._getListener(name);
        var i;

        // 如果有回调，则编译整个事件队列删除当前回调的
        if ('function' === typeof callback) {
            for (i = 0; i < listeners.length; i++) {
                if (callback === listeners[i]) {
                    listeners.splice(i--, 1);
                }

            }
        }
        else {
            listeners.length = 0;
        }

        return Hash;
    };

    /**
     * 触发事件
     *
     * @private
     * @param  {string} name 需要监听的名称
     * @param  {Object|undefined} data  事件数据
     *
     * @return {Object}       Hash
     */
    Hash._trigger = function (name, data) {
        var list = Hash._getListener(name);

        list.forEach(function (callback) {
            callback.call(Hash, data);
        });

        return Hash;
    };

    /**
     * 获取hash
     *
     * @param  {string|undefined} hash hash字符串，如果为空则获取地址栏中#开头的
     *
     * @return {string}      hash字符符
     */
    Hash._getHash = function (hash) {
        hash = (hash || location.href).match(/#(.*)$/);

        if (!hash) {
            return '';
        }

        hash = hash[0];

        if (hash.indexOf('#%7C') === 0) {
            // 百度浏览器在内的部分浏览器会把hash自动进行url-encode
            // %7C就是'|'的url-encode
            hash = decodeURIComponent(hash);
        }

        return hash;
    };

    /**
     * 解析字符串为hash对象
     *
     * @param  {string|undefined} str hash字符串，如果为空则获取当前url中的hash
     *
     * @return {Object}     hash对象
     */
    Hash.parse = function (str) {
        var obj = {};

        str = Hash._getHash(str);

        str = str.replace('#', '');
        str.split('|').forEach(function (val) {
            if (val && val.match(/([^=]+)(?:=(.*))?/)) {
                obj[decodeURIComponent(RegExp.$1)] = decodeURIComponent(RegExp.$2 || '');
            }

        });

        return obj;
    };

    /**
     * 解析hash对象为字符串
     *
     * @param  {Object} obj 需要设置为hash的对象
     *
     * @return {string}     字符串
     */
    Hash.stringify = function (obj) {
        var hash = [];

        Object.keys(obj).forEach(function (key) {
            var val = obj[key];

            if (val === '') {
                hash.push(encodeURIComponent(key));
            }
            else {
                hash.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
            }
        });

        hash.unshift('#');
        return hash.join('|');
    };

    /**
     * 设置hash
     *
     * @param {string} key 单个hash的key
     * @param {string} value 值
     * @param {Boolean} [ignore=false] 忽略事件触发
     *
     * @return {Object} Hash
     */
    Hash.set = function (key, value, ignore) {
        var obj;

        // 如果参数不正确
        if (!key || value === undefined) {
            return Hash;
        }

        obj = Hash.parse();

        obj[key] = String(value);

        setHash(obj, null, ignore);

        return Hash;
    };

    /**
     * 获取hash
     *
     * @param  {string|undefined} key，如果为空则获取各个hash对象
     *
     * @return {string|Object}     结果
     */
    Hash.get = function (key) {
        var obj = Hash.parse();

        if (!key) {
            return obj;
        }

        return obj[key];
    };

    /**
     * 删除hash
     *
     * @param  {string} key 单个hash的key
     * @param {Boolean} [ignore=false] 忽略事件触发
     *
     * @return {Object}     Hash
     */
    Hash.remove = function (key, ignore) {
        var obj = Hash.parse();

        if (obj[key]) {
            delete obj[key];
        }

        setHash(obj, null, ignore);

        return Hash;
    };

    /**
     * 设置hash到浏览器
     *
     * @private
     * @param {Object} obj hash对象
     * @param {Boolean} [isWindow=false] 是否为window事件触发
     * @param {Boolean} [ignore=false] 忽略事件触发
     */
    function setHash(obj, isWindow, ignore) {
        var newHash = obj || Hash.parse();
        var trigger = false;

        // 如果忽略事件触发则不遍历
        if (!ignore) {
            // 循环新的，判断老的如果有且值不一样时为modified，如果老的里没有则为added
            Object.keys(newHash).forEach(function (key) {
                // 如果当前值里有这个key，说明不是新增
                if (currentHash[key] !== undefined) {
                    if (currentHash[key] !== newHash[key]) {
                        Hash._trigger(key, {
                            type: 'modified',
                            oldValue: currentHash[key],
                            newValue: newHash[key],
                            key: key
                        });

                        trigger = true;
                    }
                    else {
                        delete currentHash[key];
                    }
                }
                else {
                    Hash._trigger(key, {
                        type: 'added',
                        oldValue: currentHash[key],
                        newValue: newHash[key],
                        key: key
                    });

                    trigger = true;
                }
            });

            // 使用当前hash遍历，如果新hash里不存在，则为删除了
            Object.keys(currentHash).forEach(function (key) {
                if (newHash[key] === undefined) {
                    Hash._trigger(key, {
                        type: 'removed',
                        oldValue: currentHash[key],
                        newValue: newHash[key],
                        key: key
                    });

                    trigger = true;
                }

            });
        }

        // 重置当前的hash
        currentHash = newHash;

        if ((!isWindow && trigger) || ignore) {
            flag = true;
            location.hash = Hash.stringify(currentHash);
        }
    }

    // 绑定hash事件
    window.addEventListener('hashchange', function () {
        if (!flag) {
            setHash(null, true);
        }

        flag = false;
    }, false);

    // 初始化当前hash
    currentHash = Hash.parse();
})();
