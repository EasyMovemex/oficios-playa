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

  const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
  const SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { job_request_id } = await req.json() as { job_request_id: string };
  if (!job_request_id) {
    return new Response(JSON.stringify({ error: 'job_request_id is required' }), {
      status: 400, headers: corsHeaders,
    });
  }

  // Get job category and title
  const { data: job } = await supabase
    .from('job_requests')
    .select('category_id, title, service_categories(name)')
    .eq('id', job_request_id)
    .single();

  if (!job) {
    return new Response(JSON.stringify({ error: 'Job not found' }), { status: 404, headers: corsHeaders });
  }

  // Find provider_service entries for this category
  const { data: services } = await supabase
    .from('provider_services')
    .select('provider_id')
    .eq('category_id', job.category_id);

  const providerIds = (services ?? []).map((s: { provider_id: string }) => s.provider_id);
  if (providerIds.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), { headers: corsHeaders });
  }

  // Get push tokens of verified providers
  const { data: providerProfiles } = await supabase
    .from('provider_profiles')
    .select('user_id')
    .in('id', providerIds)
    .eq('verified', true);

  const userIds = (providerProfiles ?? []).map((pp: { user_id: string }) => pp.user_id);
  if (userIds.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), { headers: corsHeaders });
  }

  const { data: profiles } = await supabase
    .from('profiles')
    .select('expo_push_token')
    .in('id', userIds)
    .not('expo_push_token', 'is', null);

  const tokens = (profiles ?? [])
    .map((p: { expo_push_token: string | null }) => p.expo_push_token)
    .filter(Boolean) as string[];

  if (tokens.length === 0) {
    return new Response(JSON.stringify({ ok: true, sent: 0 }), { headers: corsHeaders });
  }

  const catName = (job.service_categories as { name: string } | null)?.name ?? 'tu categoría';

  await fetch(`${SUPABASE_URL}/functions/v1/send-push-notification`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${SERVICE_KEY}` },
    body: JSON.stringify({
      to: tokens,
      title: `Nueva solicitud de ${catName}`,
      body: job.title,
      data: { screen: 'job', id: job_request_id },
    }),
  });

  return new Response(JSON.stringify({ ok: true, sent: tokens.length }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
});
