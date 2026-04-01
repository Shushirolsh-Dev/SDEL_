// Connect HTML to Aether
const chatMessages = document.getElementById('chatMessages')
const chatInput = document.getElementById('chatInput')
const sendButton = document.getElementById('sendButton')

function addMessage(role, content) {
    const messageDiv = document.createElement('div')
    messageDiv.className = `message ${role}`
    
    const avatar = document.createElement('div')
    avatar.className = 'message-avatar'
    avatar.textContent = role === 'user' ? '👤' : '✨'
    
    const bubble = document.createElement('div')
    bubble.className = 'message-bubble'
    bubble.textContent = content
    
    messageDiv.appendChild(avatar)
    messageDiv.appendChild(bubble)
    
    chatMessages.appendChild(messageDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
}

function showTyping() {
    const typingDiv = document.createElement('div')
    typingDiv.className = 'typing'
    typingDiv.id = 'typingIndicator'
    typingDiv.textContent = 'Aether is thinking...'
    chatMessages.appendChild(typingDiv)
    chatMessages.scrollTop = chatMessages.scrollHeight
}

function hideTyping() {
    const typingDiv = document.getElementById('typingIndicator')
    if (typingDiv) typingDiv.remove()
}

async function sendMessage() {
    const question = chatInput.value.trim()
    if (!question) return
    
    // Clear input
    chatInput.value = ''
    
    // Add user message
    addMessage('user', question)
    
    // Show typing indicator
    showTyping()
    
    // Simulate thinking (Aether is instant, but feels human)
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // Get Aether's answer
    const answer = aether.ask(question)
    
    // Remove typing indicator
    hideTyping()
    
    // Add Aether's response
    addMessage('aether', answer)
}

// Send on button click
sendButton.addEventListener('click', sendMessage)

// Send on Enter key
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage()
    }
})
