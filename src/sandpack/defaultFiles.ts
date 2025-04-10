export const defaultFiles = {
  "/index.js": {
    code: `import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

const root = createRoot(document.getElementById("root"));
root.render(<App />);`,
  },
  "/App.js": {
    code: `import React from "react";

export default function App() {
  return (
    <div style={{ 
      padding: "20px",
      fontFamily: "system-ui, sans-serif",
      maxWidth: "600px",
      margin: "0 auto"
    }}>
      <h1 style={{ color: "#6B7280", marginBottom: "1rem" }}>
        Hello from Sandpack!
      </h1>
      <p style={{ color: "#9CA3AF", lineHeight: "1.6" }}>
        Start editing to see some magic happen!
      </p>
    </div>
  );
}`,
  },
  "/styles.css": {
    code: `body {
  margin: 0;
  padding: 0;
  font-family: system-ui, sans-serif;
}

.container {
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
}`,
  },
  "/index.html": {
    code: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandpack App</title>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`,
    hidden: true,
  },
}; 