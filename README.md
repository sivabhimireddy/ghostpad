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

## Development

The extension is written in TypeScript. The sidebar UI uses React and Tailwind CSS served via CDN so no additional build step is needed for styling.

Source code lives in `src/` and static assets in `media/`.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.
