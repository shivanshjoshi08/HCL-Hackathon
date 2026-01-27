import OpenAI from 'openai';
import { botConfig, knowledge } from '../config/chatbot.js';

// Chatbot Service class
class ChatbotService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.LLM_API_KEY,
      baseURL: process.env.LLM_BASE_URL
    });
    this.embedder = null;
    this.knowledgeBase = [];
    this.initialized = false;
  }

  async initialize() {
    if (this.initialized) return;
    
    try {
      const { pipeline } = await import('@xenova/transformers');
      this.embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      
      // Pre-compute embeddings for knowledge base
      console.log('📚 Loading chatbot knowledge base...');
      for (const doc of knowledge) {
        const output = await this.embedder(doc.content, { pooling: 'mean', normalize: true });
        this.knowledgeBase.push({
          ...doc,
          embedding: Array.from(output.data)
        });
      }
      
      this.initialized = true;
      console.log(`✅ Chatbot ready with ${this.knowledgeBase.length} knowledge entries`);
    } catch (error) {
      console.error('⚠️ Chatbot initialization error:', error.message);
      this.initialized = true; // Still mark as initialized to allow chat-only mode
    }
  }

  async getEmbedding(text) {
    if (!this.embedder) return null;
    const output = await this.embedder(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  }

  calculateSimilarity(vecA, vecB) {
    if (!vecA || !vecB) return 0;
    return vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);
  }

  async retrieveDocuments(query, topK = 5) {
    if (this.knowledgeBase.length === 0) return [];
    
    const queryVector = await this.getEmbedding(query);
    if (!queryVector) return [];

    return this.knowledgeBase
      .map(doc => ({
        ...doc,
        score: this.calculateSimilarity(queryVector, doc.embedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);
  }

  async determineIntent(message, history) {
    const recentContext = history.slice(-3);
    const routes = botConfig.routes.map(r => `${r.name}: ${r.keywords.join(',')}`).join('\n');

    const systemPrompt = `Classify intent: NAVIGATE, RAG_SEARCH, or CHAT.
Routes:
${routes}
Context: ${JSON.stringify(recentContext)}
Return JSON: { "action": "ENUM", "target": "URL_IF_NAVIGATE" }`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      response_format: { type: "json_object" }
    });

    return JSON.parse(completion.choices[0].message.content);
  }

  async resolveQuery(message, history) {
    if (!history.length) return message;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `Rewrite as standalone query. History: ${JSON.stringify(history.slice(-2))}` },
        { role: 'user', content: message }
      ]
    });

    return completion.choices[0].message.content;
  }

  async generateResponse(query, context, history) {
    const systemPrompt = `Role: ${botConfig.botName} for ${botConfig.context.business}.
Tone: ${botConfig.personality?.tone || 'professional'}.
Context:
${context}
Instructions: Answer concisely using context. Help users with banking tasks like transfers, deposits, checking balance, and account management.`;

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...history.slice(-4),
        { role: 'user', content: query }
      ]
    });

    return completion.choices[0].message.content;
  }
}

// Create singleton instance
const chatbotService = new ChatbotService();

// Controller functions
export const getConfig = (req, res) => {
  res.json({ botName: botConfig.botName });
};

export const chat = async (req, res) => {
  try {
    // Initialize on first request
    await chatbotService.initialize();
    
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ 
        action: 'RESPONSE', 
        text: 'Please provide a message.' 
      });
    }

    const intent = await chatbotService.determineIntent(message, history);

    if (intent.action === 'NAVIGATE') {
      return res.json({ action: 'NAVIGATE', url: intent.target });
    }

    const resolvedQuery = intent.action === 'RAG_SEARCH'
      ? await chatbotService.resolveQuery(message, history)
      : message;

    let context = '';
    if (intent.action === 'RAG_SEARCH') {
      const docs = await chatbotService.retrieveDocuments(resolvedQuery);
      context = docs.map(d => d.content).join('\n\n');
    }

    const response = await chatbotService.generateResponse(resolvedQuery, context, history);
    res.json({ action: 'RESPONSE', text: response });

  } catch (error) {
    console.error('Chatbot error:', error);
    res.status(500).json({ 
      action: 'RESPONSE', 
      text: 'Sorry, I encountered an error. Please try again.' 
    });
  }
};
