import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Modal from "react-modal";
const GEMINI_API_KEY = 'REPLACE_WITH_YOUR_API_KEY';
const CodeGenerator = ({ onCodeGenerated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerateCode = async () => {
    setLoading(true);
    try {
      const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent([prompt]);
      const response = await result.response;
      const responseText = await response.text();
  
      // Extract the code block from the response text
      const codeBlockRegex = /```([\s\S]*?)```/;
      const match = codeBlockRegex.exec(responseText);
      const generatedCode = match ? match[1].trim() : "";
  
      onCodeGenerated(generatedCode);
    } catch (error) {
      console.error("Error generating code:", error);
    } finally {
      setLoading(false);
      closeModal();
    }
  };

  return (
    <>
    <button
  onClick={openModal}
  className="group relative overflow-hidden rounded-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-yellow-500/50"
>
  <div className="absolute inset-0 bg-gradient-to-r from-yellow-800 via-yellow-700 to-yellow-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-all duration-300"></div>
  <div className="relative flex items-center justify-center gap-2 px-6 py-3 bg-neutral-900 rounded-lg font-semibold">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.8"
      className="w-6 h-6 stroke-yellow-500 transition-all duration-300 group-hover:stroke-white"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09ZM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456ZM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423Z"
      ></path>
    </svg>
    <span className="text-yellow-400 transition-all duration-300 group-hover:text-white">
      Generate Code
    </span>
  </div>
</button>

    
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <div className="bg-neutral-800 rounded p-4 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-4">
            Enter a prompt for code generation
          </h2>
          <textarea
            value={prompt}
            onChange={handlePromptChange}
            className="w-full px-3 py-2 bg-neutral-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-c4ff45"
            rows={4}
            placeholder="Enter a prompt..."
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={closeModal}
              className="bg-neutral-700 text-white font-semibold py-2 px-4 rounded hover:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-c4ff45 mr-2"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateCode}
              className="bg-[#c4ff45] text-neutral-800 font-semibold py-2 px-4 rounded hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-c4ff45"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default CodeGenerator;