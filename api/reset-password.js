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

  // Simple retry logic (fixes most transient "fetch failed" issues)
  const maxRetries = 3;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://thesdel.com/reset-password.html'
      });

      if (error) throw error;

      return res.status(200).json({ success: true });
    } catch (err) {
      lastError = err;
      console.error(`Attempt ${attempt} failed:`, err.message);

      if (attempt < maxRetries) {
        await new Promise(r => setTimeout(r, 800 * attempt)); // small backoff
      }
    }
  }

  // Return the real error so we can see it on the phone
  console.error('Final Supabase error:', lastError);
  return res.status(500).json({ 
    error: lastError?.message || 'Failed to send reset email'
  });
};
