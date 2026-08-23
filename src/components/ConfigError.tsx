import React from 'react';

/**
 * Shown when the build went out without Supabase env vars. Because Vite
 * inlines them at build time, fixing this needs a redeploy, not a refresh —
 * so say that explicitly rather than leaving a blank screen.
 */
export const ConfigError: React.FC = () => (
  <div className="flex h-screen w-screen items-center justify-center bg-black px-8 text-white">
    <div className="max-w-md">
      <p className="mb-3 font-tech text-[10px] uppercase tracking-[0.3em] text-purple-400">
        Configuration missing
      </p>
      <h1 className="mb-4 font-display text-2xl font-semibold">
        This build has no database connection
      </h1>
      <p className="mb-6 font-sans text-sm leading-relaxed text-gray-400">
        Set <code className="text-purple-300">VITE_SUPABASE_URL</code> and{' '}
        <code className="text-purple-300">VITE_SUPABASE_PUBLISHABLE_KEY</code> in the
        hosting environment, then redeploy. These values are baked in when the app is
        built, so a refresh alone won't pick them up.
      </p>
      <p className="font-sans text-xs leading-relaxed text-gray-600">
        Running locally? Copy <code className="text-gray-500">.env.example</code> to{' '}
        <code className="text-gray-500">.env.local</code>, fill it in, and restart the
        dev server.
      </p>
    </div>
  </div>
);
