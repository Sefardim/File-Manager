import { homedir } from 'node:os';
import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import { errorInputMessage, validateInputValue} from './modules/operations.fail.mjs';


const fileManager = async () => {
    const listOfArgv = process.argv.slice(2);
    const userName = listOfArgv
        .find(item => item.startsWith('--username'))
        ?.split('=')[1]
        || 'User unknown';

    const userGreeting = `Welcome to the File Manager, ${userName}!`;

    let userPath = homedir();
    process.chdir(userPath);
    const currentPath = `You are currently in ${userPath}`;
    const farewellToTheUser = `Thank you for using File Manager, ${userName}, goodbye!`;

    const rl = readline.createInterface({ input, output });
    rl.write(`${userGreeting}\n`);
    rl.write(`${currentPath}\n`);

    rl.on('line', async (input) => {
        userPath = process.cwd();
        const isInputValid = await validateInputValue(input.trim(), userPath);

        if (isInputValid) {
            console.log(errorInputMessage);
        }
    });

    rl.on('close', () => {
        process.stdout.write(farewellToTheUser);
    });
};

fileManager();