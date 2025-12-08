import React, { useState, useRef } from 'react';
import { Send, Plus, X } from 'lucide-react';

interface FileChipProps {
  fileName: string;
  onRemove: () => void;
}

// Reusable component for displaying selected file chips
const FileChip: React.FC<FileChipProps> = ({ fileName, onRemove }) => (
  <div className="flex items-center bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2">
    <span>{fileName}</span>
    <button
      onClick={onRemove}
      className="ml-2 -mr-1 p-1 rounded-full hover:bg-indigo-200 transition-colors"
      aria-label={`Remove file ${fileName}`}
    >
      <X size={14} />
    </button>
  </div>
);

const ChatPage: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setSelectedFiles(prev => [...prev, ...Array.from(files)]);

    // Reset input so user can re-upload the same file
    event.target.value = "";
  };

  const handleRemoveFile = (fileNameToRemove: string) => {
    setSelectedFiles((prevFiles) => prevFiles.filter(file => file.name !== fileNameToRemove));
  };

  const handleSendMessage = () => {
    if (message.trim() || selectedFiles.length > 0) {
      console.log("Sending message:", message);
      console.log("Sending files:", selectedFiles);
      // Here you would typically send data to your backend/AI model

      // Clear inputs after sending
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Allow Shift+Enter for new lines
      event.preventDefault(); // Prevent default form submission
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative bg-white">
      <main className="flex-1 overflow-y-auto p-8 flex justify-center items-center">
        <div className="text-center max-w-2xl">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            Sarah.AI: Your AI Supply Chain Expert
          </h1>
          <p className="text-xl text-gray-600 font-serif">
            <strong>Hi! I'm Mini Sarah.AI.</strong> I take over from spreadsheets and old systems to run your supply chain automatically and intelligently.
          </p>
        </div>
      </main>

      {/* Fixed Bottom Input Area */}
      <div className="sticky bottom-0 w-full bg-white p-4 border-gray-200"> {/* Lighter background, subtle shadow */}
        <div className="max-w-4xl mx-auto">

          {/* File Chips Display Area */}
          {selectedFiles.length > 0 && (
            <div className="flex flex-wrap items-center mb-3">
              {selectedFiles.map((file, index) => (
                <FileChip
                  key={file.name + index} // Use index as well if file names aren't unique
                  fileName={file.name}
                  onRemove={() => handleRemoveFile(file.name)}
                />
              ))}
            </div>
          )}

          <div className="flex items-center space-x-3 bg-gray-100 border border-indigo-200  rounded-full p-1 pr-3 "> {/* Curved background for input group */}

            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              multiple // Allow multiple file selection
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload File Button (visible) */}
            <button
              onClick={() => fileInputRef.current?.click()} // Trigger hidden input click
              className="p-3 text-gray-600 hover:text-indigo-600 rounded-full transition-colors flex items-center justify-center hover:cursor-pointer"
              aria-label="Upload File"
            >
              <Plus size={24} />
            </button>

            {/* Text Input Field */}
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Mini Sarah.AI to analyze your supply chain data..."
              className="flex-1 p-2 bg-gray-100 border-none focus:outline-none text-gray-800 placeholder-gray-500" // No border, transparent background
            />

            {/* Send Button */}
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() && selectedFiles.length === 0} // Disable if no text and no files
              className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors disabled:bg-indigo-300 disabled:cursor-not-allowed flex items-center justify-center"
              aria-label="Send Message"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;