export type UserRole = 'client' | 'provider';

export type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: string[];
  expo_push_token: string | null;
  created_at: string;
  updated_at: string;
};

export type ProviderProfile = {
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
};

export type ServiceCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  created_at: string;
};

export type ProviderService = {
  id: string;
  provider_id: string;
  category_id: string;
  price_from: number | null;
  price_unit: 'por trabajo' | 'por hora' | 'a convenir';
};

export type JobStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export type JobRequest = {
  id: string;
  client_id: string;
  category_id: string;
  title: string;
  description: string;
  photos: string[] | null;
  location: string;
  budget_min: number | null;
  budget_max: number | null;
  status: JobStatus;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
};

export type BidStatus = 'pending' | 'accepted' | 'rejected';

export type JobBid = {
  id: string;
  job_request_id: string;
  provider_id: string;
  price: number;
  message: string | null;
  status: BidStatus;
  created_at: string;
};

export type BookingStatus = 'confirmed' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';

export type Booking = {
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
};

export type Review = {
  id: string;
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string | null;
  created_at: string;
};

export type ProviderWithProfile = Profile & {
  provider_profiles: ProviderProfile;
  provider_services: (ProviderService & { service_categories: ServiceCategory })[];
};
