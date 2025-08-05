"use client";

import Image from "next/image";
import { useState, useRef } from "react";

interface User {
  id: number;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  isOnline: boolean;
}

interface Message {
  id: number;
  sender: string;
  content?: string;
  timestamp: string;
  isOwn: boolean;
  type: "text" | "image" | "voice";
  imageUrl?: string;
  voiceUrl?: string;
  voiceDuration?: number;
}

const PrivateChat = () => {
  const [users] = useState<User[]>([
    {
      id: 1,
      name: "Moller Magdy",
      lastMessage: "Lorem ipsum dolor sit amet...",
      timestamp: "1 day ago",
      avatar: "MM",
      isOnline: true,
    },
    {
      id: 2,
      name: "Moller Magdy",
      lastMessage: "Lorem ipsum dolor sit amet...",
      timestamp: "1 day ago",
      avatar: "MM",
      isOnline: false,
    },
    {
      id: 3,
      name: "Moller Magdy",
      lastMessage: "Lorem ipsum dolor sit amet...",
      timestamp: "1 day ago",
      avatar: "MM",
      isOnline: true,
    },
    {
      id: 4,
      name: "Moller Magdy",
      lastMessage: "Lorem ipsum dolor sit amet...",
      timestamp: "1 day ago",
      avatar: "MM",
      isOnline: false,
    },
    {
      id: 5,
      name: "Moller Magdy",
      lastMessage: "Lorem ipsum dolor sit amet...",
      timestamp: "1 day ago",
      avatar: "MM",
      isOnline: true,
    },
  ]);

  const [selectedUser, setSelectedUser] = useState<User | null>();
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "Doctor Name",
      content:
        "Quisque ac ante vel eros tempor faucibus. View the discharge summary in the patient records.",
      timestamp: "4 days ago",
      isOwn: false,
      type: "text",
    },
    {
      id: 2,
      sender: "You",
      content:
        "Quisque ac ante vel eros tempor faucibus. View the discharge summary in the patient records.",
      timestamp: "4 days ago",
      isOwn: true,
      type: "text",
    },
    {
      id: 3,
      sender: "Doctor Name",
      content:
        "Quisque ac ante vel eros tempor faucibus. View the discharge summary in the patient records.",
      timestamp: "4 days ago",
      isOwn: false,
      type: "text",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        content: newMessage,
        timestamp: "now",
        isOwn: true,
        type: "text",
      };
      setMessages([...messages, message]);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      const message: Message = {
        id: messages.length + 1,
        sender: "You",
        timestamp: "now",
        isOwn: true,
        type: "image",
        imageUrl: imageUrl,
      };
      setMessages([...messages, message]);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        const voiceUrl = URL.createObjectURL(blob);
        const message: Message = {
          id: messages.length + 1,
          sender: "You",
          timestamp: "now",
          isOwn: true,
          type: "voice",
          voiceUrl: voiceUrl,
          voiceDuration: recordingTime,
        };
        setMessages([...messages, message]);

        // Stop all tracks to release microphone
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderMessage = (message: Message) => {
    switch (message.type) {
      case "image":
        return (
          <div
            className={`rounded-lg overflow-hidden ${
              message.isOwn ? "bg-blue-600" : "bg-gray-200"
            }`}
          >
            <Image
              src={`${message.imageUrl}`}
              alt="Shared image"
              className="max-w-xs max-h-60 object-cover"
              width={200}
              height={200}
            />
          </div>
        );
      case "voice":
        return (
          <div
            className={`px-4 py-3 rounded-lg flex items-center space-x-3 ${
              message.isOwn
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <audio controls className="flex-1">
              <source src={message.voiceUrl} type="audio/wav" />
              Your browser does not support audio playback.
            </audio>
            <span className="text-xs">
              {message.voiceDuration
                ? formatTime(message.voiceDuration)
                : "0:00"}
            </span>
          </div>
        );
      default:
        return (
          <div
            className={`px-4 py-2 rounded-lg ${
              message.isOwn
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-800"
            }`}
          >
            <p className="text-sm">{message.content}</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full">
      {/* User List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        {/* Search Bar */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for Name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
        {/* User List */}
        <div className="flex-1 overflow-y-auto">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUser(user)}
              className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                selectedUser?.id === user.id ? "bg-blue-50 border-blue-200" : ""
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.avatar}
                    </span>
                  </div>
                  {user.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.timestamp}</p>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {user.lastMessage}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {selectedUser.avatar}
                    </span>
                  </div>
                  {selectedUser.isOnline && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
                    {!message.isOwn && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            {message.sender.charAt(0)}
                          </span>
                        </div>
                      </div>
                    )}

                    <div
                      className={`flex flex-col ${
                        message.isOwn ? "items-end" : "items-start"
                      }`}
                    >
                      {!message.isOwn && (
                        <span className="text-sm font-medium text-gray-700 mb-1">
                          {message.sender}
                        </span>
                      )}

                      {renderMessage(message)}

                      <span className="text-xs text-gray-500 mt-1">
                        {message.timestamp}
                      </span>
                    </div>

                    {message.isOwn && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-medium">
                            Y
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-end space-x-3">
                {/* Textarea + Attachments in one field */}
                <div className="flex items-center bg-gray-300 border border-gray-300 rounded-xl w-full px-3 py-2">
                  {/* Textarea */}
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="flex-1 bg-transparent resize-none focus:outline-none"
                    rows={1}
                    disabled={isRecording}
                  />

                  {/* Image Upload Button */}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md ml-2"
                    title="Send image"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </button>

                  {/* Voice Recording Button */}
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-1 rounded-md ml-1 transition-colors ${
                      isRecording
                        ? "text-blue-600 bg-blue-50 hover:bg-blue-100"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                    title={
                      isRecording ? "Stop recording" : "Record voice message"
                    }
                  >
                    {isRecording ? (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">
                          {formatTime(recordingTime)}
                        </span>
                      </div>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                        />
                      </svg>
                    )}
                  </button>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isRecording}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4l16 8-16 8 4-8-4-8z"
                    />
                  </svg>
                </button>
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrivateChat;
