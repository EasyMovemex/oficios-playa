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

  const { booking_id } = await req.json() as { booking_id: string };
  if (!booking_id) {
    return new Response(JSON.stringify({ error: 'booking_id is required' }), { status: 400, headers: corsHeaders });
  }

  // Fetch the booking
  const { data: booking, error: bookingError } = await supabase
    .from('bookings')
    .select('id, client_id, job_request_id, status')
    .eq('id', booking_id)
    .single();

  if (bookingError || !booking) {
    return new Response(JSON.stringify({ error: 'Booking not found' }), { status: 404, headers: corsHeaders });
  }

  if (booking.client_id !== user.id) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: corsHeaders });
  }

  if (!['confirmed', 'in_progress'].includes(booking.status)) {
    return new Response(
      JSON.stringify({ error: 'Booking cannot be completed in its current status' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // Mark booking as completed
  const now = new Date().toISOString();
  const { data: updated, error: updateError } = await supabase
    .from('bookings')
    .update({ status: 'completed', completed_at: now, updated_at: now })
    .eq('id', booking_id)
    .select()
    .single();

  if (updateError) {
    return new Response(JSON.stringify({ error: 'Failed to update booking' }), { status: 500, headers: corsHeaders });
  }

  // Mark the job request as completed
  await supabase
    .from('job_requests')
    .update({ status: 'completed', updated_at: now })
    .eq('id', booking.job_request_id);

  return new Response(JSON.stringify({ booking: updated }), {
    status: 200,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
