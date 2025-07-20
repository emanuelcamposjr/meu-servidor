const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY // ou coloque diretamente a chave se for local
});
const openai = new OpenAIApi(configuration);

app.post('/', async (req, res) => {
  const intentName = req.body.request?.intent?.name;
  const pergunta = req.body.request?.intent?.slots?.pergunta?.value;

  if (intentName === 'PerguntarAlgoIntent' && pergunta) {
    try {
      const completion = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [{ role: "user", content: pergunta }],
      });

      const resposta = completion.data.choices[0].message.content;

      res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: resposta,
          },
          shouldEndSession: true,
        },
      });
    } catch (error) {
      console.error("Erro com OpenAI:", error.message);
      res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Houve um erro ao buscar a resposta. Tente novamente.",
          },
          shouldEndSession: true,
        },
      });
    }
  } else {
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Desculpe, não entendi sua pergunta.",
        },
        shouldEndSession: false,
      },
    });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
