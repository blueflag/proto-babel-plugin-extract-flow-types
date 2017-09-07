//@flow
import test from 'ava';
const proxyquire = require('proxyquire').noCallThru();

import {spy} from 'sinon';

const copySync = spy();

const BabelPluginExtractFlowTypes = proxyquire('./index', {
    'fs-extra': {copySync}
}).default;

const FAKE_PATH = {
    hub: {
        file: {
            opts: {
                filename: 'src/foo.js'
            }
        }
    }
};

function getState(comment: ?Object): Object {
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

test.beforeEach(() => {
    spy(console, 'log');
    spy(console, 'error');
    copySync.reset();
});
test.afterEach(() => {
    console.log.restore();
    console.error.restore();
});

test('BabelPluginExtractFlowTypes should return the right object shape', (tt: Object) => {
    tt.is(typeof BabelPluginExtractFlowTypes, 'function');
    tt.is(typeof BabelPluginExtractFlowTypes(), 'object');
    tt.is(typeof BabelPluginExtractFlowTypes().visitor, 'object');
    tt.is(typeof BabelPluginExtractFlowTypes().visitor.Program, 'object');
    tt.is(typeof BabelPluginExtractFlowTypes().visitor.Program.enter, 'function');
});


test('Program.enter will do do nothing if there is no flow pragma', (tt: Object) => {
    const {enter} = BabelPluginExtractFlowTypes().visitor.Program;
    enter(FAKE_PATH, getState());
    tt.is(console.log.callCount, 0);
});

test('Program.enter call copySync with from and to locations', (tt: Object) => {
    const {enter} = BabelPluginExtractFlowTypes().visitor.Program;
    enter(FAKE_PATH, getState({value: '@flow'}));
    tt.is(console.log.callCount, 1);
    tt.is(copySync.callCount, 1);
    tt.true(copySync.calledWith('src/foo.js', 'bar/foo.js.flow'));
});
