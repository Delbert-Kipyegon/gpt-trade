import axios from 'axios'
import { config } from "dotenv"; config();

const OPENAI_API_KEY = process.env.OA_API_KEY
const OPENAI_ORG = process.env.ORG_ID

const ask = (tradeQuery) => {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'This assistant is trained on a variety of data, including specific databases and general world knowledge, to assist users in buying and selling goods in Africa.'
        },
        {
          role: 'user',
          content: `${tradeQuery}`
        },
        {
            role: 'user',
            content: 'Using 160 characters, what is the answer?'
          },
        
        
      ],
      temperature: 1,
      top_p: 1,
      n: 1,
      stream: false,
      max_tokens: 250,
      presence_penalty: 0,
      frequency_penalty: 0
    })

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.openai.com/v1/chat/completions', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'OpenAI-Organization': OPENAI_ORG,
      },
      data
    }

    axios.request(config)
      .then((response) => {
        console.log(JSON.stringify(response.data))
        console.log(response.data.choices[0].message.content)
        resolve({ status: 'success', message: response.data.choices[0].message.content })
      })
      .catch((error) => {
        console.log("you got an error")
        console.error(error)
        resolve({ status: 'error', message: error })
      })
  })
}

export default ask
