import { createClient } from '@supabase/supabase-js'
import { randomBytes } from 'crypto'

// Use environment variables or defaults for local development
const supabaseUrl = process.env.SUPABASE_LOCAL_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_LOCAL_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Generate secure random password if not provided
function generateSecurePassword() {
  return randomBytes(16).toString('base64').slice(0, 22) + '!A1'
}

async function createAdminUser() {
  // Use environment variables or generate secure defaults
  const email = process.env.ADMIN_EMAIL || 'admin@grdesign.com'
  const password = process.env.ADMIN_PASSWORD || generateSecurePassword()

  console.log('🚀 Creating admin user...')
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}`)
  console.log('')
  console.log('⚠️  IMPORTANT: Save these credentials securely!')
  console.log('')

  try {
    // First, try to delete existing user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (!listError) {
      const existingUser = users.find(u => u.email === email)
      if (existingUser) {
        console.log('🗑️  Found existing admin user, deleting...')
        await supabase.auth.admin.deleteUser(existingUser.id)
        console.log('✅ Old admin user deleted')
        console.log('')
      }
    }

    // Create new user
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        name: 'Admin User'
      }
    })

    if (error) {
      console.error('❌ Failed to create admin user:', error.message)
      return
    }

    console.log('✅ Admin user created successfully!')
    console.log(`   User ID: ${data.user.id}`)
    console.log('')
    console.log('📝 Login at: http://localhost:3000/admin/login')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createAdminUser()