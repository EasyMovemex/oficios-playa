import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { JobRequest, ServiceCategory } from '@/types';

export type JobRequestWithDetails = JobRequest & {
  service_categories: Pick<ServiceCategory, 'name' | 'icon' | 'slug'> | null;
  job_bids: { id: string }[];
};

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export function useMyJobRequests() {
  return useQuery({
    queryKey: ['job-requests', 'mine'],
    queryFn: async (): Promise<JobRequestWithDetails[]> => {
      const userId = await getCurrentUserId();

      const { data, error } = await supabase
        .from('job_requests')
        .select('*, service_categories(name, icon, slug), job_bids(id)')
        .eq('client_id', userId)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as JobRequestWithDetails[];
    },
  });
}

export function useJobRequest(id: string) {
  return useQuery({
    queryKey: ['job-requests', id],
    queryFn: async (): Promise<JobRequestWithDetails> => {
      const { data, error } = await supabase
        .from('job_requests')
        .select('*, service_categories(name, icon, slug), job_bids(id)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as JobRequestWithDetails;
    },
    enabled: !!id,
  });
}

export function useOpenJobsForCategories(categoryIds: string[]) {
  return useQuery({
    queryKey: ['job-requests', 'open', categoryIds],
    queryFn: async (): Promise<JobRequestWithDetails[]> => {
      if (categoryIds.length === 0) return [];
      const { data, error } = await supabase
        .from('job_requests')
        .select('*, service_categories(name, icon, slug), job_bids(id)')
        .eq('status', 'open')
        .is('deleted_at', null)
        .in('category_id', categoryIds)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as JobRequestWithDetails[];
    },
    enabled: categoryIds.length > 0,
  });
}

export function useCreateJobRequest() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (values: {
      category_id: string;
      title: string;
      description: string;
      location: string;
      budget_min?: number;
      budget_max?: number;
      photos?: string[];
    }) => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('job_requests')
        .insert({ ...values, client_id: userId })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['job-requests'] });
      if (data?.id) {
        supabase.functions.invoke('notify-providers-new-job', { body: { job_request_id: data.id } }).catch(() => {});
      }
    },
  });
}
