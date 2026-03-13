// Script to create the first admin user
// Run: node scripts/create-admin.js <username> <password>

const { hash } = require("bcryptjs");
const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(process.cwd(), "data");
const ADMINS_PATH = path.join(DATA_DIR, "admins.json");

async function createFirstAdmin() {
  const username = process.argv[2];
  const password = process.argv[3];

  if (!username || !password) {
    console.error("Usage: node scripts/create-admin.js <username> <password>");
    process.exit(1);
  }

  if (username.length < 3) {
    console.error("Username must be at least 3 characters");
    process.exit(1);
  }

  if (password.length < 6) {
    console.error("Password must be at least 6 characters");
    process.exit(1);
  }

  try {
    // Ensure data directory exists
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Read existing admins
    let admins = [];
    if (fs.existsSync(ADMINS_PATH)) {
      const raw = fs.readFileSync(ADMINS_PATH, "utf8");
      admins = JSON.parse(raw);
    }

    // Check if username exists
    if (admins.some((a) => a.username === username)) {
      console.error(`Admin with username "${username}" already exists`);
      process.exit(1);
    }

    // Hash password
    const passwordHash = await hash(password, 10);

    // Create admin
    const admin = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      username,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    admins.push(admin);
    fs.writeFileSync(ADMINS_PATH, JSON.stringify(admins, null, 2), "utf8");

    console.log(`✅ Admin user "${username}" created successfully!`);
    console.log(`   You can now login at /admin/login`);
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
}

createFirstAdmin();
