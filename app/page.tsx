"use client";

import { useState, useEffect } from "react";
import DepartmentChat from "@/components/DepartmentChat";
import PrivateChat from "@/components/PrivateChat";
import GroupChat from "@/components/GroupChat";
import { useRouter } from "next/navigation";
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "department" | "private" | "group"
  >("private");
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const router = useRouter();

  // Get token once
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";

  // Use the notification socket hook with a callback for new notifications
  useNotificationSocket(token, (newNotification) => {
    setNotifications((prev) => [newNotification, ...prev]);
  });

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [router, token]);

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    router.push("/login");
  }

  return (
    <section className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300 bg-white relative">
          <h1 className="text-2xl font-semibold text-gray-700">Chats</h1>

          <div className="flex items-center space-x-4 relative">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications((prev) => !prev)}
                className="relative focus:outline-none"
              >
                <svg
                  className="w-6 h-6 text-gray-700 hover:text-gray-900 transition"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications.length}
                </span>
              </button>

              {/* Dropdown Messages */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-80 overflow-auto">
                  <ul className="divide-y divide-gray-200">
                    {notifications.length === 0 ? (
                      <li className="px-4 py-2 text-center text-gray-500">
                        No new notifications
                      </li>
                    ) : (
                      notifications.map((notif) => (
                        <li
                          key={notif.id}
                          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                          <span className="font-semibold text-sm text-gray-700">
                            {notif.title || "Notification"}:
                          </span>{" "}
                          <span className="text-sm text-gray-600">
                            {notif.message}
                          </span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              )}
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="
        bg-red-600 hover:bg-red-700
        text-white font-medium
        py-2 px-4 rounded-md shadow
        transition duration-300 ease-in-out
        focus:outline-none focus:ring-2
        focus:ring-red-400 focus:ring-opacity-75
      "
            >
              Logout
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b border-gray-400 px-6">
          <button
            onClick={() => setActiveTab("department")}
            className={`relative px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeTab === "department"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-800"
            }`}
          >
            Department
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              1
            </span>
          </button>

          <button
            onClick={() => setActiveTab("private")}
            className={`px-4 py-2 text-sm font-medium transition-colors -mb-[1px] border-b-2 ${
              activeTab === "private"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-800"
            }`}
          >
            Private
          </button>

          <button
            onClick={() => setActiveTab("group")}
            className={`px-4 py-2 text-sm font-medium transition-colors -mb-[1px] border-b-2 ${
              activeTab === "group"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-gray-800"
            }`}
          >
            Group
          </button>
        </div>

        {/* Chat Content */}
        <div className="h-[600px] px-6 py-4">
          {activeTab === "department" ? (
            <DepartmentChat />
          ) : activeTab === "private" ? (
            <PrivateChat />
          ) : (
            <GroupChat />
          )}
        </div>
      </div>
    </section>
  );
}
