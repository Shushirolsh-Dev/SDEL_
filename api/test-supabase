// api/test-supabase.js
module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json({
    status: "success",
    message: "Test endpoint is live and working on Vercel!",
    timestamp: new Date().toISOString(),
    env_check: {
      SUPABASE_URL: process.env.SUPABASE_URL ? "present" : "missing",
      SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "present" : "missing"
    },
    query: req.query || "no query params"
  });
};
