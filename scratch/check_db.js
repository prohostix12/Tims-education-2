const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

// Read .env.local
const absoluteEnvPath = path.join(__dirname, '..', '.env.local');

if (fs.existsSync(absoluteEnvPath)) {
  const envContent = fs.readFileSync(absoluteEnvPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const parts = trimmed.split('=');
      const key = parts[0].trim();
      let value = parts.slice(1).join('=').trim();
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

async function run() {
  const uri = process.env.MONGODB_URI_DIRECT || process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'tims_education';
  console.log('Connecting to Mongo URI:', uri ? uri.substring(0, 35) + '...' : 'undefined');

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  console.log('\n--- CRM INTEGRATION CONFIG ---');
  const crmConfig = await db.collection('integrations').findOne({ type: 'crm' });
  console.log(JSON.stringify(crmConfig, null, 2));

  console.log('\n--- RECENT ENQUIRIES (Last 10) ---');
  const enquiries = await db.collection('enquiries').find().sort({ createdAt: -1 }).limit(10).toArray();
  enquiries.forEach((e, idx) => {
    console.log(`\n[${idx + 1}] ID: ${e._id}`);
    console.log(`  Name: ${e.firstName} ${e.lastName} (legacy name: ${e.name})`);
    console.log(`  Email: ${e.email}`);
    console.log(`  Phone: ${e.phoneNumber || e.phone}`);
    console.log(`  CreatedAt: ${e.createdAt}`);
    console.log(`  crmSyncStatus: ${e.crmSyncStatus}`);
    console.log(`  crmSyncAttempts: ${e.crmSyncAttempts}`);
    console.log(`  crmLeadId: ${e.crmLeadId}`);
    console.log(`  crmLastSyncError: ${e.crmLastSyncError}`);
  });

  await client.close();
}

run().catch(err => {
  console.error('Error running script:', err);
  process.exit(1);
});
