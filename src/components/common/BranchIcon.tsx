import React from 'react';
import { Heart, Brain, Palette, Handshake, Castle, Dumbbell, Sparkles } from 'lucide-react';
import { BranchId } from '../../types';

interface BranchIconProps {
  branchId: BranchId;
  className?: string;
  size?: number;
}

export const BranchIcon: React.FC<BranchIconProps> = ({ branchId, className = '', size = 20 }) => {
  switch (branchId) {
    case 'body':
      return <Heart size={size} className={className} />;
    case 'mind':
      return <Brain size={size} className={className} />;
    case 'craft':
      return <Palette size={size} className={className} />;
    case 'bonds':
      return <Handshake size={size} className={className} />;
    case 'empire':
      return <Castle size={size} className={className} />;
    default:
      return <Sparkles size={size} className={className} />;
  }
};

export const BranchAltIcon: React.FC<BranchIconProps> = ({ branchId, className = '', size = 20 }) => {
  switch (branchId) {
    case 'body':
      return <Dumbbell size={size} className={className} />;
    case 'mind':
      return <Brain size={size} className={className} />;
    case 'craft':
      return <Sparkles size={size} className={className} />;
    case 'bonds':
      return <Handshake size={size} className={className} />;
    case 'empire':
      return <Castle size={size} className={className} />;
    default:
      return <Heart size={size} className={className} />;
  }
};

