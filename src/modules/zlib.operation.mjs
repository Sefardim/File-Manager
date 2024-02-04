import { createBrotliDecompress, createBrotliCompress } from 'node:zlib';
import { createReadStream, createWriteStream } from 'node:fs';
import path from 'node:path';

import { operationFailed } from './operations.fail.mjs';

export const useBrotliAlgorithm = (pathToFile, newFilePath, userPath, command) => {
    try {
        const pathToOldFile = path.join(userPath, pathToFile);
        const pathToNewFile = path.join(userPath, newFilePath);

        const readStream = createReadStream(pathToOldFile);
        const writeStream = createWriteStream(pathToNewFile);

        const brotli = command === 'compress' ? createBrotliCompress() : createBrotliDecompress();

        readStream.pipe(brotli).pipe(writeStream);
    } catch (e) {
        console.log(operationFailed);
    }
};
