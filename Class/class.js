// class.js - Complete version with Edge Functions

// Supabase configuration
const SUPABASE_URL = "https://lgfyrlfjoazedwymjpfc.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZnlybGZqb2F6ZWR3eW1qcGZjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1MTc1MTksImV4cCI6MjA4MjA5MzUxOX0.g1xVMCtSkkQIu2s1pkvWwxDDvgNGbikAMkyfbZJywVw";

const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Global state
let currentUser = null;
let userClass = null;
let userRole = null;

// ============ EDGE FUNCTION CALLS ============

// Call Edge Function with auth
async function callEdgeFunction(functionName, body) {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        throw new Error('Not authenticated');
    }
    
    const response = await fetch(`${SUPABASE_URL}/functions/v1/${functionName}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    });
    
    const result = await response.json();
    
    if (!response.ok) {
        throw new Error(result.error || 'Function call failed');
    }
    
    return result;
}

// Create class using Edge Function
async function createClass(name, description, customSlug = null) {
    try {
        const result = await callEdgeFunction('create-class', {
            name,
            description,
            custom_slug: customSlug
        });
        return result;
    } catch (error) {
        console.error('Create class error:', error);
        throw error;
    }
}

// Join class using Edge Function
async function joinClass(customLink) {
    try {
        const result = await callEdgeFunction('join-class', {
            custom_link: customLink
        });
        return result;
    } catch (error) {
        console.error('Join class error:', error);
        throw error;
    }
}

// Leave class using Edge Function
async function leaveClass() {
    try {
        const result = await callEdgeFunction('leave-class', {});
        return result;
    } catch (error) {
        console.error('Leave class error:', error);
        throw error;
    }
}

// Delete class using Edge Function
async function deleteClass(classId) {
    try {
        const result = await callEdgeFunction('delete-class', {
            class_id: classId
        });
        return result;
    } catch (error) {
        console.error('Delete class error:', error);
        throw error;
    }
}

// ============ HELPER FUNCTIONS ============

// Check if user has a class
async function checkUserClass() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    
    currentUser = user;
    
    // Check if user is a class rep
    const { data: asRep } = await supabase
        .from('classes')
        .select('*, role:rep_id')
        .eq('rep_id', user.id)
        .single();
    
    if (asRep) {
        userClass = asRep;
        userRole = 'rep';
        return userClass;
    }
    
    // Check if user is a class member
    const { data: asMember } = await supabase
        .from('class_members')
        .select('class:classes(*)')
        .eq('user_id', user.id)
        .eq('status', 'approved')
        .single();
    
    if (asMember?.class) {
        userClass = asMember.class;
        userRole = 'member';
        return userClass;
    }
    
    userClass = null;
    userRole = null;
    return null;
}

// Get user's full name
async function getUserName(userId) {
    const { data } = await supabase
        .from('profiles')
        .select('first_name, last_name')
        .eq('id', userId)
        .single();
    
    if (data) {
        return `${data.first_name || ''} ${data.last_name || ''}`.trim() || 'User';
    }
    return 'User';
}

// Get class members with names
async function getClassMembers() {
    if (!userClass) return [];
    
    const { data } = await supabase
        .from('class_members')
        .select(`
            user_id,
            status,
            joined_at,
            profiles:user_id (first_name, last_name, email)
        `)
        .eq('class_id', userClass.id)
        .eq('status', 'approved');
    
    return data || [];
}

// Get assistant reps
async function getAssistantReps() {
    if (!userClass) return [];
    
    const { data } = await supabase
        .from('class_assistants')
        .select(`
            user_id,
            added_by,
            added_at,
            profiles:user_id (first_name, last_name, email)
        `)
        .eq('class_id', userClass.id);
    
    return data || [];
}

// Check if user can manage class (rep or assistant)
async function canManageClass() {
    if (userRole === 'rep') return true;
    
    if (!userClass || !currentUser) return false;
    
    const { data } = await supabase
        .from('class_assistants')
        .select('id')
        .eq('class_id', userClass.id)
        .eq('user_id', currentUser.id)
        .single();
    
    return !!data;
}

// Update bottom nav visibility
function updateNavVisibility() {
    const bottomNav = document.getElementById('bottom-nav');
    if (!bottomNav) return;
    
    if (userClass) {
        bottomNav.classList.remove('hidden');
    } else {
        bottomNav.classList.add('hidden');
    }
}

// Initialize auth and class state
async function initAuth() {
    const { data: { user } } = await supabase.auth.getUser();
    currentUser = user;
    
    if (currentUser) {
        await checkUserClass();
    }
    
    updateNavVisibility();
    
    return { currentUser, userClass, userRole };
}

// Logout
async function logout() {
    await supabase.auth.signOut();
    window.location.href = 'https://thesdel.com';
}

// ============ EXPORT ============

window.classApp = {
    supabase,
    get currentUser() { return currentUser; },
    get userClass() { return userClass; },
    get userRole() { return userRole; },
    initAuth,
    checkUserClass,
    getUserName,
    getClassMembers,
    getAssistantReps,
    canManageClass,
    logout,
    updateNavVisibility,
    createClass,
    joinClass,
    leaveClass,
    deleteClass,
    callEdgeFunction
};
