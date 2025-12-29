// This version uses standard 'fetch' which is supported natively by GitHub Actions Node v20
const SUPABASE_URL = 'https://lgfyrlfjoazedwymjpfc.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw';

async function keepWarm() {
    console.log("SDEL WARMER: Pinging Database...");
    
    try {
        // We ping the 'orders' table directly via the REST API
        const response = await fetch(`${SUPABASE_URL}/rest/v1/orders?select=id&limit=1`, {
            method: 'GET',
            headers: {
                'apikey': ANON_KEY,
                'Authorization': `Bearer ${ANON_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            console.log("✅ SUCCESS: Database connection established. Timer reset.");
        } else {
            const errorText = await response.text();
            console.log("❌ DATABASE REJECTED PING: " + response.status + " - " + errorText);
        }
    } catch (err) {
        console.error("❌ NETWORK ERROR:", err.message);
    }
}

keepWarm();
