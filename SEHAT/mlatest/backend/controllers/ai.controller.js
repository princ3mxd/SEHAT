import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const checkSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide symptoms." });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
A patient reports the following symptoms: "${symptoms}".  
Provide a **structured diagnosis** in the following format:  

**Diagnosis:**  
Okay, here's a brief diagnostic overview based on the patient's report of "${symptoms}":  

1] **Common Causes:**  
- Condition Name: Key Symptoms.  

2] **Serious Causes:**  
- Condition Name: Key Symptoms.  

3] **Rare Possibilities:**  
- Condition Name: Key Symptoms.  

**Urgent Medical Indicators:**   
- List 1 to 3 signs that require immediate medical attention.  

**Disclaimer:** "Consult a doctor for accurate diagnosis."  
dont give ** or bold

Make sure to keep it **concise (5-6 lines max)**.
`;

    const result = await model.generateContent(prompt);
    const response = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";

    return res.status(200).json({
      success: true,
      message: "AI Analysis Complete",
      data: response,
    });
  } catch (error) {
    console.error("Error in AI Symptom Checker:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};
export default checkSymptoms;
