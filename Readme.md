# Ripple ChatGPT template

> GPT chat using [Ripple framework](https://github.com/trueadm/ripple) on the frontend and **Node.js** on the backend.

## Getting Started

1. **Clone the repository**
   ```sh
   git clone https://github.com/MarkKhramko/ripple-chatgpt-template.git
   
   cd ripple-chatgpt-template
   ```

2. **Install dependencies for all packages**
   
   ```sh
   npm install
   ```


3. **Set up your OpenAI API key**
   
   Copy `.env.example` to `.env`
   ```sh
   cp .env.example .env
   ```
   
   Add your OpenAI API key:
   ```
   OPENAI_API_KEY=your-key-here
   ```


4. **Run the development servers**
   
   ```sh
   npm run dev
   ```
   This will start both the frontend and backend servers concurrently.


5. **Open the app**
   
   Visit [http://localhost:3000](http://localhost:3000) in your browser.


## Project Structure

- `packages/frontend` — Ripple frontend
- `packages/backend` — Node.js backend with OpenAI ChatGPT streaming

## Customization

- Modify frontend UI in `packages/frontend`
- Change backend logic or endpoints in `packages/backend`

## License
[MIT](LICENSE)

## Copyright
Copyright (c) 2025 [Dominic Gannawa](https://github.com/trueadm) - [Ripple framework](https://github.com/trueadm/ripple) 
Copyright (c) 2025 [Mark Khramko](https://github.com/MarkKhramko) - Application code
