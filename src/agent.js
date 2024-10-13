const { JsonOutputParser } = require('@langchain/core/output_parsers');
const { ChatPromptTemplate } = require('@langchain/core/prompts');
const { Ollama } = require('@langchain/ollama');

const agentModel = new Ollama({
  temperature: 0,
  model: 'llama3.1',
});

const promptTemplate = ChatPromptTemplate.fromTemplate(`
You are an expert in Salesforce and educational content analysis. 
Your task is to extract the most important sentences from the following Salesforce Trailhead course content. 
Identify main topic for the content.
These key sentences should be the ones that best help readers understand the core concepts and main points of the course.
Output ONLY the extracted key sentences, without any introductory phrases, explanations, or conclusions.
Respond with a valid JSON array, containing list of sentence strings.
DO NOT include any introduction like: "Here is the extracted key sentence array in JSON format:" in the response.

Trailhead Course Content:
{pageContent}
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
