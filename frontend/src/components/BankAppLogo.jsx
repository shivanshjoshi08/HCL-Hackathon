export function BankAppLogo({ className = "h-10 w-10" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Outer Circle - Primary Color */}
      <circle cx="50" cy="50" r="48" fill="#3b82f6" />
      
      {/* Bank Building */}
      <g>
        {/* Roof/Triangle */}
        <path
          d="M 50 25 L 70 40 L 30 40 Z"
          fill="white"
        />
        
        {/* Pillars */}
        <rect x="35" y="42" width="6" height="25" fill="white" />
        <rect x="47" y="42" width="6" height="25" fill="white" />
        <rect x="59" y="42" width="6" height="25" fill="white" />
        
        {/* Base */}
        <rect x="28" y="67" width="44" height="6" fill="white" />
        
        {/* Door */}
        <rect x="45" y="55" width="10" height="12" fill="white" opacity="0.7" />
      </g>
      
      {/* Currency Symbol */}
      <text
        x="50"
        y="35"
        fontSize="18"
        fontWeight="bold"
        fill="white"
        textAnchor="middle"
      >
        ₹
      </text>
    </svg>
  );
}

export function BankAppIcon({ className = "h-6 w-6" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 22V12H15V22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
