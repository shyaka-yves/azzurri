const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function getEnv() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf8');
  const env = {};
  content.split('\n').forEach(line => {
    const [key, ...val] = line.split('=');
    if (key && val.length) {
      env[key.trim()] = val.join('=').trim().replace(/^"(.*)"$/, '$1');
    }
  });
  return env;
}

const env = getEnv();
const supabaseUrl = env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  const tables = ['admins', 'reservations', 'events', 'gallery', 'content'];
  console.log("Checking tables...");
  
  for (const table of tables) {
    const { error } = await supabase.from(table).select('*').limit(1);
    if (error) {
      console.log(`❌ Table "${table}" error: ${error.message}`);
    } else {
      console.log(`✅ Table "${table}" exists.`);
    }
  }
}

async function setupAdmin() {
  const bcrypt = require('bcryptjs');
  const password = 'shyaka1234';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log("Setting up admin 'Shyaka'...");
  const { data, error } = await supabase
    .from('admins')
    .upsert({ username: 'Shyaka', password_hash: hash }, { onConflict: 'username' });
    
  if (error) {
    console.error(`❌ Error setting up admin: ${error.message}`);
  } else {
    console.log("✅ Admin 'Shyaka' set up successfully (password: shyaka1234)");
  }
}

async function run() {
  await checkTables();
  await setupAdmin();
}

run();
