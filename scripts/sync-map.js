const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const NEW_MAP_URL = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.534425993558!2d30.055222774966932!3d-1.9387409980436723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca5b8c42a7f63%3A0x14cf363a1f515ab0!2sAzzurri%20Restaurant%2C%20Club%20%26%20Lounge!5e0!3m2!1sen!2srw!4v1773607724597!5m2!1sen!2srw";

async function syncMap() {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  
  console.log("Fetching current content...");
  const { data, error: fetchError } = await supabase
    .from('content')
    .select('data')
    .eq('id', 'default')
    .single();

  if (fetchError) {
    console.error("Error fetching content:", fetchError);
    return;
  }

  const updatedData = { ...data.data };
  if (!updatedData.contact) {
    updatedData.contact = {};
  }
  updatedData.contact.mapEmbedSrc = NEW_MAP_URL;

  console.log("Updating content in database with new map URL...");
  const { error: updateError } = await supabase
    .from('content')
    .update({ data: updatedData, updated_at: new Date().toISOString() })
    .eq('id', 'default');

  if (updateError) {
    console.error("Error updating content:", updateError);
  } else {
    console.log("Content successfully synced to Supabase!");
  }
}

syncMap();
