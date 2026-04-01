// Aether — Pure AI, No APIs
class Aether {
    constructor() {
        // Knowledge base
        this.knowledge = {
            // Math
            "limit": "A limit is the value a function approaches as the input approaches some value. Think of getting closer to a point without necessarily reaching it. For example, as x gets closer to 2, (x² - 4)/(x - 2) gets closer to 4.",
            "derivative": "The derivative measures how a function changes as its input changes. It's like the speed of a function. The derivative of x² is 2x — for every unit you move, the value changes by 2x.",
            "integral": "Integration is the reverse of differentiation. It finds the area under a curve. If derivative is speed, integral is distance traveled.",
            // Programming
            "variable": "A variable is like a labeled box where you store information. In programming, you can put things in (assign), take them out (read), and change them (reassign).",
            "function": "A function is a reusable block of code that does one specific thing. Like a recipe — you give it ingredients (inputs), it does something, and gives you a result (output).",
            "loop": "A loop repeats a block of code multiple times. For loop: 'do this 10 times'. While loop: 'keep doing this until something changes'.",
            // Thesdel
            "thesdel": "Thesdel is the Students Digital Exchange Layer — an ecosystem for students to connect, study, buy/sell, and compete. Built by a student, for students.",
            "aether": "I'm Aether! I'm the AI assistant for Thesdel. I help students learn, answer questions, and make studying less stressful. I'm still learning, so be patient with me.",
            // Default
            "default": "I'm still learning about that. Could you explain what you mean? Or ask me something about math, programming, or Thesdel."
        }
        
        // Common phrases that trigger responses
        this.triggers = {
            "what is": "explain",
            "explain": "explain",
            "how do i": "explain",
            "how to": "explain",
            "meaning of": "explain",
            "define": "explain",
            "tell me about": "explain"
        }
    }
    
    // Main brain — processes question and returns answer
    ask(question) {
        const lower = question.toLowerCase().trim()
        
        // Check for direct knowledge match
        for (const [key, answer] of Object.entries(this.knowledge)) {
            if (lower.includes(key)) {
                return answer
            }
        }
        
        // Check for trigger words
        for (const [trigger, action] of Object.entries(this.triggers)) {
            if (lower.includes(trigger)) {
                // Extract the topic after the trigger
                const parts = lower.split(trigger)
                if (parts.length > 1) {
                    const topic = parts[1].trim()
                    return this.guessAnswer(topic)
                }
                return this.knowledge.default
            }
        }
        
        // Handle greetings
        if (lower.includes("hello") || lower.includes("hi") || lower.includes("hey")) {
            return "Hey! What do you want to learn today?"
        }
        
        // Handle thanks
        if (lower.includes("thank")) {
            return "You're welcome! Keep asking questions — that's how we learn."
        }
        
        // Default response
        return this.knowledge.default
    }
    
    // Try to guess answer based on topic
    guessAnswer(topic) {
        for (const [key, answer] of Object.entries(this.knowledge)) {
            if (topic.includes(key) || key.includes(topic)) {
                return answer
            }
        }
        return `I don't have much info about "${topic}" yet. Can you ask in a different way?`
    }
    
    // Let users teach Aether new things
    learn(topic, explanation) {
        const key = topic.toLowerCase()
        this.knowledge[key] = explanation
        return `Got it! I'll remember that ${topic} is: ${explanation.substring(0, 100)}...`
    }
}

// Create a single instance
const aether = new Aether()
