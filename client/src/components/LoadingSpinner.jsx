import React from 'react';

export default function LoadingSpinner() {
  return (
    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20}}>
      <svg
        width="48"
        height="48"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="Loading"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#1976d2"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="31.4 31.4"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="0.9s"
            repeatCount="indefinite"
          />
        </circle>
      </svg>
    </div>
  );
}
