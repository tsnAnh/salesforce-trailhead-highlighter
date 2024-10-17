const { JsonOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { ChatGroq } = require('@langchain/groq');

const agentModel = new ChatGroq({
  temperature: 0,
  model: 'YOUR_MODEL_CHOICE',
  apiKey: 'YOUR_API_KEY'
});

const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are given the text of a Salesforce Trailhead course. Your task is to identify the most important sentences from the course content that convey key concepts, important instructions, or definitions. These sentences should represent the core information that someone would need to understand or remember from the course. 

Please return the important sentences in the form of a JSON array. **Do not alter, paraphrase, or modify the original sentences in any way.** Each entry in the array should be a single sentence, exactly as it appears in the input text.

Here are some guidelines to determine if a sentence is important:
- It provides a key definition, concept, or term.
- It contains actionable instructions or steps in a process.
- It summarizes or emphasizes important information.
- It highlights best practices or warnings.

### Input:
{pageContent}

### Output format:
\`\`\`json
[
    "Important sentence 1.",
    "Important sentence 2.",
    "Important sentence 3.",
    "...",
]
\`\`\`
`);

const getKeySentences = async (pageContent) => {
  const sentences = await promptTemplate
    .pipe(agentModel)
    .pipe(new JsonOutputParser())
    .invoke({
      pageContent: pageContent,
    });
  console.log(sentences);
  return sentences;
};

module.exports = { getKeySentences };
