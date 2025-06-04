import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  const { messages } = await req.json();

  // Create a new thread for this conversation
  const thread = await openai.beta.threads.create();

  // Send the user's latest message to the thread
  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: messages[messages.length - 1].content,
  });

  // Run the assistant
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
  });

  // Poll for completion of the run
  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  while (runStatus.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  // Retrieve the assistant's reply
  const responseMessages = await openai.beta.threads.messages.list(thread.id);
  const contentBlock = responseMessages.data[0].content[0];

  if (contentBlock.type === "text") {
    return Response.json({ role: 'assistant', content: contentBlock.text.value });
  } else {
    return Response.json({ role: 'assistant', content: "[Non-text content received]" });
  }
}