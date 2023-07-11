import { AutoTokenizer, BertTokenizer } from '@xenova/transformers'

const apiKey = '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'

const tokenizer = await AutoTokenizer.from_pretrained(
  'Xenova/bert-base-uncased'
)

const createPayload = (payload) => JSON.stringify(payload)

/**
 * Func:
 * ChatGPT에게 Prompt에 따른 HTML 요청
 * 음답된 HTML을 리턴
 */
async function getChatGPTResponse(prompt, existing) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: createPayload({
      model: 'gpt-3.5-turbo-16k-0613',
      messages: [
        {
          role: 'system',
          content: `You are a helpful assistant for coding. You HAVE TO ONLY answer the codes. For example, if I request the HTML code, you answer only HTML codes with no additional sentences. DO NOT include the basic HTML like doctype, <html>. Only write the codes that will be inside the content body. ${
            existing
              ? `Here's the codes that already exist in the page: ${existing}`
              : ''
          }`,
        },
        { role: 'user', content: prompt },
      ],
    }),
  })

  const data = await res.json()
  const result = data.choices[0].message.content

  console.log('The result code is: ', result)

  return data.choices[0].message.content
}

/**
 * Func:
  HTML 삽입
*/
function insertHTML(html) {
  const contentContainer = document.querySelector('.content-container')
  contentContainer.innerHTML += html
}

/**
 * input element (prompt), button element (submit)을 Select
 * Butto에 이벤트 리스너 등록 후, ChatGPT에 해당 프롬프트를 질의, HTML을 삽입.
 */
const inputElement = document.getElementById('prompt')
const buttonElement = document.getElementById('submit')
const tokenElement = document.getElementById('token')

function getTokenLength(text) {
  let tokenizedInput = tokenizer.encode(text)

  return tokenizedInput.length
}

buttonElement.addEventListener('click', async () => {
  buttonElement.innerText = 'Loading...'

  const prompt = inputElement.value
  const html = await getChatGPTResponse(prompt)

  buttonElement.innerText = 'Submit'

  insertHTML(html)
})

inputElement.addEventListener('keypress', () => {
  const value = inputElement.value
  const tokenLength = getTokenLength(value)

  tokenElement.innerText = tokenLength
})
