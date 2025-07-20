const express = require("express");
const bodyParser = require("body-parser");
const { OpenAI } = require("openai");

const app = express();
app.use(bodyParser.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // coloque diretamente a chave se for local: apiKey: "sk-..."
});

app.post("/", async (req, res) => {
  const intentName = req.body.request?.intent?.name;
  const pergunta = req.body.request?.intent?.slots?.pergunta?.value;

  if (intentName === "PerguntarAlgoIntent" && pergunta) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: pergunta }],
      });

      const resposta = completion.choices[0].message.content;

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
      console.error("Erro ao chamar OpenAI:", error.message);
      res.json({
        version: "1.0",
        response: {
          outputSpeech: {
            type: "PlainText",
            text: "Ocorreu um erro ao tentar responder. Tente novamente.",
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
  console.log("Servidor rodando na porta", port);
});
