import OpenAI from 'openai';

export const runtime = 'edge';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request): Promise<Response> {
  const { messages } = await req.json();

  const thread = await openai.beta.threads.create();

  await openai.beta.threads.messages.create(thread.id, {
    role: 'user',
    content: messages[messages.length - 1].content,
  });

  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: process.env.OPENAI_ASSISTANT_ID,
  });

  let runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  while (runStatus.status !== 'completed') {
    await new Promise((resolve) => setTimeout(resolve, 500));
    runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
  }

  const responseMessages = await openai.beta.threads.messages.list(thread.id);
  const contentBlock = responseMessages.data[0].content[0];
  if (contentBlock.type === "text") {
    const reply = contentBlock.text.value;
    return Response.json({ role: 'assistant', content: reply });
  } else {
    return Response.json({ role: 'assistant', content: "[Non-text content received]" });
  }

  return Response.json({ role: 'assistant', content: reply });
}