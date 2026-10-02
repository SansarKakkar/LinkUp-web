import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { createSocketConnection } from "../utils/socket";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const { targetUserId } = useParams();

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [targetUser, setTargetUser] = useState(null);

  const user = useSelector((store) => store.user);
  const connections = useSelector((store) => store.connections);
  const userId = user?._id;

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // Check connections from redux store for instant target user info
  useEffect(() => {
    if (!targetUser && connections && Array.isArray(connections)) {
      const found = connections.find(
        (c) => (c._id || c).toString() === targetUserId?.toString()
      );
      if (found) setTargetUser(found);
    }
  }, [connections, targetUserId, targetUser]);

  // Format timestamp to HH:MM AM/PM
  const formatTime = (timestamp) => {
    if (!timestamp) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
      return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const fetchChatMessages = async () => {
    try {
      const chat = await axios.get(
        BASE_URL + "/chat/" + targetUserId,
        {
          withCredentials: true,
        }
      );

      // Extract target user details from populated participants
      const participants = chat?.data?.participants;
      if (Array.isArray(participants)) {
        const other = participants.find(
          (p) => (p._id || p).toString() === targetUserId?.toString()
        );
        if (other) setTargetUser(other);
      }

      const chatMessages = chat?.data?.messages?.map((msg) => {
        const { senderId, text, createdAt } = msg;

        return {
          firstName: senderId?.firstName,
          lastName: senderId?.lastName,
          text,
          createdAt: createdAt || msg.createdAt,
        };
      });

      setMessages(chatMessages || []);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  useEffect(() => {
    fetchChatMessages();
  }, [targetUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = createSocketConnection();

    socketRef.current.emit("joinChat", {
      firstName: user.firstName,
      userId,
      targetUserId,
    });

    const handleIncomingMessage = ({ firstName, lastName, text, createdAt }) => {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          firstName,
          lastName,
          text,
          createdAt: createdAt || new Date().toISOString(),
        },
      ]);
    };

    socketRef.current.on("messageReceived", handleIncomingMessage);

    return () => {
      if (socketRef.current) {
        socketRef.current.off("messageReceived", handleIncomingMessage);
        socketRef.current.disconnect();
      }
    };
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      lastName: user.lastName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-4">
      <div className="bg-base-200 border border-gray-600 rounded-2xl shadow-xl h-[70vh] flex flex-col overflow-hidden">
        {/* Header: Displays Target Person's Name & Photo */}
        <div className="p-5 border-b border-gray-600 flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              {targetUser?.photoUrl ? (
                <img
                  src={targetUser.photoUrl}
                  alt={targetUser.firstName || "User"}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-primary shadow-md"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center font-bold text-white text-lg shadow-md">
                  {targetUser?.firstName?.charAt(0) || "👤"}
                </div>
              )}
              <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full absolute bottom-0 right-0 ring-2 ring-base-100"></span>
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight tracking-wide text-base-content">
                {targetUser ? `${targetUser.firstName} ${targetUser.lastName || ""}` : "Chat"}
              </h2>
              <span className="text-xs text-emerald-400 font-medium">Online</span>
            </div>
          </div>
        </div>

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-base-content/50 gap-3">
              <div className="w-16 h-16 rounded-full bg-base-300 flex items-center justify-center text-3xl">
                👋
              </div>
              <p className="text-sm font-medium">
                Start a conversation with {targetUser?.firstName || "this user"}!
              </p>
            </div>
          ) : (
            messages.map((msg, index) => {
              const isSender = user.firstName === msg.firstName;
              return (
                <div
                  key={index}
                  className={`chat ${isSender ? "chat-end" : "chat-start"}`}
                >
                  <div className="chat-header text-xs opacity-75 mb-1 px-1 flex items-center gap-1.5">
                    <span className="font-semibold">{msg.firstName}</span>
                    <time className="text-[11px] opacity-60 font-mono">
                      {formatTime(msg.createdAt)}
                    </time>
                  </div>

                  <div
                    className={`chat-bubble shadow-md text-sm leading-relaxed ${
                      isSender
                        ? "chat-bubble-primary text-primary-content"
                        : "bg-base-300 text-base-content"
                    }`}
                  >
                    {msg.text}
                  </div>

                  <div className="chat-footer opacity-50 text-[10px] mt-0.5 px-1">
                    {isSender ? "Sent" : "Seen"}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="p-5 border-t border-gray-600 flex items-center gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            className="flex-1 border border-gray-500 text-white rounded p-2 focus:outline-none"
            placeholder="Type a message..."
          />

          <button
            onClick={sendMessage}
            className="btn btn-secondary"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
