import { createHash } from 'node:crypto';
import { readFile } from 'fs/promises';
import { operationFailed } from './operations.fail.mjs';

export const calculateHash = async (path) => {
    try {
        const fileContent = await readFile(path);
        const hash = createHash('sha256').update(fileContent).digest('hex');
        console.log(hash);
    } catch (error) {
        console.log(operationFailed);
    }
}