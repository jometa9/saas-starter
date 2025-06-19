import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set in environment variables");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Assistant ID (you need to create this in OpenAI Console)
const ASSISTANT_ID = process.env.OPENAI_ASSISTANT_ID;

if (!ASSISTANT_ID) {
  throw new Error("OPENAI_ASSISTANT_ID is not set in environment variables");
}

// Función simple para crear un nuevo thread cada vez
async function createNewThread(): Promise<string> {
  try {
    console.log("Creating new thread...");
    const thread = await openai.beta.threads.create();
    console.log(`Thread created with ID: ${thread.id}`);
    return thread.id;
  } catch (error) {
    console.error("Error creating thread:", error);
    throw new Error("Failed to create chat thread");
  }
}

export async function sendMessageToAssistant(message: string): Promise<string> {
  try {
    console.log(`Sending message: "${message.substring(0, 50)}..."`);

    // Crear un nuevo thread cada vez
    const threadId = await createNewThread();

    // Agregar mensaje del usuario al thread
    console.log("Adding user message to thread...");
    await openai.beta.threads.messages.create(threadId, {
      role: "user",
      content: message,
    });

    // Ejecutar el assistant
    console.log("Starting assistant run...");
    const run = await openai.beta.threads.runs.create(threadId, {
      assistant_id: ASSISTANT_ID,
    });

    // Esperar a que complete
    console.log("Waiting for assistant response...");
    let runStatus = await openai.beta.threads.runs.retrieve(run.id, {
      thread_id: threadId,
    });

    let attempts = 0;
    const maxAttempts = 30;

    while (
      (runStatus.status === "in_progress" || runStatus.status === "queued") &&
      attempts < maxAttempts
    ) {
      console.log(`Run status: ${runStatus.status}, attempt ${attempts + 1}`);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      runStatus = await openai.beta.threads.runs.retrieve(run.id, {
        thread_id: threadId,
      });
      attempts++;
    }

    console.log(`Final run status: ${runStatus.status}`);

    if (runStatus.status === "completed") {
      // Obtener la respuesta
      const messages = await openai.beta.threads.messages.list(threadId);
      const lastMessage = messages.data[0];

      if (
        lastMessage.role === "assistant" &&
        lastMessage.content[0]?.type === "text"
      ) {
        const response = lastMessage.content[0].text.value;
        console.log(
          `Assistant response received: "${response.substring(0, 100)}..."`
        );

        // Limpiar el thread después de obtener la respuesta
        try {
          await openai.beta.threads.delete(threadId);
          console.log(`Thread ${threadId} deleted successfully`);
        } catch (deleteError) {
          console.error(`Error deleting thread ${threadId}:`, deleteError);
        }

        return response;
      } else {
        throw new Error("Invalid response format from assistant");
      }
    } else if (runStatus.status === "failed") {
      throw new Error(
        `Assistant run failed: ${runStatus.last_error?.message || "Unknown error"}`
      );
    } else if (attempts >= maxAttempts) {
      throw new Error("Assistant run timed out");
    }

    throw new Error(`Assistant run failed with status: ${runStatus.status}`);
  } catch (error) {
    console.error("Error sending message to assistant:", error);

    if (error instanceof Error) {
      throw new Error(`Assistant error: ${error.message}`);
    }

    throw new Error("Failed to get response from assistant");
  }
}
