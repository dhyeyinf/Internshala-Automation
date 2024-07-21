const puppeteer = require('puppeteer');

async function loginAndNavigate(credentials, stipend, profileLink, textToFill, count) {
    try {
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--start-maximized']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1530, height: 768 }); // Set initial viewport to full HD resolution

        await page.goto('https://internshala.com', { waitUntil: 'networkidle2' });

        // Click the login button to open the modal
        await page.click('button[data-toggle="modal"][data-target="#login-modal"]');
        await page.waitForSelector('#login-modal'); // Ensure the modal has appeared

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

        // Increase the timeout duration
        await page.waitForSelector('#internship_list_container_1', { timeout: 60000 });

        // Apply for the specified number of internships
        for (let i = 0; i < count; i++) {
            const internshipSelector = `#internship_list_container_1 .individual_internship.easy_apply:nth-child(${i + 1})`;
            const internship = await page.$(internshipSelector);

            if (internship) {
                await Promise.all([
                    internship.click(),
                    page.waitForSelector('.continue_container', { timeout: 60000 })
                ]);

                console.log(`Opened the internship details box for internship ${i + 1}`);

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

                // Wait for the message box to appear
                await page.waitForSelector('.message_container .back-cta', { timeout: 60000 });
                console.log("Application submitted successfully and message box appeared.");

                // Refresh the page to clear the message box
                await page.reload({ waitUntil: 'networkidle2' });
                console.log("Page refreshed to clear the message box.");

                // Wait for the internship list container to reload
                await page.waitForSelector('#internship_list_container_1', { timeout: 60000 });
            } else {
                console.log(`No more internships found to apply for. Applied for ${i} internships.`);
                break;
            }
        }

        await browser.close(); // Close the browser after the script finishes
    } catch (error) {
        console.error("An error occurred during login and navigation:", error);
    }
}

const credentials = {
    email: 'your mail',
    password: 'mail id password'
};

const stipend = 2000; // Specify the desired stipend amount here
const profileLink = 'computer-science'; // Specify the desired profile link here
const textToFill = "I believe I would be a good fit for this internship because of my strong skills in web development, my experience with JavaScript frameworks like React, and my ability to work well in a team.";
const count = 3; // Number of internships to apply for

loginAndNavigate(credentials, stipend,profileLink,textToFill,count);
