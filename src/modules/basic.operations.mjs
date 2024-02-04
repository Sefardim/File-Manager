import { unlink, rename as fsRename, writeFile } from 'node:fs/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';

import { isFileExist, operationFailed } from './operations.fail.mjs';

export const removeFile = async (pathToFile, userPath) => {
    const result = path.join(userPath, pathToFile);

    try {
        const isFile = await isFileExist(result);

        if (!isFile) {
            console.log(operationFailed);
        }

        await unlink(pathToFile);

    } catch (error) {
        console.log(operationFailed);
    }
}

export const readFile = async (pathToFile, userPath) => {
    try {
        const result = path.join(userPath, pathToFile);
        await createReadStream(result, 'utf8').pipe(process.stdout);

    } catch (error) {
        console.log(operationFailed);
    }
}

export const createFile = async (pathToFile, userPath) => {
    try {
        const result = path.join(userPath, pathToFile);
        await writeFile(result, '', { flag: 'wx' });
    } catch (e) {
        console.log(operationFailed);
    }
}

export const renameFile = async (pathToFile, newFilePath, userPath) => {
    try {
        const pathToOldFile = path.join(userPath, pathToFile);
        const pathToNewFile = path.join(userPath, newFilePath);
        await fsRename(pathToOldFile, pathToNewFile);

    } catch (error) {
        console.log(operationFailed);
    }
}

export const copyFile = async (pathToFile, newFilePath, userPath) => {
    try {
        const pathToOldFile = path.join(userPath, pathToFile);
        const pathToNewFile = path.join(userPath, newFilePath);

        createReadStream(pathToOldFile).pipe(createWriteStream(pathToNewFile));

    } catch (error) {
        console.log(operationFailed);
    }
}

export const moveFile = async (pathToFile, newFilePath, userPath) => {
    try {
        const pathToOldFile = path.join(userPath, pathToFile);
        const pathToNewFile = path.join(userPath, newFilePath);
        const readStream = createReadStream(pathToOldFile);
        const writeStream = createWriteStream(pathToNewFile);

        readStream.on('close', function () {
            unlink(pathToOldFile);
        });

        readStream.pipe(writeStream);
    } catch (error) {
        console.log(operationFailed);
    }
}