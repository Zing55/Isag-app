import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Helper function to get Gemini AI instance
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY não está configurada no ambiente.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Healthcheck API
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// 1. Search & Fetch ISAG Porto Course Content / Custom Syllabus Topic
app.post('/api/syllabus/search', async (req, res) => {
  try {
    const { semester, query } = req.body;
    const ai = getGeminiClient();

    const prompt = `
Você é um consultor pedagógico especialista nos currículos do ISAG - European Business School em Porto, Portugal.
Pesquise e forneça os tópicos programáticos reais e atualizados para o CTeSP (Curso Técnico Superior Profissional) em Gestão de Turismo do ISAG.

Semestre solicitado: ${semester ? `Semestre ${semester}` : 'Todos os semestres'}
Foco da busca: ${query || 'Conteúdo programático oficial do curso de Gestão de Turismo do ISAG Porto'}

Responda ESTRITAMENTE em formato JSON com a seguinte estrutura:
{
  "semesterName": "Semestre ${semester || 1}",
  "subjects": [
    {
      "code": "Código da UC (ex: GT101)",
      "name": "Nome oficial da Unidade Curricular",
      "semester": ${semester || 1},
      "credits": 6,
      "description": "Breve descrição focada nas competências técnicas",
      "modules": [
        {
          "title": "Nome do Módulo/Unidade Temática",
          "topics": ["Tópico 1", "Tópico 2", "Tópico 3"]
        }
      ]
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || '{}';
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { text };
    }

    res.json({ success: true, data });
  } catch (error: any) {
    console.error('Erro na pesquisa de syllabus:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao pesquisar programa.' });
  }
});

// 2. Generate a Complete 5-Paragraph Lesson + Smart Summary + Flashcards + Quiz
app.post('/api/lessons/generate', async (req, res) => {
  try {
    const { subjectName, moduleTitle, topic, semester } = req.body;
    if (!topic || !subjectName) {
      return res.status(400).json({ success: false, error: 'Campos "topic" e "subjectName" são obrigatórios.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Você é um docente universitário de excelência do ISAG - European Business School (Porto, Portugal), lecionando no CTeSP de Gestão de Turismo.
Elabore uma AULA COMPLETA rigorosa sobre o tópico: "${topic}", no módulo "${moduleTitle || topic}", da disciplina "${subjectName}" (Semestre ${semester || 1}).

REGRAS CRÍTICAS DE ESTRUTURA PARA A AULA:
1. A AULA DEVE CONTER EXATAMENTE 5 PARÁGRAFOS DENSOS E EDUCATIVOS. Nem mais, nem menos.
   - Parágrafo 1: "1. Contexto & Enquadramento Conceitual" (Apresentação, importância histórica/operacional e motivação do tema)
   - Parágrafo 2: "2. Fundamentos Teóricos e Conceitos-Chave" (Definições técnicas, legislação aplicável, fórmulas ou indicadores do setor)
   - Parágrafo 3: "3. Aplicação Prática no Setor Turístico em Portugal" (Casos reais do Porto, Douro, Norte de Portugal ou ecossistema nacional)
   - Parágrafo 4: "4. Análise Crítica e Desafios Atuais" (Sustentabilidade, transição digital, oposição ao overtourism, gestão de crises)
   - Parágrafo 5: "5. Síntese e Pontos de Retenção para Exames" (Resumo direto dos conceitos vitais para memorização rápida)

2. Além da aula de 5 parágrafos, crie também:
   - Um RESUMO INTELIGENTE com pontos vitais, glossário e checklist de exame.
   - 4 FLASHCARDS para Repetição Espaçada (com pergunta, resposta e dica).
   - 3 PERGUNTAS DE QUIZ de escolha múltipla (4 opções por pergunta, com resposta correta e explicação).

Forneça a resposta rigorosamente em formato JSON.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            estimatedReadTimeMinutes: { type: Type.INTEGER },
            paragraphs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  title: { type: Type.STRING },
                  content: { type: Type.STRING },
                  keyTerms: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                },
                required: ['number', 'title', 'content', 'keyTerms'],
              },
            },
            summary: {
              type: Type.OBJECT,
              properties: {
                keyTakeaways: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                technicalGlossary: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      term: { type: Type.STRING },
                      definition: { type: Type.STRING },
                    },
                    required: ['term', 'definition'],
                  },
                },
                conceptNodes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      concept: { type: Type.STRING },
                      relation: { type: Type.STRING },
                      target: { type: Type.STRING },
                    },
                    required: ['concept', 'relation', 'target'],
                  },
                },
                examChecklist: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                practicalApplication: { type: Type.STRING },
              },
              required: ['keyTakeaways', 'technicalGlossary', 'examChecklist', 'practicalApplication'],
            },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  hint: { type: Type.STRING },
                },
                required: ['front', 'back'],
              },
            },
            quizQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  correctOptionIndex: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                },
                required: ['question', 'options', 'correctOptionIndex', 'explanation'],
              },
            },
          },
          required: ['title', 'estimatedReadTimeMinutes', 'paragraphs', 'summary', 'flashcards', 'quizQuestions'],
        },
      },
    });

    const lessonData = JSON.parse(response.text || '{}');
    res.json({ success: true, data: lessonData });
  } catch (error: any) {
    console.error('Erro na geração da aula:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao gerar aula.' });
  }
});

// 3. Active Recall Evaluation Endpoint ("Explique ao Professor")
app.post('/api/active-recall/evaluate', async (req, res) => {
  try {
    const { lessonTitle, lessonContent, userExplanation } = req.body;
    if (!lessonTitle || !userExplanation) {
      return res.status(400).json({ success: false, error: 'Explicação do aluno é obrigatória.' });
    }

    const ai = getGeminiClient();

    const prompt = `
Você é o professor avaliador do CTeSP em Gestão de Turismo do ISAG (Porto, Portugal).
O aluno acabou de estudar a aula de 5 parágrafos intitulada: "${lessonTitle}".

Conteúdo de referência da aula:
${lessonContent || ''}

Explicação fornecida pelo aluno nas suas próprias palavras:
"${userExplanation}"

Avalie a precisão conceitual, a terminologia técnica utilizada (ex: terminologia turística, legislação, indicadores operacionais) e a capacidade de síntese do aluno.

Responda ESTRITAMENTE em formato JSON:
{
  "score": 85, // Nota de 0 a 100
  "feedback": "Análise pedagógica construtiva e encorajadora em português de Portugal",
  "strengths": ["Ponto forte 1", "Ponto forte 2"],
  "missingConcepts": ["Conceito ou indicador chave que o aluno esqueceu de mencionar"],
  "recommendation": "Dica prática para a próxima revisão com repetição espaçada"
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            missingConcepts: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            recommendation: { type: Type.STRING },
          },
          required: ['score', 'feedback', 'strengths', 'missingConcepts', 'recommendation'],
        },
      },
    });

    const result = JSON.parse(response.text || '{}');
    res.json({ success: true, data: result });
  } catch (error: any) {
    console.error('Erro na avaliação de evocação ativa:', error);
    res.status(500).json({ success: false, error: error.message || 'Erro ao avaliar explicação.' });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
