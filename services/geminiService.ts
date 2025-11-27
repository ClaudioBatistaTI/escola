import { GoogleGenAI } from "@google/genai";
import { Student } from "../types";
import { db } from "./database";

// Initialize the API client
// Note: In a real app, do not expose keys on client side without proxies.
// Assuming process.env.API_KEY is available as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateStudentReport = async (student: Student): Promise<string> => {
  try {
    const grades = await db.getStudentGrades(student.id);
    const gradesText = grades.map(g => `${g.courseName}: ${g.value}`).join(', ');

    const prompt = `
      Atue como um coordenador pedagógico experiente. Analise os dados do seguinte aluno e gere um relatório curto e construtivo (máximo 3 parágrafos) em Português.
      
      Dados do Aluno:
      Nome: ${student.name}
      Série: ${student.className || "Não informada"}
      Status: ${student.status}
      Notas Recentes: ${gradesText || "Nenhuma nota registrada."}
      Observações dos professores: ${student.notes}

      O relatório deve incluir:
      1. Uma análise do desempenho acadêmico.
      2. Pontos fortes identificados.
      3. Sugestões de melhoria ou áreas de atenção.
      
      Use formatação Markdown simples.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Não foi possível gerar o relatório no momento.";
  } catch (error) {
    console.error("Erro ao chamar Gemini API:", error);
    return "Erro ao conectar com a IA. Verifique sua chave de API.";
  }
};