// Home page module
import { sb, currentClass, userRole, escapeHtml, showToast } from './app.js';

let announcements = [];
let carouselIndex = 0;
let carouselInterval = null;

export function renderHomePage() {
    const cls = currentClass();
    const role = userRole();
    
    if (role === 'rep') {
        return `
            <div class="glass-panel p-6 rounded-3xl mb-6 border-l-4 border-orange-600">
                <div class="flex justify-between items-start flex-wrap gap-4 mb-4">
                    <div><h2 class="text-2xl font-black">${escapeHtml(cls?.name || 'Class')}</h2>
                    <div class="flex items-start gap-2 mt-1"><p class="text-gray-400 text-sm">${escapeHtml(cls?.description || 'No description')}</p><button onclick="window.openDescriptionModal()" class="text-xs text-orange-500"><i class="fas fa-edit"></i></button></div></div>
                    <div class="flex gap-2"><code class="text-xs bg-black/50 px-2 py-1 rounded font-mono text-orange-500">${cls?.class_code || ''}</code><button onclick="window.openRenameModal()" class="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20"><i class="fas fa-edit"></i></button></div>
                </div>
                <div class="flex gap-2 mb-3"><button onclick="window.openMembersModal()" class="flex-1 glass-panel py-2 rounded-xl text-sm"><i class="fas fa-users"></i> Manage Members</button><button onclick="window.openAnnouncementModal()" class="flex-1 bg-orange-600 text-white font-bold py-2 rounded-xl text-sm"><i class="fas fa-bullhorn"></i> Announce</button></div>
                <button onclick="window.shareInviteLink()" class="w-full glass-panel py-2 rounded-xl text-sm"><i class="fas fa-share-alt"></i> Share Invite Link</button>
            </div>
            <div id="announcementsCarousel" class="glass-panel p-4 rounded-3xl mb-6"></div>
            <div class="glass-panel p-6 rounded-3xl"><h3 class="font-bold mb-3"><i class="fas fa-history text-orange-500"></i> Past Announcements</h3><div id="pastAnnouncementsList" class="space-y-3 max-h-64 overflow-y-auto"></div></div>
        `;
    } else if (role === 'member') {
        return `
            <div class="glass-panel p-6 rounded-3xl mb-6 border-l-4 border-green-500">
                <div class="flex justify-between items-start"><div><h2 class="text-2xl font-black">${escapeHtml(cls?.name || 'Class')}</h2><p class="text-gray-400 text-sm mt-1">${escapeHtml(cls?.description || 'No description')}</p><div class="flex gap-2 mt-2"><span class="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full"><i class="fas fa-user-check"></i> Member</span></div></div><button onclick="window.leaveClass()" class="text-xs bg-red-500/20 text-red-500 px-3 py-1 rounded-full"><i class="fas fa-sign-out-alt"></i> Leave Class</button></div>
            </div>
            <div class="glass-panel p-6 rounded-3xl mb-6"><h3 class="font-bold mb-3">Today's Lectures</h3><div id="lecturesList" class="space-y-3"></div></div>
            <div id="announcementsCarouselMember" class="glass-panel p-4 rounded-3xl mb-6"></div>
            <div class="glass-panel p-6 rounded-3xl"><h3 class="font-bold mb-3">Past Announcements</h3><div id="pastAnnouncementsListMember" class="space-y-3 max-h-64 overflow-y-auto"></div></div>
        `;
    } else {
        return `<div class="glass-panel p-8 rounded-3xl text-center"><div class="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-graduation-cap text-3xl text-orange-500"></i></div><h2 class="text-2xl font-black mb-2">Join a Class or Create One</h2><p class="text-gray-400 mb-6">Get started by joining an existing class or creating your own.</p><div class="grid grid-cols-2 gap-4"><button onclick="window.showJoinModal()" class="bg-blue-600 py-3 rounded-xl font-bold">Join Class</button><button onclick="window.showCreateModal()" class="bg-orange-600 py-3 rounded-xl font-bold">Create Class</button></div></div>`;
    }
}

export async function attachHomeEvents() {
    const role = userRole();
    if (role === 'rep' || role === 'member') {
        await loadAnnouncements();
    }
    if (role === 'member') {
        await loadTodayLectures();
    }
}

async function loadAnnouncements() {
    const cls = currentClass();
    if (!cls) return;
    const now = new Date().toISOString();
    const { data: active } = await sb.from('class_announcements').select('*').eq('class_id', cls.id).lte('start_time', now).gte('end_time', now).order('created_at', { ascending: false });
    const { data: past } = await sb.from('class_announcements').select('*').eq('class_id', cls.id).lt('end_time', now).order('end_time', { ascending: false });
    if (active && active.length > 0) initCarousel(active);
    if (past && past.length > 0) displayPastAnnouncements(past);
    if (past && past.length > 0) {
        for (const ann of past) {
            await sb.from('class_announcements').delete().eq('id', ann.id);
        }
    }
}

function initCarousel(announcementsList) {
    announcements = announcementsList;
    carouselIndex = 0;
    if (carouselInterval) clearInterval(carouselInterval);
    const role = userRole();
    const container = document.getElementById(role === 'rep' ? 'announcementsCarousel' : 'announcementsCarouselMember');
    if (!container) return;
    if (announcements.length === 0) { container.innerHTML = '<div class="text-center text-gray-400 py-4">No active announcements</div>'; return; }
    container.innerHTML = `<div class="carousel-container"><div class="carousel-track" id="carouselTrack"></div><button class="carousel-btn carousel-prev" onclick="window.prevSlide()">❮</button><button class="carousel-btn carousel-next" onclick="window.nextSlide()">❯</button></div><div class="carousel-dots" id="carouselDots"></div>`;
    const track = document.getElementById('carouselTrack');
    announcements.forEach(ann => {
        track.innerHTML += `<div class="carousel-item"><div class="bg-orange-500/10 p-4 rounded-xl border-l-4 border-orange-500"><div class="flex justify-between items-start mb-2"><h4 class="font-bold text-orange-500">${escapeHtml(ann.title)}</h4><div class="flex gap-2"><span class="text-xs text-gray-500">${new Date(ann.start_time).toLocaleString()}</span>${role === 'rep' ? `<button onclick="window.deleteAnnouncement(${ann.id})" class="text-red-500 text-xs"><i class="fas fa-trash"></i></button>` : ''}</div></div><p class="text-sm">${escapeHtml(ann.content)}</p></div></div>`;
    });
    const dotsContainer = document.getElementById('carouselDots');
    announcements.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });
    updateCarousel();
    carouselInterval = setInterval(() => window.nextSlide(), 5000);
}

function updateCarousel() {
    const track = document.getElementById('carouselTrack');
    if (track) track.style.transform = `translateX(-${carouselIndex * 100}%)`;
    document.querySelectorAll('.dot').forEach((dot, i) => {
        if (i === carouselIndex) dot.classList.add('active');
        else dot.classList.remove('active');
    });
}

window.nextSlide = function() {
    if (announcements.length === 0) return;
    carouselIndex = (carouselIndex + 1) % announcements.length;
    updateCarousel();
};

window.prevSlide = function() {
    if (announcements.length === 0) return;
    carouselIndex = (carouselIndex - 1 + announcements.length) % announcements.length;
    updateCarousel();
};

function goToSlide(index) {
    carouselIndex = index;
    updateCarousel();
}

function displayPastAnnouncements(past) {
    const role = userRole();
    const container = document.getElementById(role === 'rep' ? 'pastAnnouncementsList' : 'pastAnnouncementsListMember');
    if (!container) return;
    if (past.length === 0) { container.innerHTML = '<p class="text-gray-500 text-sm">No past announcements</p>'; return; }
    container.innerHTML = past.map(ann => `<div class="bg-white/5 p-3 rounded-xl opacity-60"><div class="flex justify-between items-start mb-2"><h4 class="font-bold text-sm">${escapeHtml(ann.title)}</h4><span class="text-xs text-gray-500">Expired: ${new Date(ann.end_time).toLocaleString()}</span></div><p class="text-xs text-gray-400">${escapeHtml(ann.content)}</p></div>`).join('');
}

async function loadTodayLectures() {
    const cls = currentClass();
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const { data: lectures } = await sb.from('class_lectures').select('*').eq('class_id', cls?.id).eq('day_of_week', today);
    const container = document.getElementById('lecturesList');
    if (!container) return;
    if (!lectures || lectures.length === 0) { container.innerHTML = '<div class="text-center text-gray-400 py-4">No lectures today</div>'; return; }
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    container.innerHTML = lectures.map(lecture => {
        let [hour, minute] = lecture.time.split(':');
        let lectureHour = parseInt(hour);
        let lectureMinute = parseInt(minute) || 0;
        let isPast = (lectureHour < currentHour) || (lectureHour === currentHour && lectureMinute < currentMinute);
        let displayTime = lecture.time;
        if (lecture.time && !lecture.time.includes('AM') && !lecture.time.includes('PM')) {
            let h = lectureHour;
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            displayTime = `${h}:${lectureMinute.toString().padStart(2, '0')} ${ampm}`;
        }
        return `<div class="lecture-card glass-panel p-4 rounded-xl border-l-4 ${isPast ? 'lecture-past border-gray-500' : 'border-green-500'}"><div class="flex justify-between items-start"><div><h4 class="font-bold text-white">${escapeHtml(lecture.title)}</h4><p class="text-xs text-gray-400 mt-1">${displayTime} • ${lecture.duration} • ${escapeHtml(lecture.venue)}</p></div>${isPast ? '<span class="text-xs text-gray-500"><i class="fas fa-check-circle"></i> Completed</span>' : '<span class="text-xs text-green-500"><i class="fas fa-play-circle"></i> Upcoming</span>'}</div></div>`;
    }).join('');
}

window.deleteAnnouncement = async function(announcementId) {
    if (!confirm('Delete this announcement?')) return;
    await sb.from('class_announcements').delete().eq('id', announcementId);
    loadAnnouncements();
    showToast('Announcement deleted!', 'success');
};
