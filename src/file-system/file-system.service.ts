/**
 * Data Model Interfaces
 * Libraries
 */
const fs = require('fs');

/**
 * Call Repository
 */


/**
 * Service Methods
 */
export const writeToJsonFile = async (content: {}, filename: string) => {
    try {
        const jsonString = JSON.stringify(content);
        fs.writeFile(filename, jsonString, 'utf8', (err: any) => {
            if (err) throw err;
            console.log('Successfully captured list of scholars to json file.');
        });
        return true;
    } catch (error) {
        console.log(`writeToJsonFile ${error}`)
        return false;
    }

}