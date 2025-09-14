export const getPromptFromText = (langauge, prompt, noOfPosts) => {
  const systemPrompt = `You are a professional Instagram content creator.
You generate tricky ${langauge} interview/code challenge posts.
Your content must be engaging, educational, and varied.
Always ensure:
- Difficulty variety: easy, medium, hard
- Topic variety: basics, async/event loop, closures, prototypes, scope, type coercion, recursion, algorithms, performance, memory, ES6+ features
- Avoid repetitive questions (like only console.log).`;

  const userPrompt = `The user requested: "${prompt}"

Your task:
- Generate exactly ${noOfPosts} Instagram-style posts about ${langauge}.
- Even if the user's request is narrow, include a **mix of topics and difficulty levels** from the following list:
  [basics, async/event loop, closures, prototypes, hoisting, scope, type coercion, recursion, algorithms, performance, ES6+ features, memory].
- Ensure each post is unique and educational.

Output format:
A valid JSON array where each object looks like this:
{
  "codeSnippet": "string",
  "caption": "string",
  "hashtags": "comma,separated,tags",
  "correctAns": "string",
  "explaination": "string"
}

Examples:
[
  {
    "codeSnippet": "console.log(1);\nsetTimeout(()=>console.log(2),0);\nconsole.log(3);",
    "caption": "JS Event Loop in Action",
    "hashtags": "javascript,eventloop,async,trickyquestions",
    "correctAns": "1\\n3\\n2",
    "explaination": "JS executes synchronous code first, then processes the callback queue."
  },
  {
    "codeSnippet": "function makeCounter(){ let count=0; return ()=>++count; }\nconst c1=makeCounter();\nconsole.log(c1());\nconsole.log(c1());",
    "caption": "Closures in JS",
    "hashtags": "javascript,closures,interview,trickyquestions",
    "correctAns": "1\\n2",
    "explaination": "The inner function keeps access to 'count' even after makeCounter has finished executing."
  },
  {
    "codeSnippet": "/* Guess the output */\nconsole.log([] + []);\nconsole.log([] + {});\nconsole.log({} + []);",
    "caption": "Type Coercion Madness",
    "hashtags": "javascript,typecoercion,wtfjs,trickyquestions",
    "correctAns": "''\\n'[object Object]'\\n0",
    "explaination": "JavaScript converts arrays/objects to strings when using '+'. Context decides the behavior."
  },
  {
    "codeSnippet": "class A {}\nclass B extends A {}\nconsole.log(A.prototype.isPrototypeOf(B.prototype));",
    "caption": "Prototype Chain Check",
    "hashtags": "javascript,prototype,oops,trickyquestions",
    "correctAns": "true",
    "explaination": "In ES6 classes, inheritance works through the prototype chain."
  },
  {
    "codeSnippet": "/* Guess the output */\nfunction factorial(n){ return n<=1 ? 1 : n*factorial(n-1); }\nconsole.log(factorial(5));",
    "caption": "Recursive Factorial",
    "hashtags": "javascript,recursion,algorithms,trickyquestions",
    "correctAns": "120",
    "explaination": "Recursion calls the function repeatedly until the base case n<=1."
  }
]

⚠️ Strict Rules:
- Output only the JSON array (no text outside).
- Ensure JSON is valid and parsable.
- Cover a wide range of topics, not just the user’s prompt.
- Explanations should be clear but short (Instagram-friendly).`;

  return { systemPrompt, userPrompt };
};

export const getPromptFromCode = (langauge, codeSnippet) => {
  const systemPrompt = '';
  const userPrompt = '';

  return { systemPrompt, userPrompt };
};
