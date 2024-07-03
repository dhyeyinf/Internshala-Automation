const puppeteer = require('puppeteer');

async function loginAndNavigate(credentials, stipend, profileLink, textToFill, count) {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1530, height: 768 });

        await page.goto('https://internshala.com', { waitUntil: 'networkidle2' });

        // Click the login button to open the modal
        await page.click('button[data-toggle="modal"][data-target="#login-modal"]');
        await page.waitForSelector('#login-modal');

        // Fill in the login credentials
        await page.type('#modal_email', credentials.email);
        await page.type('#modal_password', credentials.password);
        await page.click('#modal_login_submit');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

        console.log("Logged in successfully");

        // Construct the URL based on the stipend amount and profile link
        const stipendURL = `https://internshala.com/internships/work-from-home-${profileLink}-internships/stipend-${stipend}/`;

        // Navigate to the filtered internships page
        await page.goto(stipendURL, { waitUntil: 'networkidle2' });

        console.log(`Navigated to internships page with profile "${profileLink}" and stipend ${stipend}`);

        await page.waitForSelector('#internship_list_container_1', { timeout: 60000 });

        for (let i = 0; i < count; i++) {
            // Get the internship element and click on it to open the box
            const internship = await page.$(`#internship_list_container_1 .individual_internship.easy_apply:nth-child(${i + 1})`);
            if (internship) {
                await Promise.all([
                    internship.click(),
                    page.waitForSelector('.continue_container', { timeout: 60000 })
                ]);

                console.log(`Opened internship details box ${i + 1}`);

                // Click the "Continue" button inside the box
                await page.click('.continue_container #continue_button');
                console.log("Clicked the Continue button");

                // Find the textarea element and fill in the text about why you would be a good fit
                const textareaSelector = '#cover_letter_holder .ql-editor';
                const textarea = await page.$(textareaSelector);

                if (textarea) {
                    await textarea.click({ clickCount: 3 });
                    await textarea.press('Backspace');
                    await page.type(textareaSelector, textToFill);
                    console.log("Filled in the text about why you would be a good fit.");
                } else {
                    console.log("Textarea element not found.");
                }

                // Click the submit button
                const submitButtonSelector = '.submit_button_container #submit';
                await page.waitForSelector(submitButtonSelector);
                await page.click(submitButtonSelector);
                console.log("Clicked the submit button.");

                // Wait for navigation to complete
                try {
                    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
                    console.log("Application submitted successfully.");
                } catch (err) {
                    console.log("Navigation timeout after submitting the application, but continuing the script.");
                }

                // Wait for the "Continue applying" button and click it
                try {
                    await page.waitForSelector('#backToInternshipsCta', { timeout: 60000 });
                    await page.click('#backToInternshipsCta');
                    console.log("Clicked the Continue applying button.");
                } catch (err) {
                    console.log("Continue applying button not found, refreshing the page.");
                    await page.reload({ waitUntil: ['networkidle2', 'domcontentloaded'] });
                }

                // Ensure a short delay after each iteration
                await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for 2 seconds
            } else {
                console.log(`No internship found for list container ${i + 1}.`);
                break;
            }
        }

        await browser.close();
        console.log("Browser closed.");
    } catch (error) {
        console.error("An error occurred during login and navigation:", error);
    }
}

const credentials = {
    email: 'nexoj24448@gawte.com',
    password: 'Automationtest'
};

const stipend = 2000; // Specify the desired stipend amount here
const profileLink = 'accounts'; // Specify the desired profile link here
const textToFill = "I believe I would be a good fit for this internship because of my strong skills in web development, my experience with JavaScript frameworks like React, and my ability to work well in a team.";
const count = 3; // Specify the number of internships to apply for here

loginAndNavigate(credentials, stipend, profileLink, textToFill, count);
