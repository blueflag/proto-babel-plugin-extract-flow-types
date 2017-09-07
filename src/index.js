// @flow
import {copySync} from 'fs-extra';
// import {writeFile} from 'fs'
// import findFile from './find-file'
// import mkdirp from './mkdir'
// import getPath from './path'

// const filesWritten = [];
//
function getPath(file: string): Object {
    const parts = file.trim().split('/');

    return {
        srcDir: parts[0],
        path: parts.slice(1).join('/'),
        filename: parts[parts.length - 1]
    };
}

export default function BabelPluginExtractFlowTypes(): Object {
    return {
        visitor: {
            Program: {
                enter(path: Object, state: Object) {
                    const firstComment = state.file.ast.comments[0] || {value: ''};
                    if(firstComment.value.indexOf('@flow') !== -1) {
                        const {filename} = path.hub.file.opts;
                        const {outDir} = state.opts;
                        const pathData = getPath(filename);


                        const outFolder = `${outDir}/${pathData.path}.flow`;

                        try {
                            copySync(filename, outFolder);
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
