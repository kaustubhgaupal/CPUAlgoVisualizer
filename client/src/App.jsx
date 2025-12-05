import React from "react";
import CPUScheduler from "./pages/CPUScheduler";
import ChatBot from "./components/ChatBot";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />
      <main className="flex-1 p-4">
        <CPUScheduler />
      </main>
      <ChatBot />
      <Footer />
    </div>
  );
}
