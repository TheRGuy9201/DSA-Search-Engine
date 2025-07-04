import React from 'react';

interface EyeIconProps {
  isAutofilled?: boolean;
}

// Eye icons that can adapt to autofilled inputs
export const EyeIcon: React.FC<EyeIconProps> = ({ isAutofilled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isAutofilled ? "black" : "white"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={isAutofilled ? "eye-icon-autofill" : "text-white"}
    style={{ color: isAutofilled ? 'black' : 'white' }}
    data-autofilled={isAutofilled}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

export const EyeOffIcon: React.FC<EyeIconProps> = ({ isAutofilled = false }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke={isAutofilled ? "black" : "white"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={isAutofilled ? "eye-icon-autofill" : "text-white"}
    style={{ color: isAutofilled ? 'black' : 'white' }}
    data-autofilled={isAutofilled}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);
