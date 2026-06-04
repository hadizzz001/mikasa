import { MongoClient, Db } from "mongodb";

const uri = process.env.DATABASE_URL;

if (!uri) {
  throw new Error("DATABASE_URL is not set");
}

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

// Reuse the connection across hot-reloads in development to avoid
// exhausting the connection pool.
const clientPromise: Promise<MongoClient> =
  globalForMongo._mongoClientPromise ?? new MongoClient(uri).connect();

if (process.env.NODE_ENV !== "production") {
  globalForMongo._mongoClientPromise = clientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await clientPromise;
  // The database name is taken from the connection string.
  return client.db();
}

export default clientPromise;
