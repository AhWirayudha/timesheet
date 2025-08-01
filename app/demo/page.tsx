'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemo } from '@/lib/demo-context';
import { Clock, Brain, BarChart3, Users, Calendar, TrendingUp, Play, ArrowRight, Database, Mail, Plus } from 'lucide-react';

export default function DemoHomePage() {
  const { demoUser } = useDemo();

  const sampleStats = [
    { label: 'Total Hours', value: '42.5', icon: Clock, color: 'text-blue-600' },
    { label: 'Activities', value: '15', icon: Calendar, color: 'text-green-600' },
    { label: 'Productivity Score', value: '85%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Projects', value: '3', icon: Users, color: 'text-orange-600' }
  ];

  const sampleActivities = [
    { id: 1, title: 'Frontend Development', category: 'Development', hours: 8.5, date: '2024-01-15', project: 'E-commerce Platform' },
    { id: 2, title: 'Team Meeting', category: 'Meeting', hours: 1.0, date: '2024-01-15', project: 'Team' },
    { id: 3, title: 'Code Review', category: 'Development', hours: 2.5, date: '2024-01-14', project: 'E-commerce Platform' },
    { id: 4, title: 'UI Design', category: 'Design', hours: 6.0, date: '2024-01-14', project: 'Mobile App' }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome to Timesheet AI Assistant
        </h1>
        <p className="text-gray-600">
          Hi {demoUser.name}! This is a demo of our timesheet management system. 
          Explore the features below with sample data stored locally in your browser.
        </p>
      </div>

      {/* Demo Notice */}
      <Card className="mb-8 bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Database className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Demo Mode - Local Storage
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                Your data is stored locally in your browser. Sign up to sync across devices and access team features.
              </p>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button asChild size="sm" variant="outline">
                <Link href="/login/sign-in">
                  <Plus className="h-4 w-4 mr-2" />
                  Sign In
                </Link>
              </Button>
              <Button asChild size="sm" variant="outline">
                <Link href="/login/sign-up">
                  <Mail className="h-4 w-4 mr-2" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {sampleStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Timesheet Feature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Timesheet Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Log your daily activities with categories, descriptions, and time tracking. 
              View your recent activities below. All data is stored locally in your browser.
            </p>
            <div className="space-y-3 mb-4">
              {sampleActivities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.category} • {activity.project}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">{activity.hours}h</p>
                    <p className="text-sm text-gray-600">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button asChild className="w-full">
              <Link href="/demo/timesheet">
                Try Timesheet
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Analytics Feature */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain className="h-5 w-5 mr-2 text-green-600" />
              Analytics Dashboard
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Get insights about your productivity patterns, work-life balance, 
              and personalized recommendations with manual analysis.
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900">Productivity Analysis</p>
                <p className="text-sm text-green-700">Track your work patterns and efficiency</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">Category Distribution</p>
                <p className="text-sm text-blue-700">See how you spend your time across different activities</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">Period Comparison</p>
                <p className="text-sm text-purple-700">Compare weekly, monthly, and yearly data</p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/demo/dashboard">
                View Analytics
                <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Gemini AI Notice */}
      <Card className="mb-8 bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Want Advanced AI-Powered Analytics?
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Sign up to access Gemini AI for personalized insights, productivity recommendations, intelligent workload analysis, and advanced pattern recognition.
              </p>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/login/sign-up">
                  <Brain className="h-4 w-4 mr-2" />
                  Get Gemini AI
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <Play className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Experience the full power of Timesheet AI Assistant with your own data and Gemini AI analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="/login/sign-up">Sign Up Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login/sign-in">Sign In</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 