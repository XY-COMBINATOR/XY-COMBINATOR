/**
 * Vercel Analytics compatibility shim for client SPA environment.
 */
export function Analytics() {
  return null;
}

const VercelAnalytics = { Analytics };

export default VercelAnalytics;
