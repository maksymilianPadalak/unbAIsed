'use client';

import React from 'react';
import { Brain } from 'lucide-react';

interface ResearchAnimationProps {
  companyName: string;
}

export default function ResearchAnimation({ companyName }: ResearchAnimationProps) {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="brutalist-border bg-gradient-to-br from-gray-900 via-black to-purple-900/30 p-12 text-center overflow-hidden relative">
        {/* Animated space background */}
        <div className="absolute inset-0 opacity-30">
          {/* Stars */}
          {[...Array(50)].map((_, i) => (
            <div
              key={`star-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
          
          {/* Shooting stars */}
          {[...Array(3)].map((_, i) => (
            <div
              key={`shooting-${i}`}
              className="absolute w-20 h-0.5 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse"
              style={{
                left: `${Math.random() * 80}%`,
                top: `${20 + Math.random() * 60}%`,
                transform: `rotate(${-30 + Math.random() * 60}deg)`,
                animationDelay: `${i * 2}s`,
                animationDuration: '4s'
              }}
            />
          ))}
          
          {/* Purple nebula effect */}
          <div className="absolute inset-0 bg-gradient-radial from-purple-600/10 via-transparent to-transparent animate-pulse" />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          {/* Company name with glow effect */}
          <div className="mb-12">
            <div className="inline-block p-4 border-2 border-purple-500/50 rounded-lg bg-purple-500/10 mb-4">
              <h2 className="text-4xl font-black font-mono text-white uppercase tracking-wider">
                <span className="bg-gradient-to-r from-purple-400 via-white to-purple-400 bg-clip-text text-transparent animate-pulse">
                  {companyName}
                </span>
              </h2>
            </div>
            <p className="text-purple-300 font-mono text-sm uppercase tracking-widest">
              ETHICAL ANALYSIS IN PROGRESS
            </p>
          </div>

          {/* Central brain animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div className="w-48 h-48 border-4 border-white border-opacity-30 rounded-full animate-spin" 
                   style={{ animationDuration: '8s' }} />
              
              {/* Middle ring */}
              <div className="absolute inset-6 border-4 border-purple-400 border-opacity-40 rounded-full animate-spin" 
                   style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
              
              {/* Inner ring */}
              <div className="absolute inset-12 border-4 border-cyan-400 border-opacity-50 rounded-full animate-spin" 
                   style={{ animationDuration: '4s' }} />
              
              {/* Brain in center */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-16 h-16 text-purple-400 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Simple status message */}
          <div className="mt-8">
            <h3 className="text-2xl font-black font-mono text-white uppercase tracking-wider">
              <span className="bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                NOT FOUND IN DATABASE. DOING RESEARCH!
              </span>
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
