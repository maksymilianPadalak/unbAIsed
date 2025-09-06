'use client';

import React from 'react';

interface StarryLoaderProps {
  title: string;
  subtitle?: string;
  size?: 'small' | 'medium' | 'large';
}

export default function StarryLoader({ 
  title, 
  subtitle,
  size = 'medium'
}: StarryLoaderProps) {
  const sizeClasses = {
    small: {
      container: 'p-6',
      spinner: 'w-24 h-24',
      center: 'w-8 h-8',
      title: 'text-xl',
      subtitle: 'text-sm'
    },
    medium: {
      container: 'p-8',
      spinner: 'w-32 h-32',
      center: 'w-10 h-10',
      title: 'text-2xl',
      subtitle: 'text-base'
    },
    large: {
      container: 'p-12',
      spinner: 'w-48 h-48',
      center: 'w-16 h-16',
      title: 'text-4xl',
      subtitle: 'text-lg'
    }
  };

  const classes = sizeClasses[size];

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className={`brutalist-border bg-gradient-to-br from-gray-900 via-black to-purple-900/30 ${classes.container} text-center overflow-hidden relative`}>
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
          {/* Central spinner animation */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              {/* Outer ring */}
              <div className={`${classes.spinner} border-4 border-white border-opacity-30 rounded-full animate-spin`} 
                   style={{ animationDuration: '8s' }} />
              
              {/* Middle ring */}
              <div className="absolute inset-6 border-4 border-purple-400 border-opacity-40 rounded-full animate-spin" 
                   style={{ animationDirection: 'reverse', animationDuration: '6s' }} />
              
              {/* Inner ring */}
              <div className="absolute inset-12 border-4 border-cyan-400 border-opacity-50 rounded-full animate-spin" 
                   style={{ animationDuration: '4s' }} />
              
              {/* Center dot */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`${classes.center} bg-gradient-to-r from-purple-400 to-cyan-400 rounded-full animate-pulse`} />
              </div>
            </div>
          </div>

          {/* Status message */}
          <div className="mt-8">
            <h3 className={`${classes.title} font-black font-mono text-white uppercase tracking-wider mb-2`}>
              <span className="bg-gradient-to-r from-purple-400 via-white to-cyan-400 bg-clip-text text-transparent animate-pulse">
                {title}
              </span>
            </h3>
            {subtitle && (
              <p className={`${classes.subtitle} text-purple-300 font-mono uppercase tracking-widest`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
