// app/api/upload/devices/keyword-predictions
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';


// Initialize the Supabase admin client using environment variables
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
  
  // Parse the incoming JSON payload.
  let jsonData;
  try {
    jsonData = await request.json();
  } catch (error) {
    return NextResponse.json({ error: 'Invalid JSON.' }, { status: 400 });
  }
  
  // Expect the following fields in the payload:
  // device_id, device_secret, predicted_label, model_type
  const { device_id, device_password, predicted_label, model_type } = jsonData;
  
  if (!device_id || !device_password || !predicted_label || !model_type) {
    return NextResponse.json(
      { error: 'Missing required fields.' },
      { status: 400 }
    );
  }
  
  // Validate device credentials against your devices table
  const { data: deviceData, error: deviceError } = await supabaseAdmin
    .from('devices')
    .select('*')
    .eq('device_id', device_id)
    .single();
  
  if (deviceError || !deviceData) {
    return NextResponse.json(
      { error: 'Device not found.' },
      { status: 404 }
    );
  }
  
  // Check that the provided device_secret matches what you have stored
  if (deviceData.device_password !== device_password) {
    return NextResponse.json(
      { error: 'Invalid device credentials.' },
      { status: 401 }
    );
  }
  
  // Optionally, you can add further security by verifying a signature or timestamp
  
  // Insert the prediction data into Supabase (predictions table)
  const { error } = await supabaseAdmin
    .from('keyword_predictions')
    .insert([
      {
        device_id,
        predicted_label,
      }
    ]);
  
  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
  
  return NextResponse.json({ message: 'Prediction stored successfully.' });
}
