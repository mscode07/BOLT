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
require("dotenv").config();
const sdk_1 = __importDefault(require("@anthropic-ai/sdk"));
const express_1 = __importDefault(require("express"));
const prompts_1 = require("./prompts");
const basePrompts_1 = require("./defaluts/basePrompts");
const app = (0, express_1.default)();
app.use(express_1.default.json());
const anthropic = new sdk_1.default();
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Request body: ", req.body.prompt);
    const usreRequest = req.body.prompt;
    try {
        const response = yield anthropic.messages.create({
            messages: [{ role: "user", content: usreRequest }],
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 1024,
            system: "Return the tech based on what do you think this project should be. Only return a single word for        example if you think it's a node project then reatun 'node', if it's a react project return 'react' Same with other tech return the tech in single word. Do not return anything extra",
        });
        const techByUser = response.content[0].text;
        console.log(`Detectec tech :${techByUser}`);
        const basePromt = basePrompts_1.promptMap[techByUser] || basePrompts_1.defaultPrompt;
        const userMessage = `${basePromt}\n\nUser Request: ${usreRequest}`;
        const codeResponse = yield anthropic.messages.create({
            messages: [{ role: "user", content: userMessage }],
            model: "claude-3-7-sonnet-20250219",
            max_tokens: 4096,
            system: (0, prompts_1.getSystemPrompt)(),
        });
        // .on("text", (text) => {
        //   console.log(text);
        // });
        // const genratedCode = (codeResponse.content[0] as TextBlock).text;
        // const genratedCode = await codeResponse;
        const genratedCode = codeResponse.content[0].text;
        console.log("Genrated code: ", genratedCode);
        res.json({
            techByUser,
            genratedCode,
        });
    }
    catch (error) {
        console.log("Getting error here ", error);
        res.status(500).json({ message: "Faild to genreate code" });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on the Port: 3000");
});
