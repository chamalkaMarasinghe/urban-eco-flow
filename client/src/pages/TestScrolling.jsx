import React, { useState } from "react";

const TwoColumnLayout = () => {
  const [content, setContent] = useState([
    "Right Column (dynamic height based on content)",
    "Add more content here to see how the height changes.",
  ]);

  const addContent = () => {
    setContent([
      ...content,
      "Here's some more content.",
      "Even more content to test the dynamic height adjustment!",
    ]);
  };

  return (
    <div className="grid grid-cols-2 h-screen">
      {/* Left Column */}
      <div className="bg-blue-200 h-[150vh]">Left Column (fixed height)</div>

      {/* Right Column */}
      <div className="bg-green-200 overflow-auto p-4">
        {content.map((item, index) => (
          <p key={index}>{item}</p>
        ))}
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={addContent}
        >
          Add More Content
        </button>
      </div>
    </div>
  );
};

export default TwoColumnLayout;
