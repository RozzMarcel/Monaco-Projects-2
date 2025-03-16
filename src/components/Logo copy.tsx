import React from 'react';
import { Triangle } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const sizes = {
    sm: {
      icon: 'h-5 w-5',
      text: 'text-lg',
      subtext: 'text-xs'
    },
    md: {
      icon: 'h-6 w-6',
      text: 'text-2xl',
      subtext: 'text-sm'
    },
    lg: {
      icon: 'h-8 w-8',
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
      <div className="flex items-center">
        <Triangle className={`${sizes[size].icon} text-monaco-bronze rotate-180`} />
        <span className={`${sizes[size].text} font-bold ${colors[variant].text} ml-2`}>
          MONACO PROJECTS
        </span>
      </div>
      <span className={`${sizes[size].subtext} ${colors[variant].subtext} tracking-wider`}>
        INTERIOR DESIGN & RENOVATION MANAGEMENT
      </span>
    </div>
  );
}

export default Logo;