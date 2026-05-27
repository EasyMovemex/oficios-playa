import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BidStatus } from '@/types';

export type BidWithProvider = {
  id: string;
  job_request_id: string;
  provider_id: string;
  price: number;
  message: string | null;
  status: BidStatus;
  created_at: string;
  provider_profiles: {
    id: string;
    verified: boolean;
    rating_avg: number;
    total_reviews: number;
    profiles: {
      full_name: string;
      avatar_url: string | null;
    };
  };
};

async function getMyProviderId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data, error } = await supabase
    .from('provider_profiles')
    .select('id')
    .eq('user_id', user.id)
    .single();
  if (error || !data) throw new Error('Provider profile not found');
  return (data as { id: string }).id;
}

export function useCreateBid() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      job_request_id: string;
      price: number;
      message?: string;
    }) => {
      const providerId = await getMyProviderId();
      const { data, error } = await supabase
        .from('job_bids')
        .insert({ ...values, provider_id: providerId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['bids', vars.job_request_id] });
    },
  });
}

export type MyActiveBid = {
  id: string;
  job_request_id: string;
  price: number;
  message: string | null;
  status: BidStatus;
  created_at: string;
  job_requests: {
    id: string;
    title: string;
    status: string;
    service_categories: { name: string; icon: string };
  };
};

export function useMyActiveBids(providerId: string | undefined) {
  return useQuery<MyActiveBid[]>({
    queryKey: ['my-active-bids', providerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_bids')
        .select(`
          id, job_request_id, price, message, status, created_at,
          job_requests!job_request_id (
            id, title, status,
            service_categories!category_id (name, icon)
          )
        `)
        .eq('provider_id', providerId!)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      return (data ?? []) as unknown as MyActiveBid[];
    },
    enabled: !!providerId,
  });
}

export function useBids(jobRequestId: string) {
  return useQuery<BidWithProvider[]>({
    queryKey: ['bids', jobRequestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_bids')
        .select(`
          *,
          provider_profiles!provider_id (
            id, verified, rating_avg, total_reviews,
            profiles!user_id (full_name, avatar_url)
          )
        `)
        .eq('job_request_id', jobRequestId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as BidWithProvider[];
    },
    enabled: !!jobRequestId,
  });
}
