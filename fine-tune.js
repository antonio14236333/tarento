const { OpenAI } = require('openai');

const openai = new OpenAI({
    apiKey: "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"
  });

const history = [];
  




async function main() {


  for (let i = 0; i < 3; i++) {
    const entrevistador = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Eres un asistente, pregunta para conocer al otro." },
        ...history.flatMap(({ transcription, responseText }) => [
          { role: 'assistant', content: resEntrevistador },
          { role: 'user', content: resEntrevistado }
        ])
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 10
    });
  
    const entrevistado = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Conociste a alguien." },
        ...history.flatMap(({ transcription, responseText }) => [
          { role: 'assistant', content: resEntrevistador },
          { role: 'user', content: resEntrevistado }
        ]),
        { role: 'assistant', content: entrevistador.choices[0].message.content }
      ],
      model: "gpt-3.5-turbo",
      max_tokens: 10
    });

    history.push ({
      resEntrevistador: entrevistador.choices[0].message.content,
      resEntrevistado: entrevistado.choices[0].message.content
    });


    console.log(entrevistador.choices[0].message.content);
    console.log(entrevistado.choices[0].message.content);

  }

  
  
}

main();