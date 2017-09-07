import React from 'react';
import test from 'ava';
import protobabelpluginextractflowtypes from './index';

test('protobabelpluginextractflowtypes does the right thing', tt => {
    tt.is(protobabelpluginextractflowtypes(123), 246, 'protobabelpluginextractflowtypes should add 123');
    tt.is(protobabelpluginextractflowtypes(), 123, 'protobabelpluginextractflowtypes should return 123 when given no arguments');
});
