// Supabase config
const _URL = "https://lgfyrlfjoazedwymjpfc.supabase.co";
const _KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw";
const sb = supabase.createClient(_URL, _KEY);

// Global variables
let currentUser = null;
let currentClass = null;
let userRole = null;
let currentPage = 'home';
let timetableTab = 'lectures';
let announcements = [];
let carouselIndex = 0;
let carouselInterval = null;

// Helper functions
function showToast(msg, type) { alert(msg); }
function generateClassCode() { 
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return 'THESDEL-' + result;
}
function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// Load user first name
async function loadUserFirstName() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return;
    const { data: profile } = await sb.from('profile').select('first_name').eq('id', user.id).single();
    if (profile?.first_name) document.getElementById('userFirstName').innerText = profile.first_name;
    else document.getElementById('userFirstName').innerText = user.email?.split('@')[0] || 'User';
}

// Navigation
async function navigateTo(page) {
    if (currentPage === page) return;
    currentPage = page;
    
    const container = document.getElementById('main-content');
    container.style.animation = 'none';
    container.offsetHeight;
    container.style.animation = 'slideIn 0.3s ease-out';
    
    await renderPage();
    updateBottomNavActive();
}

async function renderPage() {
    const container = document.getElementById('main-content');
    
    if (currentPage === 'home') {
        const { renderHomePage } = await import('/js/home.js');
        container.innerHTML = renderHomePage(currentClass, userRole);
        const { attachHomeEvents } = await import('/js/home.js');
        if (attachHomeEvents) attachHomeEvents();
    } else if (currentPage === 'timetable') {
        const { renderTimetablePage } = await import('/js/timetable.js');
        container.innerHTML = renderTimetablePage();
        const { attachTimetableEvents } = await import('/js/timetable.js');
        if (attachTimetableEvents) attachTimetableEvents();
    } else if (currentPage === 'tests') {
        const { renderTestsPage } = await import('/js/tests.js');
        container.innerHTML = renderTestsPage();
    } else if (currentPage === 'ranks') {
        const { renderRanksPage } = await import('/js/ranks.js');
        container.innerHTML = renderRanksPage();
    } else if (currentPage === 'profile') {
        const { renderProfilePage } = await import('/js/profile.js');
        container.innerHTML = renderProfilePage(currentUser, currentClass, userRole);
        const { attachProfileEvents } = await import('/js/profile.js');
        if (attachProfileEvents) attachProfileEvents();
    }
}

function updateBottomNavActive() {
    document.querySelectorAll('#bottomNav a').forEach(link => {
        const page = link.getAttribute('data-page');
        if (page === currentPage) link.classList.add('nav-active');
        else link.classList.remove('nav-active');
    });
}

function renderBottomNav() {
    const nav = document.getElementById('bottomNav');
    if (userRole === 'rep' || userRole === 'assistant') {
        nav.innerHTML = `<a href="#" data-page="home"><i class="fas fa-home"></i><span>Home</span></a><a href="#" data-page="timetable"><i class="fas fa-calendar-alt"></i><span>Timetable</span></a><a href="#" data-page="tests"><i class="fas fa-pen-fancy"></i><span>Tests</span></a><a href="#" data-page="ranks"><i class="fas fa-trophy"></i><span>Ranks</span></a><a href="#" data-page="profile"><i class="fas fa-user"></i><span>Profile</span></a>`;
    } else if (userRole === 'member') {
        nav.innerHTML = `<a href="#" data-page="home"><i class="fas fa-home"></i><span>Home</span></a><a href="#" data-page="timetable"><i class="fas fa-calendar-alt"></i><span>Timetable</span></a><a href="#" data-page="tests"><i class="fas fa-pen-fancy"></i><span>Tests</span></a><a href="#" data-page="ranks"><i class="fas fa-trophy"></i><span>Ranks</span></a><a href="#" data-page="profile"><i class="fas fa-user"></i><span>Profile</span></a>`;
    } else {
        nav.innerHTML = `<a href="#" data-page="home"><i class="fas fa-home"></i><span>Home</span></a><a href="#" data-page="tests"><i class="fas fa-pen-fancy"></i><span>Tests</span></a><a href="#" data-page="ranks"><i class="fas fa-trophy"></i><span>Ranks</span></a><a href="#" data-page="profile"><i class="fas fa-user"></i><span>Profile</span></a>`;
    }
    document.querySelectorAll('#bottomNav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.getAttribute('data-page');
            navigateTo(page);
        });
    });
    updateBottomNavActive();
}

// Load user class and role
async function loadUserClass() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;
    currentUser = user;
    
    const { data: createdClass } = await sb.from('classes').select('*').eq('created_by', user.id).maybeSingle();
    if (createdClass) {
        userRole = 'rep';
        currentClass = createdClass;
        return 'rep';
    }
    
    const { data: assistantCheck } = await sb.from('class_assistants').select('class_id').eq('user_id', user.id).maybeSingle();
    if (assistantCheck) {
        const { data: classData } = await sb.from('classes').select('*').eq('id', assistantCheck.class_id).single();
        if (classData) {
            userRole = 'assistant';
            currentClass = classData;
            return 'assistant';
        }
    }
    
    const { data: memberData } = await sb.from('class_members').select('class_id').eq('user_id', user.id).maybeSingle();
    if (memberData) {
        const { data: classData } = await sb.from('classes').select('*').eq('id', memberData.class_id).single();
        if (classData) {
            userRole = 'member';
            currentClass = classData;
            return 'member';
        }
    }
    
    userRole = 'none';
    return 'none';
}

// Clock and greeting
function updateClock() {
    document.getElementById('clock').innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    const h = new Date().getHours();
    document.getElementById('dynamic-greeting').innerText = h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

// Load header
async function loadHeader() {
    const headerHtml = `
        <header class="flex justify-between items-start mb-10">
            <div>
                <h1 class="text-3xl font-extrabold tracking-tight">Hey, <span class="text-orange-500" id="userFirstName">---</span></h1>
                <p class="text-gray-500 text-sm font-medium uppercase tracking-widest h-5" id="dynamic-greeting"></p>
            </div>
            <div class="glass-panel px-4 py-2 rounded-xl text-right">
                <p class="text-xl font-black text-white" id="clock">00:00</p>
            </div>
        </header>
    `;
    document.getElementById('header-container').innerHTML = headerHtml;
    await loadUserFirstName();
    updateClock();
    setInterval(updateClock, 1000);
}

// Initialize app
async function init() {
    await loadHeader();
    
    const { data: { session } } = await sb.auth.getSession();
    const { data: { user } } = await sb.auth.getUser();
    
    if (!session || !user) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = user;
    await loadUserClass();
    renderBottomNav();
    await renderPage();
}

// Start the app
init();

// Export for use in other modules
window.sb = sb;
window.currentUser = () => currentUser;
window.currentClass = () => currentClass;
window.userRole = () => userRole;
window.showToast = showToast;
window.generateClassCode = generateClassCode;
window.escapeHtml = escapeHtml;
window.navigateTo = navigateTo;
