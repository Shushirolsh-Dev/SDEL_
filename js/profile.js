// Profile page module
import { sb, currentUser as getCurrentUser, currentClass, userRole, escapeHtml, showToast } from './app.js';

export function renderProfilePage() {
    const user = getCurrentUser();
    const cls = currentClass();
    const role = userRole();
    return `
        <div class="glass-panel p-6 rounded-3xl text-center mb-6">
            <div class="w-20 h-20 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><i class="fas fa-user text-3xl text-orange-500"></i></div>
            <h2 class="text-2xl font-bold">${user?.email?.split('@')[0] || 'User'}</h2>
            <p class="text-gray-400 text-sm">${user?.email}</p>
            <div class="flex justify-center gap-2 mt-2"><span class="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full"><i class="fas fa-user-check"></i> ${role === 'rep' ? 'Class Rep' : 'Member'}</span></div>
        </div>
        <div class="glass-panel p-6 rounded-3xl">
            <h3 class="font-bold mb-3">Class Info</h3>
            <div class="space-y-2 text-sm"><div class="flex justify-between"><span class="text-gray-400">Class Name:</span><span>${cls?.name || 'No class'}</span></div><div class="flex justify-between"><span class="text-gray-400">Class Code:</span><code class="text-orange-500">${cls?.class_code || 'None'}</code></div><div class="flex justify-between"><span class="text-gray-400">Role:</span><span class="${role === 'rep' ? 'text-orange-500' : 'text-green-500'}">${role === 'rep' ? 'Class Representative' : 'Member'}</span></div></div>
        </div>
        <button onclick="window.logout()" class="w-full mt-6 bg-red-600/20 text-red-500 py-4 rounded-xl font-bold hover:bg-red-600/30 transition"><i class="fas fa-sign-out-alt"></i> Logout</button>
    `;
}

export function attachProfileEvents() {
    // Any profile-specific event listeners can go here
}

window.logout = async function() {
    await sb.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = 'login.html';
    window.history.pushState(null, '', 'login.html');
};
