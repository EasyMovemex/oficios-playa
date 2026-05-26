import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const { bid_id } = await req.json() as { bid_id: string };
  if (!bid_id) {
    return new Response(JSON.stringify({ error: 'bid_id is required' }), { status: 400, headers: corsHeaders });
  }

  // Fetch bid with its job request
  const { data: bid, error: bidError } = await supabase
    .from('job_bids')
    .select('id, provider_id, job_request_id, job_requests(id, client_id)')
    .eq('id', bid_id)
    .single();

  if (bidError || !bid) {
    return new Response(JSON.stringify({ error: 'Bid not found' }), { status: 404, headers: corsHeaders });
  }

  const jobRequest = Array.isArray(bid.job_requests) ? bid.job_requests[0] : bid.job_requests;
  if (jobRequest.client_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
  }

  // Accept this bid
  await supabase.from('job_bids').update({ status: 'accepted' }).eq('id', bid_id);

  // Reject all other bids for the same job
  await supabase
    .from('job_bids')
    .update({ status: 'rejected' })
    .eq('job_request_id', bid.job_request_id)
    .neq('id', bid_id);

  // Create booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      job_request_id: bid.job_request_id,
      bid_id,
      client_id: user.id,
      provider_id: bid.provider_id,
      status: 'confirmed',
    })
    .select()
    .single();

  if (bookingError) {
    return new Response(JSON.stringify({ error: 'Failed to create booking' }), { status: 500, headers: corsHeaders });
  }

  // Move job to in_progress
  await supabase
    .from('job_requests')
    .update({ status: 'in_progress' })
    .eq('id', bid.job_request_id);

  // Notify provider that their bid was accepted
  const { data: providerProfile } = await supabase
    .from('provider_profiles')
    .select('user_id')
    .eq('id', bid.provider_id)
    .single();

  if (providerProfile) {
    const { data: providerUser } = await supabase
      .from('profiles')
      .select('expo_push_token')
      .eq('id', providerProfile.user_id)
      .single();

    if (providerUser?.expo_push_token) {
      const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
      const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
      await fetch(`${SUPABASE_URL}/functions/v1/send-push-notification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SERVICE_KEY}` },
        body: JSON.stringify({
          to: providerUser.expo_push_token,
          title: '¡Tu oferta fue aceptada!',
          body: 'El cliente aceptó tu propuesta. Revisá los detalles de la reserva.',
          data: { screen: 'booking', id: booking.id },
        }),
      }).catch(() => {});
    }
  }

  return new Response(JSON.stringify({ booking }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
