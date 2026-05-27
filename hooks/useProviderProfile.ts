import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';

export type MyProviderProfile = {
  id: string;
  user_id: string;
  business_name: string | null;
  logo_url: string | null;
  bio: string | null;
  years_experience: number;
  verified: boolean;
  rating_avg: number;
  total_reviews: number;
  coverage_area: string;
  schedule: string | null;
  website: string | null;
  portfolio_urls: string[] | null;
  created_at: string;
  updated_at: string;
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

export function useMyProviderProfile() {
  const { profile } = useAuthStore();

  return useQuery<MyProviderProfile | null>({
    queryKey: ['my-provider-profile', profile?.id],
    queryFn: async () => {
      if (!profile) return null;

      const { data, error } = await supabase
        .from('provider_profiles')
        .select(`
          *,
          provider_services (
            id, price_from, price_unit,
            service_categories (id, name, slug, icon)
          )
        `)
        .eq('user_id', profile.id)
        .maybeSingle();

      if (error) throw error;
      return data as MyProviderProfile | null;
    },
    enabled: !!profile,
  });
}
