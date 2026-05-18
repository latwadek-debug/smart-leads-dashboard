import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { getLeads, deleteLead, exportLeadsCsv } from '../api';
import { LeadFiltersBar } from '../components/LeadFiltersBar';
import { LeadsTable } from '../components/LeadsTable';
import { LeadFormModal } from '../components/LeadFormModal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Lead, LeadFilters } from '../types';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuthStore } from '@/store/authStore';
import { UserRole } from '@/types';
import { Button } from '@/components/ui/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function LeadsPage() {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const isAdmin = user?.role === UserRole.ADMIN;

  // Local state for UI Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToEdit, setLeadToEdit] = useState<Lead | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState<string | null>(null);

  // Filters State
  const [filters, setFilters] = useState<LeadFilters>({
    page: 1,
    limit: 10,
    search: '',
    status: '',
    source: '',
  });

  // Debounce search term to prevent excessive API calls
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch leads based on filters + debounced search
  const { data, isLoading, isError } = useQuery({
    queryKey: ['leads', { ...filters, search: debouncedSearch }],
    queryFn: () => getLeads({ ...filters, search: debouncedSearch }),
    placeholderData: (previousData) => previousData, // keep old data while fetching new (smoother UI)
  });

  // Handle pagination reset when search/filters change
  useEffect(() => {
    if (debouncedSearch !== filters.search) {
       // Just resetting page visually if needed, but handled mostly via onFilterChange below.
    }
  }, [debouncedSearch, filters.search]);

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: deleteLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success('Lead deleted successfully');
      setLeadToDelete(null);
    },
    onError: () => {
      toast.error('Failed to delete lead');
      setLeadToDelete(null);
    }
  });

  // Handlers
  const handleFilterChange = (newFilters: Partial<LeadFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleEdit = (lead: Lead) => {
    setLeadToEdit(lead);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setLeadToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setLeadToDelete(id);
  };

  const handleExport = async () => {
    try {
      setIsExporting(true);
      await exportLeadsCsv({
        status: filters.status,
        source: filters.source,
        search: debouncedSearch,
      });
      toast.success('Export downloaded successfully');
    } catch (error) {
      toast.error('Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  if (isError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
        Failed to load leads. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Leads Pipeline</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage and track your customer leads.</p>
        </div>
      </div>

      <LeadFiltersBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onExportCsv={handleExport}
        onAddLead={handleAdd}
        isExporting={isExporting}
      />

      <LeadsTable 
        leads={data?.data || []} 
        isLoading={isLoading} 
        onEdit={handleEdit} 
        onDelete={handleDelete}
        isAdmin={isAdmin}
      />

      {/* Pagination Controls */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between bg-white dark:bg-dark-surface px-4 py-3 border border-gray-200 dark:border-dark-border rounded-xl">
          <div className="flex flex-1 justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handleFilterChange({ page: filters.page! - 1 })}
              disabled={!data.pagination.hasPrevPage}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handleFilterChange({ page: filters.page! + 1 })}
              disabled={!data.pagination.hasNextPage}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing page <span className="font-medium">{data.pagination.page}</span> of{' '}
                <span className="font-medium">{data.pagination.totalPages}</span> 
                {' '}({data.pagination.total} total results)
              </p>
            </div>
            <div>
              <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-r-none"
                  onClick={() => handleFilterChange({ page: filters.page! - 1 })}
                  disabled={!data.pagination.hasPrevPage}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-l-none border-l-0"
                  onClick={() => handleFilterChange({ page: filters.page! + 1 })}
                  disabled={!data.pagination.hasNextPage}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Reusable Form Modal */}
      <LeadFormModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={leadToEdit}
      />

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={!!leadToDelete}
        onClose={() => setLeadToDelete(null)}
        onConfirm={() => leadToDelete && deleteMutation.mutate(leadToDelete)}
        title="Delete Lead"
        description="Are you sure you want to delete this lead? This action cannot be undone and all associated data will be lost."
        confirmText="Delete Lead"
        isDestructive={true}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
