const puppeteer = require('puppeteer');
const runBrave = require('./brave');

async function loginAndNavigate(credentials, stipend, profileLink, applicationText) {
    try {
        const browser = await runBrave();
        if (!browser) {
            console.error("Failed to launch Brave browser.");
            return;
        }

        const page = await browser.newPage();
        await page.setViewport({ width: 1530, height: 1080 });
        await page.goto('https://internshala.com', { waitUntil: 'networkidle2' });

        await page.click('button[data-toggle="modal"][data-target="#login-modal"]');
        await page.waitForSelector('#login-modal'); // Ensure the modal has appeared

        await page.type('#modal_email', credentials.email);
        await page.type('#modal_password', credentials.password);
        await page.click('#modal_login_submit');
        await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });

        console.log("Logged in successfully");

        const stipendURL = `https://internshala.com/internships/work-from-home-${profileLink}-internships/stipend-${stipend}/`;

        await page.goto(stipendURL, { waitUntil: 'networkidle2' });

        console.log(`Navigated to internships page with profile "${profileLink}" and stipend ${stipend}`);

        await page.waitForSelector('#internship_list_container_1', { timeout: 60000 });

        const firstInternshipLink = await page.$eval(
            '#internship_list_container_1 .individual_internship',
            element => element.getAttribute('data-href')
        );

        if (firstInternshipLink) {
            const internshipDetailsURL = `https://internshala.com${firstInternshipLink}`;

            await page.goto(internshipDetailsURL, { waitUntil: 'networkidle2' });
            console.log("Navigated to the first internship details page");

            const currentURL = page.url();
            const applicationFormURL = currentURL.replace('internship/details', 'application/form');

            await page.goto(applicationFormURL, { waitUntil: 'networkidle2' });
            console.log("Navigated to the application form page");

            const applicationTextAreaSelector = '.ql-editor[data-placeholder*="What excites you about this internship?"]';
            await page.waitForSelector(applicationTextAreaSelector, { timeout: 60000 });
            await page.evaluate((selector, text) => {
                const editor = document.querySelector(selector);
                editor.innerHTML = `<p>${text}</p>`;
            }, applicationTextAreaSelector, applicationText);
            console.log("Filled out the application text area");

            const submitButtonSelector = '.submit_button_container input[type="submit"]';
            await page.waitForSelector(submitButtonSelector, { timeout: 60000 });
            await page.click(submitButtonSelector);
            console.log("Clicked the submit button");

            await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 });
            console.log("Form submitted successfully");

        } else {
            console.log("No internships found.");
        }

        await browser.close();
    } catch (error) {
        console.error("An error occurred during login and navigation:", error);
    }
}

const credentials = {
    email: 'your_mail_id',
    password: 'Internshala_login_password'
};
// Filter Section and automation writing.
const stipend = 4000; 
const profileLink = 'web-development'; 
const applicationText = "I am passionate about web development and have hands-on experience with various technologies such as HTML, CSS, JavaScript, and React. My past projects demonstrate my ability to create responsive and dynamic web applications. I am excited about this internship because it offers an opportunity to further develop my skills and contribute to real-world projects. I believe my technical skills and eagerness to learn make me a great fit for this role.";

loginAndNavigate(credentials, stipend, profileLink, applicationText);
