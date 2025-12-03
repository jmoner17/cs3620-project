// app/api/device/register-device/route.js
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PRIVATE_SUPABASE_SERVICE_KEY
);

export async function POST(request) {
  // Ensure content type is JSON
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    return NextResponse.json(
      { error: 'Invalid content type. Expected application/json.' },
      { status: 400 }
    );
  }
  
  try {
    const jsonData = await request.json();
    
    // Check if the required fields exist and are strings
    if (
      !jsonData.device_id || typeof jsonData.device_id !== 'string' ||
      !jsonData.device_password || typeof jsonData.device_password !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Missing or invalid device_id or device_password.' },
        { status: 400 }
      );
    }
    
    // Trim the inputs
    const device_id = jsonData.device_id.trim();
    const device_password = jsonData.device_password.trim();
    
    // Define allowed patterns:
    // device_id: only alphanumeric (A-Za-z0-9)
    // device_password: alphanumeric and special characters @#$%^&*!
    const deviceIdRegex = /^[A-Za-z0-9]+$/;
    const devicePasswordRegex = /^[A-Za-z0-9@#$%^&*!]+$/;
    
    if (!deviceIdRegex.test(device_id)) {
      return NextResponse.json(
        { error: 'Invalid device_id. Allowed characters: A-Za-z0-9.' },
        { status: 400 }
      );
    }
    
    if (!devicePasswordRegex.test(device_password)) {
      return NextResponse.json(
        { error: 'Invalid device_password. Allowed characters: A-Za-z0-9 and @#$%^&*!.' },
        { status: 400 }
      );
    }
    
    // Insert the device as unclaimed (or update if already exists)
    const { error } = await supabaseAdmin
      .from('devices')
      .insert([
        { device_id, device_password }
      ]);
      
    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to register device.' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Device registered and unclaimed. Ready for pairing.' });
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

