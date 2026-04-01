class Aether {
    constructor() {
        this.token = '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'; // ← YOUR TOKEN HERE
    }
    
    async ask(question) {
        const response = await fetch('https://models.inference.ai.azure.com/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'DeepSeek-R1',
                messages: [{ role: 'user', content: question }]
            })
        });
        const data = await response.json();
        return data.choices[0].message.content;
    }
}

window.aether = new Aether();
