import { useState, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
const GEMINI_API_KEY = 'REPLACE_WITH_YOUR_API_KEY';
const CodeExplainer = ({ code, onClose }) => {
  const [explanation, setExplanation] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    const generateExplanation = async () => {
      setIsLoading(true);
      try {
        const prompt = `Explain the provided code:\n\n${code}`;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([prompt]);
        const response = await result.response;
        const text = await response.text();
        setExplanation(text);
        setMessages([{ role: "assistant", content: text }]);
      } catch (error) {
        console.error("Error generating explanation:", error);
      } finally {
        setIsLoading(false);
      }
    };

    generateExplanation();
  }, [code]);

  const handlePromptSubmit = async (prompt) => {
    setIsLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const text = await response.text();
      setMessages((prevMessages) => [...prevMessages, { role: "user", content: prompt }, { role: "assistant", content: text }]);
    } catch (error) {
      console.error("Error generating response:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleCloseModal = () => {
    onClose();
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-neutral-800 rounded p-4 max-w-xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Code Explanation</h2>
          <button
            className="text-white hover:text-c4ff45 focus:outline-none"
            onClick={handleCloseModal}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="explanation-content text-white bg-neutral-900 rounded max-h-96 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
            <div className="spinner">
    <div className="spinnerin"></div>
</div>
            </div>
          ) : (
            <div>
              {messages.map((message, index) => (
                <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
                  <div
                    className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-neutral-700" : "bg-neutral-600"}`}
                  >
                    <ReactMarkdown className="prose prose-invert max-w-none">{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
              <ChatInput onSubmit={handlePromptSubmit} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChatInput = ({ onSubmit }) => {
  const [prompt, setPrompt] = useState("");

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (prompt.trim()) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

 

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex">
        <input
          type="text"
          className="w-full px-3 py-2 bg-neutral-700 text-white rounded-l focus:outline-none focus:ring-2 focus:ring-c4ff45"
          placeholder="Enter a prompt"
          value={prompt}
          onChange={handlePromptChange}
        />
        <button
          type="submit"
          className="bg-[#c4ff45] text-neutral-800 font-semibold py-2 px-4 rounded-r hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-c4ff45"
        >
          Send
        </button>
      </div>
    </form>
  );
};

export default CodeExplainer;