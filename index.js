const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require('openai');

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.post('/alexa', async (req, res) => {
  try {
    const intentName = req.body.request.intent?.name;
    const pergunta = req.body.request.intent?.slots?.pergunta?.value;

    let resposta = "Desculpe, não entendi a pergunta.";

    if (intentName === "PerguntarAlgoIntent" && pergunta) {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: "Você é um assistente pessoal cristão e reformado." },
          { role: "user", content: pergunta }
        ]
      });

      resposta = completion.choices[0].message.content;
    }

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: resposta
        },
        shouldEndSession: false
      }
    });

  } catch (err) {
    console.error(err);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Ocorreu um erro ao tentar responder."
        },
        shouldEndSession: true
      }
    });
  }
});

app.get('/', (req, res) => {
  res.send('Servidor Alexa ativo');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor ouvindo na porta ${port}`);
});
