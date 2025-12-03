// app/api/device/link/route.js
import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY
);


export async function POST(request) {
  // Ensure the request has a JSON content type.
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid content type. Expected application/json.' },
      { status: 400 }
    );
  }
  
  const supabase = createRouteHandlerClient({ cookies });
  
  // Retrieve the authenticated user.
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json(
      { error: 'Not authenticated.' },
      { status: 401 }
    );
  }
  
  try {
    // Parse the incoming JSON payload.
    const { device_id, device_password } = await request.json();
    if (!device_id || !device_password) {
      return NextResponse.json(
        { error: 'Missing device_id or device_password.' },
        { status: 400 }
      );
    }
    
    // Query the devices table for a matching device.
    const { data: device, error: selectError } = await supabaseAdmin
      .from('devices')
      .select('*')
      .eq('device_id', device_id.trim())
      .eq('device_password', device_password.trim())
      .single();
      
    if (selectError || !device) {
      return NextResponse.json(
        { error: 'Device not found or invalid credentials.' },
        { status: 404 }
      );
    }
    
    // Ensure the device is unclaimed.
    if (device.claimed) {
      return NextResponse.json(
        { error: 'Device is already claimed.' },
        { status: 400 }
      );
    }
    
    // Update the device record: mark it as claimed and attach the user's ID.
    const { error: updateError } = await supabaseAdmin
      .from('devices')
      .update({ claimed: true, user_id: user.id })
      .eq('device_id', device.device_id);
      
    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to claim device.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: 'Device successfully linked to your account.'
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}


