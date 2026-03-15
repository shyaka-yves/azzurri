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

async function checkContent() {
  console.log("Fetching site content from Supabase...");
  const { data, error } = await supabase.from('content').select('*').eq('id', 'default').maybeSingle();
  
  if (error) {
    console.error(`❌ Error fetching content: ${error.message}`);
  } else if (!data) {
    console.log("⚠️ No row found for id='default' in content table.");
  } else {
    console.log("✅ Content found:");
    console.log(JSON.stringify(data.data, null, 2).substring(0, 1000) + "...");
  }
}

checkContent();
