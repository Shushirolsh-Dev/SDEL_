// app.js — Complete working version with typewriter effect

const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');

// Typewriter effect — makes Aether type like a human
async function typeEffect(element, text, speed = 18) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text[i];
        chatMessages.scrollTop = chatMessages.scrollHeight;
        await new Promise(r => setTimeout(r, speed));
    }
}

// Add user message to chat
function addUserMessage(content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message user';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'message-username';
    nameDiv.textContent = 'User';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.textContent = content;
    
    messageDiv.appendChild(nameDiv);
    messageDiv.appendChild(bubbleDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing animation (three dots)
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message aether';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-username">Aether</div>
        <div class="message-bubble">
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing animation
function hideTypingIndicator() {
    const el = document.getElementById('typingIndicator');
    if (el) el.remove();
}

// Main function — sends question to Aether and streams reply
async function sendToAether(question) {
    showTypingIndicator();
    await new Promise(r => setTimeout(r, 300));
    hideTypingIndicator();
    
    // Create empty Aether message container
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message aether';
    
    const nameDiv = document.createElement('div');
    nameDiv.className = 'message-username';
    nameDiv.textContent = 'Aether';
    
    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'message-bubble';
    bubbleDiv.style.color = '#ffffff';
    
    messageDiv.appendChild(nameDiv);
    messageDiv.appendChild(bubbleDiv);
    
    // Add action buttons container (will be filled after typing)
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'message-actions';
    messageDiv.appendChild(actionsDiv);
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    
    // Get answer from Aether and type it out
    const answer = window.aether.ask(question);
    await typeEffect(bubbleDiv, answer, 15);
    
    // Add action buttons after typing is complete
    actionsDiv.innerHTML = `
        <button class="action-btn" data-action="copy">Copy</button>
        <button class="action-btn" data-action="regenerate">Regenerate</button>
    `;
    
    // Handle copy and regenerate
    actionsDiv.querySelectorAll('.action-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (btn.dataset.action === 'copy') {
                navigator.clipboard.writeText(answer);
            } else if (btn.dataset.action === 'regenerate') {
                messageDiv.remove();
                const lastUser = document.querySelectorAll('.message.user');
                if (lastUser.length) {
                    const lastQ = lastUser[lastUser.length - 1].querySelector('.message-bubble').textContent;
                    sendToAether(lastQ);
                }
            }
        });
    });
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Handle send button click or Enter key
function handleSend() {
    const question = chatInput.value.trim();
    if (!question) return;
    chatInput.value = '';
    addUserMessage(question);
    sendToAether(question);
}

// Event listeners
sendButton.addEventListener('click', handleSend);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend();
});
