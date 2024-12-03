import React, { useState } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatStarted, setChatStarted] = useState(false);

  const startChat = () => {
    setChatStarted(true);
  };

  const handleSend = async () => {
    if (input.trim() === "") return;

    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");

    try {
      console.log("Sending data:", { text: input });

      const response = await fetch("http://localhost:8000/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });

      if (response.ok) {
        const data = await response.json();

        const imageUrl = data.image_url;

        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "chatbot",
            text: "Here is your image:",
            image: imageUrl,
          },
        ]);
      } else {
        const data = await response.json();
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: "chatbot", text: `Error: ${data.detail}` },
        ]);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "chatbot", text: "Error: " + error.message },
      ]);
    }
  };

  return (
    <div className="App">
      {!chatStarted ? (
        <div className="welcome-screen">
          <h1>Welcome to the Image Generation Model</h1>
          <p>Provide the details for an image, and I'll generate it for you!</p>
          <button className="start-chat-button" onClick={startChat}>
            Start Chat
          </button>
        </div>
      ) : (
        <div className="chat-interface">
          <aside className="sidemenu">
            <div className="side-menu-button" onClick={() => setMessages([])}>
              <span>+</span>
              New Chat
            </div>
          </aside>
          <section className="chatbox">
            <div className="chat-log">
              {messages.map((message, index) => (
                <ChatMessage
                  key={index}
                  sender={message.sender}
                  text={message.text}
                  image={message.image}
                />
              ))}
            </div>
            <div className="chat-input-holder">
              <textarea
                rows="1"
                className="chat-input-textarea"
                placeholder="Type your message here"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              ></textarea>
              <button className="send-button" onClick={handleSend}>
                Send
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function ChatMessage({ sender, text, image }) {
  return (
    <div className={`chat-message ${sender}`}>
      <div
        className={`chat-message-center ${
          sender === "user" ? "user-message" : "ai-message"
        }`}
      >
        <div
          className={`avatar ${sender === "chatbot" ? "chatgpt-avatar" : ""}`}
        ></div>
        <div className="message">
          <p>{text}</p>
          {image && (
            <img src={image} alt="Generated" className="generated-image" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
