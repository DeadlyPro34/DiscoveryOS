/**
 * AnimatedCharacter Component
 * Fully visible SVG figures for DiscoveryOS brand
 * 
 * Features:
 * - 100px x 130px inline SVG
 * - Brand palette colors with opacity 0.85
 * - Animated parts (bounce, float, rotate)
 * - Position absolute bottom-right with pointer-events-none
 */

import React from 'react';

interface AnimatedCharacterProps {
  variant?: 'happy' | 'thinking' | 'excited' | 'cool';
  color?: '#E8521A' | '#F5E6A3' | '#F0C040' | '#4DD9AC';
}

export function AnimatedCharacter({
  variant = 'happy',
  color = '#4DD9AC',
}: AnimatedCharacterProps): React.ReactElement {
  const animations = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-8px); }
    }
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-12px); }
    }
    @keyframes wave {
      0%, 100% { transform: rotate(0deg); transform-origin: 85px 45px; }
      25% { transform: rotate(25deg); transform-origin: 85px 45px; }
      75% { transform: rotate(-15deg); transform-origin: 85px 45px; }
    }
    @keyframes headNod {
      0%, 100% { transform: rotateZ(0deg); transform-origin: 50px 35px; }
      50% { transform: rotateZ(5deg); transform-origin: 50px 35px; }
    }
  `;

  const renderFace = () => {
    switch (variant) {
      case 'thinking':
        return (
          <>
            {/* Head */}
            <circle cx="50" cy="35" r="20" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
            {/* Eyes - thinking */}
            <circle cx="44" cy="32" r="1.5" fill="#1a1a1a" />
            <circle cx="56" cy="32" r="1.5" fill="#1a1a1a" />
            {/* Mouth - thinking (straight line) */}
            <path d="M 44 38 L 56 38" stroke="#1a1a1a" strokeWidth="1.5" fill="none" />
            {/* Thinking bubble */}
            <circle cx="65" cy="20" r="4" fill="#F0C040" stroke="#1a1a1a" strokeWidth="1" opacity="0.85" />
            <circle cx="68" cy="15" r="2.5" fill="#F0C040" stroke="#1a1a1a" strokeWidth="1" opacity="0.85" />
          </>
        );
      case 'excited':
        return (
          <>
            {/* Head */}
            <circle cx="50" cy="35" r="20" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
            {/* Eyes - excited (wide) */}
            <circle cx="44" cy="32" r="2" fill="#1a1a1a" />
            <circle cx="56" cy="32" r="2" fill="#1a1a1a" />
            {/* Mouth - excited (big smile) */}
            <path d="M 44 37 Q 50 41 56 37" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
            {/* Eyebrows - excited */}
            <path d="M 42 28 L 46 27" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 54 27 L 58 28" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      case 'cool':
        return (
          <>
            {/* Head */}
            <circle cx="50" cy="35" r="20" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
            {/* Sunglasses - left lens */}
            <rect x="38" y="29" width="6" height="5" rx="1" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
            {/* Sunglasses - right lens */}
            <rect x="56" y="29" width="6" height="5" rx="1" fill="none" stroke="#1a1a1a" strokeWidth="1.5" />
            {/* Sunglasses - bridge */}
            <line x1="44" y1="31" x2="56" y2="31" stroke="#1a1a1a" strokeWidth="1.5" />
            {/* Mouth - cool (straight) */}
            <path d="M 44 38 L 56 38" stroke="#1a1a1a" strokeWidth="1.5" strokeLinecap="round" />
          </>
        );
      default: // happy
        return (
          <>
            {/* Head */}
            <circle cx="50" cy="35" r="20" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
            {/* Eyes */}
            <circle cx="44" cy="32" r="1.5" fill="#1a1a1a" />
            <circle cx="56" cy="32" r="1.5" fill="#1a1a1a" />
            {/* Mouth - smile */}
            <path d="M 44 36 Q 50 39 56 36" stroke="#1a1a1a" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <>
      <style>{animations}</style>
      <svg
        width="100"
        height="130"
        viewBox="0 0 100 130"
        style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      >
        {/* Body */}
        <g style={{ animation: 'float 3s ease-in-out infinite' }}>
          {/* Torso */}
          <rect x="40" y="55" width="20" height="25" rx="3" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
          {/* Arms */}
          <rect x="25" y="60" width="15" height="8" rx="4" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
          <rect x="60" y="60" width="15" height="8" rx="4" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
          {/* Legs */}
          <rect x="42" y="80" width="6" height="20" rx="3" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
          <rect x="52" y="80" width="6" height="20" rx="3" fill={color} stroke="#1a1a1a" strokeWidth="1.5" opacity="0.85" />
        </g>

        {/* Head - Animated (bounce for happy/excited) */}
        <g
          style={{
            animation: variant === 'thinking' ? 'headNod 2s ease-in-out infinite' : 'bounce 2s ease-in-out infinite',
            transformOrigin: '50px 35px',
          }}
        >
          {renderFace()}
        </g>

        {/* Accent circle - animated */}
        <circle
          cx="30"
          cy="15"
          r="6"
          fill="#E8521A"
          stroke="#1a1a1a"
          strokeWidth="1.5"
          opacity="0.85"
          style={{ animation: 'bounce 2.5s ease-in-out infinite' }}
        />
      </svg>
    </>
  );
}
