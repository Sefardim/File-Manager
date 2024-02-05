import path from 'node:path';
import { readdir } from 'node:fs/promises';

import { operationFailed, writeCurrentPathToConsole } from './operations.fail.mjs';

export const navigation = (currenPath, userPath) => {
    const result = path.join(userPath, currenPath);
    process.chdir(result);
    userPath = process.cwd();
    writeCurrentPathToConsole(userPath);
}

export const listOfCurrentDirectory = async (userPath) => {
    try {
        const filesNamesArray = await readdir(userPath, { withFileTypes: true });
        const folderNames = filesNamesArray
            .filter(fileName => fileName.isDirectory())
            .map(item => {
                return {
                    Name: item.name,
                    Type: 'folder'
                }})
            .sort((a, b) => a - b);
        const filesNames = filesNamesArray
            .filter(fileName => fileName.isFile())
            .map(item => {
                return {
                    Name: item.name,
                    Type: 'file'
                }})
            .sort((a, b) => a - b);
        const result = folderNames.concat(filesNames);
        console.table(result);
        writeCurrentPathToConsole(userPath);

    } catch (error) {
        console.log(operationFailed);
    }
}