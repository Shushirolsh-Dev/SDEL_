const _URL = "https://lgfyrlfjoazedwymjpfc.supabase.co";
const _KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw";
const sb = supabase.createClient(_URL, _KEY);

// Helper to get user profile data across all pages
async function getProfile() {
    const { data: profiles } = await sb.from('profile').select('*').limit(1);
    return profiles[0];
}

// Global clock/greeting logic
function initUI() {
    const clock = document.getElementById('clock');
    const greet = document.getElementById('dynamic-greeting');
    if(clock) setInterval(() => { clock.innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false}); }, 1000);
    if(greet) {
        const h = new Date().getHours();
        greet.innerText = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    }
}
