import path from 'node:path';
import { stat } from 'node:fs/promises';
import { listOfCurrentDirectory, navigation } from './navigation.mjs';
import { copyFile, createFile, moveFile, readFile, removeFile, renameFile } from './basic.operations.mjs';
import { getOperatingSystemInfo } from './operating.system.mjs';
import { calculateHash } from './hash.calculation.mjs';
import { useBrotliAlgorithm } from './zlib.operation.mjs';

export const errorInputMessage = 'Invalid input';
export const operationFailed = 'Operation failed\n';
const osCommands = ['--EOL', '--cpus', '--homedir', '--username', '--architecture'];

export const writeCurrentPathToConsole = (userPath) => {
    const currentPath = `You are currently in ${userPath}`;
    console.log(`${currentPath}\n`);
};


export const isFileExist = async (path) => {
    try {
        await stat(path);
        return true;
    } catch (error) {
        return false;
    }
};

export const validatePath = async (pathToFile, userPath) => {
    let isExist;
    const result = path.join(userPath, pathToFile);

    try {
        isExist = await isFileExist(result);
    } catch (e) {
        console.log('Operation failed');
    }

    return isExist;
};


const validateCommand = async (arrayWithCommand, userPath) => {
    const command = arrayWithCommand[0];

    switch (command) {
        case 'rm': {
            if (arrayWithCommand.length !== 2) {
                return true;
            }

            const isPathValid = await validatePath(arrayWithCommand[1], userPath);

            if (isPathValid) {
                await removeFile(arrayWithCommand[1], userPath);
                writeCurrentPathToConsole(userPath);
                return false;
            }
        }
        case 'ls': {
            await listOfCurrentDirectory(userPath);
            break;
        }
        case 'up': {
            if (arrayWithCommand.length > 1) {
                return true;
            }

            navigation('..', userPath);
            return false;
        }
        case 'cat': {
            if (arrayWithCommand.length === 2) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await readFile(arrayWithCommand[1], userPath);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }
            }
            return true;
        }
        case 'cd': {
            if (arrayWithCommand.length === 2) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    navigation(arrayWithCommand[1], userPath);
                    return false;
                }
            }
            return true;
        }
        case 'add': {
            if (arrayWithCommand.length === 2) {
                await createFile(arrayWithCommand[1], userPath);
                writeCurrentPathToConsole(userPath);
                return false;
            }
            return true;
        }
        case 'cp': {
            if (arrayWithCommand.length === 3) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await copyFile(arrayWithCommand[1], arrayWithCommand[2], userPath);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }
            }
            return true;
        }
        case 'mv': {
            if (arrayWithCommand.length === 3) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await moveFile(arrayWithCommand[1], arrayWithCommand[2], userPath);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }
            }
            return true;
        }
        case 'rn': {
            if (arrayWithCommand.length === 3) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await renameFile(arrayWithCommand[1], arrayWithCommand[2], userPath);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }
            }
            return true;
        }
        case 'os': {
            if (arrayWithCommand.length === 2 && osCommands.includes(arrayWithCommand[1])) {
                await getOperatingSystemInfo(arrayWithCommand[1]);
                writeCurrentPathToConsole(userPath);
                return false;
            }
            return true;
        }
        case 'hash': {
            if (arrayWithCommand.length === 2) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await calculateHash(arrayWithCommand[1], userPath);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }

            }
            return true;
        }
        case 'compress': {
            if (arrayWithCommand.length === 3) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await useBrotliAlgorithm(arrayWithCommand[1], arrayWithCommand[2], userPath, command);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }
            }
            return true;
        }
        case 'decompress': {
            if (arrayWithCommand.length === 3) {
                const isPathValid = await validatePath(arrayWithCommand[1], userPath);

                if (isPathValid) {
                    await useBrotliAlgorithm(arrayWithCommand[1], arrayWithCommand[2], userPath, command);
                    writeCurrentPathToConsole(userPath);
                    return false;
                }
            }
            return true;
        }
        case '.exit': {
            const listOfArgv = process.argv.slice(2);
            const userName = listOfArgv
                .find(item => item.startsWith('--username'))
                ?.split('=')[1]
                || 'User unknown';
            const farewellToTheUser = `Thank you for using File Manager, ${userName}, goodbye!`;
            console.log(`${farewellToTheUser}\n`);
            process.exit();
            break;
        }

        default: return true;
    }
};


export const validateInputValue = async (value, userPath) => {
    if (!value) { return true; }

    const commandDefinition = value.split(' ');

    return await validateCommand(commandDefinition, userPath);
};