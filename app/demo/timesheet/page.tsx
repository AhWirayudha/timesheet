'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Clock, Calendar, Tag, FileText, Database, FolderOpen, Users, Mail, Brain, AlertCircle } from 'lucide-react';
import Link from 'next/link';

const categories = [
  'Development',
  'Design',
  'Meeting',
  'Research',
  'Planning',
  'Testing',
  'Documentation',
  'Other'
];

interface Project {
  id: number;
  name: string;
  description: string;
}

interface TimesheetActivity {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  category: string;
  projectId?: number;
  description: string;
  createdAt: string;
}

export default function DemoTimesheetPage() {
  const [activities, setActivities] = useState<TimesheetActivity[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'E-commerce Platform', description: 'Main e-commerce project' },
    { id: 2, name: 'Mobile App', description: 'Mobile application development' },
    { id: 3, name: 'API Development', description: 'Backend API services' }
  ]);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    startTime: '',
    endTime: '',
    category: '',
    projectId: undefined as number | undefined,
    description: ''
  });

  // Load activities from localStorage on component mount
  useEffect(() => {
    loadActivitiesFromLocalStorage();
  }, []);

  const loadActivitiesFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('demoTimesheetActivities');
      if (stored) {
        const parsed = JSON.parse(stored);
        setActivities(Array.isArray(parsed) ? parsed : []);
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setActivities([]);
    }
  };

  const saveActivitiesToLocalStorage = (activities: TimesheetActivity[]) => {
    try {
      localStorage.setItem('demoTimesheetActivities', JSON.stringify(activities));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate time overlap
    const newStartTime = new Date(`2000-01-01T${formData.startTime}`);
    const newEndTime = new Date(`2000-01-01T${formData.endTime}`);
    
    if (newStartTime >= newEndTime) {
      alert('End time must be after start time');
      return;
    }

    // Check for time conflicts
    const hasConflict = activities.some(activity => {
      if (activity.date !== formData.date) return false;
      
      const existingStart = new Date(`2000-01-01T${activity.startTime}`);
      const existingEnd = new Date(`2000-01-01T${activity.endTime}`);
      
      return (
        (newStartTime < existingEnd && newEndTime > existingStart) ||
        (existingStart < newEndTime && existingEnd > newStartTime)
      );
    });

    if (hasConflict) {
      alert('Time conflict detected. Please choose a different time slot.');
      return;
    }

    // Save to localStorage for demo users
    const newActivity: TimesheetActivity = {
      id: Date.now().toString(),
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      category: formData.category,
      projectId: formData.projectId,
      description: formData.description,
      createdAt: new Date().toISOString()
    };
    
    const updatedActivities = [...activities, newActivity];
    setActivities(updatedActivities);
    saveActivitiesToLocalStorage(updatedActivities);
    
    setFormData({
      date: new Date().toISOString().split('T')[0],
      startTime: '',
      endTime: '',
      category: '',
      projectId: undefined,
      description: ''
    });
  };

  const deleteActivity = (id: string) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    saveActivitiesToLocalStorage(updatedActivities);
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    return diffHours.toFixed(2);
  };

  const totalHours = activities.reduce((total, activity) => {
    return total + parseFloat(calculateDuration(activity.startTime, activity.endTime));
  }, 0);

  // Add sample data for testing
  const addSampleData = () => {
    const today = new Date();
    
    const sampleActivities = [
      {
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 days ago
        startTime: '09:00',
        endTime: '12:00',
        category: 'Development',
        projectId: 1,
        description: 'Frontend development - React components'
      },
      {
        date: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '13:00',
        endTime: '17:00',
        category: 'Meeting',
        projectId: 1,
        description: 'Team standup and project planning'
      },
      {
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 5 days ago
        startTime: '08:30',
        endTime: '11:30',
        category: 'Design',
        projectId: 2,
        description: 'UI/UX design work'
      },
      {
        date: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '18:00',
        category: 'Development',
        projectId: 3,
        description: 'Backend API development'
      },
      {
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 4 days ago
        startTime: '09:00',
        endTime: '12:00',
        category: 'Research',
        projectId: 1,
        description: 'Market research and competitor analysis'
      },
      {
        date: new Date(today.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '13:00',
        endTime: '16:00',
        category: 'Testing',
        projectId: 1,
        description: 'Unit testing and integration testing'
      },
      {
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 days ago
        startTime: '08:00',
        endTime: '11:00',
        category: 'Planning',
        projectId: 1,
        description: 'Sprint planning and task breakdown'
      },
      {
        date: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '17:00',
        category: 'Documentation',
        projectId: 3,
        description: 'API documentation and user guides'
      },
      {
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        startTime: '09:00',
        endTime: '12:00',
        category: 'Development',
        projectId: 3,
        description: 'Database optimization and queries'
      },
      {
        date: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '13:00',
        endTime: '16:00',
        category: 'Meeting',
        projectId: 1,
        description: 'Client presentation and feedback session'
      },
      {
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 day ago
        startTime: '08:30',
        endTime: '11:30',
        category: 'Development',
        projectId: 1,
        description: 'Bug fixes and code review'
      },
      {
        date: new Date(today.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        startTime: '14:00',
        endTime: '17:00',
        category: 'Design',
        projectId: 2,
        description: 'Mobile app design and prototyping'
      }
    ];

    try {
      const newActivities = sampleActivities.map(activity => ({
        ...activity,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9), // Generate unique ID
        createdAt: new Date().toISOString()
      }));
      
      const updatedActivities = [...activities, ...newActivities];
      setActivities(updatedActivities);
      saveActivitiesToLocalStorage(updatedActivities);
    } catch (error) {
      console.error('Error creating sample activities:', error);
      alert('Error creating sample activities. Please try again.');
    }
  };

  const clearAllData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      try {
        localStorage.removeItem('demoTimesheetActivities');
        setActivities([]);
      } catch (error) {
        console.error('Error clearing localStorage:', error);
        alert('Error clearing localStorage. Please try again.');
      }
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Timesheet
            </h1>
            <p className="text-gray-600">
              Track your daily activities and manage your time effectively.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Hours This Week</p>
              <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(2)}h</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={addSampleData} variant="outline" size="sm">
                <Database className="h-4 w-4 mr-2" />
                Add Sample Data
              </Button>
              <Button onClick={clearAllData} variant="outline" size="sm">
                Clear All
              </Button>
            </div>
          </div>
        </div>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Hours Today</p>
                <p className="text-2xl font-bold text-gray-900">{totalHours.toFixed(2)}h</p>
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
                <p className="text-2xl font-bold text-gray-900">{activities.length}</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Activity Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" />
                    Category
                  </Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="project" className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4" />
                    Project
                  </Label>
                  <Select 
                    value={formData.projectId?.toString() || 'none'} 
                    onValueChange={(value) => setFormData({ ...formData, projectId: value === 'none' ? undefined : parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select project (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Project (Personal)</SelectItem>
                      {projects.map((project) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="startTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Start Time
                  </Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="endTime" className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    End Time
                  </Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="What did you work on?"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">
                Add Activity
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Activity List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No activities yet. Add your first activity!</p>
                  <Button onClick={addSampleData} variant="outline">
                    <Database className="h-4 w-4 mr-2" />
                    Add Sample Data for Testing
                  </Button>
                </div>
              ) : (
                activities
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity) => (
                    <div key={activity.id} className="border rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">{activity.date}</span>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {activity.category}
                          </span>
                          {activity.projectId ? (
                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                              {projects.find(p => p.id === activity.projectId)?.name || 'Unknown Project'}
                            </span>
                          ) : (
                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded">
                              Personal
                            </span>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteActivity(activity.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Delete
                        </Button>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{activity.startTime} - {activity.endTime}</span>
                        <span className="font-medium">
                          {calculateDuration(activity.startTime, activity.endTime)}h
                        </span>
                      </div>
                      {activity.description && (
                        <p className="text-sm text-gray-700">{activity.description}</p>
                      )}
                    </div>
                  ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gemini AI Notice */}
      <Card className="mt-8 bg-purple-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-purple-800">
                Want AI-Powered Analytics?
              </h3>
              <p className="text-sm text-purple-700 mt-1">
                Sign up to access Gemini AI analysis for personalized insights, productivity recommendations, and intelligent workload analysis.
              </p>
            </div>
            <div className="flex gap-2 ml-auto">
              <Button asChild size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Link href="/login/sign-up">
                  <Brain className="h-4 w-4 mr-2" />
                  Get AI Analytics
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 