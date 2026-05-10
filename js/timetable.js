// Timetable page module
import { sb, currentClass, userRole, escapeHtml, showToast } from './app.js';

let timetableTab = 'lectures';

export function renderTimetablePage() {
    return `<div class="glass-panel p-6 rounded-3xl"><div class="flex gap-4 mb-6 border-b border-white/10"><button onclick="window.switchTimetableTab('lectures')" id="lecturesTab" class="pb-2 px-4 font-bold tab-active text-white">📚 Lectures</button><button onclick="window.switchTimetableTab('exams')" id="examsTab" class="pb-2 px-4 font-bold text-gray-400 text-white">📝 Exams</button></div><div id="timetableContent"><div class="text-center text-gray-400 py-8"><i class="fas fa-spinner fa-spin"></i> Loading...</div></div></div>`;
}

export async function attachTimetableEvents() {
    await loadLecturesTimetable();
}

window.switchTimetableTab = function(tab) {
    timetableTab = tab;
    const lecturesTab = document.getElementById('lecturesTab');
    const examsTab = document.getElementById('examsTab');
    if (tab === 'lectures') {
        lecturesTab.classList.add('tab-active');
        lecturesTab.classList.remove('text-gray-400');
        examsTab.classList.remove('tab-active');
        examsTab.classList.add('text-gray-400');
        loadLecturesTimetable();
    } else {
        examsTab.classList.add('tab-active');
        examsTab.classList.remove('text-gray-400');
        lecturesTab.classList.remove('tab-active');
        lecturesTab.classList.add('text-gray-400');
        loadExamsTimetable();
    }
};

window.openLectureModal = function() { document.getElementById('lectureModal').classList.remove('hidden'); };
window.closeLectureModal = function() { document.getElementById('lectureModal').classList.add('hidden'); document.getElementById('lectureForm').reset(); };
window.openExamModal = function() { document.getElementById('examModal').classList.remove('hidden'); };
window.closeExamModal = function() { document.getElementById('examModal').classList.add('hidden'); document.getElementById('examForm').reset(); };

async function loadLecturesTimetable() {
    const container = document.getElementById('timetableContent');
    const cls = currentClass();
    const role = userRole();
    const { data: lectures } = await sb.from('class_lectures').select('*').eq('class_id', cls?.id).order('day_of_week', { ascending: true }).order('time', { ascending: true });
    if (!lectures || lectures.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-400 py-8"><p>No lectures scheduled</p>${role === 'rep' || role === 'assistant' ? '<button onclick="window.openLectureModal()" class="mt-4 bg-orange-600 px-4 py-2 rounded-lg text-sm text-white">+ Add Lecture</button>' : ''}</div>`;
        return;
    }
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    let html = '';
    days.forEach(day => {
        const dayLectures = lectures.filter(l => l.day_of_week === day);
        if (dayLectures.length > 0) {
            html += `<div class="mb-6"><h3 class="font-bold mb-2 text-orange-500">${day}</h3><div class="space-y-2">`;
            dayLectures.forEach(lecture => {
                let displayTime = lecture.time;
                if (lecture.time && !lecture.time.includes('AM') && !lecture.time.includes('PM')) {
                    const [hour, minute] = lecture.time.split(':');
                    let h = parseInt(hour);
                    const ampm = h >= 12 ? 'PM' : 'AM';
                    h = h % 12 || 12;
                    displayTime = `${h}:${minute} ${ampm}`;
                }
                html += `<div class="glass-panel p-3 rounded-xl flex justify-between items-center"><div><h4 class="font-bold text-sm text-white">${escapeHtml(lecture.title)}</h4><p class="text-xs text-gray-400">${displayTime} • ${lecture.duration} • ${escapeHtml(lecture.venue || 'Online')}</p></div>${role === 'rep' || role === 'assistant' ? `<button onclick="window.deleteLecture(${lecture.id})" class="text-red-500 text-sm"><i class="fas fa-trash"></i></button>` : ''}</div>`;
            });
            html += `</div></div>`;
        }
    });
    if (role === 'rep' || role === 'assistant') {
        html += `<button onclick="window.openLectureModal()" class="w-full mt-4 glass-panel py-2 rounded-xl text-orange-500">+ Add Lecture</button>`;
    }
    container.innerHTML = html;
}

async function loadExamsTimetable() {
    const container = document.getElementById('timetableContent');
    const cls = currentClass();
    const role = userRole();
    const { data: exams } = await sb.from('class_exams').select('*').eq('class_id', cls?.id).order('exam_date', { ascending: true });
    if (!exams || exams.length === 0) {
        container.innerHTML = `<div class="text-center text-gray-400 py-8"><p>No exams scheduled</p>${role === 'rep' || role === 'assistant' ? '<button onclick="window.openExamModal()" class="mt-4 bg-orange-600 px-4 py-2 rounded-lg text-sm text-white">+ Schedule Exam</button>' : ''}</div>`;
        return;
    }
    let html = `<div class="space-y-3">`;
    exams.forEach(exam => {
        const examDate = new Date(exam.exam_date);
        const isPast = examDate < new Date();
        let displayTime = exam.time;
        if (exam.time && !exam.time.includes('AM') && !exam.time.includes('PM')) {
            const [hour, minute] = exam.time.split(':');
            let h = parseInt(hour);
            const ampm = h >= 12 ? 'PM' : 'AM';
            h = h % 12 || 12;
            displayTime = `${h}:${minute} ${ampm}`;
        }
        html += `<div class="glass-panel p-4 rounded-xl ${isPast ? 'opacity-50' : 'border-l-4 border-orange-500'}"><div class="flex justify-between items-start"><div><h4 class="font-bold text-white">${escapeHtml(exam.title)}</h4><p class="text-xs text-gray-400 mt-1">📅 ${new Date(exam.exam_date).toLocaleDateString()} • ⏰ ${displayTime} • 📍 ${escapeHtml(exam.venue || 'Online')}</p></div>${role === 'rep' || role === 'assistant' ? `<button onclick="window.deleteExam(${exam.id})" class="text-red-500 text-sm"><i class="fas fa-trash"></i></button>` : ''}</div></div>`;
    });
    html += `</div>`;
    if (role === 'rep' || role === 'assistant') {
        html += `<button onclick="window.openExamModal()" class="w-full mt-4 glass-panel py-2 rounded-xl text-orange-500">+ Schedule Exam</button>`;
    }
    container.innerHTML = html;
}

window.deleteLecture = function(id) {
    if (confirm('Delete this lecture?')) {
        sb.from('class_lectures').delete().eq('id', id).then(() => loadLecturesTimetable());
    }
};

window.deleteExam = function(id) {
    if (confirm('Delete this exam?')) {
        sb.from('class_exams').delete().eq('id', id).then(() => loadExamsTimetable());
    }
};

// Form submissions
document.getElementById('lectureForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('lectureTitle').value.trim();
    const day_of_week = document.getElementById('lectureDay').value;
    const time = document.getElementById('lectureTime').value;
    const duration = document.getElementById('lectureDuration').value.trim();
    const venue = document.getElementById('lectureVenue').value.trim();
    if (!title || !day_of_week || !time || !duration || !venue) {
        document.getElementById('lectureMessage').innerHTML = '<div class="text-red-500">All fields required</div>';
        return;
    }
    const cls = currentClass();
    const { error } = await sb.from('class_lectures').insert([{ class_id: cls.id, title, day_of_week, time, duration, venue }]);
    if (error) {
        document.getElementById('lectureMessage').innerHTML = '<div class="text-red-500">Error: ' + error.message + '</div>';
    } else {
        window.closeLectureModal();
        if (timetableTab === 'lectures') loadLecturesTimetable();
        showToast('Lecture added!', 'success');
    }
});

document.getElementById('examForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('examTitle').value.trim();
    const exam_date = document.getElementById('examDate').value;
    const time = document.getElementById('examTime').value;
    const venue = document.getElementById('examVenue').value.trim();
    if (!title || !exam_date || !time || !venue) {
        document.getElementById('examMessage').innerHTML = '<div class="text-red-500">All fields required</div>';
        return;
    }
    const cls = currentClass();
    const { error } = await sb.from('class_exams').insert([{ class_id: cls.id, title, exam_date, time, venue }]);
    if (error) {
        document.getElementById('examMessage').innerHTML = '<div class="text-red-500">Error: ' + error.message + '</div>';
    } else {
        window.closeExamModal();
        if (timetableTab === 'exams') loadExamsTimetable();
        showToast('Exam scheduled!', 'success');
    }
});
