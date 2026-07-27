import { useState, useCallback } from 'react';

interface UseEmailSubscriptionReturn {
  email: string;
  setEmail: (email: string) => void;
  isSubmitted: boolean;
  isProcessing: boolean;
  error: boolean;
  isValidEmail: boolean;
  handleSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export function useEmailSubscription(): UseEmailSubscriptionReturn {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(false);

  const isValidEmail = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = useCallback(async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!isValidEmail) {
      setError(true);
      return;
    }

    setError(false);
    setIsProcessing(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Subscription failed');
      }

      setIsSubmitted(true);
    } catch (err) {
      console.error('Subscription error:', err);
      setError(true);
    } finally {
      setIsProcessing(false);
    }
  }, [email, isValidEmail]);

  const clearError = useCallback(() => {
    setError(false);
  }, []);

  const reset = useCallback(() => {
    setEmail('');
    setIsSubmitted(false);
    setIsProcessing(false);
    setError(false);
  }, []);

  return {
    email,
    setEmail,
    isSubmitted,
    isProcessing,
    error,
    isValidEmail,
    handleSubmit,
    clearError,
    reset,
  };
}
