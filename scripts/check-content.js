const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = "https://fbgptlgpsleipafdmrwm.supabase.co";
const SUPABASE_SERVICE_ROLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZiZ3B0bGdwc2xlaXBhZmRtcndtIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2NjUwMywiZXhwIjoyMDg3NTQyNTAzfQ.gEjd9DSVosDljVnPu7xdiyvkac0qC8Atr-nSn03ZP9k";

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
