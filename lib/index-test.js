'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _ava = require('ava');

var _ava2 = _interopRequireDefault(_ava);

var _sinon = require('sinon');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var proxyquire = require('proxyquire').noCallThru();

var copySync = (0, _sinon.spy)();

var BabelPluginExtractFlowTypes = proxyquire('./index', {
    'fs-extra': { copySync: copySync }
}).default;

var FAKE_PATH = {
    hub: {
        file: {
            opts: {
                filename: 'src/foo.js'
            }
        }
    }
};

function getState(comment) {
    return {
        file: {
            ast: {
                comments: [comment]
            }
        },
        opts: {
            outDir: 'bar'
        }
    };
}

_ava2.default.beforeEach(function () {
    (0, _sinon.spy)(console, 'log');
    (0, _sinon.spy)(console, 'error');
    copySync.reset();
});
_ava2.default.afterEach(function () {
    console.log.restore();
    console.error.restore();
});

(0, _ava2.default)('BabelPluginExtractFlowTypes should return the right object shape', function (tt) {
    tt.is(typeof BabelPluginExtractFlowTypes === 'undefined' ? 'undefined' : _typeof(BabelPluginExtractFlowTypes), 'function');
    tt.is(_typeof(BabelPluginExtractFlowTypes()), 'object');
    tt.is(_typeof(BabelPluginExtractFlowTypes().visitor), 'object');
    tt.is(_typeof(BabelPluginExtractFlowTypes().visitor.Program), 'object');
    tt.is(_typeof(BabelPluginExtractFlowTypes().visitor.Program.enter), 'function');
});

(0, _ava2.default)('Program.enter will do do nothing if there is no flow pragma', function (tt) {
    var enter = BabelPluginExtractFlowTypes().visitor.Program.enter;

    enter(FAKE_PATH, getState());
    tt.is(console.log.callCount, 0);
});

(0, _ava2.default)('Program.enter call copySync with from and to locations', function (tt) {
    var enter = BabelPluginExtractFlowTypes().visitor.Program.enter;

    enter(FAKE_PATH, getState({ value: '@flow' }));
    tt.is(console.log.callCount, 1);
    tt.is(copySync.callCount, 1);
    tt.true(copySync.calledWith('src/foo.js', 'bar/foo.js.flow'));
});