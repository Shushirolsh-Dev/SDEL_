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

  // Optional: small initial delay for cold start stabilization
  await new Promise(resolve => setTimeout(resolve, 500));

  const maxRetries = 5;
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Use AbortController + timeout wrapper for fetch (Supabase uses global fetch)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

      // Temporarily override fetch for this call to add timeout
      const originalFetch = global.fetch;
      global.fetch = async (url, opts = {}) => {
        opts.signal = controller.signal;
        return originalFetch(url, opts);
      };

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'https://thesdel.com/reset-password.html'
      });

      clearTimeout(timeoutId);
      global.fetch = originalFetch; // restore original fetch

      if (error) throw error;

      console.log('Supabase resetPasswordForEmail succeeded on attempt', attempt);
      return res.status(200).json({ success: true });
    } catch (err) {
      lastError = err;

      // Detailed logging for diagnosis
      console.error(`Attempt ${attempt} failed:`, {
        name: err.name,
        message: err.message,
        code: err.code || 'no code',
        cause: err.cause ? (err.cause.message || err.cause) : 'no cause',
        stack: err.stack ? err.stack.substring(0, 300) : 'no stack'
      });

      if (attempt < maxRetries) {
        const delay = 800 * Math.pow(attempt, 1.5); // \~0.8s to \~9s
        console.log(`Retrying after ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // Final failure log and response
  console.error('Final Supabase error after retries:', lastError);
  const userError = lastError?.message?.includes('fetch') || lastError?.message?.includes('timeout')
    ? 'Temporary connection issue with the service — please try again in 30 seconds.'
    : lastError?.message || 'Failed to send reset email after retries';

  return res.status(500).json({ error: userError });
};
