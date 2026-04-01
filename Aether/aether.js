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
// aether.js — Enhanced with Memory & Context
class AetherAI {
    constructor() {
        // Knowledge base
        this.knowledge = {
            "limit": "A limit is the value a function approaches as the input approaches some value.",
            "derivative": "The derivative measures how a function changes as its input changes.",
            "integral": "Integration finds the area under a curve.",
            "variable": "A variable is a container for data that can change.",
            "function": "A function is a reusable block of code.",
            "loop": "A loop repeats a block of code multiple times.",
            "thesdel": "Thesdel is the Students Digital Exchange Layer — built by a student, for students.",
            "aether": "I'm Aether. I help students learn. I remember what we talk about.",
            "intensity": "Intensity is power per unit area. Like how loud a sound is."
        };
        
        // ========== NEW: Memory & Context ==========
        this.memory = {
            lastTopic: null,
            lastQuestion: null,
            lastAnswer: null,
            conversationHistory: [], // stores last 5 exchanges
            userLevel: 'beginner' // beginner, intermediate, advanced
        };
        
        // Personality phrases
        this.personality = {
            greetings: ["Wagwan", "Hey", "What's good", "Ready to learn?"],
            encouragements: ["Nice", "You're getting it", "Keep going", "That's the spirit"],
            confusion: ["Say that again?", "Explain what you mean?", "Not sure I got that"]
        };
    }
    
    ask(question, userId = "default") {
        const lower = question.toLowerCase().trim();
        
        // ========== NEW: Handle "again" requests ==========
        if (lower.includes("again") || lower.includes("repeat")) {
            if (this.memory.lastAnswer) {
                return `${this.memory.lastAnswer}\n\n${this.getRandomEncouragement()} — want me to explain differently?`;
            }
            return "You haven't asked me anything yet. Ask me something first!";
        }
        
        // ========== NEW: Handle "explain differently" ==========
        if (lower.includes("differently") || lower.includes("another way")) {
            if (this.memory.lastTopic) {
                return this.explainDifferently(this.memory.lastTopic);
            }
            return "What do you want me to explain differently?";
        }
        
        // ========== NEW: Handle "teach me" ==========
        if (lower.includes("teach me") || lower.includes("learn that")) {
            return this.handleTeaching(question);
        }
        
        // ========== NEW: Handle level change ==========
        if (lower.includes("explain like i'm")) {
            if (lower.includes("beginner") || lower.includes("15")) {
                this.memory.userLevel = 'beginner';
                return "Got it! I'll explain things simply from now on.";
            }
            if (lower.includes("advanced") || lower.includes("detailed")) {
                this.memory.userLevel = 'advanced';
                return "Alright! I'll give you more detailed explanations.";
            }
        }
        
        // Check knowledge base
        for (let key in this.knowledge) {
            if (lower.includes(key)) {
                const answer = this.formatAnswer(key, this.knowledge[key]);
                // Store in memory
                this.memory.lastTopic = key;
                this.memory.lastQuestion = question;
                this.memory.lastAnswer = answer;
                this.memory.conversationHistory.push({ q: question, a: answer });
                if (this.memory.conversationHistory.length > 5) this.memory.conversationHistory.shift();
                return answer;
            }
        }
        
        // Handle greetings with variety
        if (lower.match(/hello|hi|hey|wagwan/)) {
            return `${this.getRandomGreeting()}! Ask me about math, programming, or Thesdel.`;
        }
        
        if (lower.includes("thank")) {
            return `${this.getRandomEncouragement()}! Anything else you want to learn?`;
        }
        
        // Default with memory suggestion
        if (this.memory.lastTopic) {
            return `I'm still learning about "${question}". But we were talking about ${this.memory.lastTopic} — want me to explain that again differently?`;
        }
        
        return "I'm still learning about that. Try asking about: limit, derivative, integral, variable, function, loop, thesdel, aether, or intensity.";
    }
    
    // Explain the same topic in a different way
    explainDifferently(topic) {
        const alternativeExplanations = {
            "limit": "Imagine you're walking toward a wall. You get closer and closer but never touch it. That's a limit — the value you're approaching.",
            "derivative": "If you're driving a car, your speedometer shows derivative — how fast your distance is changing at that exact moment.",
            "integral": "If your speedometer shows your speed, the total distance you traveled is the integral. Adding up all the little moments.",
            "thesdel": "Thesdel is like a campus in your pocket. You can chat, buy/sell textbooks, practice exams, and compete with other schools — all in one place."
        };
        return alternativeExplanations[topic] || this.knowledge[topic];
    }
    
    // Format answer based on user level
    formatAnswer(topic, baseAnswer) {
        if (this.memory.userLevel === 'beginner') {
            return `${baseAnswer} ${this.getRandomEncouragement()} Want me to break it down more?`;
        }
        if (this.memory.userLevel === 'advanced') {
            return `${baseAnswer}\n\nFor more depth: this concept is foundational in ${topic === 'limit' ? 'calculus and analysis' : topic === 'derivative' ? 'differential calculus' : 'mathematical analysis'}.`;
        }
        return baseAnswer;
    }
    
    // Handle user teaching Aether new things
    handleTeaching(question) {
        // Simple teaching: "teach me that X means Y"
        const match = question.match(/teach me that (.+?) is (.+)/i);
        if (match) {
            const topic = match[1].trim().toLowerCase();
            const explanation = match[2].trim();
            this.knowledge[topic] = explanation;
            return `Got it! I've learned that "${topic}" means: ${explanation}. Thanks for teaching me!`;
        }
        return "Teach me something! Say: 'teach me that [topic] is [explanation]'";
    }
    
    getRandomGreeting() {
        return this.personality.greetings[Math.floor(Math.random() * this.personality.greetings.length)];
    }
    
    getRandomEncouragement() {
        return this.personality.encouragements[Math.floor(Math.random() * this.personality.encouragements.length)];
    }
}

window.aether = new AetherAI();
