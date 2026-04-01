// aether.js — The AI that remembers
class Aether {
    constructor() {
        // Base knowledge
        this.knowledge = {
            "limit": "A limit is the value a function approaches. Think of it like walking toward a wall — you get closer and closer but might never touch it.",
            "derivative": "Derivative = how fast something changes. If you're driving, speed is the derivative of distance.",
            "integral": "Integral = total accumulation. If speed is derivative, distance traveled is the integral.",
            "variable": "Variable = labeled box. You put data in, take it out, change it. Like a locker for information.",
            "function": "Function = reusable recipe. Input ingredients, follow steps, get output. Clean and repeatable.",
            "loop": "Loop = doing the same thing multiple times. Like saying 'pass notes to everyone in class' instead of naming each person.",
            "thesdel": "Thesdel is the Student Digital Exchange Layer — built by a student, for students. No ads, no distractions, just tools that work.",
            "aether": "I'm Aether. I help students learn without the noise. I remember what you ask so I can get better at helping you."
        }
        
        // Memory: store user conversations
        this.memory = {} // userId -> { lastQuestion, topics, learningHistory }
        
        // Personality: Nigerian student vibe
        this.personality = {
            greetings: ["Hey! What are we learning today?", "Wagwan. Ready to learn?", "You're back! Ask me something."],
            encouragement: ["You're getting this.", "That's the spirit.", "Omo, you're sharp o.", "Keep going — you're improving."],
            confusion: ["Hmm, explain that again?", "I didn't quite get that. Break it down for me.", "Not sure yet. Teach me?"]
        }
    }
    
    // Main method — where the magic happens
    ask(question, userId = "default") {
        const lower = question.toLowerCase().trim()
        
        // 1. Check memory: have they asked this before?
        if (!this.memory[userId]) {
            this.memory[userId] = { topics: [], questions: [], learningProgress: {} }
        }
        const userMemory = this.memory[userId]
        
        // 2. Detect if they're asking for clarification
        if (lower.includes("again") || lower.includes("repeat")) {
            if (userMemory.lastAnswer) {
                return `${userMemory.lastAnswer}\n\n${this.getRandomEncouragement()}`
            }
        }
        
        // 3. Check for learning requests
        if (lower.includes("teach me about") || lower.includes("explain")) {
            const topic = this.extractTopic(lower)
            if (this.knowledge[topic]) {
                const answer = this.knowledge[topic]
                userMemory.lastAnswer = answer
                userMemory.topics.push(topic)
                return `${answer}\n\n${this.getRandomEncouragement()}`
            }
            return this.askToTeach(topic)
        }
        
        // 4. Direct knowledge match
        for (const [key, answer] of Object.entries(this.knowledge)) {
            if (lower.includes(key)) {
                userMemory.lastAnswer = answer
                userMemory.topics.push(key)
                return answer
            }
        }
        
        // 5. Greetings
        if (lower.match(/hello|hi|hey|wagwan/)) {
            return this.getRandomGreeting()
        }
        
        // 6. Thanks
        if (lower.includes("thank")) {
            return this.getRandomEncouragement()
        }
        
        // 7. Unknown: invite them to teach Aether
        return `I don't know about "${question}" yet. Can you teach me? Just say "teach me about [topic] is [explanation]".`
    }
    
    // Let users teach Aether
    teach(topic, explanation) {
        const key = topic.toLowerCase()
        this.knowledge[key] = explanation
        return `Omo, I've learned! Now when someone asks about "${topic}", I'll tell them: ${explanation.substring(0, 100)}...`
    }
    
    // Extract topic from "explain X" or "teach me about X"
    extractTopic(text) {
        const patterns = ["explain", "teach me about", "what is", "define"]
        for (const pattern of patterns) {
            if (text.includes(pattern)) {
                return text.split(pattern)[1].trim().split(" ")[0]
            }
        }
        return text.split(" ")[0]
    }
    
    // Ask user to teach Aether
    askToTeach(topic) {
        return `I don't know about "${topic}" yet. Want to teach me? Just reply with: "teach me about ${topic} is [your explanation]"`
    }
    
    // Personality helpers
    getRandomGreeting() {
        return this.personality.greetings[Math.floor(Math.random() * this.personality.greetings.length)]
    }
    
    getRandomEncouragement() {
        return this.personality.encouragement[Math.floor(Math.random() * this.personality.encouragement.length)]
    }
    
    // Show memory for debugging (optional)
    showMemory(userId) {
        return this.memory[userId] || { topics: [], questions: [] }
    }
}

// Create global instance
window.aether = new Aether()
