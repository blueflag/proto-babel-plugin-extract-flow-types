// @flow
import {copySync} from 'fs-extra';

export default function BabelPluginExtractFlowTypes(): Object {
    return {
        visitor: {
            Program: {
                enter(path: Object, state: Object) {
                    const firstComment = state.file.ast.comments[0] || {value: ''};
                    if(firstComment.value.indexOf('@flow') !== -1) {
                        const {filename} = path.hub.file.opts;
                        const {root} = path.hub.file.opts;
                        const {outDir} = state.opts;
                        const {srcDir} = state.opts;

                        const dest = filename.replace(root, '').replace(srcDir, outDir);
                        const outFolder = `${root}/${dest}.flow`;

                        try {
                            copySync(filename, outFolder);
                        } catch (err) {
                            console.error(err);
                        }
                    }
                }
            }
        }
    };
}
