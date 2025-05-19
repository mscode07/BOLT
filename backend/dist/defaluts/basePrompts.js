"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptMap = exports.defaultPrompt = exports.nodeBasePrompt = exports.reactBasePrompt = exports.nextBasePrompt = void 0;
exports.nextBasePrompt = `Project Files:
.eslintrc.json:
{
  "extends": "next/core-web-vitals"
}
app/globals.css:
@tailwind base;
@tailwind components;
@tailwind utilities;
...
app/layout.tsx:
import './globals.css';
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`;
exports.reactBasePrompt = `Project Files:
src/index.js:
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
ReactDOM.render(<App />, document.getElementById('root'));
src/App.js:
import React from 'react';
export default function App() {
  return <div>React App</div>;
}
`;
exports.nodeBasePrompt = `Project Files:
server.js:
const express = require('express');
const app = express();
app.use(express.json());
app.get('/', (req, res) => res.send('Node.js Server'));
app.listen(3000, () => console.log('Server running on port 3000'));
`;
exports.defaultPrompt = `Project Files:
index.js:
console.log('Generic project setup');
`;
exports.promptMap = {
    nextjs: exports.nextBasePrompt,
    react: exports.reactBasePrompt,
    node: exports.nodeBasePrompt,
};
