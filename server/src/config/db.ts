import mongoose from 'mongoose';

export interface DbStatus {
  connected: boolean;
  mode: 'mongodb_atlas' | 'local_persistent_store';
  uriConfigured: boolean;
  databaseName: string;
  error: string | null;
  lastChecked: string;
}

let isConnected = false;
let connectionError: string | null = null;

export async function connectDatabase(): Promise<DbStatus> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.includes('YOUR_MONGODB_URI') || uri.includes('<username>')) {
    isConnected = false;
    connectionError = 'MONGODB_URI is not configured in environment variables. Using embedded high-performance datastore.';
    console.log('ℹ️  ScholarSphere Database: No active MONGODB_URI provided. Running in high-fidelity embedded store mode.');
    return getDbStatus();
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      connectTimeoutMS: 4000
    });
    isConnected = true;
    connectionError = null;
    console.log('✅ ScholarSphere Database: Successfully connected to MongoDB at', uri.replace(/\/\/[^@]+@/, '//***:***@'));
  } catch (err: any) {
    isConnected = false;
    connectionError = err.message || 'Failed to connect to MongoDB cluster';
    console.warn('⚠️  ScholarSphere Database: MongoDB connection attempt failed. Falling back to embedded datastore. Reason:', connectionError);
  }

  return getDbStatus();
}

export function getDbStatus(): DbStatus {
  const uri = process.env.MONGODB_URI;
  const isConfigured = Boolean(uri && !uri.includes('<username>') && !uri.includes('YOUR_MONGODB_URI'));

  return {
    connected: isConnected && mongoose.connection.readyState === 1,
    mode: isConnected && mongoose.connection.readyState === 1 ? 'mongodb_atlas' : 'local_persistent_store',
    uriConfigured: isConfigured,
    databaseName: isConnected && mongoose.connection.name ? mongoose.connection.name : 'scholarsphere_local',
    error: connectionError,
    lastChecked: new Date().toISOString()
  };
}
