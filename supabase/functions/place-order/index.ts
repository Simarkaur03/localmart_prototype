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

    const { items, customerId, storeId, deliveryAddress, totalAmount } = await req.json()

    // 1. Double check stock for all items
    for (const item of items) {
      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('stock_qty, name')
        .eq('id', item.id)
        .single()

      if (fetchError || !product) throw new Error(`Product ${item.name} not found`)
      if (product.stock_qty < item.quantity) {
        throw new Error(`Insufficient stock for ${product.name}`)
      }
    }

    // 2. Create Order & Order Items (Transaction managed by DB triggers)
    // In Supabase, multi-row inserts or RPC are best for atomicity
    // We'll insert the order first
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_id: customerId,
        store_id: storeId,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        status: 'pending'
      })
      .select()
      .single()

    if (orderError) throw orderError

    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      price_at_order: item.price,
      product_name: item.name
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return new Response(JSON.stringify({ orderId: order.id }), {
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
