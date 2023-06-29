
/**
 * POST /api/mockquiz { 
 *  body: {
 *      noteText: "..." as string
 *  }
 * }
 */
export async function POST(request: Request){
    const reqJson = await request.json()
    const noteText = reqJson.noteText as string | undefined 

    if (!noteText) { 
        return new Response('Missing note text', {
            status: 500, 
        })
    }

    // example response for development purposes
    if (!process.env.OPENAI_API_KEY){ 
        return new Response(JSON.stringify({
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "created": 1677652288,
            "choices": [{
              "index": 0,
              "message": {
                "role": "assistant",
                "content": `No API key was provided.  Here's a sample response:\n
                Certainly!\nQuestions\nExample question 1\n\nAnswers:\nExample answer`,
              },
              "finish_reason": "stop"
            }],
            "usage": {
              "prompt_tokens": 9,
              "completion_tokens": 12,
              "total_tokens": 21
            }
          }), {
            status: 200, 
        })
    }

    // fetch openAI's chat completion endpoint
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-3.5-turbo", // Must be model that supports chat 
            messages: [ // Commands to prepare OpenAI's Chat api 
                {
                    "role": "system",
                    "content": "You are a teaching assistant.",
                }, 
                {
                    "role": "user",
                    "content": "Can you give me a mock quiz with answers based on my notes?",
                }, 
                {
                    "role": "assistant",
                    "content": "Sure! Can you share the notes?",
                }, 
                { // noteText is supplied in the request
                    "role": "user",
                    "content": `${noteText}`,
                }, 
            ],
        })
    })
    return res
}