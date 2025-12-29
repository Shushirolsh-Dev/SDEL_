import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Using the credentials from your checkout page
const supabase = createClient(
    'https://lgfyrlfjoazedwymjpfc.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw'
);

async function keepAlive() {
    console.log("SDEL Database: Sending keep-alive signal...");
    
    // Just a simple read query to keep the project "Active"
    const { data, error } = await supabase
        .from('orders')
        .select('id')
        .limit(1);

    if (error) {
        console.error("Keep-alive failed:", error.message);
    } else {
        console.log("Keep-alive success! Supabase will not pause your project.");
    }
}

keepAlive();
