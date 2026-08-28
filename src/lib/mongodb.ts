import dns from "node:dns";
import { MongoClient, type Db } from "mongodb";

// Some networks (this project was set up behind one) block or refuse the
// SRV/TXT DNS lookups that mongodb+srv:// needs to discover the cluster's
// replica-set members, even though ordinary A-record lookups work fine.
// MONGODB_URI_DIRECT — a standard mongodb:// string listing the replica
// set's hosts directly — sidesteps that entirely and is preferred when
// present. MONGODB_URI (the srv form) is kept as a fallback for normal
// networks, with a public-DNS retry as a last resort.
const directUri = process.env.MONGODB_URI_DIRECT;
const srvUri = process.env.MONGODB_URI;
const uri = directUri || srvUri;
const dbName = process.env.MONGODB_DB || "tims_education";

if (!uri) {
  throw new Error("Missing MONGODB_URI (or MONGODB_URI_DIRECT) environment variable. Add it to .env.local.");
}

if (!directUri) {
  dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // Reuse the client across hot-reloads in dev so we don't open a new
  // connection pool on every file change.
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri).connect();
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
