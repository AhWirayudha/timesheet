'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Brain, TrendingUp, Clock, Calendar, Users, BarChart3, PieChart, Activity, Copy, Download, Filter, Database, Mail, Plus } from 'lucide-react';
import Link from 'next/link';

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

interface Project {
  id: number;
  name: string;
  description: string;
}

interface CategoryStats {
  category: string;
  hours: number;
  percentage: number;
}

type AnalysisPeriod = 'weekly' | 'monthly' | 'yearly';

interface AiInsight {
  summary: string;
  recommendations: string[];
  trends: string[];
  alerts: string[];
  performance: {
    best: string;
    needsImprovement: string;
    opportunities: string[];
  };
}

export default function DemoDashboardPage() {
  const [activities, setActivities] = useState<TimesheetActivity[]>([]);
  const [projects, setProjects] = useState<Project[]>([
    { id: 1, name: 'E-commerce Platform', description: 'Main e-commerce project' },
    { id: 2, name: 'Mobile App', description: 'Mobile application development' },
    { id: 3, name: 'API Development', description: 'Backend API services' }
  ]);
  const [categoryStats, setCategoryStats] = useState<CategoryStats[]>([]);
  const [totalHours, setTotalHours] = useState(0);
  const [aiInsights, setAiInsights] = useState<AiInsight | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPeriod, setAnalysisPeriod] = useState<AnalysisPeriod>('weekly');
  const [selectedProject, setSelectedProject] = useState<number | 'all'>('all');

  // Load activities from localStorage on component mount
  useEffect(() => {
    loadActivitiesFromLocalStorage();
  }, []);

  // Update stats when filters change
  useEffect(() => {
    const { totalHours: filteredTotal, categoryStats: filteredStats } = calculateFilteredStats();
    setTotalHours(filteredTotal);
    setCategoryStats(filteredStats);
  }, [analysisPeriod, selectedProject, activities]);

  const loadActivitiesFromLocalStorage = () => {
    try {
      const stored = localStorage.getItem('demoTimesheetActivities');
      if (stored) {
        const parsed = JSON.parse(stored);
        const activitiesData = Array.isArray(parsed) ? parsed : [];
        setActivities(activitiesData);
        calculateStats(activitiesData);
      } else {
        setActivities([]);
        calculateStats([]);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
      setActivities([]);
      calculateStats([]);
    }
  };

  const calculateStats = (activitiesData: TimesheetActivity[]) => {
    const total = activitiesData.reduce((sum, activity) => {
      return sum + calculateDuration(activity.startTime, activity.endTime);
    }, 0);

    setTotalHours(total);

    // Calculate category distribution
    const categoryMap = new Map<string, number>();
    activitiesData.forEach(activity => {
      const duration = calculateDuration(activity.startTime, activity.endTime);
      categoryMap.set(activity.category, (categoryMap.get(activity.category) || 0) + duration);
    });

    const stats: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, hours]) => ({
      category,
      hours,
      percentage: (hours / total) * 100
    }));

    setCategoryStats(stats.sort((a, b) => b.hours - a.hours));
  };

  const calculateFilteredStats = () => {
    const filteredActivities = getActivitiesByPeriod(analysisPeriod);
    const total = filteredActivities.reduce((sum, activity) => {
      return sum + calculateDuration(activity.startTime, activity.endTime);
    }, 0);

    // Calculate category distribution for filtered data
    const categoryMap = new Map<string, number>();
    filteredActivities.forEach(activity => {
      const duration = calculateDuration(activity.startTime, activity.endTime);
      categoryMap.set(activity.category, (categoryMap.get(activity.category) || 0) + duration);
    });

    const stats: CategoryStats[] = Array.from(categoryMap.entries()).map(([category, hours]) => ({
      category,
      hours,
      percentage: total > 0 ? (hours / total) * 100 : 0
    }));

    return {
      totalHours: total,
      categoryStats: stats.sort((a, b) => b.hours - a.hours)
    };
  };

  const calculateDuration = (startTime: string, endTime: string) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    const diffMs = end.getTime() - start.getTime();
    return diffMs / (1000 * 60 * 60);
  };

  const getActivitiesByPeriod = (period: AnalysisPeriod) => {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'weekly':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'monthly':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'yearly':
        startDate = new Date(now.setDate(now.getDate() - 365));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    return activities.filter(activity => {
      const activityDate = new Date(activity.date);
      const dateFilter = activityDate >= startDate && activityDate <= new Date();
      
      // Filter by project if selected
      const projectFilter = selectedProject === 'all' || activity.projectId === selectedProject;
      
      return dateFilter && projectFilter;
    });
  };

  const analyzeWithAI = async () => {
    setIsAnalyzing(true);
    
    try {
      const periodActivities = getActivitiesByPeriod(analysisPeriod);

      if (periodActivities.length === 0) {
        setAiInsights({
          summary: `No activities found for this ${analysisPeriod} period. Please add some activities first.`,
          recommendations: ['Add some activities to get started with analysis'],
          trends: [],
          alerts: [],
          performance: {
            best: 'No data available',
            needsImprovement: 'Add activities to begin tracking',
            opportunities: ['Start logging your work activities']
          }
        });
        return;
      }

      // Generate fallback insights for demo
      const totalPeriodHours = periodActivities.reduce((sum, activity) => 
        sum + calculateDuration(activity.startTime, activity.endTime), 0
      );
      
      const periodDays = analysisPeriod === 'weekly' ? 7 : analysisPeriod === 'monthly' ? 30 : 365;
      const avgHoursPerDay = totalPeriodHours / periodDays;
      const topCategory = categoryStats[0];

      setAiInsights(generateFallbackInsights(periodActivities, totalPeriodHours, avgHoursPerDay, topCategory));
    } catch (error) {
      setAiInsights({
        summary: 'Unable to analyze data at the moment. Please try again later.',
        recommendations: ['Check your internet connection', 'Verify your data is properly formatted'],
        trends: [],
        alerts: ['Analysis failed - using fallback data'],
        performance: {
          best: 'Analysis unavailable',
          needsImprovement: 'Please try again later',
          opportunities: ['Retry the analysis when the issue is resolved']
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateFallbackInsights = (activities: TimesheetActivity[], totalHours: number, avgHoursPerDay: number, topCategory: CategoryStats | undefined): AiInsight => {
    const periodLabel = analysisPeriod === 'weekly' ? 'Week' : analysisPeriod === 'monthly' ? 'Month' : 'Year';
    
    const summary = `Personal timesheet analysis for the ${periodLabel} period shows ${totalHours.toFixed(2)} total hours worked, averaging ${avgHoursPerDay.toFixed(2)} hours per day. Top category is ${topCategory?.category || 'Unknown'} with ${topCategory?.hours?.toFixed(2) || 0} hours.`;
    
    const recommendations = [];
    if (avgHoursPerDay > 8) {
      recommendations.push('Schedule breaks and leisure time to prevent burnout');
    }
    if (topCategory && topCategory.percentage > 50) {
      recommendations.push('Consider allocating time to other categories for skill development');
    }
    recommendations.push('Track your energy levels throughout the day');
    recommendations.push('Set realistic daily goals based on your patterns');
    
    const trends = [
      `Average ${avgHoursPerDay.toFixed(1)} hours per day`,
      `Work distributed across ${categoryStats.length} categories`,
      `Completed ${activities.length} activities during this period`
    ];
    
    const alerts = [];
    if (avgHoursPerDay > 9) {
      alerts.push(`High workload detected (${avgHoursPerDay.toFixed(1)}h/day) - consider reducing daily work hours`);
    }
    if (topCategory && topCategory.percentage > 60) {
      alerts.push(`High focus on ${topCategory.category} (${topCategory.percentage.toFixed(1)}%) - consider diversifying work activities`);
    }
    
    const dailyPatterns = activities.reduce((acc: any, activity: any) => {
      const day = new Date(activity.date).toLocaleDateString('en-US', { weekday: 'long' });
      acc[day] = (acc[day] || 0) + calculateDuration(activity.startTime, activity.endTime);
      return acc;
    }, {});
    
    const mostProductiveDay = Object.entries(dailyPatterns)
      .sort(([,a]: any, [,b]: any) => b - a)[0];
    
    const best = mostProductiveDay 
      ? `Most productive day: ${mostProductiveDay[0]} with ${(mostProductiveDay[1] as number).toFixed(1)} hours`
      : `Strong performance in ${topCategory?.category || 'primary work'} category`;
    
    const needsImprovement = avgHoursPerDay > 8 
      ? 'Focus on work-life balance and reducing daily work hours'
      : 'Maintain current productivity levels while optimizing time allocation';
    
    const opportunities = [
      'Implement time blocking techniques to improve focus',
      'Review and optimize category organization',
      'Set specific productivity goals for the next period'
    ];
    
    return {
      summary,
      recommendations,
      trends,
      alerts,
      performance: {
        best,
        needsImprovement,
        opportunities
      }
    };
  };

  const copyToClipboard = async () => {
    try {
      if (!aiInsights) return;
      
      const insightsText = `
${aiInsights.summary}

RECOMMENDATIONS:
${aiInsights.recommendations.map(rec => `• ${rec}`).join('\n')}

TRENDS:
${aiInsights.trends.map(trend => `• ${trend}`).join('\n')}

${aiInsights.alerts.length > 0 ? `ALERTS:\n${aiInsights.alerts.map(alert => `• ${alert}`).join('\n')}\n` : ''}PERFORMANCE:
Best: ${aiInsights.performance.best}
Needs Improvement: ${aiInsights.performance.needsImprovement}

OPPORTUNITIES:
${aiInsights.performance.opportunities.map(opp => `• ${opp}`).join('\n')}
      `.trim();
      
      await navigator.clipboard.writeText(insightsText);
      alert('Insights copied to clipboard!');
    } catch (error) {
      alert('Failed to copy to clipboard');
    }
  };

  const exportData = () => {
    const periodActivities = getActivitiesByPeriod(analysisPeriod);
    const csvContent = [
      ['Date', 'Category', 'Start Time', 'End Time', 'Duration (h)', 'Description'],
      ...periodActivities.map(activity => [
        activity.date,
        activity.category,
        activity.startTime,
        activity.endTime,
        calculateDuration(activity.startTime, activity.endTime).toFixed(2),
        activity.description
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timesheet-${analysisPeriod}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const getPeriodStats = () => {
    const periodActivities = getActivitiesByPeriod(analysisPeriod);
    const totalPeriodHours = periodActivities.reduce((sum, activity) => {
      return sum + calculateDuration(activity.startTime, activity.endTime);
    }, 0);

    const periodDays = analysisPeriod === 'weekly' ? 7 : analysisPeriod === 'monthly' ? 30 : 365;
    const avgHoursPerDay = totalPeriodHours / periodDays;

    return {
      totalHours: totalPeriodHours,
      activitiesCount: periodActivities.length,
      avgHoursPerDay
    };
  };

  const periodStats = getPeriodStats();

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
            <Select value={analysisPeriod} onValueChange={(value: AnalysisPeriod) => setAnalysisPeriod(value)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">📅 Last 7 Days</SelectItem>
                <SelectItem value="monthly">📅 Last 30 Days</SelectItem>
                <SelectItem value="yearly">📅 Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={selectedProject.toString()} 
              onValueChange={(value) => setSelectedProject(value === 'all' ? 'all' : parseInt(value))}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">📁 All Projects</SelectItem>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id.toString()}>
                    📁 {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={exportData} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
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

      {/* Filter Summary */}
      <Card className="mb-8 border-blue-200 bg-blue-50">
        <CardContent className="pt-4">
          <div className="flex items-center gap-2 text-sm">
            <Filter className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-blue-800">Active Filter:</span>
            <span className="text-blue-700">
              {analysisPeriod === 'weekly' ? '📅 Last 7 Days' : 
               analysisPeriod === 'monthly' ? '📅 Last 30 Days' : '📅 Last Year'}
            </span>
            {selectedProject !== 'all' && (
              <>
                <span className="text-blue-600">•</span>
                <span className="text-blue-700">
                  📁 {projects.find(p => p.id === selectedProject)?.name || 'Project'}
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.totalHours.toFixed(2)}h</div>
            <p className="text-xs text-muted-foreground">
              {analysisPeriod === 'weekly' ? 'This week' : analysisPeriod === 'monthly' ? 'This month' : 'This year'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activities</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.activitiesCount}</div>
            <p className="text-xs text-muted-foreground">
              Total entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average/Day</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{periodStats.avgHoursPerDay.toFixed(2)}h</div>
            <p className="text-xs text-muted-foreground">
              Hours per day
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categoryStats.length}</div>
            <p className="text-xs text-muted-foreground">
              Different types
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Category Distribution
              <span className="text-xs text-gray-500 font-normal">
                ({analysisPeriod === 'weekly' ? '7 days' : analysisPeriod === 'monthly' ? '30 days' : '1 year'})
                {selectedProject !== 'all' && ` • ${projects.find(p => p.id === selectedProject)?.name}`}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryStats.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">No data for this period</p>
                  <p className="text-xs text-gray-400">
                    Try changing the period filter or add some activities
                  </p>
                </div>
              ) : (
                categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-sm font-medium">{stat.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-12 text-right">
                        {stat.hours.toFixed(1)}h
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Analysis
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                Manual Logic
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button 
                onClick={analyzeWithAI} 
                disabled={isAnalyzing || activities.length === 0}
                className="w-full"
              >
                {isAnalyzing ? 'Analyzing...' : `Analyze ${analysisPeriod === 'weekly' ? 'Weekly' : analysisPeriod === 'monthly' ? 'Monthly' : 'Yearly'}`}
              </Button>
              
              {aiInsights && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">Insights & Recommendations</h4>
                      <span className="text-xs text-gray-500">
                        Manual Analysis
                      </span>
                    </div>
                    <Button onClick={copyToClipboard} variant="ghost" size="sm">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg text-sm space-y-4">
                    {/* Summary */}
                    <div>
                      <h5 className="font-medium text-blue-700 mb-2">Summary</h5>
                      <p className="text-gray-700">{aiInsights.summary}</p>
                    </div>

                    {/* Performance */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-green-700 mb-2">Best Performance</h5>
                        <p className="text-gray-700">{aiInsights.performance.best}</p>
                      </div>
                      <div>
                        <h5 className="font-medium text-yellow-700 mb-2">Needs Improvement</h5>
                        <p className="text-gray-700">{aiInsights.performance.needsImprovement}</p>
                      </div>
                    </div>

                    {/* Recommendations */}
                    <div>
                      <h5 className="font-medium text-purple-700 mb-2">Recommendations</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {aiInsights.recommendations.map((rec, index) => (
                          <li key={index} className="text-gray-700">{rec}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Trends */}
                    <div>
                      <h5 className="font-medium text-indigo-700 mb-2">Trends</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {aiInsights.trends.map((trend, index) => (
                          <li key={index} className="text-gray-700">{trend}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Alerts */}
                    {aiInsights.alerts.length > 0 && (
                      <div>
                        <h5 className="font-medium text-red-700 mb-2">Alerts</h5>
                        <ul className="list-disc list-inside space-y-1">
                          {aiInsights.alerts.map((alert, index) => (
                            <li key={index} className="text-red-600">{alert}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Opportunities */}
                    <div>
                      <h5 className="font-medium text-emerald-700 mb-2">Opportunities</h5>
                      <ul className="list-disc list-inside space-y-1">
                        {aiInsights.performance.opportunities.map((opp, index) => (
                          <li key={index} className="text-gray-700">{opp}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
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
    </div>
  );
} 