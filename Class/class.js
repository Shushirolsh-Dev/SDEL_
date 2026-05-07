// class.js - Updated with Edge Functions

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

// Export the secure functions
window.classApp = {
    ...window.classApp,
    createClass,
    joinClass,
    leaveClass,
    deleteClass,
    callEdgeFunction
};
