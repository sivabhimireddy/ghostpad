# Ink

Ink is a VS Code extension that brings Claude 3 and GPT-4 directly into your editor via the [OpenRouter](https://openrouter.ai/) API.

## Features

- **Chat Sidebar** – open the Ink view from the activity bar to chat with a model.
- **Explain Selected Code** – ask the LLM to explain the current selection.
- **Edit with Instruction** – provide an instruction and let the model rewrite selected code.

## Setup

1. Install dependencies and compile:

```bash
npm install
npm run compile
```

2. Configure your OpenRouter API key in the settings: `ink.openRouterKey`. You can also choose the model with `ink.model`.

3. Press `F5` to launch a new Extension Development Host window.

## How to Run

1. Open this folder in VS Code.
2. Follow the Setup steps above if you haven't already.
3. Press `F5` (or choose **Run > Start Debugging**) to launch a new Extension Development Host.
4. Use the command palette to try the Ink commands in the development window.

## Development

The extension is written in TypeScript. The sidebar UI uses React and Tailwind CSS served via CDN so no additional build step is needed for styling.

Source code lives in `src/` and static assets in `media/`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Running Tests

1. Install dependencies:
   ```sh
   npm install
   ```
2. Run the tests:
   ```sh
   npm test
   ```
