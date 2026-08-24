import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Starfield } from './Starfield';
import { useAuth } from '../hooks/useAuth';

const GoogleMark: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.65l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.46 14.97.5 12 .5A11 11 0 0 0 2.18 7.05l3.66 2.84c.87-2.6 3.3-4.14 6.16-4.14z"
    />
  </svg>
);

const GitHubMark: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2A3.2 3.2 0 0 1 4.9 18.6c-.35-.9-.86-1.14-.86-1.14-.7-.48.05-.47.05-.47a2.5 2.5 0 0 1 1.82 1.23 2.53 2.53 0 0 0 3.45 1 2.54 2.54 0 0 1 .76-1.6c-2.66-.3-5.47-1.34-5.47-5.96a4.660 4.66 0 0 1 1.24-3.23 4.34 4.34 0 0 1 .12-3.19s1.01-.32 3.3 1.23a11.4 11.4 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23a4.34 4.34 0 0 1 .12 3.19 4.65 4.65 0 0 1 1.24 3.23c0 4.63-2.82 5.65-5.5 5.95a2.84 2.84 0 0 1 .81 2.2v3.26c0 .31.2.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5z" />
  </svg>
);

export const SignIn: React.FC = () => {
  const { signIn } = useAuth();
  const [pending, setPending] = useState<'google' | 'github' | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async (provider: 'google' | 'github') => {
    setError(null);
    setPending(provider);
    try {
      await signIn(provider);
      // On success the browser navigates to the provider — nothing to do here.
    } catch {
      setError("Couldn't reach the sign-in provider. Check your connection and try again.");
      setPending(null);
    }
  };

  const buttonBase =
    'w-full flex items-center justify-center gap-3 rounded-2xl px-6 py-4 font-tech text-[11px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black';

  return (
    <div className="relative flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-black text-white">
      <Starfield />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="relative z-10 flex w-full max-w-md flex-col items-center px-8"
      >
        <motion.h1
          initial={{ scale: 0.94, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4 flex flex-col items-center text-center"
        >
          <span className="animate-gradient bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text font-tech text-7xl font-black leading-[0.85] tracking-tighter text-transparent text-glow md:text-8xl">
            AI
          </span>
          <span className="animate-gradient mr-[-0.4em] mt-2 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-[length:200%_auto] bg-clip-text font-tech text-3xl font-bold tracking-[0.4em] text-transparent opacity-90 text-glow md:text-4xl">
            MASTERY
          </span>
        </motion.h1>

        <p className="mb-12 max-w-xs text-center font-sans text-sm font-light leading-relaxed text-gray-400">
          Your personal galaxy of AI tools, organised and ready to launch.
        </p>

        <div className="flex w-full flex-col gap-3">
          <button
            onClick={() => handleSignIn('google')}
            disabled={pending !== null}
            className={`${buttonBase} border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:border-white/25 hover:bg-white/10`}
          >
            <GoogleMark />
            {pending === 'google' ? 'Connecting…' : 'Continue with Google'}
          </button>

          <button
            onClick={() => handleSignIn('github')}
            disabled={pending !== null}
            className={`${buttonBase} border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:border-white/25 hover:bg-white/10`}
          >
            <GitHubMark />
            {pending === 'github' ? 'Connecting…' : 'Continue with GitHub'}
          </button>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-6 text-center font-sans text-xs leading-relaxed text-red-400"
          >
            {error}
          </p>
        )}
      </motion.div>
    </div>
  );
};
