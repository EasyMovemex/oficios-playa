import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export type ProviderWithDetails = {
  id: string;
  user_id: string;
  bio: string | null;
  years_experience: number;
  verified: boolean;
  rating_avg: number;
  total_reviews: number;
  coverage_area: string;
  portfolio_urls: string[] | null;
  created_at: string;
  updated_at: string;
  profiles: {
    id: string;
    full_name: string;
    phone: string | null;
    avatar_url: string | null;
  };
  provider_services: {
    id: string;
    price_from: number | null;
    price_unit: string;
    service_categories: {
      id: string;
      name: string;
      slug: string;
      icon: string;
    };
  }[];
};

export type ReviewWithReviewer = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: {
    full_name: string;
    avatar_url: string | null;
  };
};

export function useProviders() {
  return useQuery<ProviderWithDetails[]>({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          profiles!user_id (id, full_name, phone, avatar_url),
          provider_services (
            id, price_from, price_unit,
            service_categories (id, name, slug, icon)
          )
        `)
        .order('rating_avg', { ascending: false });

      if (error) throw error;
      return (data ?? []) as ProviderWithDetails[];
    },
  });
}

export function useProvider(id: string) {
  return useQuery<ProviderWithDetails>({
    queryKey: ['provider', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          profiles!user_id (id, full_name, phone, avatar_url),
          provider_services (
            id, price_from, price_unit,
            service_categories (id, name, slug, icon)
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as ProviderWithDetails;
    },
    enabled: !!id,
  });
}

export function useProviderReviews(providerUserId: string) {
  return useQuery<ReviewWithReviewer[]>({
    queryKey: ['provider-reviews', providerUserId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id, rating, comment, created_at,
          profiles!reviewer_id (full_name, avatar_url)
        `)
        .eq('reviewee_id', providerUserId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data ?? []) as unknown as ReviewWithReviewer[];
    },
    enabled: !!providerUserId,
  });
}
