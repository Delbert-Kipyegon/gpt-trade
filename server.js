import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import ask from './openai.js'

const main = async ({ port }) => {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded())
  app.use(cors())

  app.get('/', (_req, res) => res.send('Welcome to the Trade Information Assistant'))

  app.post('/ussd', async (req, res) => {
    const { text } = req.body

    let response = ''

    if (text === '') {
      response = 'CON Welcome to Trade Information Assistant.\nThis service helps you get answers to your trading questions.\nEnter: \n1. To ask a question\n0. To exit'
    } else if (text === '1') {
      response = 'CON Please enter your trade-related question.'
    } else if (text === '0') {
      response = 'END You have exited the Trade Information Assistant. Thank you for using our service. Goodbye!'
    } else if (text.split('*').length > 1) {
      console.log({ text })
      const parts = text.split('*')
      const input = parts[parts.length - 1].split('#')[0]

      const outcome = await ask(input)
      
      if (outcome.status === 'success') {
        response = `END ${outcome.message}`
      } else {
        response = 'END Sorry, an error occurred. Please try again.'
      }
    } else {
      response = 'END Invalid input. Please try again.'
    };

    res.set('Content-Type: text/plain')
    res.send(response)
  })

  app.use('*', (_req, res) => res.status(400).send('Invalid route. Please check your URL and try again.'))

  app.listen(port, () => console.log(`App running on port ${port}`))
}

main({
  port: process.env.APP_PORT || 3000
})
