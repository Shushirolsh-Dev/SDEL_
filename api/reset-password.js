// api/reset-password.js
module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;
  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Invalid email' });
  }

  const { createClient } = require('@supabase/supabase-js');

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Enhanced retry logic: 5 attempts with exponential backoff (800ms → \~10s max delay)
  const maxRetries = 5;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://thesdel.com/reset-password.html'
      });

      if (error) throw error;

      console.log('Supabase resetPasswordForEmail succeeded on attempt', attempt);
      return res.status(200).json({ success: true });
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt} failed:`, err.message || err);

      if (attempt < maxRetries) {
        // Exponential backoff: 800ms * attempt^1.5 (approx 0.8s → 1.8s → 3.3s → 5.7s → 9s)
        const delay = 800 * Math.pow(attempt, 1.5);
        console.log(`Retrying after ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Log final failure and return detailed error to frontend
  console.error('Final Supabase error after retries:', lastError?.message || lastError);
  return res.status(500).json({ 
    error: lastError?.message || 'Failed to send reset email after retries'
  });
};
