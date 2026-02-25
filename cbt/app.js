const _URL = "https://lgfyrlfjoazedwymjpfc.supabase.co";
const _KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw";
const sb = supabase.createClient(_URL, _KEY);

let currentUser = null;

async function sync() {
    // 1. Time & Greeting
    const h = new Date().getHours();
    document.getElementById('dynamic-greeting').innerText = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
    setInterval(() => { 
        document.getElementById('clock').innerText = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', hour12:false}); 
    }, 1000);

    // 2. Profile Sync & Rank Calculation
    // We order by XP descending to get the leaderboard
    const { data: allUsers } = await sb.from('profile').select('id, first_name, xp').order('xp', { ascending: false });
    
    if (allUsers) {
        // We find the current user (taking the first one for this demo session)
        const me = allUsers[0]; 
        const myRank = allUsers.findIndex(u => u.id === me.id) + 1;

        document.getElementById('user-first-name').innerText = me.first_name;
        document.getElementById('user-xp').innerText = (me.xp || 0).toLocaleString();
        document.getElementById('global-rank').innerText = `#${myRank}`;
        currentUser = me.id;
    }

    // 3. Subject Sync (Silent)
    const { data: subs } = await sb.from('user_subjects').select('*');
    const container = document.getElementById('live-subject-container');
    if(subs && subs.length > 0) {
        container.innerHTML = subs.map(s => `
            <div class="glass-panel p-4 rounded-2xl flex justify-between items-center border-l-4 border-l-orange-500 animate-fadeIn">
                <div><p class="font-bold text-sm uppercase">${s.subject_name}</p><p class="text-[10px] text-gray-500 font-bold uppercase">${s.mastered_count} Mastered</p></div>
                <div class="text-right"><p class="text-sm font-black text-orange-500 uppercase">LVL ${s.current_level}</p></div>
            </div>`).join('');
    }
}

async function saveBuild() {
    const name = document.getElementById('build-name').value;
    if(!name) return;
    const { error } = await sb.from('custom_builds').insert([{ creator_id: currentUser, build_name: name, subject_category: 'General' }]);
    if(!error) switchTab('home');
}

function switchTab(id) {
    document.querySelectorAll('.page-view').forEach(v => v.classList.remove('active-view'));
    document.querySelectorAll('.nav-link').forEach(n => { n.classList.remove('nav-active'); n.classList.add('text-gray-500'); });
    const target = document.getElementById('view-' + id);
    if(target) target.classList.add('active-view');
    const navBtn = document.querySelector(`[data-view="${id}"]`);
    if(navBtn) { navBtn.classList.add('nav-active'); navBtn.classList.remove('text-gray-500'); }
}

document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-view')));
});

document.getElementById('btn-save-build').addEventListener('click', saveBuild);

sync();
