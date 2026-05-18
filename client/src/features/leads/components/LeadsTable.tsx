import { format } from 'date-fns';
import { Edit2, Trash2, MoreHorizontal, Inbox } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/Table';
import { Badge } from '@/components/ui/Badge';
import { Lead, LeadStatus } from '../types';
import { Button } from '@/components/ui/Button';

interface LeadsTableProps {
  leads: Lead[];
  isLoading: boolean;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
}

export function LeadsTable({ leads, isLoading, onEdit, onDelete, isAdmin }: LeadsTableProps) {
  
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
      <div className="w-full bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-8 flex flex-col items-center justify-center space-y-4">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-2"></div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Loading leads...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border p-12 flex flex-col items-center justify-center text-center">
        <div className="h-12 w-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
          <Inbox className="h-6 w-6 text-primary-600 dark:text-primary-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No leads found</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          Get started by adding a new lead or adjusting your search filters.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-surface rounded-xl border border-gray-200 dark:border-dark-border shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead) => (
            <TableRow key={lead._id}>
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400">{lead.email}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(lead.status)}>{lead.status}</Badge>
              </TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell className="text-gray-500 dark:text-gray-400 text-sm">
                {format(new Date(lead.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onEdit(lead)} className="h-8 w-8 p-0" title="Edit">
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Button>
                  {isAdmin && (
                    <Button variant="ghost" size="sm" onClick={() => onDelete(lead._id)} className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" title="Delete">
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
