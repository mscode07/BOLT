import Anthropic from "@anthropic-ai/sdk";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { defaultPrompt, promptMap } from "./defaluts/basePrompts";
import { getSystemPrompt } from "./prompts";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const anthropic = new Anthropic();

app.get("/template", async (req: any, res: any) => {
  const userRequest = req.query.prompt;
  console.log("This is the user's Request :-", req.query.prompt);
  if (!userRequest) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  try {
    const response = await anthropic.messages.create({
      messages: [{ role: "user", content: userRequest }],
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 1024,
      system:
        "Return the tech based on what do you think this project should be. Only return a single word for example if you think it's a node project then return 'node', if it's a react project return 'react' Same with other tech return the tech in single word. Do not return anything extra",
    });

    const techByUser = (response.content[0] as TextBlock).text;
    res.write(
      `data: ${JSON.stringify({ type: "tech", data: techByUser })}\n\n`
    );

    const basePrompt = promptMap[techByUser] || defaultPrompt;
    const userMessage = `${basePrompt}\n\nUser Request: ${userRequest}`;

    const codeStream = anthropic.messages.stream({
      messages: [{ role: "user", content: userMessage }],
      model: "claude-3-7-sonnet-20250219",
      max_tokens: 4096,
      system: getSystemPrompt(),
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
      res.write(
        `data: ${JSON.stringify({ type: "error", data: error.message })}\n\n`
      );
      res.end();
    });
  } catch (error) {
    console.log("Error:", error);
    res.write(
      `data: ${JSON.stringify({
        type: "error",
        data: "Failed to generate code",
      })}\n\n`
    );
    res.end();
  }
  req.on("close", () => {
    console.log("Client disconnected");
    res.end();
  });
});

app.listen(3000, () => {
  console.log("Server is running on the Port: 3000");
});
