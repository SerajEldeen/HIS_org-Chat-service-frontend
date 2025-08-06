"use client";

import { useState } from "react";
import DepartmentChat from "@/components/DepartmentChat";
import PrivateChat from "@/components/PrivateChat";
import GroupChat from "@/components/GroupChat";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "department" | "private" | "group"
  >("department");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-white border-gray-300 px-6 py-0">
          <h1 className="text-2xl font-semibold text-gray-400 mb-4">Chats</h1>

          {/* Tab Navigation */}
          <div className="flex space-x-1 border-b border-gray-400">
            {/* Department Tab */}
            <button
              onClick={() => setActiveTab("department")}
              className={`relative px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
                activeTab === "department"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-800 "
              }`}
            >
              Department
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                1
              </span>
            </button>

            {/* Private Tab */}
            <button
              onClick={() => setActiveTab("private")}
              className={`px-4 py-2 text-sm font-medium transition-colors -mb-[1px] border-b-2 ${
                activeTab === "private"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-800 "
              }`}
            >
              Private
            </button>

            {/* Group Tab */}
            <button
              onClick={() => setActiveTab("group")}
              className={`px-4 py-2 text-sm font-medium transition-colors -mb-[1px] border-b-2 ${
                activeTab === "group"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-gray-800 "
              }`}
            >
              Group
            </button>
          </div>
        </div>

        {/* Chat Content */}
        <div className="h-[600px]">
          {activeTab === "department" ? (
            <DepartmentChat />
          ) : activeTab === "private" ? (
            <PrivateChat />
          ) : (
            <GroupChat />
          )}
        </div>
      </div>
    </div>
  );
}
