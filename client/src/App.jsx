import { useCallback, useEffect, useState } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-github";
import FileTree from "./components/tree";
import Terminal from "./components/terminal";
import socket from "./socket";
import ace from "ace-builds";
import "./App.css";
function App() {
  const [fileTree, setFileTree] = useState({});
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileContent, setSelectedFileContent] = useState("");
  const [code, setCode] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openFiles, setOpenFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selection, setSelection] = useState(null);
  const [editorTheme, setEditorTheme] = useState("github");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [isCopied, setIsCopied] = useState(false); // State to track copied status
  const isSaved = selectedFileContent === code;
  const [codingTime, setCodingTime] = useState(0);

  const getFileTree = async () => {
    const response = await fetch("http://localhost:9000/files");
    const result = await response.json();
    setFileTree(result.tree);
  };

  const getFileContents = useCallback(async () => {
    if (!selectedFile) return;
    const response = await fetch(
      `http://localhost:9000/files/content?path=${selectedFile}`
    );
    const result = await response.json();
    setSelectedFileContent(result.content);
  }, [selectedFile]);

  const handleSearch = () => {
    const lowerCaseCode = code.toLowerCase();
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const startIndex = lowerCaseCode.indexOf(lowerCaseSearchTerm);
    if (startIndex !== -1) {
      const endIndex = startIndex + searchTerm.length;
      setSelection({ start: startIndex, end: endIndex });
    } else {
      setSelection(null);
    }
  };

  

  useEffect(() => {
    getFileTree();
  }, []);

  useEffect(() => {
    if (!isSaved && code) {
      const timer = setTimeout(() => {
        socket.emit("file:change", {
          path: selectedFile,
          content: code,
        });
      }, 5*1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [code, selectedFile, isSaved]);
  useEffect(() => {
    setCode(selectedFileContent);
  }, [selectedFileContent]);

  useEffect(() => {
    if (selectedFile) getFileContents();
  }, [getFileContents, selectedFile]);

  useEffect(() => {
    socket.on("file:refresh", getFileTree);
    return () => {
      socket.off("file:refresh", getFileTree);
    };
  }, []);

  const handleFileSelect = (path) => {
    if (!openFiles.includes(path)) {
      setOpenFiles([...openFiles, path]);
    }
    setSelectedFile(path);
    setSelectedFileContent("");
    setCode("");
    setIsSaved(true);
    setIsCopied(false);
  };

  const handleCloseFile = (path) => {
    setOpenFiles(openFiles.filter((file) => file !== path));
    if (selectedFile === path) {
      setSelectedFile(openFiles[0] || "");
      setSelectedFileContent("");
      setCode("");
      setIsSaved(true);
      setIsCopied(false);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const results = Object.keys(fileTree).filter((path) =>
        path.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm, fileTree]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(code); // Copy code to clipboard
    setIsCopied(true); // Set copied state to true
    setTimeout(() => setIsCopied(false), 5000); // Reset isCopied state after 5 seconds
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCodingTime((prevTime) => prevTime + 1);
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  // Format time as hours, minutes, and seconds
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-screen bg-neutral-900 font-sans no-scrollbar ">
      <div className="flex flex-col bg-neutral-800 text-white w-full">
        {/* Top Navigation Bar */}
        <nav className="flex items-center justify-between bg-neutral-800 text-white p-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://i.ibb.co/R30W19g/Picsart-24-06-01-01-26-43-922.png"
              alt="Codeic Logo"
              className="w-12 h-12 mr-2 mb-1"
            />
            <span className="text-2xl font-semibold  anta-regular">
              CodeYantra &nbsp; &nbsp;&nbsp;
            </span>
            <ul className="flex space-x-4">
              <li className="hover:bg-[#ffffff17] cursor-pointer px-3 py-2 rounded-md text-lg font-md  ">
                File
              </li>
              <li className="hover:bg-[#ffffff17] cursor-pointer px-3 py-2 rounded-md text-lg font-md">
                Edit
              </li>
              <li className="hover:bg-[#ffffff17] cursor-pointer px-3 py-2 rounded-md text-lg font-md">
                View
              </li>
              <li className="hover:bg-[#ffffff17] cursor-pointer px-3 py-2 rounded-md text-lg font-md">
                Navigate
              </li>
              <li className="hover:bg-[#ffffff17] cursor-pointer px-3 py-2 rounded-md text-lg font-md">
                Editor
              </li>
              <li className="hover:bg-[#ffffff17] cursor-pointer px-3 py-2 rounded-md text-lg font-md">
                Help
              </li>
            </ul>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleCopyCode}
              className="bg-[#ffffff17] text-white px-3 py-2 rounded-md focus:outline-none"
            >
              {isCopied ? "Copied" : "Copy Code"}
            </button>
            <button
              className={`text-white px-3 py-2 rounded-md focus:outline-none ${
                isSaved ? "bg-green-500" : "bg-yellow-500"
              }`}
            >
              {isSaved ? "Saved" : "Unsaved"}
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="bg-[#ffffff17] text-white px-3 py-2 pr-10 rounded-md focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button
                onClick={handleSearch}
                className="absolute inset-y-0 right-0 px-3 py-2 bg-[#ffffff20] text-white rounded-md focus:outline-none"
              >
                {/* Search Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <circle cx="10" cy="10" r="7" />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 15l5 5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </nav>

        <div className="p-1">
          {searchResults.length > 0 && (
            <h2 className="text-xl font-semibold mb-2 ml-4">Search Results</h2>
          )}
          <ul>
            {searchResults.map((result) => (
              <li
                key={result}
                onClick={() => handleFileSelect(`\\${result}`)}
                className="cursor-pointer hover:text-gray-400  ml-4"
              >
                {result}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } lg:block bg-neutral-900 text-white p-4 overflow-y-auto overflow-x-hidden w-72 border-r border-white transition-all duration-300 ease-in-out`}
          >
            <div className="flex items-center justify-between mb-4">
            <div className="flex flex-row"> 
            <span  className="mt-1 mr-2"> 
              <svg
                    className="w-5 h-5 "
                    fill="white"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"></path>
                  </svg>
                  </span>
            <span className="text-xl font-medium mt-[1px]">File Explorer</span>
              </div>
             
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden text-gray-400 hover:text-white focus:outline-none"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            <FileTree
              onSelect={handleFileSelect}
              tree={fileTree}
              selectedFile={selectedFile} // Pass the selectedFile prop here
            />
          </div>
          <div className="flex-1 flex flex-col bg-neutral-800 overflow-auto no-scrollbar">
            {/* Tab Bar */}
            <div className="bg-neutral-900 text-white flex space-x-2 p-2">
              {openFiles.map((file) => (
                <div
                  key={file}
                  className={`flex items-center cursor-pointer p-2 rounded-t-md ${
                    selectedFile === file
                      ? "bg-neutral-700 text-[#c4ff45]"
                      : "bg-neutral-900 hover:bg-neutral-700"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"></path>
                  </svg>
                  <span onClick={() => handleFileSelect(file)} className="mr-2">
                    {file.split("/").pop()}
                  </span>
                  <button
                    onClick={() => handleCloseFile(file)}
                    className="text-red-400 hover:text-red-600 focus:outline-none"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
            {/* Code Editor */}
            <div className="flex-1 bg-neutral-800 p-4 relative overflow-auto h-[300px]">
              {selectedFile && (
                <p className="text-sm mb-2 text-gray-400">
                  {selectedFile.replaceAll("/", " > ")}
                </p>
              )}
              <AceEditor
                width="100%"
                mode={selectedLanguage}
                value={code}
                onChange={(e) => setCode(e)}
                selection={selection}
                className="h-[100px] rounded"
                enableBasicAutocompletion={true}
                enableLiveAutocompletion={true}
                fontSize={16}
                style={{
                  backgroundColor: "#1f1f1f",
                  color: "#d4d4d4",
                  fontFamily: "Cascadia Code, monospace",
                }}
                theme={editorTheme}
              />
            </div>
            {/* Status Bar */}
            <div className="bg-neutral-800 text-gray-400 p-2 flex justify-between">
              <span>Ln 1, Col 1</span>
              <span>{formatTime(codingTime)}</span>

              <span>UTF-8</span>
              <span>JavaScript</span>
            </div>
            {/* Terminal */}
            <div className="my-20"> </div>
            <div className="bg-neutral-800 text-white p-4 flex items-center justify-between h-[80px] font-mono">
              <Terminal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
