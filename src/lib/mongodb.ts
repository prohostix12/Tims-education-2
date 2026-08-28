import type { Db, MongoClient as MongoClientType } from "mongodb";

// Some networks (this project was set up behind one) block or refuse the
// SRV/TXT DNS lookups that mongodb+srv:// needs to discover the cluster's
// replica-set members, even though ordinary A-record lookups work fine.
// MONGODB_URI_DIRECT — a standard mongodb:// string listing the replica
// set's hosts directly — sidesteps that entirely and is preferred when
// present. MONGODB_URI (the srv form) is kept as a fallback for normal
// networks, with a public-DNS retry as a last resort.
//
// Everything below is deliberately lazy (nothing runs at module load time):
// Next.js imports route modules while collecting page data at build time,
// often before deployment env vars are wired up or reachable, and a
// top-level throw/connect there would fail the whole build. Connecting
// only happens the first time getDb() is actually called, at request time.

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClientType> | undefined;
}

async function createClientPromise(): Promise<MongoClientType> {
  const directUri = process.env.MONGODB_URI_DIRECT;
  const srvUri = process.env.MONGODB_URI;
  const uri = directUri || srvUri;

  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI (or MONGODB_URI_DIRECT) environment variable. Add it in your deployment's " +
        "environment variables (and in .env.local for local dev).",
    );
  }

  if (!directUri) {
    const dns = await import("node:dns");
    dns.setServers(["8.8.8.8", "1.1.1.1", ...dns.getServers()]);
  }

  const { MongoClient } = await import("mongodb");
  return new MongoClient(uri).connect();
}

// A plain module-scope variable is enough to reuse the connection across
// warm invocations of the same server process/lambda. In dev, Next's hot
// reload re-evaluates this module on every change, so that cache is kept
// on `global` instead, which survives the reload.
let clientPromise: Promise<MongoClientType> | undefined;

function getClientPromise(): Promise<MongoClientType> {
  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = createClientPromise();
    }
    return global._mongoClientPromise;
  }

  if (!clientPromise) {
    clientPromise = createClientPromise();
  }
  return clientPromise;
}

export async function getDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || "tims_education";
  const client = await getClientPromise();
  return client.db(dbName);
}
