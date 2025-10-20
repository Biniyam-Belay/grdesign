import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'http://localhost:54321'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@grdesign.com'
  const password = 'Admin123!'

  console.log('🚀 Creating admin user...')
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}`)

  try {
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
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createAdminUser()