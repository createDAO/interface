import { createDaoCafeNodeHandler } from "daocafe-sdk/server";

// Serves the daocafe-sdk hooks (e.g. useDAOs on /daos) by reading the
// CreateDAO contracts directly over RPC, with an in-memory cache.
// DRPC_API_KEY is server-only; the public key is used as a fallback.
const drpcKey = process.env.DRPC_API_KEY || process.env.NEXT_PUBLIC_DRPC_API_KEY;
const drpc = (network: string) =>
  drpcKey ? `https://lb.drpc.org/ogrpc?network=${network}&dkey=${drpcKey}` : undefined;

export default createDaoCafeNodeHandler({
  rpcUrls: {
    1: drpc("ethereum"),
    42161: drpc("arbitrum"),
    11155111: drpc("sepolia"),
  },
  // Persist synced events across restarts (mounted as a volume in docker-compose)
  cacheDir: process.env.DAOCAFE_CACHE_DIR,
});
