'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Edit, Trash2, Download } from 'lucide-react';

export default function DemoTimesheetPage() {
  const sampleActivities = [
    {
      id: 1,
      title: 'Frontend Development',
      description: 'Working on React components and state management',
      category: 'Development',
      startTime: '09:00',
      endTime: '12:30',
      duration: '3.5h',
      date: '2024-01-15',
      project: 'E-commerce Platform'
    },
    {
      id: 2,
      title: 'Team Standup Meeting',
      description: 'Daily standup with development team',
      category: 'Meeting',
      startTime: '13:00',
      endTime: '13:30',
      duration: '0.5h',
      date: '2024-01-15',
      project: 'Team'
    },
    {
      id: 3,
      title: 'Code Review',
      description: 'Reviewing pull requests and providing feedback',
      category: 'Development',
      startTime: '14:00',
      endTime: '16:00',
      duration: '2h',
      date: '2024-01-15',
      project: 'E-commerce Platform'
    },
    {
      id: 4,
      title: 'UI Design',
      description: 'Creating wireframes and mockups',
      category: 'Design',
      startTime: '16:30',
      endTime: '18:00',
      duration: '1.5h',
      date: '2024-01-15',
      project: 'Mobile App'
    }
  ];

  const categories = [
    { name: 'Development', color: 'bg-blue-100 text-blue-800' },
    { name: 'Design', color: 'bg-purple-100 text-purple-800' },
    { name: 'Meeting', color: 'bg-green-100 text-green-800' },
    { name: 'Planning', color: 'bg-orange-100 text-orange-800' },
    { name: 'Research', color: 'bg-gray-100 text-gray-800' }
  ];

  const totalHours = sampleActivities.reduce((sum, activity) => {
    const hours = parseFloat(activity.duration.replace('h', ''));
    return sum + hours;
  }, 0);

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Timesheet
        </h1>
        <p className="text-gray-600">
          Track your daily activities and manage your time effectively.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours Today</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours}h</p>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Activities</p>
                <p className="text-2xl font-bold text-gray-900">{sampleActivities.length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Projects</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Plus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mb-8">
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Categories */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category.name} className={category.color}>
                {category.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Activities List */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sampleActivities.map((activity) => (
              <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{activity.title}</h3>
                      <Badge className="bg-blue-100 text-blue-800">
                        {activity.category}
                      </Badge>
                      {activity.project && (
                        <Badge variant="outline" className="text-gray-600">
                          {activity.project}
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{activity.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {activity.startTime} - {activity.endTime}
                      </span>
                      <span className="font-medium text-gray-900">{activity.duration}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demo Notice */}
      <Card className="mt-8 bg-orange-50 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Plus className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-orange-800">
                Demo Mode - Sample Data
              </h3>
              <p className="text-sm text-orange-700 mt-1">
                This is sample data for demonstration purposes. Sign up to create your own timesheet entries.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 