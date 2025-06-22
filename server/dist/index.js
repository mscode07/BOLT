"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
const basePrompts_1 = require("./defaluts/basePrompts");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const anthropic = new sdk_1.default();
// app.post("/template", async (req, res) => {
//   console.log("Request body: ", req.body.prompt);
//   const usreRequest = req.body.prompt;
//   try {
//     const response = await anthropic.messages.create({
//       messages: [{ role: "user", content: usreRequest }],
//       model: "claude-3-7-sonnet-20250219",
//       max_tokens: 1024,
//       system:
//         "Return the tech based on what do you think this project should be. Only return a single word for        example if you think it's a node project then reatun 'node', if it's a react project return 'react' Same with other tech return the tech in single word. Do not return anything extra",
//     });
//     const techByUser = (response.content[0] as TextBlock).text;
//     console.log(`Detectec tech :${techByUser}`);
//     const basePromt = promptMap[techByUser] || defaultPrompt;
//     const userMessage = `${basePromt}\n\nUser Request: ${usreRequest}`;
//     //! streaiming the code generation
//     const codeResponse = anthropic.messages
//       .stream({
//         messages: [{ role: "user", content: userMessage }],
//         model: "claude-3-7-sonnet-20250219",
//         max_tokens: 4096,
//         system: getSystemPrompt(),
//       })
//       .on("text", (text) => {
//         console.log(text);
//       });
//     const genratedCode = codeResponse;
//     console.log("Genrated code: ", genratedCode);
//     res.json({
//       techByUser,
//       genratedCode,
//     });
//   } catch (error) {
//     console.log("Getting error here ", error);
//     res.status(500).json({ message: "Faild to genreate code" });
//   }
// });
app.get("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRequest = req.query.prompt;
    console.log("This is the user's Request:-", req.query.prompt);
    if (!userRequest) {
        return res.status(400).json({ error: "Prompt is required" });
    }
    // Set SSE headers
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Cache-Control",
    });
    try {
        const response = yield anthropic.messages.create({
            messages: [{ role: "user", content: userRequest }],
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 1024,
            system: "Return the tech based on what do you think this project should be. Only return a single word for example if you think it's a node project then return 'node', if it's a react project return 'react' Same with other tech return the tech in single word. Do not return anything extra",
        });
        const techByUser = response.content[0].text;
        res.write(`data: ${JSON.stringify({ type: "tech", data: techByUser })}\n\n`);
        const basePrompt = basePrompts_1.promptMap[techByUser] || basePrompts_1.defaultPrompt;
        const userMessage = `${basePrompt}\n\nUser Request: ${userRequest}`;
        // Stream code generation
        const codeStream = anthropic.messages.stream({
            messages: [{ role: "user", content: userMessage }],
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 4096,
            system: (0, prompts_1.getSystemPrompt)(),
        });
        codeStream.on("text", (text) => {
            res.write(`data: ${JSON.stringify({ type: "code", data: text })}\n\n`);
        });
        codeStream.on("end", () => {
            res.write(`event: end\n`);
            res.write(`data: completed\n\n`);
            res.end();
        });
        codeStream.on("error", (error) => {
            console.error("Streaming error:", error);
            res.write(`data: ${JSON.stringify({ type: "error", data: error.message })}\n\n`);
            res.end();
        });
    }
    catch (error) {
        console.log("Error:", error);
        res.write(`data: ${JSON.stringify({
            type: "error",
            data: "Failed to generate code",
        })}\n\n`);
        res.end();
    }
    // Handle client disconnect
    req.on("close", () => {
        console.log("Client disconnected");
        res.end();
    });
}));
app.listen(3000, () => {
    console.log("Server is running on the Port: 3000");
});
