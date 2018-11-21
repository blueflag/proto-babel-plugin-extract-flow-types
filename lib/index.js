'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = BabelPluginExtractFlowTypes;

var _fsExtra = require('fs-extra');

function BabelPluginExtractFlowTypes() {
    return {
        visitor: {
            Program: {
                enter: function enter(path, state) {
                    var firstComment = state.file.ast.comments[0] || { value: '' };
                    if (firstComment.value.indexOf('@flow') !== -1) {
                        var filename = path.hub.file.opts.filename;
                        var root = path.hub.file.opts.root;
                        var outDir = state.opts.outDir;
                        var srcDir = state.opts.srcDir;


                        var dest = filename.replace(root, '').replace(srcDir, outDir);
                        var outFolder = root + '/' + dest + '.flow';

                        try {
                            (0, _fsExtra.copySync)(filename, outFolder);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
        }
    };
}