**DevPostr**
============

🚀 **DevPostr** is an AI-powered tool that helps developers generate, preview, and share beautiful code-based posts for Twitter/X and other social platforms.It transforms code snippets into visually engaging images, allows multi-post generation, and supports scheduled automated posting through a backend worker system.

✨ **Features**
--------------

*   🎨 **AI-Generated Code Posts**Generate tricky coding questions, explanations, captions, and hashtags using LLMs.
    
*   🖼️ **Beautiful Image Renderer**Convert code snippets into high-quality social media images using Satori or Puppeteer.
    
*   🕒 **Flexible Scheduling**Users can schedule posts manually without forced auto-posting.
    
*   ☁️ **Cloud Uploads**Images are uploaded to Cloudinary before being stored in MongoDB.
    
*   🧵 **Background Workers**BullMQ + Redis power job queues for uploading media, posting to Twitter, and processing tasks asynchronously.
    
*   🔐 **Secure OAuth Posting**Users can authenticate with Twitter and automate content publishing.
    
*   ✨ **Smooth Frontend UX**Users can multiselect posts, set upload times, and manage everything from the UI.
    

🛠️ **Tech Stack**
------------------

### **Frontend**

*   Next.js (App Router)
    
*   React
    
*   TailwindCSS
    
*   Puppeteer for rendering images
    

### **Backend**

*   Node.js / Express
    
*   MongoDB
    
*   BullMQ + Redis
    
*   Cloudinary (image hosting)
    
*   Twitter API v2
    
*   LLM APIs (OpenAI-compatible)
    

⚙️ **How DevPostr Works**
-------------------------

### **1\. Generate Content**

Users choose:

*   Language (JS, Python, etc.)
    
*   Number of posts
    
*   Text Prompts
    

The LLM returns structured JSON with:

Plain textANTLR4BashCC#CSSCoffeeScriptCMakeDartDjangoDockerEJSErlangGitGoGraphQLGroovyHTMLJavaJavaScriptJSONJSXKotlinLaTeXLessLuaMakefileMarkdownMATLABMarkupObjective-CPerlPHPPowerShell.propertiesProtocol BuffersPythonRRubySass (Sass)Sass (Scss)SchemeSQLShellSwiftSVGTSXTypeScriptWebAssemblyYAMLXML`   {    "codeSnippet": "",    "caption": "",    "hashtags": "",    "correctAns": "",    "explanation": ""  }   `

### **2\. Render Images**

The frontend takes the generated content and renders it into a previewable image using:

*   **Puppeteer** for more complex rendering
    

Users download or select multiple images.

### **3\. Upload & Schedule**

Frontend uploads images and metadata to the backend, where:

*   Cloudinary stores media
    
*   MongoDB stores the schedule
    
*   BullMQ queues the job
    
*   A worker posts it at the correct time
    

🧪 **Development Notes**
------------------------

*   Puppeteer behavior may differ between Windows, Linux, and Render deployments.
    
*   For high-volume workloads, migrating to a dedicated worker host is recommended.