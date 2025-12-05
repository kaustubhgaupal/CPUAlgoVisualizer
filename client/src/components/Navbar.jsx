import React from "react";

export default function Navbar() {
  return (
    <header className="w-full bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
            CPU
          </div>
          <div>
            <h1 className="text-lg font-semibold text-slate-800">
              CPU Scheduling Simulator
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Visualize FCFS, SJF, Priority and Round Robin with an AI tutor.
            </p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-3 text-xs text-slate-500">
          <span className="px-2 py-1 rounded-full bg-slate-100">
            AI Assistant Enabled 🤖
          </span>
        </div>
      </div>
    </header>
  );
}
