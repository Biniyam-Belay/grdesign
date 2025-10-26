import { createClient } from '@supabase/supabase-js'

// Use environment variables or defaults for local development
const supabaseUrl = process.env.SUPABASE_LOCAL_URL || 'http://localhost:54321'
const supabaseServiceKey = process.env.SUPABASE_LOCAL_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU'

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function deleteAdminUser() {
  const email = 'admin@grdesign.com'

  console.log('🗑️  Deleting old admin user...')
  console.log(`📧 Email: ${email}`)
  console.log('')

  try {
    // First, get the user ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Failed to list users:', listError.message)
      return
    }

    const adminUser = users.find(u => u.email === email)
    
    if (!adminUser) {
      console.log('✅ No admin user found with that email')
      return
    }

    // Delete the user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(adminUser.id)
    
    if (deleteError) {
      console.error('❌ Failed to delete user:', deleteError.message)
      return
    }

    console.log('✅ Admin user deleted successfully!')
    console.log(`   User ID: ${adminUser.id}`)
    console.log('')
    console.log('Now run: node create-admin-local.mjs')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

deleteAdminUser()
