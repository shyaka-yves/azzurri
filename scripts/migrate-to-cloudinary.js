const { createClient } = require('@supabase/supabase-js');
const cloudinary = require('cloudinary').v2;
require('dotenv').config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure Supabase
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const FOLDER = 'azzurri';

async function uploadToCloudinary(url) {
  if (!url || !url.includes('supabase.co')) return url;
  
  try {
    console.log(`Uploading ${url} to Cloudinary...`);
    const result = await cloudinary.uploader.upload(url, {
      folder: FOLDER,
      resource_type: 'auto',
    });
    console.log(`Successfully uploaded to: ${result.secure_url}`);
    return result.secure_url;
  } catch (error) {
    console.error(`Failed to upload ${url}:`, error.message);
    return url; // Keep original if it fails
  }
}

async function migrateEvents() {
  console.log('\n--- Migrating Events ---');
  const { data: events, error } = await supabase.from('events').select('*');
  if (error) throw error;

  for (const event of events) {
    if (event.image_url.includes('supabase.co')) {
      const newUrl = await uploadToCloudinary(event.image_url);
      if (newUrl !== event.image_url) {
        const { error: updateError } = await supabase
          .from('events')
          .update({ image_url: newUrl })
          .eq('id', event.id);
        if (updateError) console.error(`Failed to update event ${event.id}:`, updateError.message);
      }
    }
  }
}

async function migrateGallery() {
  console.log('\n--- Migrating Gallery ---');
  const { data: images, error } = await supabase.from('gallery').select('*');
  if (error) throw error;

  for (const img of images) {
    if (img.image_url.includes('supabase.co')) {
      const newUrl = await uploadToCloudinary(img.image_url);
      if (newUrl !== img.image_url) {
        const { error: updateError } = await supabase
          .from('gallery')
          .update({ image_url: newUrl })
          .eq('id', img.id);
        if (updateError) console.error(`Failed to update gallery image ${img.id}:`, updateError.message);
      }
    }
  }
}

async function migrateContent() {
  console.log('\n--- Migrating Site Content (Images, Videos, PDFs) ---');
  const { data: content, error } = await supabase.from('content').select('*').eq('id', 'default').single();
  if (error) {
    if (error.code === 'PGRST116') return; // Not found
    throw error;
  }

  // Regex to find ANY Supabase storage URL
  const jsonStr = JSON.stringify(content.data);
  const supabaseUrlRegex = /https:\/\/[a-z0-9]+\.supabase\.co\/storage\/v1\/object\/public\/uploads\/[a-zA-Z0-9._%-]+/g;
  const urls = jsonStr.match(supabaseUrlRegex) || [];
  
  if (urls.length === 0) {
    console.log('No Supabase URLs found in content.');
    return;
  }

  console.log(`Found ${urls.length} potential URLs in content.`);
  let newData = { ...content.data };

  // Recursive walk and replace
  async function walk(obj) {
    for (const key in obj) {
      if (typeof obj[key] === 'string' && obj[key].includes('supabase.co')) {
        const url = obj[key].split('?')[0]; // Remove query params if any
        // Check if it's a file from Supabase storage
        if (url.includes('/storage/v1/object/public/uploads/')) {
          obj[key] = await uploadToCloudinary(url);
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        await walk(obj[key]);
      }
    }
  }

  await walk(newData);

  const { error: updateError } = await supabase
    .from('content')
    .update({ data: newData })
    .eq('id', 'default');
  
  if (updateError) console.error('Failed to update content:', updateError.message);
}

async function run() {
  try {
    await migrateEvents();
    await migrateGallery();
    await migrateContent();
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

run();
