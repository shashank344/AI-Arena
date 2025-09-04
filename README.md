# AI Arena

AI Arena is a polished, feature-rich interface for interacting with generative AI models. This project was built to provide a seamless and intuitive experience for developers and enthusiasts to experiment with different AI models, fine-tune parameters, and generate high-quality outputs, from text to UI components.

## Getting Started

To get the application running on your local machine, follow these steps.

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (version 20 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### 2. Set Up Environment Variables

You'll need a Gemini API key to use the AI features.

1.  Get your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
2.  In the root of the project, you will find a `.env` file.
3.  Open the `.env` file and add your API key:

    ```
    GEMINI_API_KEY=<your-api-key-here>
    ```

    Replace `<your-api-key-here>` with the key you obtained from Google AI Studio.

### 3. Installation & Running the App

First, install the necessary npm packages:

```bash
npm install
```

This project requires two separate processes to be running simultaneously:

1.  **Next.js Frontend**: This runs the user interface.
2.  **Genkit Flows**: This runs the backend AI logic that connects to the Gemini API.

To run both, open two separate terminal windows.

**In your first terminal, run the Next.js app:**

```bash
npm run dev
```

The application will be available at [http://localhost:9003](http://localhost:9003).

**In your second terminal, run the Genkit flows:**

```bash
npm run genkit:dev
```

This will start the Genkit development server, which your Next.js application will call to perform AI tasks. You can view the Genkit developer UI at [http://localhost:4000](http://localhost:4000) to inspect your flows.

---

## Research

### Platforms Reviewed & Chosen Features

For this project, several existing AI interface platforms were reviewed to identify best practices and essential features. Platforms like **OpenAI's Playground**, **Hugging Face Spaces**, and various open-source projects provided inspiration.

Based on this research, the following core features were chosen for AI Arena to create a comprehensive and user-friendly experience:

-   **Model Selection**: Allows users to easily switch between different AI models (e.g., GPT-4, custom fine-tuned models). This is crucial for comparing outputs and selecting the best model for a specific task.
-   **Prompt Templating**: Offers a set of pre-defined prompt templates for common tasks (e.g., summarization, code explanation). This lowers the barrier to entry for new users and streamlines repetitive workflows.
-   **Parameter Tuning**: Provides intuitive controls (sliders, input fields) for adjusting key AI parameters like `temperature` and `max tokens`, giving users fine-grained control over the generation process.
-   **Dynamic Theming**: Includes a light/dark mode toggle to cater to user preferences and reduce eye strain, with the choice persisted in local storage.
-   **AI-Powered Tool Recommendation**: A meta-feature where the AI itself suggests the optimal models and parameters based on the user's prompt, guiding them toward better results.
-   **Component Generation**: A powerful feature that leverages the AI to generate React components directly from a text prompt, accelerating UI development.

## Design

### Design Mockup & Tailwind Mapping

The design philosophy for AI Arena is centered on a clean, modern, and focused interface that prioritizes the user's interaction with the AI.

-   **Mockup Link**: [View the design mockup on Figma (Placeholder)](https://www.figma.com/proto/your-mockup-link-here)

The visual design is implemented using **Tailwind CSS** and **ShadCN UI**, with a custom theme defined in `src/app/globals.css`. The mapping from our design principles to the Tailwind configuration is as follows:

-   **Primary Color**: A vibrant blue (`#29ABE2`) is used for primary actions and highlights, reflecting innovation. This is mapped to the `--primary` HSL variable in `globals.css`.
    -   `--primary: 197 71% 52%;`
-   **Background Color**: A light, desaturated grey (`#F5F5F5`) provides a neutral and readable canvas. This is mapped to the `--background` variable.
    -   `--background: 0 0% 96.1%;`
-   **Accent Color**: A contrasting teal (`#247BA0`) is used for secondary interactive elements. This is mapped to the `--accent` variable.
    -   `--accent: 198 63% 38%;`
-   **Typography**:
    -   Headlines use **Space Grotesk** (`font-headline` in `tailwind.config.ts`).
    -   Body text uses **PT Sans** (`font-body` in `tailwind.config.ts`).
-   **Component Styling**: ShadCN UI provides the base for components, which are styled using Tailwind CSS utility classes and our custom color palette, ensuring a consistent and modern look and feel.

## Development

### Implementation Notes

The application is built on a modern, robust tech stack designed for performance and scalability.

-   **Framework**: **Next.js 15** with the App Router is used for its powerful features like Server Components, Server Actions, and route handlers.
-   **AI Integration**: **Google's Genkit** is the exclusive toolkit for all generative AI functionality. It provides a structured way to define AI flows, prompts, and tools.
    -   **Flows**: AI logic is encapsulated in Genkit flows located in `src/ai/flows/`. Each flow is a server-side module that handles a specific AI task (e.g., generating a component, routing a prompt).
    -   **Actions**: Next.js Server Actions in `src/app/actions.ts` act as the bridge between the client-side UI and the server-side Genkit flows.
-   **UI & Styling**:
    -   **ShadCN UI** is used for the component library, providing accessible and reusable components.
    -   **Tailwind CSS** is used for all styling, enabling rapid and consistent UI development.
-   **State Management**: React hooks (`useState`, `useTransition`) are used for managing client-side state, keeping the application lightweight and performant.

### Known Limitations

-   **API Key Management**: The Gemini API key is stored directly in the `.env` file. For a production environment, a more secure solution like Google Secret Manager or another secrets vault should be used.
-   **Static Data**: The list of available AI models and prompt templates in `src/data/mock-data.ts` is static. A production application would fetch this data from a database or a configuration service.
-   **Error Handling**: Client-side error handling is basic and primarily relies on displaying toast notifications. A more comprehensive strategy could include more specific error states and user guidance.
-   **Live URL**: This prototype is designed to be run on a local machine, and a live deployment URL is not available as part of this package. The infrastructure for deployment would need to be set up separately (e.g., using Firebase App Hosting, Vercel).
