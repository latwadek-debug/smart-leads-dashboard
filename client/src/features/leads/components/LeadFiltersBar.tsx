import { Search, Download, Plus } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { LeadStatus, LeadSource, LeadFilters } from '../types';

interface LeadFiltersProps {
  filters: LeadFilters;
  onFilterChange: (filters: Partial<LeadFilters>) => void;
  onExportCsv: () => void;
  onAddLead: () => void;
  isExporting?: boolean;
}

export function LeadFiltersBar({ 
  filters, 
  onFilterChange, 
  onExportCsv, 
  onAddLead,
  isExporting
}: LeadFiltersProps) {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 bg-white dark:bg-dark-surface p-4 rounded-xl border border-gray-200 dark:border-dark-border shadow-sm mb-6">
      
      {/* Search and Filters */}
      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 w-full md:w-auto">
        <div className="relative w-full sm:w-64">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="flex h-10 w-full rounded-md border border-gray-300 bg-white pl-10 pr-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:border-dark-border dark:text-gray-100"
            placeholder="Search leads by name or email..."
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
          />
        </div>
        
        <Select
          className="w-full sm:w-40"
          value={filters.status || ''}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
          options={[
            { value: '', label: 'All Statuses' },
            { value: LeadStatus.NEW, label: 'New' },
            { value: LeadStatus.CONTACTED, label: 'Contacted' },
            { value: LeadStatus.QUALIFIED, label: 'Qualified' },
            { value: LeadStatus.LOST, label: 'Lost' },
          ]}
        />

        <Select
          className="w-full sm:w-40"
          value={filters.source || ''}
          onChange={(e) => onFilterChange({ source: e.target.value, page: 1 })}
          options={[
            { value: '', label: 'All Sources' },
            { value: LeadSource.WEBSITE, label: 'Website' },
            { value: LeadSource.INSTAGRAM, label: 'Instagram' },
            { value: LeadSource.REFERRAL, label: 'Referral' },
          ]}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-3 self-end md:self-auto mt-4 md:mt-0">
        <Button 
          variant="outline" 
          onClick={onExportCsv}
          isLoading={isExporting}
        >
          <Download className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Export CSV</span>
          <span className="sm:hidden">Export</span>
        </Button>
        <Button onClick={onAddLead}>
          <Plus className="mr-2 h-4 w-4" />
          New Lead
        </Button>
      </div>

    </div>
  );
}
