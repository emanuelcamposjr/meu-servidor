const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAIApi(new Configuration({
  apiKey: "SUA_CHAVE_OPENAI"
}));

app.post("/alexa", async (req, res) => {
  try {
    const pergunta = req.body.request.intent.slots.pergunta.value;

    const resposta = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "Você é um assistente pessoal chamado Chat, gentil, cristão, conselheiro e brincalhão quando o Emmanuel estiver alegre." },
        { role: "user", content: pergunta }
      ]
    });

    const fala = resposta.data.choices[0].message.content;

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: fala
        },
        shouldEndSession: false
      }
    });
  } catch (error) {
    console.error("Erro:", error);
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Desculpe, houve um problema ao tentar responder."
        },
        shouldEndSession: true
      }
    });
  }
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));
