import React, { useState } from 'react';
import { SubmitButton } from './SubmitButton';

export const ContactForm = ({ onClose, hideHeader }: { onClose: () => void, hideHeader?: boolean }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({ name: '', email: '', message: '' });
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {!hideHeader && <h2 className="text-xl text-white font-oxanium font-extrabold tracking-[2px] uppercase mb-8 text-center text-shadow-sm">
        [CONTACT US]
      </h2>}
      {isSuccess ? (
        <div className="flex flex-col items-center justify-center h-48">
          <div className="text-green-400 animate-pulse text-lg tracking-widest font-bold">
            [ TRANSMITTED ✓ ]
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col">
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="[ Enter Name ]"
              className="w-full bg-black text-slate-400 placeholder-slate-600 border border-slate-700 p-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
            />
          </div>
          <div className="flex flex-col">
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="[ Enter Email ]"
              className="w-full bg-black text-slate-400 placeholder-slate-600 border border-slate-700 p-3 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
            />
          </div>
          <div className="flex flex-col">
            <textarea
              id="message"
              name="message"
              required
              value={formData.message}
              onChange={handleChange}
              placeholder="[ Enter Message ]"
              className="w-full bg-black text-slate-400 placeholder-slate-600 border border-slate-700 p-3 resize-none h-32 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-mono text-sm"
            />
          </div>
          <SubmitButton disabled={isSubmitting}>
            {isSubmitting ? 'EXECUTING...' : '> EXECUTE_MESSAGE'}
          </SubmitButton>
        </form>
      )}
    </>
  );
};
