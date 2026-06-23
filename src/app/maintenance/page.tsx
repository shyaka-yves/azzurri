"use client";

import React from "react";
import Image from "next/image";

export default function MaintenancePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-[#050509]">
      {/* Dynamic Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-azzurri-blue/5 rounded-full blur-[150px] animate-pulse" />
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px] animate-bounce-slow" />
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-azzurri-blue/10 rounded-full blur-[120px] animate-bounce-slow delay-1000" />

      <div className="z-10 flex flex-col items-center text-center px-6 max-w-3xl">
        {/* Logo */}
        <div className="mb-12 animate-fade-in">
          <Image
            src="/logo.png"
            alt="Azzurri Logo"
            width={320}
            height={100}
            className="h-auto w-48 md:w-64 lg:w-[280px] drop-shadow-[0_0_15px_rgba(212,175,55,0.2)]"
            priority
          />
        </div>

        {/* Content Card */}
        <div className="p-8 md:p-12 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-azzurri-blue/5 opacity-50" />
          
          <div className="relative z-10">
            <h1 className="heading-font text-4xl md:text-5xl font-medium mb-6 tracking-tight text-[#EFD077]">
              Refining the Experience
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed font-light">
              We are currently perfecting our digital home to better serve you. 
              The Azzurri experience will return shortly with something extraordinary.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 transition-colors hover:bg-white/10">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold"></span>
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-gold">
                  System Upgrade
                </span>
              </div>
              
              <div className="hidden sm:block w-px h-6 bg-white/10" />

              <div className="text-[12px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                Kigali, Rwanda
              </div>
            </div>
          </div>
        </div>

        {/* Status Hint */}
        <p className="mt-12 text-zinc-500 text-sm tracking-widest uppercase animate-pulse">
          Launching Soon
        </p>
      </div>

      {/* Decorative borders */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-azzurri-blue/30 to-transparent" />
      
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-30px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 10s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fadeIn 1.5s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
}
