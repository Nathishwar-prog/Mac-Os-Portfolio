# Project Entry Template

Use this template when adding new projects to `src/lib/portfolioData.ts` to maintain consistency and quality.

```typescript
{
  title: "Display Title",
  subtitle: "Short tagline (one line)",
  name: "Internal/Simple Name",
  description: "Detailed description of the project (2-3 sentences).",
  tech: ["Technology 1", "Technology 2"],
  live: "https://live-link.com",
  codeLink: "https://github.com/your-username/repo-name",
  innovation: [
    "Key innovative feature 1",
    "Key innovative feature 2",
    "Key innovative feature 3",
  ],
  keyFeatures: [
    "Feature A",
    "Feature B",
    "Feature C",
  ],
  code: {
    language: "typescript", // or javascript, python, etc.
    content: `// Sample code snippet that demonstrates 
// a core logic or interesting part of the app.
function demo() {
  return "Hello World";
}`,
  },
  preview: null, // Set to a component or image path later
},
```

## Guidelines
1. **Title**: Catchy and descriptive.
2. **Description**: Focus on the *problem* solved and the *result*.
3. **Tech Stack**: List 4-6 primary technologies used.
4. **Innovation**: What makes this project unique or technically challenging?
5. **Code Snippet**: Keep it under 20 lines. Focus on "aha!" moments.
