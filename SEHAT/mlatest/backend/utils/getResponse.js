import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const getResponse = async (message) => {
  try {
    const contextString = `You are a virtual counselor specialized in women's healthcare, including physical health, mental well-being, and emergency health assistance. Do give brief answers. Reply in paragraphs, no bullet points needed. Be friendly and engage in lighthearted conversation. Keep answers to around 1-2 lines and, at the end, make the person feel happy and jolly.`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent({
      contents: [
        {
          parts: [{ text: contextString + "\n\nUser's question: " + message }],
        },
      ],
    });

    const response = result.response.text();

    if (!response || typeof response !== "string") {
      throw new Error(`Invalid response type: ${typeof response}`);
    }

    let formattedResponse = response
      .trim()
      .replace(/\s+/g, " ")
      .replace(/\*\*(.*?)\*\*/g, "**$1**")
      .replace(/(\d+\.)\s*/g, "\n$1 ")
      .replace(/\n{2,}/g, "\n")
      .trim();

    const lines = formattedResponse
      .split("\n")
      .filter((line) => line.trim().length > 0);
    let finalLines = [];
    let pointCounter = 1;

    lines.forEach((line) => {
      if (line.startsWith("**Women's Safety Tips**")) {
        finalLines.push(line);
      } else if (line.match(/^\d+\.\s/)) {
        finalLines.push(line);
        pointCounter = parseInt(line.split(".")[0]) + 1;
      } else {
        finalLines.push(`${pointCounter}. ${line}`);
        pointCounter++;
      }
    });

    const formattedText = finalLines.join("\n");

    const cleanText = finalLines
      .map((line) => {
        if (line.startsWith("**Women's Safety Tips**"))
          return "Women's Safety Tips";
        return line;
      })
      .join(" ");

    console.log("Formatted response:", formattedText);
    console.log("Clean response:", cleanText);

    return { formatted: formattedText, clean: cleanText };
  } catch (error) {
    console.error("Error with Gemini API:", error);
    throw new Error(`Failed to get response: ${error.message}`);
  }
};

export default getResponse;
