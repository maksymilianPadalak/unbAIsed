'use client';

import React from 'react';

interface StarryAIProps {
  className?: string;
}

export default function StarryAI({ className = "" }: StarryAIProps) {
  return (
    <span className={`bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-pulse ${className}`}>
      AI
    </span>
  );
}
