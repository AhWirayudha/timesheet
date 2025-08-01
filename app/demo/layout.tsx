'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useDemo } from '@/lib/demo-context';
import { CircleIcon, Home, LogOut, Calendar, BarChart3, Play, Database, Brain } from 'lucide-react';

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  const { exitDemoMode } = useDemo();

  const navigationItems = [
    {
      name: 'Demo Home',
      href: '/demo',
      icon: Home
    },
    {
      name: 'Timesheet',
      href: '/demo/timesheet',
      icon: Calendar
    },
    {
      name: 'Analytics',
      href: '/demo/dashboard',
      icon: BarChart3
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <CircleIcon className="h-6 w-6 text-orange-500" />
            <span className="ml-2 text-xl font-semibold text-gray-900">Timesheet AI</span>
            <span className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">DEMO</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={exitDemoMode}
              className="flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit Demo
            </Button>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center px-3 py-4 text-sm font-medium text-gray-700 border-b-2 border-transparent hover:text-gray-900 hover:border-gray-300 transition-colors"
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-white">
        {children}
      </main>

      {/* Demo Banner */}
      <div className="bg-orange-50 border-t border-orange-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center text-sm text-orange-700">
            <Database className="h-4 w-4 mr-2" />
            <span>Demo Mode - Data stored locally in your browser. Sign up for full features and Gemini AI analytics.</span>
          </div>
        </div>
      </div>

      {/* Gemini AI Banner */}
      <div className="bg-purple-50 border-t border-purple-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-center text-sm text-purple-700">
            <Brain className="h-4 w-4 mr-2" />
            <span>Want advanced AI analytics? Sign up to access Gemini AI for personalized insights and recommendations.</span>
            <Link href="/login/sign-up" className="ml-2 underline font-medium hover:text-purple-800">
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 