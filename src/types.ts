export enum Difficulty {
  Junior = "初级",
  Middle = "中级",
  Senior = "高级",
}

export enum GrammarCategory {
  NonFinite = "非谓语动词",
  RelativeClause = "定语从句",
  AdverbialClause = "状语从句",
  Conjunction = "连词辨析",
  NounClause = "名词性从句",
}

export interface Question {
  id: string;
  text: string; // Use "____" for the blank
  options: string[];
  correctAnswer: string;
  explanation: {
    rule: string;
    example: string;
    commonMistake: string;
  };
  difficulty: Difficulty;
  category: GrammarCategory;
}

export interface UserAnswer {
  questionId: string;
  selectedOption: string;
  isCorrect: boolean;
}
