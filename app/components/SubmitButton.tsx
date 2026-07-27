import React from 'react';

interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SubmitButton = ({ children, className = '', ...props }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      className={`w-full py-3 mt-4 text-cyan-400 border border-cyan-400 hover:bg-cyan-400/10 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)] transition-all font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
