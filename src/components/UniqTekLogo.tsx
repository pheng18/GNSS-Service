import React from 'react';

interface UniqTekLogoProps {
  className?: string;
  size?: number | string;
  roundedClassName?: string;
}

export const UniqTekLogo: React.FC<UniqTekLogoProps> = ({
  className = '',
  size = 40,
  roundedClassName = 'rounded-xl'
}) => {
  return (
    <div
      style={{ width: size, height: size }}
      className={`relative inline-flex items-center justify-center bg-[#E21B23] shadow-sm select-none shrink-0 ${roundedClassName} ${className}`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full p-1.5"
      >
        {/* Continuous "u-n" path */}
        <path
          d="M27 42 V56 C27 68 48 68 48 56 V52 C48 40 69 40 69 52 V68"
          stroke="white"
          strokeWidth="11"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Stylized arrow pointing up-right at the top-right of the "n" curve */}
        <path
          d="M62 37 L73 30 L73 41 Z"
          fill="white"
        />
      </svg>
    </div>
  );
};
