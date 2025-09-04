// @/data/mock-data.ts

export const models = [
  { id: 'gpt-4', name: 'GPT-4', icon: 'Sparkles' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5-Turbo', icon: 'Sparkles' },
  { id: 'custom-model-1', name: 'Custom Fine-Tuned', icon: 'BrainCircuit' },
];

export const templates = [
  {
    id: 'summarize',
    name: 'Summarize Text',
    content: 'Summarize the following text into three key points: \n\n',
  },
  {
    id: 'code-explain',
    name: 'Explain Code Snippet',
    content: 'Explain the following code snippet in plain English, focusing on its purpose and functionality: \n\n',
  },
  {
    id: 'translate-js-to-python',
    name: 'Translate JS to Python',
    content: 'Translate the following JavaScript code to its Python equivalent: \n\n',
  },
  {
    id: 'social-media-post',
    name: 'Generate Social Media Post',
    content: 'Create a short, engaging Twitter post about the following topic: \n\n',
  },
  {
    id: 'define-word',
    name: 'Define a Word',
    content: 'What is the meaning of the word: \n\n',
  },
];
