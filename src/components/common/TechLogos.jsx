import React from 'react';
import { Terminal, Code2 } from 'lucide-react';

export function TechLogo({ name = '', iconUrl = '', size = 24, className = '' }) {
  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt={name}
        style={{ width: size, height: size, objectFit: 'contain' }}
        className={`tech-logo-img ${className}`}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
    );
  }

  const key = (name || '').toLowerCase().trim();

  // React
  if (key.includes('react')) {
    return (
      <svg width={size} height={size} viewBox="-11.5 -10.23174 23 20.46348" fill="none" className={className}>
        <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }

  // Node.js
  if (key.includes('node')) {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" fill="#5FA04E" className={className}>
        <path d="M16 2.5L3.5 9.7v14.6L16 31.5l12.5-7.2V9.7L16 2.5zm9.5 20.4L16 28.4l-9.5-5.5V11.1L16 5.6l9.5 5.5v11.8z" />
        <path d="M16 10a6 6 0 1 0 0 12 6 6 0 0 0 0-12zm0 9.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
      </svg>
    );
  }

  // Python
  if (key.includes('python')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <path
          fill="#3776AB"
          d="M11.9 2c-3.1 0-5 1.4-5 3.6v2.2h5.1V9H5.7C3.6 9 2 10.7 2 13.1c0 2.5 1.5 4.1 4.1 4.1H7v-2.3c0-2.4 2-4.1 4.4-4.1h4.9v-1.6c0-2-1.9-3.4-4.4-3.4zm-1.8 1.8c.6 0 1 .4 1 1s-.4 1-1 1-1-.4-1-1 .4-1 1-1z"
        />
        <path
          fill="#FFD43B"
          d="M12.1 22c3.1 0 5-1.4 5-3.6v-2.2H12V15h6.3c2.1 0 3.7-1.7 3.7-4.1 0-2.5-1.5-4.1-4.1-4.1H17v2.3c0 2.4-2 4.1-4.4 4.1H7.7v1.6c0 2 1.9 3.4 4.4 3.4zm1.8-1.8c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        />
      </svg>
    );
  }

  // MongoDB
  if (key.includes('mongo')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
        <path
          d="M12 2C11.5 4 7 8 7 13.5c0 3.5 2.5 6.5 5 8.5 2.5-2 5-5 5-8.5C17 8 12.5 4 12 2z"
          fill="#47A248"
        />
        <path
          d="M12 2v20c.5-.4 1-1 1.5-1.5 2.2-2.1 3.5-4.5 3.5-7 0-4.5-3.5-8-5-11.5z"
          fill="#499D4A"
        />
        <path d="M12 21.5v.5c.2 0 .3-.1.4-.2l-.4-.3z" fill="#3FA037" />
      </svg>
    );
  }

  // Express
  if (key.includes('express')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <text
          x="50%"
          y="65%"
          fontSize="14"
          fontWeight="900"
          fontFamily="monospace"
          textAnchor="middle"
          fill="#ffffff"
        >
          ex
        </text>
      </svg>
    );
  }

  // Tailwind CSS
  if (key.includes('tailwind')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#06B6D4" className={className}>
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C8.335 13.382 6.974 12 4.001 12z" />
      </svg>
    );
  }

  // Docker
  if (key.includes('docker')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#2496ED" className={className}>
        <path d="M13.983 11.078h2.119a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.119a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 0 0 .186-.186V3.574a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 0 0 .186-.186V6.29a.186.186 0 0 0-.186-.185h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 0 0 .184-.186V6.29a.185.185 0 0 0-.185-.185H8.1a.185.185 0 0 0-.185.185v1.888c0 .102.083.186.185.186m-2.954 0h2.119a.186.186 0 0 0 .185-.186V6.29a.185.185 0 0 0-.185-.185H5.145a.185.185 0 0 0-.185.185v1.888c0 .102.083.186.185.186m5.884 2.714h2.118a.186.186 0 0 0 .186-.185V9.006a.186.186 0 0 0-.186-.186h-2.118a.185.185 0 0 0-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186H8.1a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.954 0h2.119a.185.185 0 0 0 .185-.185V9.006a.185.185 0 0 0-.185-.186H5.145a.185.185 0 0 0-.185.185v1.888c0 .102.083.185.185.185m-2.93 0h2.12a.185.185 0 0 0 .184-.185V9.006a.185.185 0 0 0-.184-.186h-2.12a.185.185 0 0 0-.184.185v1.888c0 .102.083.185.185.185M23.76 9.89c-.365-.257-.935-.4-1.637-.4-.23 0-.46.015-.678.046a3.687 3.687 0 0 0-2.455-1.196c-.184 0-.362.016-.54.047l-.19.033v2.858h-.024a5.05 5.05 0 0 0-.44-.02h-.824v1.888c0 .102.083.185.185.185h2.119a.186.186 0 0 0 .186-.185v-1.12c.328-.15.708-.235 1.127-.235.313 0 .61.05.887.147a3.486 3.486 0 0 1-1.39 1.488c-.125.07-.225.163-.298.27-.478.7-.91 1.442-1.572 1.94-.96.726-2.15 1.126-3.468 1.157H2.176c-.235 0-.425.19-.425.426 0 1.25.32 2.454.918 3.498 1.096 1.91 2.923 3.23 5.045 3.666 1.09.225 2.227.24 3.328.04 2.825-.51 5.253-2.3 6.643-4.78.366-.653.636-1.353.805-2.08.35-.015.7-.058 1.052-.132.888-.186 1.7-.568 2.375-1.135a3.6 3.6 0 0 0 1.066-1.69c.074-.265-.01-.54-.225-.694" />
      </svg>
    );
  }

  // Kubernetes
  if (key.includes('kube') || key.includes('k8s')) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#326CE5" className={className}>
        <path d="M12.001 2l8.66 5v10l-8.66 5-8.66-5V7l8.66-5zm-1.13 2.83l-6.53 3.77v7.54l6.53 3.77 6.53-3.77V8.6l-6.53-3.77zm.13 3.67a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7zm0 1.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
      </svg>
    );
  }

  // TypeScript
  if (key.includes('typescript') || key === 'ts') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#3178C6" className={className}>
        <rect width="24" height="24" rx="4" fill="#3178C6" />
        <path d="M11.5 10.5h-5v1.5h1.75v7.5h1.5V12h1.75v-1.5zm5.75 3.75c-.75-.5-1.5-.75-2.25-.75-.75 0-1.25.25-1.25.75 0 .5.25.75 1.5 1.25 1.5.5 2.25 1.25 2.25 2.25 0 1.25-1 2-2.75 2-1 0-2-.25-2.75-.75l.5-1.25c.75.5 1.5.75 2.25.75.75 0 1.25-.25 1.25-.75 0-.5-.5-.75-1.5-1.25-1.5-.5-2.25-1-2.25-2.25 0-1.25 1-2 2.5-2 1 0 1.75.25 2.5.5l-.5 1.25z" fill="#ffffff" />
      </svg>
    );
  }

  // JavaScript
  if (key.includes('javascript') || key === 'js') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
        <rect width="24" height="24" rx="4" fill="#F7DF1E" />
        <path d="M12.5 13.5v4.5c0 1.5-.8 2-2 2s-1.8-.8-2-1.5l1.4-.8c.2.4.4.7.7.7.3 0 .5-.2.5-.7v-4.2h1.4zm6.5 2.8c-.4-.3-1-.5-1.6-.5-.6 0-1 .3-1 .7 0 .5.4.7 1.2 1 1.2.4 1.8 1 1.8 2 0 1.2-.9 2-2.3 2-.9 0-1.8-.4-2.2-1l1.1-1c.3.4.7.6 1.2.6.5 0 .8-.2.8-.5 0-.4-.4-.6-1.1-.9-1.2-.5-1.8-1-1.8-2 0-1.1.9-1.9 2.2-1.9.8 0 1.5.3 2 .6l-.6 1.4z" fill="#000000" />
      </svg>
    );
  }

  // Default fallback
  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#06b6d4',
      }}
      className={className}
    >
      <Code2 size={Math.round(size * 0.8)} />
    </div>
  );
}

export default TechLogo;
