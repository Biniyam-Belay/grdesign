#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { randomBytes } from 'crypto';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please check your .env.local file');
  process.exit(1);
}

// Create admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Generate secure random password if not provided
function generateSecurePassword() {
  return randomBytes(16).toString('base64').slice(0, 22) + '!A1';
}

async function createAdminUser() {
  // Use environment variables or generate secure defaults
  const email = process.env.ADMIN_EMAIL || 'admin@grdesign.com';
  const password = process.env.ADMIN_PASSWORD || generateSecurePassword();

  console.log('🚀 Creating admin user...');
  console.log(`📧 Email: ${email}`);
  console.log(`🔑 Password: ${password}`);
  console.log('');
  console.log('⚠️  IMPORTANT: Save these credentials securely!');
  console.log('');

  try {
    // First, try to delete existing user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    
    if (!listError) {
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        console.log('🗑️  Found existing admin user, deleting...');
        await supabase.auth.admin.deleteUser(existingUser.id);
        console.log('✅ Old admin user deleted');
        console.log('');
      }
    }

    // Create user using admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    });

    if (error) {
      throw error;
    }

    console.log('✅ Admin user created successfully!');
    console.log(`   User ID: ${data.user.id}`);
    console.log('');
    console.log('📝 Login credentials:');
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log('');
    console.log('🌐 Access your CMS at: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

// Run the script
createAdminUser();