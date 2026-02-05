import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin access
);

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET to .env.local');
  }

  // Get headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error: Missing svix headers', { status: 400 });
  }

  // Get body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  // Verify webhook
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error: Verification failed', { status: 400 });
  }

  // Handle the webhook
  const eventType = evt.type;

  if (eventType === 'user.created') {
    const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;

    // Insert user into Supabase
    const { error } = await supabase.from('users').insert({
      clerk_id: id,
      email: email_addresses[0]?.email_address,
      first_name: first_name || '',
      last_name: last_name || '',
      role: (public_metadata as any)?.role || 'student', // Default to student
    });

    if (error) {
      console.error('Error creating user in Supabase:', error);
      return new Response('Error: Failed to create user', { status: 500 });
    }

    console.log('✅ User created in Supabase:', id);
  }

  if (eventType === 'user.updated') {
    const { id, email_addresses, first_name, last_name, public_metadata } = evt.data;

    // Update user in Supabase
    const { error } = await supabase
      .from('users')
      .update({
        email: email_addresses[0]?.email_address,
        first_name: first_name || '',
        last_name: last_name || '',
        role: (public_metadata as any)?.role || 'student',
      })
      .eq('clerk_id', id);

    if (error) {
      console.error('Error updating user in Supabase:', error);
      return new Response('Error: Failed to update user', { status: 500 });
    }

    console.log('✅ User updated in Supabase:', id);
  }

  if (eventType === 'user.deleted') {
    const { id } = evt.data;

    // Soft delete or hard delete user
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('clerk_id', id);

    if (error) {
      console.error('Error deleting user in Supabase:', error);
      return new Response('Error: Failed to delete user', { status: 500 });
    }

    console.log('✅ User deleted from Supabase:', id);
  }

  return new Response('Webhook processed successfully', { status: 200 });
}
