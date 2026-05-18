import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '../api';
import { Users, TrendingUp, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Link } from 'react-router-dom';
import { LeadStatus } from '@/features/leads/types';
import { format } from 'date-fns';

export function DashboardHome() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const getStatusBadgeVariant = (status: LeadStatus) => {
    switch (status) {
      case LeadStatus.NEW: return 'info';
      case LeadStatus.CONTACTED: return 'warning';
      case LeadStatus.QUALIFIED: return 'success';
      case LeadStatus.LOST: return 'danger';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card className="animate-pulse h-64"></Card>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
        Failed to load dashboard statistics.
      </div>
    );
  }

  const statCards = [
    { title: 'Total Leads', value: data.total, icon: Users, color: 'text-primary-500', bg: 'bg-primary-50 dark:bg-primary-900/20' },
    { title: 'New Leads', value: data.new, icon: TrendingUp, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Qualified', value: data.qualified, icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20' },
    { title: 'Lost Leads', value: data.lost, icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Dashboard Overview</h2>
        <p className="text-gray-500 dark:text-gray-400">Welcome back! Here is a summary of your lead pipeline.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <Link to="/leads" className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </CardHeader>
          <CardContent className="flex-1">
            {data.recent.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-500">
                <p>No recent activity.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recent.map((lead) => (
                  <div key={lead._id} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-dark-bg border border-transparent hover:border-gray-200 dark:hover:border-dark-border transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">{lead.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Added {format(new Date(lead.createdAt), 'MMM d, yyyy')}</p>
                    </div>
                    <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions / Getting Started */}
        <Card className="col-span-1 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
          <CardHeader>
            <CardTitle className="text-lg text-white">Boost Your Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-primary-100 text-sm mb-6">
              You currently have <span className="font-bold text-white">{data.new}</span> new leads waiting to be contacted. Engaging within the first 24 hours increases conversion by 60%.
            </p>
            <Link 
              to="/leads" 
              className="inline-flex w-full items-center justify-center rounded-md bg-white text-primary-700 px-4 py-2 font-medium transition-colors hover:bg-gray-100"
            >
              Go to Leads
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
