import { arch, EOL, cpus, homedir, userInfo } from 'os';
import { platform } from 'node:process';

export const getOperatingSystemInfo = async (command) => {
    switch (command) {
        case '--EOL': {
            console.log('default system End-Of-Line: ', JSON.stringify(EOL));
            break;
        }
        case '--cpus': {
            const computerCPU = cpus();
            const isApplePlatform = platform === 'darwin';
            console.log('amount CPUs:', computerCPU.length);
            console.table(computerCPU.map(({ model, speed }) => ({
                model,
                speed: isApplePlatform ? `${speed / 10}GHz` : `${speed / 1000}GHz`
            })));
            break;
        }
        case '--homedir': {
            console.log('homedir: ', homedir());
            break;
        }
        case '--username': {
            console.log('User name:', userInfo().username);
            break;
        }
        case '--architecture': {
            console.log('CPU architecture:', arch());
            break;
        }
    }

}