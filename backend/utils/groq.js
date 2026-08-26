import dotenv from "dotenv";
dotenv.config();
import Groq from "groq-sdk";

const apiResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  };

  try {
    let result = await fetch(
      `https://api.groq.com/openai/v1/chat/completions`,
      options,
    );

    let data = await result.json();

    if (!result.ok) {
      console.log("Groq API Error:", data);

      throw new Error(data.error?.message || "Groq API request failed");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export default apiResponse;

// console.log(
//     "Groq key loaded:",
//     !!process.env.GROQ_API_KEY
// );