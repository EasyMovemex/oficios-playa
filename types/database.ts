export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      service_categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          avatar_url: string | null;
          role: string[];
          expo_push_token: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string[];
          expo_push_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: string[];
          expo_push_token?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      provider_profiles: {
        Row: {
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
        Insert: {
          id?: string;
          user_id: string;
          bio?: string | null;
          years_experience?: number;
          verified?: boolean;
          rating_avg?: number;
          total_reviews?: number;
          coverage_area?: string;
          portfolio_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          bio?: string | null;
          years_experience?: number;
          verified?: boolean;
          rating_avg?: number;
          total_reviews?: number;
          coverage_area?: string;
          portfolio_urls?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      provider_services: {
        Row: {
          id: string;
          provider_id: string;
          category_id: string;
          price_from: number | null;
          price_unit: string;
        };
        Insert: {
          id?: string;
          provider_id: string;
          category_id: string;
          price_from?: number | null;
          price_unit?: string;
        };
        Update: {
          id?: string;
          provider_id?: string;
          category_id?: string;
          price_from?: number | null;
          price_unit?: string;
        };
      };
      job_requests: {
        Row: {
          id: string;
          client_id: string;
          category_id: string;
          title: string;
          description: string;
          photos: string[] | null;
          location: string;
          budget_min: number | null;
          budget_max: number | null;
          status: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          client_id: string;
          category_id: string;
          title: string;
          description: string;
          photos?: string[] | null;
          location: string;
          budget_min?: number | null;
          budget_max?: number | null;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          client_id?: string;
          category_id?: string;
          title?: string;
          description?: string;
          photos?: string[] | null;
          location?: string;
          budget_min?: number | null;
          budget_max?: number | null;
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      job_bids: {
        Row: {
          id: string;
          job_request_id: string;
          provider_id: string;
          price: number;
          message: string | null;
          status: 'pending' | 'accepted' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          job_request_id: string;
          provider_id: string;
          price: number;
          message?: string | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          job_request_id?: string;
          provider_id?: string;
          price?: number;
          message?: string | null;
          status?: 'pending' | 'accepted' | 'rejected';
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          job_request_id: string;
          bid_id: string | null;
          client_id: string;
          provider_id: string;
          status: 'confirmed' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
          scheduled_at: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          job_request_id: string;
          bid_id?: string | null;
          client_id: string;
          provider_id: string;
          status?: 'confirmed' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
          scheduled_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          job_request_id?: string;
          bid_id?: string | null;
          client_id?: string;
          provider_id?: string;
          status?: 'confirmed' | 'in_progress' | 'completed' | 'disputed' | 'cancelled';
          scheduled_at?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          booking_id: string;
          reviewer_id: string;
          reviewee_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          booking_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          rating?: number;
          comment?: string | null;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
