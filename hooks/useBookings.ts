import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { BookingStatus } from '@/types';

const BOOKING_SELECT = `
  *,
  job_requests (id, title, location, service_categories(name, icon, slug)),
  provider_profiles!provider_id (
    id, user_id, verified, rating_avg,
    profiles!user_id (full_name, phone, avatar_url)
  ),
  profiles!client_id (full_name, phone, avatar_url)
`;

export type BookingWithDetails = {
  id: string;
  job_request_id: string;
  bid_id: string | null;
  client_id: string;
  provider_id: string;
  status: BookingStatus;
  scheduled_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  job_requests: {
    id: string;
    title: string;
    location: string;
    service_categories: { name: string; icon: string; slug: string } | null;
  };
  provider_profiles: {
    id: string;
    user_id: string;
    verified: boolean;
    rating_avg: number;
    profiles: { full_name: string; phone: string | null; avatar_url: string | null };
  };
  profiles: { full_name: string; phone: string | null; avatar_url: string | null };
};

async function getCurrentUserId(): Promise<string> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  return user.id;
}

export function useMyClientBookings() {
  return useQuery<BookingWithDetails[]>({
    queryKey: ['bookings', 'client'],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('bookings')
        .select(BOOKING_SELECT)
        .eq('client_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as BookingWithDetails[];
    },
  });
}

export function useMyProviderBookings(providerProfileId?: string) {
  return useQuery<BookingWithDetails[]>({
    queryKey: ['bookings', 'provider', providerProfileId],
    queryFn: async () => {
      if (!providerProfileId) return [];
      const { data, error } = await supabase
        .from('bookings')
        .select(BOOKING_SELECT)
        .eq('provider_id', providerProfileId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as BookingWithDetails[];
    },
    enabled: !!providerProfileId,
  });
}

export function useBooking(id: string) {
  return useQuery<BookingWithDetails>({
    queryKey: ['booking', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(BOOKING_SELECT)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as unknown as BookingWithDetails;
    },
    enabled: !!id,
  });
}

export function useMyReviewForBooking(bookingId: string) {
  return useQuery<boolean>({
    queryKey: ['review-exists', bookingId],
    queryFn: async () => {
      const userId = await getCurrentUserId();
      const { count } = await supabase
        .from('reviews')
        .select('id', { count: 'exact', head: true })
        .eq('booking_id', bookingId)
        .eq('reviewer_id', userId);
      return (count ?? 0) > 0;
    },
    enabled: !!bookingId,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (values: {
      booking_id: string;
      reviewee_id: string;
      rating: number;
      comment?: string;
    }) => {
      const userId = await getCurrentUserId();
      const { data, error } = await supabase
        .from('reviews')
        .insert({ ...values, reviewer_id: userId })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['booking', vars.booking_id] });
      qc.invalidateQueries({ queryKey: ['bookings'] });
    },
  });
}
