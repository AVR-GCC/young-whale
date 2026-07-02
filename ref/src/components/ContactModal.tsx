import React, { useState } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      // Assuming success for demo purposes even if endpoint doesn't exist
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-terminal border border-[#1E293B] shadow-2xl rounded p-8 font-mono" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl text-white mb-6 tracking-widest uppercase">
          Contact Us
        </h2>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="text-green-400 animate-pulse text-lg tracking-widest font-bold">
              [ TRANSMITTED ✓ ]
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col">
              <label htmlFor="name" className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-slate-700 text-white pb-2 focus:outline-none focus:ring-0 focus:border-[#00AACC] focus:shadow-[0_4px_15px_-3px_rgba(0,170,204,0.3)] transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="email" className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-slate-700 text-white pb-2 focus:outline-none focus:ring-0 focus:border-[#00AACC] focus:shadow-[0_4px_15px_-3px_rgba(0,170,204,0.3)] transition-all"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="message" className="text-xs text-slate-400 mb-2 uppercase tracking-widest">Message</label>
              <textarea
                id="message"
                name="message"
                required
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border-b border-slate-700 text-white pb-2 resize-none h-32 focus:outline-none focus:ring-0 focus:border-[#00AACC] focus:shadow-[0_4px_15px_-3px_rgba(0,170,204,0.3)] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 mt-4 text-cyan-400 border border-cyan-400/30 hover:bg-cyan-400/10 hover:border-cyan-400/60 transition-all font-bold tracking-widest uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'EXECUTING...' : '> EXECUTE_MESSAGE'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
