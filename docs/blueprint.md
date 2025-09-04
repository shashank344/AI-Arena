# **App Name**: AI Arena

## Core Features:

- Model Selection: Allows users to select from a variety of AI models (GPT-3.5, GPT-4, custom) using a dropdown or sidebar. Data is fetched from a mock API.
- Prompt Templating: Offers a text area for prompt editing with save/load functionality for templates (dummy JSON data).
- Parameter Tuning: Provides sliders and input fields to adjust parameters like temperature and max tokens, influencing the AI's responses.
- Dynamic Theming: Enables users to switch between light and dark themes, with the selected theme persisted in local storage for a consistent experience.
- Response Formatting: Formats LLM responses to produce clean, short code snippets by providing an explicit output schema, so the snippets can be easily copied or downloaded.
- AI-Powered Tool Recommendation: Uses generative AI as a tool to recommend the most appropriate tools and parameter settings based on the user's prompt, improving the quality and relevance of results.

## Style Guidelines:

- Primary color: HSL-inspired vibrant blue (#29ABE2) to reflect intelligence and innovation, converted from HSL.
- Background color: Light grey (#F5F5F5), desaturated, to ensure readability and focus on the AI-generated content.
- Accent color: Analogous yet contrasting teal (#247BA0), for interactive elements and key actions.
- Body: 'PT Sans' for body, a readable and modern sans-serif; Headlines: 'Space Grotesk' to create visual interest
- Use a set of consistent and simple icons, likely Remix Icon or Material Design, to represent different AI models, parameters, and actions (copy, download).
- Design a clean, responsive layout that adapts seamlessly from mobile to desktop, utilizing a grid system and flexible components. Ensure key elements are easily accessible on all devices.
- Incorporate subtle hover and focus animations on interactive elements like buttons, sliders, and the theme toggle, providing clear feedback to the user. Use Framer Motion for smooth transitions.