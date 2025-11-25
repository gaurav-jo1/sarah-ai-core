// src/App.tsx
import React, { useState } from 'react';
import { FaPaperclip } from 'react-icons/fa'; // For file upload icon
import { MdSend } from 'react-icons/md'; // For send icon

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here (e.g., send text and/or file to API)
    console.log('Submitted:', { text: inputValue, file: selectedFile });
    setInputValue('');
    setSelectedFile(null);
    // Reset file input
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  return (
    <div className="min-h-screen bg-black text-white relative flex flex-col justify-end p-4">
      {/* Welcome Text - Centered in the Middle with Neon Blue Effect */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1 className="text-3xl md:text-5xl font-bold text-center tracking-wide pb-25">
          <span className="bg-linear-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
            Let Sarah Help You Work Smarter
          </span>
        </h1>
      </div>

      {/* Input Form - Remains at Bottom */}
      <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-8 relative z-20">
        <div className="relative flex items-center bg-gray-900 border border-gray-700 rounded-full px-4 py-3 shadow-lg">
          {/* File Upload Button */}
          <label htmlFor="file-upload" className="mr-3 cursor-pointer hover:bg-gray-800 p-2 rounded-full transition-colors">
            <FaPaperclip className="w-5 h-5 text-gray-400" />
          </label>
          <input
            id="file-upload"
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept="image/*,application/pdf,text/*,.doc,.docx"
          />

          {/* Text Input */}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Ask me anything"
            className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-400 mr-3"
          />

          {/* Send Button */}
          <button
            type="submit"
            disabled={!inputValue && !selectedFile}
            className="p-2 rounded-full hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <MdSend className="w-5 h-5 text-blue-500" />
          </button>
        </div>

        {/* Optional: Show selected file name */}
        {selectedFile && (
          <p className="text-center text-xs text-gray-400 mt-2 truncate">{selectedFile.name}</p>
        )}
      </form>
    </div>
  );
};

export default App;