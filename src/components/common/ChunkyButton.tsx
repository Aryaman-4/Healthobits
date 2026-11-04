import React, { ButtonHTMLAttributes } from 'react';
import { sound } from '../../utils/audio';

interface ChunkyButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'green' | 'blue' | 'red' | 'yellow' | 'purple' | 'white' | 'gray';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const ChunkyButton: React.FC<ChunkyButtonProps> = ({
  children,
  variant = 'green',
  size = 'md',
  fullWidth = false,
  className = '',
  onClick,
  ...props
}) => {
  const variantStyles = {
    green: 'bg-[#58CC02] border-[#46A302] text-white hover:bg-[#61e002]',
    blue: 'bg-[#1CB0F6] border-[#1899D6] text-white hover:bg-[#28baff]',
    red: 'bg-[#FF4B4B] border-[#EA2B2B] text-white hover:bg-[#ff5f5f]',
    yellow: 'bg-[#FFC800] border-[#E5A400] text-[#3C3C3C] hover:bg-[#ffd220]',
    purple: 'bg-[#CE82FF] border-[#A560E8] text-white hover:bg-[#d696ff]',
    white: 'bg-white border-[#E5E5E5] text-[#3C3C3C] hover:bg-gray-50',
    gray: 'bg-[#E5E5E5] border-[#CCCCCC] text-[#777777] hover:bg-gray-300'
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl border-b-2 active:border-b-0 active:translate-y-[2px]',
    md: 'px-5 py-3 text-sm rounded-2xl border-b-4 active:border-b-0 active:translate-y-1',
    lg: 'px-7 py-4 text-base rounded-2xl border-b-4 active:border-b-0 active:translate-y-1'
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    sound.playTap();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`font-extrabold uppercase tracking-wider select-none cursor-pointer transition-all duration-75 flex items-center justify-center gap-2 border-2 border-t-0 border-l-0 border-r-0 ${
        variantStyles[variant]
      } ${sizeStyles[size]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

