const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});
console.log(process.env.ANTHROPIC_API_KEY)
connect();
app.post('/completions', async (req, res) => {
  try {
    const msg = await anthropic.messages.create({
      model: "claude-3-sonnet-20240320",
      max_tokens: 1000,
      temperature: 0,
      system: "Respond only with short poems.",
      messages: [
        {
          "role": "user",
          "content": req.body.text // Changed from req.body.tex
        }
      ]
    });
    res.send(msg);
  } catch (error) {
    console.error(error); // Changed from console.log(error(error))
    res.status(500).send("An error occurred");
  }
});
