import React from 'react';
import Image from 'next/image';
import { useEmailSubscription } from '@/app/hooks/useEmailSubscription';
import { SubmitButton } from './SubmitButton';

export const RequestInvite = ({ hideHeader }: { onClose: () => void, hideHeader?: boolean }) => {
  const {
    email,
    setEmail,
    isSubmitted,
    isProcessing,
    error,
    isValidEmail,
    handleSubmit,
    clearError,
  } = useEmailSubscription();
  const logoSize = 130

  return (
    <div className="space-y-6 relative">
      <div className="flex justify-center mb-10">
        <Image src="/mobile%20logo.svg" alt="Logo" width={logoSize} height={logoSize} className="rounded-full bg-[#131A26] border border-[#1E293B]" />
      </div>
      {!isSubmitted ? (
        <>
          {!hideHeader && <h2 className="text-xl text-white font-oxanium font-extrabold tracking-[2px] uppercase mb-12 text-center text-shadow-sm">
            [REQUEST INVITE]
          </h2>}
          <form onSubmit={handleSubmit} className="w-full relative group font-mono" noValidate>
            <div className="flex flex-col">
              <input
                id="email_invite"
                type="email"
                value={email}
                disabled={isProcessing}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) clearError();
                }}
                placeholder="[ Enter Email ]"
                className={`w-full bg-black text-slate-400 placeholder-slate-600 border ${(error && !email) ? 'border-red-500/50' : 'border-slate-700'} p-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm`}
                spellCheck={false}
                autoComplete="off"
                required
              />
            </div>
            
            {error && (
              <div className="text-red-400 text-sm mt-2">
                Invalid email — try again.
              </div>
            )}
            <SubmitButton disabled={isProcessing || !isValidEmail}>
              {isProcessing ? 'EXECUTING...' : '> REQUEST_INVITE'}
            </SubmitButton>
          </form>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-48 font-mono">
          <div className="text-green-400 animate-pulse text-lg tracking-widest font-bold">
            [ REQUEST LOGGED ✓ ]
          </div>
          <div className="text-slate-400 text-sm tracking-widest mt-2">
            You&apos;re on the waiting list
          </div>
        </div>
      )}
    </div>
  );
};
