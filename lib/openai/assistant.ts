import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not set in environment variables');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Assistant ID (you need to create this in OpenAI Console)
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!ASSISTANT_ID) {
  throw new Error('OPENAI_ASSISTANT_ID is not set in environment variables');
}

interface ChatThread {
  threadId: string;
  userId: string;
  lastActivity: Date;
  createdAt: Date;
}

// In-memory store for threads (use Redis/DB in production)
const activeThreads = new Map<string, ChatThread>();

// Clean inactive threads every hour
setInterval(() => {
  const now = new Date();
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;
  
  for (const [userId, thread] of activeThreads.entries()) {
    if (now.getTime() - thread.lastActivity.getTime() > TWELVE_HOURS) {
      console.log(`Cleaning up thread for user ${userId}`);
      // Optional: delete thread in OpenAI as well
      deleteThread(thread.threadId).catch(console.error);
      activeThreads.delete(userId);
    }
  }
}, 60 * 60 * 1000); // Every hour

async function deleteThread(threadId: string) {
  try {
    await openai.beta.threads.del(threadId);
    console.log(`Thread ${threadId} deleted successfully`);
  } catch (error) {
    console.error(`Error deleting thread ${threadId}:`, error);
  }
}

export async function getOrCreateUserThread(userId: string): Promise<string> {
  const existingThread = activeThreads.get(userId);
  
  if (existingThread) {
    // Update last activity
    existingThread.lastActivity = new Date();
    return existingThread.threadId;
  }
  
  // Create new thread
  try {
    const thread = await openai.beta.threads.create();
    
    const chatThread: ChatThread = {
      threadId: thread.id,
      userId,
      lastActivity: new Date(),
      createdAt: new Date()
    };
    
    activeThreads.set(userId, chatThread);
    console.log(`Created new thread ${thread.id} for user ${userId}`);
    
    return thread.id;
  } catch (error) {
    console.error('Error creating thread:', error);
    throw new Error('Failed to create chat thread');
  }
}

export async function sendMessageToAssistant(
  userId: string, 
  message: string
): Promise<string> {
  try {
    const threadId = await getOrCreateUserThread(userId);
    
    // Add user message to thread
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: message,
    });
    
    // Run the assistant
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });
    
    // Wait for completion
    let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    
    while (runStatus.status === 'in_progress' || runStatus.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
    }
    
    if (runStatus.status === 'completed') {
      // Get the response
      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0];
      
      if (lastMessage.role === 'assistant' && lastMessage.content[0]?.type === 'text') {
        return lastMessage.content[0].text.value;
      }
    }
    
    throw new Error(`Assistant run failed with status: ${runStatus.status}`);
    
  } catch (error) {
    console.error('Error sending message to assistant:', error);
    throw new Error('Failed to get response from assistant');
  }
}

export function getUserThreadInfo(userId: string): ChatThread | null {
  return activeThreads.get(userId) || null;
}

export function clearUserThread(userId: string): void {
  const thread = activeThreads.get(userId);
  if (thread) {
    deleteThread(thread.threadId).catch(console.error);
    activeThreads.delete(userId);
  }
} 