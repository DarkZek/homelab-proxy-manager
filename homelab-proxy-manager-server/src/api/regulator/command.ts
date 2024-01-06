import fs from 'fs';

export async function regulatorCommand(name: string): Promise<string> {
    // Remove old command
    try { 
        fs.unlinkSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`);
    } catch (e) { }

    // Create a file flag to run the command
    fs.closeSync(fs.openSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`, 'w'));

    // Wait for the command to run
    for (let i = 0; i < 25; i++) {
        
        await new Promise(resolve => setTimeout(resolve, 50));

        if (fs.readFileSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`, 'utf8') !== '') {
        // Data has been filled in
        break;
        }

        if (i === 49) {
            // Timeout
            throw new Error(`Timeout running ${name}. Ensure daemon is running`);
        }
    }

    const contents = fs.readFileSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`, 'utf8')

    fs.unlinkSync(`${process.env.REGULATOR_COMMANDS_DIR}${name}`);

    return contents;
}