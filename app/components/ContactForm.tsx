import React, { useState } from 'react';
import { X } from 'lucide-react';
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
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          content: formData.message
        })
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

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactFormModal: React.FC<ContactFormModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-deep/90 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#0B0F19] border border-slate-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <h2 className="text-xl text-white font-oxanium font-extrabold tracking-[2px] uppercase text-shadow-sm">
            [CONTACT US]
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white transition-colors rounded hover:bg-white/10"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar">
          <ContactForm onClose={onClose} hideHeader />
        </div>
      </div>
    </div>
  );
};
