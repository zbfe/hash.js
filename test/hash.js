/**
 * @file hash测试用例
 * @author xiaowu
 */

/* globals Hash */
describe('Hash', function () {
    var testType = [
        '',
        'true',
        true,
        false,
        function () {},
        [],
        {},
        1,
        0,
        null,
        undefined
    ];

    // 清理hash
    beforeAll(function () {
        location.hash = '';
    });
    afterAll(function () {
        location.hash = '';
    });

    // 执行完则清空事件缓存
    afterEach(function () {
        Hash._listener = {};
    });

    it('on 参数校验', function () {
        Hash.on('');
        Hash.on(null);
        Hash.on(false);
        Hash.on('参数校验');
        Hash.on('参数校验', null);
        Hash.on('参数校验', false);
        Hash.on('参数校验', '');
        Hash.on('参数校验', function () {});
        Hash.on('参数校验', function () {});
        expect(Hash._listener['参数校验'].length).toBe(2);
    });

    it('on 返回值类型检查', function () {
        expect(Hash.on()).toEqual(Hash);
        expect(Hash.on(1)).toEqual(Hash);
        expect(Hash.on(false)).toEqual(Hash);
        expect(Hash.on(null)).toEqual(Hash);
        expect(Hash.on('返回值类型检查', null)).toEqual(Hash);
        expect(Hash.on('返回值类型检查', false)).toEqual(Hash);
        expect(Hash.on('返回值类型检查', function () {})).toEqual(Hash);
    });

    it('on 执行检查', function () {
        var num = 0;
        Hash.on('执行检查', function () {
            num += 1;
        });
        Hash.set('执行检查', 1);
        Hash.set('执行检查', 1);

        // 应该只执行一次
        expect(num).toBe(1);

        Hash.set('执行检查', 2);
        Hash.set('执行检查', 3);
        expect(num).toBe(3);
    });

    it('on 执行检查-队列', function () {
        var num = 0;
        Hash.on('执行检查', function () {
            num += 1;
        });
        Hash.on('执行检查', function () {
            num += 1;
        });
        Hash.set('执行检查', 1);
        Hash.set('执行检查', 1);

        // 应该只执行一次
        expect(num).toBe(2);

        Hash.set('执行检查', 2);
        Hash.set('执行检查', 3);
        expect(num).toBe(6);
    });

    it('on 回调参数检查', function (done) {
        Hash.on('回调参数检查', function (data) {
            expect(data.key).toBe('回调参数检查');
            expect('added').toBe(data.type);
            expect(data.oldValue).toBeUndefined();

            // 字符类型的1
            expect(data.newValue).toBe('1');
            expect(typeof data.newValue).toBe('string');
            done();
        });
        Hash.set('回调参数检查', 1);
    });

    it('one 返回值类型检查', function () {
        expect(Hash).toEqual(Hash.one());
        expect(Hash).toEqual(Hash.one(1));
        expect(Hash).toEqual(Hash.one(false));
        expect(Hash).toEqual(Hash.one(null));
        expect(Hash).toEqual(Hash.one('返回值类型检查', null));
        expect(Hash).toEqual(Hash.one('返回值类型检查', false));
        expect(Hash).toEqual(Hash.one('返回值类型检查', function () {}));
    });

    it('one 执行结果检查', function () {
        var num = 0;

        Hash.one('执行结果检查', function () {
            num += 1;
        });
        Hash.set('执行结果检查', 1);
        Hash.set('执行结果检查', 2);
        Hash.set('执行结果检查', 3);
        expect(num).toBe(1);
    });

    it('off 返回值类型检查', function () {
        expect(Hash).toEqual(Hash.off());
        expect(Hash).toEqual(Hash.off(1));
        expect(Hash).toEqual(Hash.off(false));
        expect(Hash).toEqual(Hash.off(null));
        expect(Hash).toEqual(Hash.off('string', null));
        expect(Hash).toEqual(Hash.off('string', false));
        expect(Hash).toEqual(Hash.off('string', function () {}));
    });

    it('off 执行检查', function () {
        var num = 0;
        var test = function () {
            num += 1;
        };
        Hash.on('off执行检查', test);
        Hash.set('off执行检查', 1).set('off执行检查', 2);
        Hash.off('off执行检查', test);
        Hash.set('off执行检查', 3);
        Hash.set('off执行检查', 4);
        expect(num).toBe(2);
    });

    it('off 执行检查2', function () {
        var num = 0;
        Hash.on('执行检查2', function () {
            num += 1;
        });
        Hash.set('执行检查2', 1);
        Hash.set('执行检查2', 2);

        // 因为fn不对，卸载不了事件
        Hash.off('执行检查2', function () {});

        Hash.set('执行检查2', 3);
        Hash.set('执行检查2', 4);
        expect(num).toBe(4);
    });

    it('off 执行检查 - 全删除', function () {
        var num = 0;
        Hash.on('执行检查 - 全删除', function () {
            num += 1;
        });
        Hash.set('执行检查 - 全删除', 1);
        Hash.set('执行检查 - 全删除', 2);
        Hash.off('执行检查 - 全删除');
        Hash.set('执行检查 - 全删除', 3);
        Hash.set('执行检查 - 全删除', 4);
        expect(num).toBe(2);
    });

    it('_trigger 返回值类型检查', function () {
        testType.forEach(function (val) {
            expect(Hash._trigger(val)).toEqual(Hash);
        });
    });

    it('_trigger 执行参数检查', function (done) {
        Hash.on('执行参数检查', function (num) {
            expect(num).toBe(true);
            done();
        });
        Hash._trigger('执行参数检查', true);
    });

    it('_getListener', function () {
        testType.forEach(function (val) {
            expect(Array.isArray(Hash._getListener(val))).toBe(true);
            expect(Hash._getListener(val).length).toBe(0);
        });
    });

    it('_getHash', function () {
        expect('string').toBe(typeof Hash._getHash());
        expect('string').toBe(typeof Hash._getHash('fdsfsd'));
        expect('').toBe(Hash._getHash('/index.html?test'));
        expect('#|').toBe(Hash._getHash('/index.html?test#|'));
        expect('#|ceshi').toBe(Hash._getHash('/index.html?test#%7Cceshi'));
        expect('#|ceshi|真的').toBe(Hash._getHash('/index.html?test#%7Cceshi|真的'));
        expect('#测试').toBe(Hash._getHash('/index.html?test#测试'));
        expect('#test').toBe(Hash._getHash('/index.html?test#test'));
        expect('####te###st').toBe(Hash._getHash('/index.html?test####te###st'));
        expect('#test||||').toBe(Hash._getHash('/index.html?test#test||||'));
    });

    it('parse', function () {
        // 返回值类型检查
        expect('object').toBe(typeof Hash.parse());

        // 普通字符检查
        expect('1').toBe(Hash.parse('#|a=1').a);
        expect('abcd').toBe(Hash.parse('#|a=abcd').a);

        // 数组检查
        expect('[1,2,3]').toBe(Hash.parse('#|a=1|b|c=[1,2,3]').c);

        // 对象检查
        expect('{"a":"1"}').toBe(Hash.parse('#|a=1|b|c=[1,2,3]|d={%22a%22%3A%221%22}').d);
        expect('{"a":"1"}').toBe(Hash.parse('#|a=1|b|c=[1,2,3]|d={"a":"1"}').d);

        // 不存在值检查
        expect(Hash.parse('#|a=1|b|').c).toBeUndefined();

        // 简单值检查
        expect('').toBe(Hash.parse('#|a=1|b|').b);

        // 验证 #|||| => {}
        expect(0).toBe(Object.keys(Hash.parse('#||||')).length);

        // 验证没有#
        expect(0).toBe(Object.keys(Hash.parse('a=1|b|||')).length);

        // 验证 #||a|||||b||||
        expect({
            a: '',
            b: ''
        }).toEqual(Hash.parse('#||a|||||b||||'));

        // 中文
        expect('中 文').toBe(Hash.parse('#|a=中 文').a);
        expect('1').toBe(Hash.parse('#|中 文=1')['中 文']);
        expect('中 文').toBe(Hash.parse('#|a=' + encodeURIComponent('中 文')).a);

        // 验证整个转义
        expect('中 文').toBe(Hash.parse('#' + encodeURIComponent('|a=中 文')).a);
        expect('1').toBe(Hash.parse('#' + encodeURIComponent('|中 文=1'))['中 文']);

        // 在考虑是否有这个需求
        // expect('中 文').toBe(Hash.parse('#' + encodeURIComponent('a=中 文')).a);
    });

    it('stringify', function () {
        // 返回值检查
        expect('string').toBe(typeof Hash.stringify({}));

        // 简单模式
        expect('#|a|b').toBe(Hash.stringify({
            a: '',
            b: ''
        }));

        expect('#|a=1|b=1').toBe(Hash.stringify({
            a: 1,
            b: '1'
        }));

        // 中文value
        expect('#|a=' + encodeURIComponent('中文')).toBe(Hash.stringify({
            a: '中文'
        }));

        expect('#|a=' + encodeURIComponent('  ')).toBe(Hash.stringify({
            a: '  '
        }));

        // 中文key+value
        expect('#|' + encodeURIComponent('中文') + '=' + encodeURIComponent('中文')).toBe(Hash.stringify({
            '中文': '中文'
        }));
        expect('#|a=' + encodeURIComponent('  ')).toBe(Hash.stringify({
            a: '  '
        }));
    });

    it('stringify => parse', function () {
        var data = {
            b: [
                1,
                2
            ]
        };
        var datahash = Hash.stringify({
            a: JSON.stringify(data)
        });
        expect(data).toEqual(JSON.parse(Hash.parse(datahash).a));
    });

    it('parse => stringify', function () {
        var hash = '#|a=1|b|c=2';
        expect(hash).toBe(Hash.stringify(Hash.parse(hash)));
    });

    it('set 参数校验', function () {
        expect(Hash).toEqual(Hash.set());
        expect(Hash).toEqual(Hash.set(false));
        expect(Hash).toEqual(Hash.set(null));
        expect(Hash).toEqual(Hash.set(''));
        expect(Hash).toEqual(Hash.set('', ''));
        expect(Hash).toEqual(Hash.set('test', 'test'));
    });

    it('remove 参数校验', function () {
        expect(Hash).toEqual(Hash.remove());
        expect(Hash).toEqual(Hash.remove(false));
        expect(Hash).toEqual(Hash.remove(null));
        expect(Hash).toEqual(Hash.remove(''));
        expect(Hash).toEqual(Hash.remove('', ''));
        expect(Hash).toEqual(Hash.remove('test', 'test'));
    });

    it('get 参数校验', function () {
        expect('object').toBe(typeof Hash.get());
        expect('object').toBe(typeof Hash.get(null));
        expect('object').toBe(typeof Hash.get(''));

        // 获取个空的
        expect(Hash.get(Date.now())).toBeUndefined();
    });

    it('测试新加hash', function (done) {
        Hash.on('测试新加hash', function (data) {
            expect('added').toBe(data.type);
            expect(data.oldValue).toBeUndefined();
            expect('2').toBe(data.newValue);
            done();
        });
        Hash.set('测试新加hash', 2);
    });

    it('测试修改hash', function (done) {
        Hash.set('测试修改hash', 1);

        // 延迟是为了使上面的set不触发下面的事件
        Hash.on('测试修改hash', function (data) {
            expect('modified').toBe(data.type);
            expect('1').toBe(data.oldValue);
            expect('2').toBe(data.newValue);
            done();
        });

        Hash.set('测试修改hash', 2);
    });

    it('测试删除hash', function (done) {
        Hash.set('测试删除hash', 1);

        Hash.on('测试删除hash', function (data) {
            expect('removed').toBe(data.type);
            expect(data.newValue).toBeUndefined();
            expect('1').toBe(data.oldValue);
            done();
        });
        Hash.remove('测试删除hash');
    });

    it('模拟浏览器事件触发hash - add', function (done) {
        // Hash.set('测试浏览器后退触发hash', 1);
        Hash.on('模拟浏览器事件触发hash - add', function (data) {
            expect(data.type).toBe('added');
            expect(data.oldValue).toBeUndefined();
            expect(data.newValue).toBe('1');
            done();
        });

        // 模拟浏览器后退
        setTimeout(function () {
            location.hash = Hash.stringify({
                '模拟浏览器事件触发hash - add': 1
            });
        });
    });

    it('模拟浏览器事件触发hash - remove', function (done) {
        Hash.set('模拟浏览器事件触发hash - remove', 1);

        Hash.on('模拟浏览器事件触发hash - remove', function (data) {
            expect(data.type).toBe('removed');
            expect(data.newValue).toBeUndefined();
            expect(data.oldValue).toBe('1');
            done();
        });

        // 模拟浏览器后退
        setTimeout(function () {
            location.hash = '';
        });
    });

    it('模拟浏览器事件触发hash - modified', function (done) {
        // 模拟浏览器后退
        setTimeout(function () {
            Hash.set('模拟浏览器事件触发hash - modified', 1);

            Hash.on('模拟浏览器事件触发hash - modified', function (data) {
                expect(data.type).toBe('modified');
                expect(data.newValue).toBe('2');
                expect(data.oldValue).toBe('1');
                done();
            });

            location.hash = Hash.stringify({
                '模拟浏览器事件触发hash - modified': 2
            });
        }, 500);
    });

    it('set(key, value, true)', function (done) {
        var flag = 0;

        Hash.on('设置时忽略事件', function () {
            flag += 1;
        });

        Hash.one('设置时忽略事件', function () {
            flag += 1;
        });

        setTimeout(function () {
            Hash.set('设置时忽略事件', 1, true);
            Hash.set('设置时忽略事件', 2);
            Hash.set('设置时忽略事件', 3, true);
        }, 200);

        setTimeout(function () {
            expect(flag).toBe(2);
            done();
        }, 500);
    });

    it('remove(key, true)', function (done) {
        var flag = 0;

        Hash.on('设置时忽略事件', function () {
            flag += 1;
        });

        Hash.one('设置时忽略事件', function () {
            flag += 1;
        });

        setTimeout(function () {
            Hash.remove('设置时忽略事件', true);
        }, 200);

        setTimeout(function () {
            expect(flag).toBe(0);
            done();
        }, 500);
    });
});
