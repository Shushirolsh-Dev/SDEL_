// Modal functions module
import { sb, currentClass as getCurrentClass, currentUser as getCurrentUser, userRole as getUserRole, showToast } from './app.js';

window.openCreateModal = function() { document.getElementById('createModal').classList.remove('hidden'); };
window.closeCreateModal = function() { document.getElementById('createModal').classList.add('hidden'); document.getElementById('createClassForm').reset(); };
window.openJoinModal = function() { document.getElementById('joinModal').classList.remove('hidden'); };
window.closeJoinModal = function() { document.getElementById('joinModal').classList.add('hidden'); document.getElementById('joinClassCode').value = ''; };
window.openAnnouncementModal = function() { document.getElementById('announcementModal').classList.remove('hidden'); };
window.closeAnnouncementModal = function() { document.getElementById('announcementModal').classList.add('hidden'); document.getElementById('announcementForm').reset(); };
window.openRenameModal = function() { document.getElementById('renameModal').classList.remove('hidden'); };
window.closeRenameModal = function() { document.getElementById('renameModal').classList.add('hidden'); document.getElementById('newClassName').value = ''; };
window.openDescriptionModal = function() { 
    const cls = getCurrentClass();
    document.getElementById('descriptionModal').classList.remove('hidden');
    document.getElementById('newClassDescription').value = cls?.description || '';
};
window.closeDescriptionModal = function() { document.getElementById('descriptionModal').classList.add('hidden'); };
window.openMembersModal = function() { document.getElementById('membersModal').classList.remove('hidden'); loadMembersList(); };
window.closeMembersModal = function() { document.getElementById('membersModal').classList.add('hidden'); };

async function loadMembersList() {
    const cls = getCurrentClass();
    const user = getCurrentUser();
    const { data: members } = await sb.from('class_members').select('user_id, user_email').eq('class_id', cls.id);
    const { data: assistants } = await sb.from('class_assistants').select('user_id').eq('class_id', cls.id);
    const assistantIds = new Set(assistants?.map(a => a.user_id) || []);
    const container = document.getElementById('membersListModal');
    if (!members || members.length === 0) { container.innerHTML = '<p class="text-gray-400">No members yet</p>'; return; }
    const role = getUserRole();
    container.innerHTML = members.map(m => `
        <div class="flex justify-between items-center p-3 bg-white/5 rounded-lg">
            <div><p class="font-medium">${escapeHtml(m.user_email?.split('@')[0] || 'User')}</p><p class="text-xs text-gray-500">${m.user_email}</p>${m.user_id === cls?.created_by ? '<span class="text-xs text-orange-500">👑 Class Rep</span>' : (assistantIds.has(m.user_id) ? '<span class="text-xs text-blue-500">🔧 Assistant Rep</span>' : '')}</div>
            <div class="flex gap-2">${role === 'rep' && m.user_id !== user?.id ? `<button onclick="window.makeAssistant('${m.user_id}')" class="text-xs bg-blue-600 px-2 py-1 rounded">Make Assistant</button><button onclick="window.removeMember('${m.user_id}')" class="text-xs bg-red-600 px-2 py-1 rounded">Remove</button><button onclick="window.transferRep('${m.user_id}')" class="text-xs bg-orange-600 px-2 py-1 rounded">Transfer Rep</button>` : ''}</div>
        </div>
    `).join('');
}

window.makeAssistant = async function(userId) {
    const cls = getCurrentClass();
    const user = getCurrentUser();
    await sb.from('class_assistants').insert([{ class_id: cls.id, user_id: userId, added_by: user.id }]);
    showToast('Assistant rep added!', 'success');
    loadMembersList();
};

window.removeMember = async function(userId) {
    if (!confirm('Remove this member?')) return;
    const cls = getCurrentClass();
    await sb.from('class_members').delete().eq('class_id', cls.id).eq('user_id', userId);
    await sb.from('class_assistants').delete().eq('class_id', cls.id).eq('user_id', userId);
    showToast('Member removed!', 'success');
    loadMembersList();
};

window.transferRep = async function(userId) {
    if (!confirm('Transfer class rep ownership? You will become a regular member.')) return;
    const cls = getCurrentClass();
    await sb.from('classes').update({ created_by: userId }).eq('id', cls.id);
    await sb.from('class_assistants').delete().eq('class_id', cls.id).eq('user_id', userId);
    showToast('Rep transferred! Reloading...', 'success');
    setTimeout(() => location.reload(), 1500);
};

window.renameClass = async function() {
    const newName = document.getElementById('newClassName').value.trim();
    if (!newName) { alert('Enter new class name'); return; }
    const cls = getCurrentClass();
    const { error } = await sb.from('classes').update({ name: newName }).eq('id', cls.id);
    if (error) { alert('Error: ' + error.message); } else {
        cls.name = newName;
        window.closeRenameModal();
        window.navigateTo('home');
        showToast('Class renamed!', 'success');
    }
};

window.updateDescription = async function() {
    const newDesc = document.getElementById('newClassDescription').value.trim();
    const cls = getCurrentClass();
    const { error } = await sb.from('classes').update({ description: newDesc }).eq('id', cls.id);
    if (error) { alert('Error: ' + error.message); } else {
        cls.description = newDesc;
        window.closeDescriptionModal();
        window.navigateTo('home');
        showToast('Description updated!', 'success');
    }
};

window.leaveClass = async function() {
    if (!confirm('Leave this class?')) return;
    const cls = getCurrentClass();
    const user = getCurrentUser();
    await sb.from('class_members').delete().eq('class_id', cls.id).eq('user_id', user.id);
    await sb.from('class_assistants').delete().eq('class_id', cls.id).eq('user_id', user.id);
    location.reload();
};

window.shareInviteLink = function() {
    const cls = getCurrentClass();
    if (cls) {
        const link = `${window.location.origin}/join.html?code=${cls.class_code}`;
        navigator.clipboard.writeText(link);
        alert('Invite link copied!');
    }
};

// Announcement form submission
document.getElementById('announcementForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('announcementTitle').value.trim();
    const content = document.getElementById('announcementText').value.trim();
    const start_time = document.getElementById('announcementStart').value;
    const end_time = document.getElementById('announcementEnd').value;
    if (!title || !content || !start_time || !end_time) {
        document.getElementById('announcementMessage').innerHTML = '<div class="text-red-500">All fields required</div>';
        return;
    }
    const cls = getCurrentClass();
    const user = getCurrentUser();
    const { error } = await sb.from('class_announcements').insert([{ class_id: cls.id, title, content, start_time, end_time, created_by: user.id }]);
    if (error) {
        document.getElementById('announcementMessage').innerHTML = '<div class="text-red-500">Error: ' + error.message + '</div>';
    } else {
        window.closeAnnouncementModal();
        window.navigateTo('home');
        showToast('Announcement posted!', 'success');
    }
});

// Create class form
document.getElementById('createClassForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('className').value.trim();
    const desc = document.getElementById('classDescription').value;
    const joinType = document.querySelector('input[name="joinType"]:checked').value;
    if (!name) { document.getElementById('createMessage').innerHTML = '<div class="text-red-500">Class name required</div>'; return; }
    const code = window.generateClassCode();
    const user = getCurrentUser();
    const { error } = await sb.from('classes').insert([{ name, description: desc, join_type: joinType, class_code: code, created_by: user.id, created_at: new Date() }]);
    if (error) {
        document.getElementById('createMessage').innerHTML = '<div class="text-red-500">Error: ' + error.message + '</div>';
    } else {
        await sb.from('class_members').insert([{ class_id: 1, user_id: user.id, user_email: user.email }]);
        alert('Class created!');
        location.reload();
    }
});

// Join class
window.submitJoin = async function() {
    const code = document.getElementById('joinClassCode').value.trim();
    const msgDiv = document.getElementById('joinMessage');
    if (!code) { msgDiv.innerHTML = '<div class="text-red-500">Enter class code</div>'; return; }
    const { data: classData, error } = await sb.from('classes').select('*').eq('class_code', code).single();
    if (error || !classData) { msgDiv.innerHTML = '<div class="text-red-500">Invalid class code</div>'; return; }
    const user = getCurrentUser();
    if (classData.join_type === 'open') {
        const { error: joinErr } = await sb.from('class_members').insert([{ class_id: classData.id, user_id: user.id, user_email: user.email }]);
        if (joinErr) { msgDiv.innerHTML = '<div class="text-red-500">Already a member</div>'; }
        else { msgDiv.innerHTML = '<div class="text-green-500">Joined! Redirecting...</div>'; setTimeout(() => location.reload(), 1500); }
    } else {
        await sb.from('class_requests').insert([{ class_id: classData.id, user_id: user.id, user_email: user.email, user_name: user.email?.split('@')[0], status: 'pending' }]);
        msgDiv.innerHTML = '<div class="text-yellow-500">Request sent! Wait for approval.</div>'; setTimeout(() => location.reload(), 2000);
    }
};
