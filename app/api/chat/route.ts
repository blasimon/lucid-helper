import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  const { messages, thread_id } = await req.json();

  let threadId = thread_id;

  if (!threadId) {
    const thread = await openai.beta.threads.create();
    threadId = thread.id;
  }

  await openai.beta.threads.messages.create(threadId, {
    role: 'user',
    content: messages[messages.length - 1].content,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  while (runStatus.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    runStatus = await openai.beta.threads.runs.retrieve(threadId, run.id);
  }

  const responseMessages = await openai.beta.threads.messages.list(threadId);
  const contentBlock = responseMessages.data[0].content[0];

  if (contentBlock.type === "text") {
    return Response.json({ 
      role: 'assistant', 
      content: contentBlock.text.value, 
      thread_id: threadId 
    });
  } else {
    return Response.json({ 
      role: 'assistant', 
      content: "[Non-text content received]", 
      thread_id: threadId 
    });
  }
}