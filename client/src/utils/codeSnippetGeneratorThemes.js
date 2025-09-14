export const prismLanguages = {
    javascript: () => import("prismjs/components/prism-javascript"),
    typescript: () => import("prismjs/components/prism-typescript"),
    python: () => import("prismjs/components/prism-python"),
    java: () => import("prismjs/components/prism-java"),
    c: () => import("prismjs/components/prism-c"),
    cpp: () => import("prismjs/components/prism-cpp"),
    csharp: () => import("prismjs/components/prism-csharp"),
    css: () => import("prismjs/components/prism-css"),
    json: () => import("prismjs/components/prism-json"),
    yaml: () => import("prismjs/components/prism-yaml"),
    sql: () => import("prismjs/components/prism-sql"),
};

export const supportedLangauges = [
    { name: "JavaScript", value: "javascript" },
    { name: "TypeScript", value: "typescript" },
    { name: "Python", value: "python" },
    { name: "Java", value: "java" },
    { name: "CPP", value: "cpp" },
    { name: "C", value: "c" },
    { name: "C#", value: "csharp" },
    { name: "HTML", value: "html" },
    { name: "CSS", value: "css" },
    { name: "JSON", value: "json" },
    { name: "YAML", value: "yaml" },
    { name: "SQL", value: "sql" },
]