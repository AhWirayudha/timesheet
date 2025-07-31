'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Clock, Calendar, Users, BarChart3, PieChart, Activity } from 'lucide-react';

export default function DemoDashboardPage() {
  const sampleStats = [
    { label: 'Total Hours', value: '42.5', change: '+12%', icon: Clock, color: 'text-blue-600' },
    { label: 'Activities', value: '15', change: '+3', icon: Calendar, color: 'text-green-600' },
    { label: 'Productivity Score', value: '85%', change: '+5%', icon: TrendingUp, color: 'text-purple-600' },
    { label: 'Team Members', value: '3', change: '+1', icon: Users, color: 'text-orange-600' }
  ];

  const categoryData = [
    { category: 'Development', hours: 24, percentage: 56, color: 'bg-blue-500' },
    { category: 'Design', hours: 8, percentage: 19, color: 'bg-purple-500' },
    { category: 'Meeting', hours: 6, percentage: 14, color: 'bg-green-500' },
    { category: 'Planning', hours: 4.5, percentage: 11, color: 'bg-orange-500' }
  ];

  const aiInsights = [
    {
      type: 'Productivity',
      title: 'Peak Performance Hours',
      description: 'Your most productive hours are between 9-11 AM. Consider scheduling important tasks during this time.',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'Work-Life Balance',
      title: 'Good Balance Achieved',
      description: 'You\'ve maintained a healthy work-life balance this week with regular breaks and reasonable hours.',
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'Recommendation',
      title: 'Optimize Break Times',
      description: 'Consider taking more frequent short breaks during long development sessions to maintain focus.',
      icon: Brain,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              AI-powered insights and analytics for your productivity.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="week">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
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
                    <p className="text-sm text-green-600">{stat.change}</p>
                  </div>
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* AI Insights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="h-5 w-5 mr-2 text-purple-600" />
          AI-Powered Insights
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {aiInsights.map((insight) => {
            const Icon = insight.icon;
            return (
              <Card key={insight.title} className={`${insight.bgColor} border-0`}>
                <CardContent className="p-6">
                  <div className="flex items-start">
                    <Icon className={`h-6 w-6 ${insight.color} mr-3 mt-1`} />
                    <div>
                      <Badge className="mb-2 text-xs">{insight.type}</Badge>
                      <h3 className="font-semibold text-gray-900 mb-2">{insight.title}</h3>
                      <p className="text-sm text-gray-600">{insight.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-blue-600" />
              Category Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.map((item) => (
                <div key={item.category} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                    <span className="font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{item.hours}h</p>
                    <p className="text-sm text-gray-600">{item.percentage}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2 text-green-600" />
              Weekly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const hours = [8.5, 7.2, 9.1, 6.8, 8.0, 2.5, 1.4][index];
                const maxHours = 10;
                const percentage = (hours / maxHours) * 100;
                return (
                  <div key={day} className="flex items-center">
                    <span className="w-8 text-sm font-medium text-gray-600">{day}</span>
                    <div className="flex-1 mx-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{hours}h</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Calendar className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
            <Button variant="outline">
              <BarChart3 className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button variant="outline">
              <Users className="h-4 w-4 mr-2" />
              Team Analytics
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="mt-8 bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Brain className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Demo Mode - AI Insights
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                These are sample AI insights. Sign up to get personalized analysis based on your actual data.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 