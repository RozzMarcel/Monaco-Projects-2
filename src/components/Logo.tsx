import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sizes = {
    sm: {
      text: 'text-lg',
      subtext: 'text-xs'
    },
    md: {
      text: 'text-2xl',
      subtext: 'text-sm'
    },
    lg: {
      text: 'text-4xl',
      subtext: 'text-sm'
    }
  };

  const colors = {
    light: {
      text: 'text-white',
      subtext: 'text-white/80'
    },
    dark: {
      text: 'text-monaco-bronze',
      subtext: 'text-gray-500'
    }
  };

  return (
    <div className="flex flex-col items-start">
      <span className={`${sizes[size].text} font-bold ${colors[variant].text}`}>
        MONACO PROJECTS
      </span>
      <span className={`${sizes[size].subtext} ${colors[variant].subtext} tracking-wider`}>
        INTERIOR DESIGN & RENOVATION MANAGEMENT
      </span>
    </div>
  );
}

export default Logo;