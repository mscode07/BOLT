require("dotenv").config();
import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import express from "express";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { nextBasePrompt } from "./defaluts/nextJs";
import { defaultPrompt, promptMap } from "./defaluts/basePrompts";
import { text } from "stream/consumers";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
const anthropic = new Anthropic();

app.post("/template", async (req, res) => {
  console.log("Request body: ", req.body.prompt);
  const usreRequest = req.body.prompt;
  try {
    const response = await anthropic.messages.create({
      messages: [{ role: "user", content: usreRequest }],
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      system:
        "Return the tech based on what do you think this project should be. Only return a single word for        example if you think it's a node project then reatun 'node', if it's a react project return 'react' Same with other tech return the tech in single word. Do not return anything extra",
    });
    const techByUser = (response.content[0] as TextBlock).text;
    console.log(`Detectec tech :${techByUser}`);

    const basePromt = promptMap[techByUser] || defaultPrompt;

    const userMessage = `${basePromt}\n\nUser Request: ${usreRequest}`;

    const codeResponse = await anthropic.messages.create({
      messages: [{ role: "user", content: userMessage }],
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      system: getSystemPrompt(),
    });
    // .on("text", (text) => {
    //   console.log(text);
    // });
    // const genratedCode = (codeResponse.content[0] as TextBlock).text;
    // const genratedCode = await codeResponse;
    const genratedCode = (codeResponse.content[0] as TextBlock).text;
    console.log("Genrated code: ", genratedCode);

    //! streaiming the code generation
    // const codeResponse = await anthropic.messages
    //   .stream({
    //     messages: [{ role: "user", content: userMessage }],
    //     model: "claude-3-7-sonnet-20250219",
    //     max_tokens: 4096,
    //     system: getSystemPrompt(),
    //   })
    //   .on("text", (text) => {
    //     console.log(text);
    //   });

    // const genratedCode = await codeResponse;
    // // const genratedCode = (codeResponse.content[0] as TextBlock).text;
    // console.log("Genrated code: ", genratedCode);

    res.json({
      techByUser,
      genratedCode,
    });
  } catch (error) {
    console.log("Getting error here ", error);
    res.status(500).json({ message: "Faild to genreate code" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on the Port: 3000");
});
