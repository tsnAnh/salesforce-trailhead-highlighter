# Salesforce Trailhead Highlighter Chrome Extension

This Chrome extension automatically highlights important sentences in Salesforce Trailhead course content using LLM. The extension extracts key concepts, important instructions, definitions, and best practices from the course text and returns them in a structured JSON format.

## Features

- Highlights key definitions, concepts, and important steps in Trailhead courses.
- Powered by LLM for natural language processing.
- Easy to configure with your model choice and API key.

## Installation and Setup

1. Clone the repository to your local machine:
    ```bash
    git clone https://github.com/your-username/salesforce-trailhead-highlighter.git
    ```

2. Navigate to the project directory:
    ```bash
    cd salesforce-trailhead-highlighter
    ```

3. Install the required dependencies by running:
    ```bash
    npm install
    ```

4. Open the Chrome browser and go to `chrome://extensions/`.

5. Enable **Developer mode** by toggling the switch in the top-right corner.

6. Click **Load unpacked** and select the directory of the cloned repository.

## Configuration

To use Groq’s AI service, you need to configure the model choice and API key by replacing placeholders in the code.

### Replacing `YOUR_MODEL_CHOICE` and `YOUR_API_KEY`

1. Open the `agent.js` file located in the `src` folder.

2. Find the following lines:
    ```js
    const agentModel = new ChatGroq({
      temperature: 0,
      model: 'YOUR_MODEL_CHOICE',
      apiKey: 'YOUR_API_KEY'
    });
    ```

3. Replace `'YOUR_MODEL_CHOICE'` with the correct model identifier provided by Groq. For example:
    ```js
    const agentModel = new ChatGroq({
      temperature: 0,
      model: 'groq-model-v1',
      apiKey: 'YOUR_API_KEY'
    });
    ```

4. Replace `'YOUR_API_KEY'` with your actual Groq API key. For example:
    ```js
    const agentModel = new ChatGroq({
      temperature: 0,
      model: 'groq-model-v1',
      apiKey: '12345abcde'
    });
    ```

5. Save the file.

### Example of the Updated Code

```js
const agentModel = new ChatGroq({
  temperature: 0,
  model: 'groq-model-v1',
  apiKey: '12345abcde'
});
```

## Building the Extension

After configuring the `agent.js` file, you need to build the extension before loading it into Chrome.

1. Run the following command to bundle the JavaScript files:
    ```bash
    npm run build
    ```

2. The built files will be placed in a `build` folder.

3. Follow the same process as in the **Installation** section, using the `build` folder as the unpacked extension directory.

## Usage

1. Navigate to a Salesforce Trailhead course page.

2. Click the extension icon in the Chrome toolbar to activate it.

3. The extension will automatically analyze the content and highlight important sentences based on key definitions, instructions, and best practices.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an issue for any bug fixes or feature suggestions.

## License

This project is licensed under the MIT License.
