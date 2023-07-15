
/**
 * POST /api/mockquiz { 
 *  body: {
 *      noteText: "..." as string
 *  }
 * }
 */
export async function POST(request: Request) {
    const reqJson = await request.json()
    const noteText = reqJson.noteText as string | undefined

    if (!noteText) {
        return new Response('Missing note text', {
            status: 500,
        })
    }

    // example response for development purposes
    if (!process.env.OPENAI_API_KEY) {
        const longtext = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi varius velit sit amet dolor faucibus ultricies. Phasellus non rhoncus sem. Mauris et sodales ipsum, quis imperdiet quam. Cras efficitur tortor quis viverra feugiat. Maecenas condimentum elementum sapien nec consectetur. Vivamus vulputate convallis massa, ac rhoncus magna eleifend quis. Integer hendrerit posuere ex finibus sodales. Vivamus ipsum lorem, consectetur at mollis feugiat, scelerisque in nunc.

Nullam tincidunt feugiat nulla a tristique. Nam eleifend ac lacus at ultrices. Mauris ut aliquam arcu. Vestibulum pulvinar dolor ut rhoncus mattis. Duis aliquet, nisi eu sodales porttitor, arcu ligula malesuada orci, euismod lacinia nisl nulla vitae urna. Mauris bibendum mi in varius tempor. Integer dignissim, nulla accumsan eleifend eleifend, nunc arcu sagittis dolor, vitae placerat erat erat eu purus. Vestibulum pretium tincidunt ultricies. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.

Proin dolor velit, venenatis ac feugiat sit amet, ultrices sit amet turpis. Nullam venenatis sit amet ex sit amet tincidunt. Praesent eu mi mattis mauris luctus luctus id sit amet leo. Etiam sit amet mauris molestie, malesuada sapien et, mollis ex. Quisque sodales nibh a bibendum convallis. Nulla ultricies pharetra scelerisque. Ut efficitur sodales ex nec feugiat. Duis justo ex, porta sit amet maximus in, lobortis non leo. Integer luctus, ligula id aliquet posuere, mauris dui blandit magna, nec sagittis nisi massa at odio. Vestibulum tempor mi in consectetur consectetur. Donec sapien mi, condimentum nec purus sit amet, aliquam molestie ante. Suspendisse lectus tellus, condimentum non placerat venenatis, viverra ultrices lacus. Phasellus in nulla viverra, lacinia dolor ut, ornare nulla. Quisque tortor nunc, feugiat facilisis magna non, rhoncus semper mauris. Quisque consequat euismod eros, ut luctus leo ullamcorper sit amet. Duis vel sem a felis euismod aliquam ut eu massa.

Etiam nisl lectus, pulvinar non consequat sed, posuere eget ante. Fusce vel porttitor arcu. Interdum et malesuada fames ac ante ipsum primis in faucibus. Morbi mollis vehicula urna id efficitur. Nullam eu vehicula magna. Sed nisi lorem, vulputate quis ornare id, lacinia at nunc. Vestibulum lacus ante, rhoncus eu finibus eu, posuere vitae est. Vivamus blandit magna at porttitor viverra. Vestibulum id tempor quam, porta elementum velit. Morbi nec lorem id libero suscipit auctor. Pellentesque quis erat justo. Vestibulum magna urna, convallis eget tellus id, pellentesque fermentum nunc.

In varius lacus a massa accumsan venenatis. Quisque eget justo ac purus porttitor laoreet. Vestibulum at ipsum consectetur, luctus mauris in, convallis quam. Vivamus efficitur consequat massa, et dapibus elit pharetra lobortis. Aenean imperdiet, ligula eget ultricies tempor, enim risus tincidunt metus, ut hendrerit enim massa sit amet ligula. Praesent imperdiet, augue vel luctus semper, neque leo cursus mi, sit amet mollis eros orci sit amet nunc. Praesent ac ante orci. Cras tellus leo, maximus faucibus sagittis non, ornare euismod augue. Curabitur varius maximus lobortis.
`

        return new Response(JSON.stringify({
            "id": "chatcmpl-123",
            "object": "chat.completion",
            "created": 1677652288,
            "choices": [{
                "index": 0,
                "message": {
                    "role": "assistant",
                    "content": `No API key was provided.  Here's a sample response:\n
                Certainly!\nQuestions\nExample question 1\n${longtext}\nAnswers:\n${longtext}`,
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