# Internshala Automation

Automate the application process for internships on Internshala using Puppeteer. This script logs into Internshala, navigates to the filtered internships page based on stipend and profile, applies for a specified number of internships, and fills in the required application details.

## Features

- Automatically logs into Internshala using provided credentials.
- Navigates to internships filtered by stipend and profile.
- Applies for a specified number of internships.
- Fills in the required text in the application form.
- Submits the application and refreshes the page to clear the message box.

## Prerequisites

- Node.js
- Puppeteer

## Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/dhyeyinf/internshala-automation.git
    ```

2. Install the dependencies:
    ```sh
    cd internshala-automation
    npm install
    ```

## Usage

1. Update the `credentials` object in the script with your Internshala email and password.
2. Set the desired stipend amount and profile link.
3. Specify the text to fill in the application form.
4. Run the script:
    ```sh
    node webscrapping.js
    ```

## Configuration

Here's an example configuration within the script:

```javascript
const credentials = {
    email: 'your-email@example.com',
    password: 'your-password'
};

const stipend = 2000; // Specify the desired stipend amount here
const profileLink = 'computer-science'; // Specify the desired profile link here
const textToFill = "I believe I would be a good fit for this internship because of my strong skills in web development, my experience with JavaScript frameworks like React, and my ability to work well in a team.";

loginAndNavigate(credentials, stipend, profileLink, textToFill, 3); // Apply for 3 internships
