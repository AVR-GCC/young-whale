import React, { useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export const SubscriptionTerminal = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(false);
      setIsProcessing(true);

      const { error: insertError } = await supabase
        .from('email_subscriptions')
        .insert({ email });

      setIsProcessing(false);

      if (insertError) {
        setError(true);
      } else {
        setIsSubmitted(true);
      }
    } else {
      setError(true);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-16 mb-8 px-4">
      <div className="bg-[#0B0F19] border border-slate-800 rounded-md p-6 font-mono relative overflow-hidden">
        {/* Decorative corner accents */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/30"></div>
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-500/30"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-500/30"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/30"></div>

        <div className="text-slate-400 text-xs sm:text-sm mb-5 tracking-wide">
          <span className="font-oxanium tracking-[2px] text-white">YOUNG WHALE CLUB</span>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full" noValidate>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full">
              <div className="flex-1 w-full relative group">
                <input
                  type="email"
                  value={email}
                  disabled={isProcessing}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(false);
                  }}
                  className={`w-full bg-black/40 border ${error ? 'border-red-500' : 'border-slate-700'} rounded text-white px-4 py-3 outline-none transition-all placeholder:text-slate-500/0 focus:ring-1 focus:ring-[#00E5D2] focus:border-[#00E5D2] disabled:opacity-50`}
                  spellCheck={false}
                  autoComplete="off"
                  required
                />
                
                {/* Simulated placeholder */}
                {!email && (
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500 font-mono transition-opacity group-focus-within:opacity-0 w-full whitespace-nowrap overflow-hidden">
                    <span>Email</span>
                  </div>
                )}
                
              </div>
              <button 
                type="submit"
                disabled={isProcessing}
                className={`flex-shrink-0 bg-[#0c1a24] text-[#00E5D2] font-bold text-sm sm:text-base tracking-widest whitespace-nowrap px-8 py-3 rounded border border-[#00E5D2]/30 shadow-[0_0_10px_rgba(0,229,210,0.1)] transition-all duration-300 mt-2 sm:mt-0 self-stretch sm:self-auto uppercase hover:bg-[#112635] hover:border-[#00E5D2]/50 hover:shadow-[0_0_15px_rgba(0,229,210,0.2)] active:scale-95 disabled:opacity-80 disabled:cursor-wait disabled:scale-95`}
              >
                {isProcessing ? '[ AUTHENTICATING... ]' : '[ REQUEST INVITE ]'}
              </button>
            </div>
            {error && (
              <div className="text-red-400 text-sm mt-1">
                Invalid email — try again.
              </div>
            )}
          </form>
        ) : (
          <div className="text-[#00E5D2] text-sm sm:text-base tracking-wide mt-2 font-bold my-4">
            <span className="text-green-400">[ REQUEST LOGGED ✓ ] &gt; You&apos;re on the waiting list</span>
          </div>
        )}
      </div>
    </div>
  );
};

