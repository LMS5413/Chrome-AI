# Chrome AI - A website that utilizes Browser AI

# This Chrome-AI project has been discontinued. Google removed the window.ai API from the Dev and Canary versions of the browser.

# The main reason for its discontinuation is that the experimental API did not meet long-term stability and security requirements. In addition, Google decided to focus its efforts on more standardized and widely adopted AI integration approaches, ensuring better compatibility across platforms and avoiding fragmentation in the developer ecosystem


This project uses future methods that leverage upcoming features and APIs that Google Chrome will be adding for AI tools.

### Technologies
<div>
    <p><a href="https://angular.dev/">Angular JS</a></p>
    <p><a href="https://tailwindcss.com/">Tailwind CSS</a></p>
</div


## Getting Started

To start using the website's AI-powered features, follow these steps:

1. Install Google Chrome [Dev](https://www.google.com/intl/en-US/chrome/dev/) or [Canary](https://www.google.com/intl/en-US/chrome/canary)

2. Enter the flag `chrome://flags/#prompt-api-for-gemini-nano` and select `Enabled`

3. Enter the flag `chrome://flags/#optimization-guide-on-device-model` and select `Enabled BypassPrefRequirement`

4. Enter the flag `chrome://flags/#text-safety-classifier` and disable this option

5. Enter the [website](https://chrome-ai-eight.vercel.app/) and enjoy!


# Images from website

![img](https://i.imgur.com/ES7eWBF.png)
![img](https://i.imgur.com/Gs9u1RY.png)

### How to run locally

To run the website locally, follow these steps:

1. Clone the repository to your local machine:
    ```
    git clone https://github.com/LMS5413/Chrome-AI.git
    ```

2. Navigate to the project directory:
    ```
    cd Chrome-AI
    ```

3. Install the required dependencies:
    ```
    npm i
    ```

4. Start the local development server:
    ```
    ng serve
    ```

5. Open your web browser and visit `http://localhost:4200` to access the website.
