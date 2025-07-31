'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useDemo } from '@/lib/demo-context';
import { Clock, Brain, BarChart3, Users, Calendar, TrendingUp, Play, ArrowRight } from 'lucide-react';

export default function DemoHomePage() {
  const { demoUser } = useDemo();

  const sampleStats = [
    { label: 'Total Hours', value: '42.5', icon: Clock, color: 'text-blue-600' },
    { label: 'Activities', value: '15', icon: Calendar, color: 'text-green-600' },
    { label: 'Productivity Score', value: '85%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Team Members', value: '3', icon: Users, color: 'text-orange-600' }
  ];

  const sampleActivities = [
    { id: 1, title: 'Frontend Development', category: 'Development', hours: 8.5, date: '2024-01-15' },
    { id: 2, title: 'Team Meeting', category: 'Meeting', hours: 1.0, date: '2024-01-15' },
    { id: 3, title: 'Code Review', category: 'Development', hours: 2.5, date: '2024-01-14' },
    { id: 4, title: 'UI Design', category: 'Design', hours: 6.0, date: '2024-01-14' }
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
          Explore the features below with sample data.
        </p>
      </div>

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
              View your recent activities below.
            </p>
            <div className="space-y-3 mb-4">
              {sampleActivities.slice(0, 3).map((activity) => (
                <div key={activity.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">{activity.category}</p>
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
              AI-Powered Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Get intelligent insights about your productivity patterns, work-life balance, 
              and personalized recommendations.
            </p>
            <div className="space-y-3 mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900">Productivity Peak</p>
                <p className="text-sm text-green-700">Your most productive hours are 9-11 AM</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="font-medium text-blue-900">Work-Life Balance</p>
                <p className="text-sm text-blue-700">Good balance achieved this week</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <p className="font-medium text-purple-900">Recommendation</p>
                <p className="text-sm text-purple-700">Consider taking more breaks during long sessions</p>
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

      {/* CTA Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-8 text-center">
          <Play className="h-12 w-12 mx-auto text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Experience the full power of Timesheet AI Assistant with your own data.
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