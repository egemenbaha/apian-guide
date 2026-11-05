import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { topics } from '../src/topics.js';

export function parseFaq(markdown) {
  const updatedAt = markdown.match(/^Son güncelleme: \*\*(.+)\*\*$/m)?.[1];
  const [body, pending] = markdown.split('## Açık kalan sorular');
  if (!updatedAt || !pending) throw new Error('FAQ date or open-question section is missing.');
  const questions = [...body.matchAll(/^### (\d+)\. (.+)\n([\s\S]*?)(?=^### |^<a id=|$(?![\s\S]))/gm)]
    .map(([, id, question, answer]) => ({ id: Number(id), question, answer: answer.trim() }));
  if (!questions.length || questions.some((question, i) => question.id !== i + 1 || !question.answer)) {
    throw new Error('FAQ numbering must be sequential and every question must have answer text or a pending note.');
  }
  const openQuestions = [...pending.matchAll(/^- \[ \] (.+)$/gm)].map(([, text]) => text);
  return { updatedAt, questions, openQuestions };
}

export function validateTopics(questions, topicList) {
  const ids = topicList.flatMap(topic => {
    if (topic.sections.length !== topic.questionIds.length) throw new Error(`Section mapping mismatch: ${topic.id}`);
    const assigned = topic.questionIds.flat();
    if (topic.introQuestionId != null &&
        (!questions.some(question => question.id === topic.introQuestionId) || assigned.includes(topic.introQuestionId))) {
      throw new Error(`Invalid intro question for ${topic.id}`);
    }
    return assigned;
  });
  if (ids.length !== questions.length || new Set(ids).size !== ids.length ||
      questions.some(question => !ids.includes(question.id))) {
    throw new Error('Every FAQ question must belong to exactly one topic section.');
  }
}

export async function generateFaq() {
  const markdown = await readFile(new URL('../PROJECT_DESCRIPTION.md', import.meta.url), 'utf8');
  const data = parseFaq(markdown);
  validateTopics(data.questions, topics);
  await writeFile(new URL('../src/faq-data.js', import.meta.url),
    `// Generated from PROJECT_DESCRIPTION.md; edit the Markdown source instead.\nexport const faq = ${JSON.stringify(data, null, 2)};\n`);
  console.log(`Generated ${data.questions.length} FAQ entries and ${data.openQuestions.length} open question groups.`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await generateFaq();
