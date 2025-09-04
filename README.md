# Aether Interface

This is a Next.js application built with Firebase Studio, featuring a generative AI interface powered by Google's Gemini models through Genkit.

## Getting Started

To get the application running on your local machine, follow these steps.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 2. Installation

First, install the necessary npm packages:

```bash
npm install
```

### 3. Set Up Environment Variables

You'll need a Gemini API key to use the AI features.

1.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the root of the project, you will find a `.env` file.
3.  Open the `.env` file and add your API key:

    ```
    GEMINI_API_KEY=<your-api-key-here>
    ```

    Replace `<your-api-key-here>` with the key you obtained from Google AI Studio.

### 4. Running the Development Servers

This project requires two separate processes to be running simultaneously:

1.  **Next.js Frontend**: This runs the user interface.
2.  **Genkit Flows**: This runs the backend AI logic that connects to the Gemini API.

To run both, open two separate terminal windows.

**In your first terminal, run the Next.js app:**

```bash
npm run dev
```

The application will be available at [http://localhost:9002](http://localhost:9002).

**In your second terminal, run the Genkit flows:**

```bash
npm run genkit:dev
```

This will start the Genkit development server, which your Next.js application will call to perform AI tasks. You can view the Genkit developer UI at [http://localhost:4000](http://localhost:4000) to inspect your flows.

Now you can open your browser to [http://localhost:9002](http://localhost:9002) and start using the Aether Interface!