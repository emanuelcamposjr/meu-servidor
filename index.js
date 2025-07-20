const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post("/alexa", async (req, res) => {
  try {
    const pergunta = req.body.request?.intent?.slots?.pergunta?.value || "Olá, tudo bem?";

    const resposta = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Você é um assistente pessoal educado, amigável e direto." },
        { role: "user", content: pergunta }
      ]
    });

    const textoResposta = resposta.data.choices[0].message.content;

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: textoResposta
        },
        shouldEndSession: false
      }
    });

  } catch (error) {
    console.error("Erro:", error.message);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Desculpe, ocorreu um erro ao tentar responder. Tente novamente mais tarde."
        },
        shouldEndSession: true
      }
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor ouvindo na porta ${PORT}`);
});
