import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'

// Load environment variables
config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables!')
  console.error('Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  const email = 'admin@grdesign.com'
  const password = 'Admin123!Secure'

  console.log('🚀 Creating admin user for production Supabase...')
  console.log(`📧 Email: ${email}`)
  console.log(`🔑 Password: ${password}`)
  console.log('')

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
    console.log('')
    console.log('📝 Use these credentials to sign in at /admin/login:')
    console.log(`   Email: ${email}`)
    console.log(`   Password: ${password}`)
    console.log('')
    console.log('⚠️  Remember to change the password after first login!')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createAdminUser()
