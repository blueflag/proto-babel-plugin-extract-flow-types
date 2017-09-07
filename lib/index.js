'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = BabelPluginExtractFlowTypes;

var _fsExtra = require('fs-extra');

function getPath(file) {
    var parts = file.trim().split('/');

    return {
        srcDir: parts[0],
        path: parts.slice(1).join('/'),
        filename: parts[parts.length - 1]
    };
}
function BabelPluginExtractFlowTypes() {
    return {
        visitor: {
            Program: {
                enter: function enter(path, state) {
                    var firstComment = state.file.ast.comments[0] || { value: '' };
                    if (firstComment.value.indexOf('@flow') !== -1) {
                        var filename = path.hub.file.opts.filename;
                        var outDir = state.opts.outDir;

                        var pathData = getPath(filename);

                        var outFolder = outDir + '/' + pathData.path + '.flow';

                        try {
                            (0, _fsExtra.copySync)(filename, outFolder);
                            console.log(filename, '->', outFolder);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
        }
    };
}