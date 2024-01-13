import fs from 'fs';

const REGULATOR_MAX_ATTEMPTS = 25;

export async function regulatorCommand(name: string): Promise<string> {
    // Remove old command
    try { 
        fs.unlinkSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`);
    } catch (e) { }

    // Create a file flag to run the command
    fs.closeSync(fs.openSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`, 'w'));

    // Wait for the command to run
    for (let i = 0; i < REGULATOR_MAX_ATTEMPTS; i++) {
        
        await new Promise(resolve => setTimeout(resolve, 50));

        if (fs.readFileSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`, 'utf8').length !== 0) {
            // Data has been filled in
            break;
        }

        if (i === REGULATOR_MAX_ATTEMPTS - 1) {
            // Timeout
            throw new Error(`Timeout running ${name}. Ensure daemon is running`);
        }
    }

    const contents = fs.readFileSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`, 'utf8')

    fs.unlinkSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`);

    if (contents.startsWith('Error:')) {
        throw new Error(contents)
    }

    return contents;
}