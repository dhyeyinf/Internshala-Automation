const puppeteer = require('puppeteer');

async function runBrave() {
    try {
        const browser = await puppeteer.launch({
            executablePath: 'path/to/brave-browser',
            headless: false, 
        });

        return browser;
    } catch (error) {
        console.error("An error occurred while launching Brave browser:", error);
        return null;
    }
}

module.exports = runBrave;
