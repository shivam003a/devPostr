export const codeImageTemplate = (language = 'javascript', bgColor, codeColor, codeSnippet) => {

  const backgroundColor = `background-color: rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`
  const cardColor = `background-color: rgba(${codeColor.r},${codeColor.g},${codeColor.b},${codeColor.a})`

  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <link
      href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-okaidia.min.css"
      rel="stylesheet"
    />
    <title>Document</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .parent-div {
        width: 600px;
        height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        gap: 8px;
      }
      .inner-div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 12px;
        overflow: hidden;
      }
      .code-container {
        margin: 0 auto;
        border-radius: 8px;
        padding: 12px;
      }
      .mc-outer-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
      }
      .mc-inner-div {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .mc-element {
        width: 14px;
        height: 14px;
        border-radius: 9999px;
      }
      .red {
        background-color: #ff5f56;
      }
      .yellow {
        background-color: #ffbd2e;
      }
      .green {
        background-color: #27c93f;
      }
      .cs-langauge {
        font-family: "Poppins", sans-serif;
        color: #94a3b8;
        font-size: 10px;
        font-weight: 600;
      }
      .no-border,
      textarea,
      pre {
        outline: 0 !important;
        border: 0 !important;
        font-size: 18px;
      }
    </style>
  </head>
  <body>
    <div class="parent-div">
      <div class="inner-div" style="${backgroundColor}">
        <div
          class="code-container"
          style="${cardColor}"
        >
          <!-- macOS traffic lights -->
          <div class="mc-outer-div">
            <div class="mc-inner-div">
              <div class="mc-element red"></div>
              <div class="mc-element yellow"></div>
              <div class="mc-element green"></div>
            </div>
            <span class="cs-langauge">${language?.toUpperCase()}</span>
          </div>

          <!-- code editor -->
          <div class="no-border" style="${cardColor}">
            <pre class="language-${language}" style="${cardColor}"><code>
                 
            </code></pre>
          </div>
        </div>
      </div>
    </div>

    <!-- Prism core first -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/prism.min.js"></script>

    <!-- Base for C-like languages -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-clike.min.js"></script>

    <!-- Language components -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-javascript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-typescript.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-python.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-c.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-cpp.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-java.min.js"></script>

    <!-- JS-Beautify -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/js-beautify/1.14.7/beautify-js.min.js"></script>

    <script>
      document.addEventListener("DOMContentLoaded", () => {
        const codeBlock = document.querySelector("pre code");
        const rawCode = ${JSON.stringify(codeSnippet)};

        // Format using js-beautify
        const formattedCode = js_beautify(rawCode, {
          indent_size: 4,
          space_in_empty_paren: true,
        });

        codeBlock.textContent = formattedCode;

        // Highlight with Prism
        Prism.highlightElement(codeBlock);
      });
    </script>
  </body>
</html>`

  return template;
}

export const explainationImageTemplate = (language = 'javascript', bgColor, codeColor, correctAns, explaination) => {
  const backgroundColor = `background-color: rgba(${bgColor.r},${bgColor.g},${bgColor.b},${bgColor.a})`
  const cardColor = `background-color: rgba(${codeColor.r},${codeColor.g},${codeColor.b},${codeColor.a})`

  const template = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@300..700&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    />
    <title>Document</title>
    <style>
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      .parent-div {
        width: 600px;
        height: 600px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        gap: 8px;
      }
      .inner-div {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 12px;
        overflow: hidden;
      }
      .code-container {
        margin: 0 auto;
        border-radius: 8px;
        padding: 12px;
      }
      .mc-outer-div {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
      }
      .mc-inner-div {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      .mc-element {
        width: 14px;
        height: 14px;
        border-radius: 9999px;
      }
      .red {
        background-color: #ff5f56;
      }
      .yellow {
        background-color: #ffbd2e;
      }
      .green {
        background-color: #27c93f;
      }
      .cs-langauge {
        font-family: "Poppins", sans-serif;
        color: #94a3b8;
        font-size: 10px;
        font-weight: 600;
      }
      textarea,
      pre {
        outline: 0 !important;
        border: 0 !important;
        font-size: 14px;
      }
      .no-border {
        outline: 0 !important;
        border: 0 !important;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .text-cont {
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
      .code-text-white {
        color: #fff;
        font-family: "Fira Code", monospace;
        font-size: 13px;
      }
      .code-text-gray {
        color: #94a3b8;
        font-family: "Fira Code", monospace;
        font-size: 16px;
      }
    </style>
  </head>
  <body>
    <div class="parent-div">
      <div class="inner-div" style="${backgroundColor}">
        <div
          class="code-container"
          style="${cardColor}"
        >
          <!-- macOS traffic lights -->
          <div class="mc-outer-div">
            <div class="mc-inner-div">
              <div class="mc-element red"></div>
              <div class="mc-element yellow"></div>
              <div class="mc-element green"></div>
            </div>
            <span class="cs-langauge">${language?.toUpperCase()}</span>
          </div>

          <!-- code editor -->
          <div class="no-border">
            <!-- code editor -->
            <div class="text-cont">
              <span class="code-text-white">Correct Answer</span>
              <span class="code-text-gray">&gt; ${correctAns}</span>
            </div>
            <div class="text-cont">
              <span class="code-text-white">Explaination</span>
              <span class="code-text-gray">&gt; ${explaination}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`

  return template;
}
