const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function checkContent() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('id', 'default')
    .single();

  if (error) {
    console.error("Error fetching content:", error);
  } else {
    console.log("Current DB Content:", JSON.stringify(data, null, 2));
  }
}

checkContent();
