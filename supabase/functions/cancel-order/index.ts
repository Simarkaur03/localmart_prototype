import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { orderId, reason } = await req.json()

    // 1. Check if cancel is allowed
    const { data: order, error: fetchError } = await supabase
      .from('orders')
      .select('status')
      .eq('id', orderId)
      .single()

    if (fetchError || !order) throw new Error('Order not found')
    
    const allowedStatus = ['pending', 'accepted'];
    if (!allowedStatus.includes(order.status)) {
       throw new Error(`Cannot cancel order in ${order.status} state`)
    }

    // 2. Update status (Stock restoration handled by DB trigger restore_stock_trigger)
    const { error: updateError } = await supabase
      .from('orders')
      .update({ 
        status: 'cancelled',
        cancellation_reason: reason 
      })
      .eq('id', orderId)

    if (updateError) throw updateError

    return new Response(JSON.stringify({ status: 'cancelled' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
