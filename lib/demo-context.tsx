'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface DemoContextType {
  isDemoMode: boolean;
  enterDemoMode: () => void;
  exitDemoMode: () => void;
  demoUser: {
    id: 'demo-user';
    email: 'demo@example.com';
    name: 'Demo User';
    role: 'user';
  };
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const router = useRouter();

  const demoUser = {
    id: 'demo-user',
    email: 'demo@example.com',
    name: 'Demo User',
    role: 'user' as const
  };

  const enterDemoMode = () => {
    setIsDemoMode(true);
    // Store demo mode in sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('demoMode', 'true');
    }
    // Redirect to demo page
    router.push('/demo');
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    // Remove demo mode from sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('demoMode');
    }
    // Redirect to home page
    router.push('/');
  };

  useEffect(() => {
    // Check if demo mode is active on mount
    if (typeof window !== 'undefined') {
      const demoMode = sessionStorage.getItem('demoMode');
      if (demoMode === 'true') {
        setIsDemoMode(true);
      }
    }
  }, []);

  return (
    <DemoContext.Provider value={{ isDemoMode, enterDemoMode, exitDemoMode, demoUser }}>
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
} 