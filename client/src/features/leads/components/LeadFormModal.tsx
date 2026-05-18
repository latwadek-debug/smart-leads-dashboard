import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

import { leadSchema, LeadFormData, LeadStatus, LeadSource, Lead } from '../types';
import { createLead, updateLead } from '../api';

interface LeadFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  leadToEdit?: Lead | null;
}

export function LeadFormModal({ isOpen, onClose, leadToEdit }: LeadFormModalProps) {
  const queryClient = useQueryClient();
  const isEditing = !!leadToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: '',
      email: '',
      status: LeadStatus.NEW,
      source: LeadSource.WEBSITE,
      notes: '',
    },
  });

  // Populate form if editing
  useEffect(() => {
    if (isOpen && leadToEdit) {
      reset({
        name: leadToEdit.name,
        email: leadToEdit.email,
        status: leadToEdit.status,
        source: leadToEdit.source,
        notes: leadToEdit.notes || '',
      });
    } else if (isOpen && !leadToEdit) {
      reset({
        name: '',
        email: '',
        status: LeadStatus.NEW,
        source: LeadSource.WEBSITE,
        notes: '',
      });
    }
  }, [isOpen, leadToEdit, reset]);

  const mutationFn = isEditing
    ? (data: LeadFormData) => updateLead({ id: leadToEdit._id, data })
    : createLead;

  const mutation = useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast.success(isEditing ? 'Lead updated successfully' : 'Lead created successfully');
      onClose();
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'An error occurred';
      toast.error(message);
    },
  });

  const onSubmit = (data: LeadFormData) => {
    mutation.mutate(data);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Lead' : 'Add New Lead'}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Jane Doe"
          {...register('name')}
          error={errors.name?.message}
        />
        
        <Input
          label="Email Address"
          type="email"
          placeholder="jane@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            {...register('status')}
            error={errors.status?.message}
            options={[
              { value: LeadStatus.NEW, label: 'New' },
              { value: LeadStatus.CONTACTED, label: 'Contacted' },
              { value: LeadStatus.QUALIFIED, label: 'Qualified' },
              { value: LeadStatus.LOST, label: 'Lost' },
            ]}
          />
          <Select
            label="Source"
            {...register('source')}
            error={errors.source?.message}
            options={[
              { value: LeadSource.WEBSITE, label: 'Website' },
              { value: LeadSource.INSTAGRAM, label: 'Instagram' },
              { value: LeadSource.REFERRAL, label: 'Referral' },
            ]}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (Optional)
          </label>
          <textarea
            className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:border-dark-border dark:text-gray-100"
            placeholder="Add any additional context about this lead..."
            {...register('notes')}
          />
          {errors.notes && <p className="mt-1 text-sm text-red-500">{errors.notes.message}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={mutation.isPending}>
            {isEditing ? 'Save Changes' : 'Create Lead'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
