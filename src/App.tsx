import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  RotateCcw, 
  BookOpen, 
  Trophy, 
  Lightbulb,
  AlertCircle,
  GraduationCap,
  ExternalLink
} from 'lucide-react';
import { questions } from './data/questions';
import { Question, Difficulty, UserAnswer } from './types';

const DifficultyBadge = ({ difficulty }: { difficulty: Difficulty }) => {
  const colors = {
    [Difficulty.Junior]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    [Difficulty.Middle]: 'bg-amber-100 text-amber-700 border-amber-200',
    [Difficulty.Senior]: 'bg-rose-100 text-rose-700 border-rose-200',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${colors[difficulty]}`}>
      {difficulty}
    </span>
  );
};

export default function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.correctAnswer;

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    
    const newAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOption,
      isCorrect: selectedOption === currentQuestion.correctAnswer,
    };
    
    setAnswers([...answers, newAnswer]);
    setIsSubmitted(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
      setIsSubmitted(false);
    } else {
      setShowResults(true);
    }
  };

  const resetQuiz = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsSubmitted(false);
    setAnswers([]);
    setShowResults(false);
  };

  const score = answers.filter(a => a.isCorrect).length;
  const progress = ((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100;

  const getEncouragement = (score: number) => {
    const ratio = score / questions.length;
    if (ratio === 1) return "太棒了！你是语法大师！🌟";
    if (ratio >= 0.8) return "做得好！继续保持！🚀";
    if (ratio >= 0.6) return "不错，还有提升空间！💪";
    return "加油，多练习一定会进步的！📚";
  };

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full text-center border border-slate-100"
        >
          <div className="mb-6 inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-2">练习完成!</h2>
          <p className="text-slate-500 mb-6">你的最终得分</p>
          
          <div className="text-6xl font-black text-indigo-600 mb-4">
            {score}<span className="text-2xl text-slate-300 font-normal"> / {questions.length}</span>
          </div>
          
          <p className="text-lg font-medium text-slate-700 mb-8">
            {getEncouragement(score)}
          </p>

          <div className="space-y-3">
            <button 
              onClick={resetQuiz}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw size={20} />
              再试一次
            </button>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-400 mb-3">推荐复习内容</p>
              <div className="flex flex-wrap justify-center gap-2">
                <a href="#" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  <BookOpen size={12} /> 非谓语动词详解
                </a>
                <a href="#" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">
                  <BookOpen size={12} /> 定语从句引导词
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <GraduationCap size={20} />
            </div>
            <h1 className="font-bold text-lg hidden sm:block">GrammarMaster</h1>
          </div>
          
          <div className="flex-1 max-w-xs mx-4">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-indigo-500"
              />
            </div>
          </div>

          <div className="text-sm font-medium text-slate-500">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            {/* Question Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <DifficultyBadge difficulty={currentQuestion.difficulty} />
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    {currentQuestion.category}
                  </span>
                </div>
              </div>

              <div className="text-xl md:text-2xl leading-relaxed text-slate-800 font-medium mb-10">
                {currentQuestion.text.split('______').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={`inline-flex items-center justify-center min-w-[120px] px-4 py-1 mx-2 border-b-2 transition-all ${
                        isSubmitted 
                          ? isCorrect 
                            ? 'border-emerald-500 text-emerald-600 bg-emerald-50 rounded-t-lg' 
                            : 'border-rose-500 text-rose-600 bg-rose-50 rounded-t-lg'
                          : selectedOption 
                            ? 'border-indigo-500 text-indigo-600' 
                            : 'border-slate-300 text-slate-300'
                      }`}>
                        {selectedOption || '______'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(option)}
                    className={`group relative flex items-center justify-between p-4 rounded-2xl border-2 transition-all text-left ${
                      selectedOption === option
                        ? isSubmitted
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                            : 'bg-rose-50 border-rose-500 text-rose-700'
                          : 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : isSubmitted && option === currentQuestion.correctAnswer
                          ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                          : 'bg-white border-slate-100 hover:border-slate-200 text-slate-600'
                    }`}
                  >
                    <span className="font-semibold text-lg">{option}</span>
                    {isSubmitted && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="text-emerald-500" size={24} />
                    )}
                    {isSubmitted && selectedOption === option && option !== currentQuestion.correctAnswer && (
                      <XCircle className="text-rose-500" size={24} />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-10 flex justify-end">
                {!isSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleSubmit}
                    className={`px-8 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
                      selectedOption 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:translate-y-[-2px]' 
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    提交答案
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                  >
                    {currentIndex < questions.length - 1 ? '下一题' : '查看结果'}
                    <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>

            {/* Explanation Card */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`rounded-3xl p-6 md:p-8 border-2 ${
                    isCorrect 
                      ? 'bg-emerald-50/50 border-emerald-100' 
                      : 'bg-rose-50/50 border-rose-100'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${isCorrect ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                      {isCorrect ? <Lightbulb size={24} /> : <AlertCircle size={24} />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-lg font-bold mb-4 ${isCorrect ? 'text-emerald-800' : 'text-rose-800'}`}>
                        {isCorrect ? '回答正确！' : '解析详情'}
                      </h3>
                      
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">语法规则</h4>
                          <p className="text-slate-700 leading-relaxed">{currentQuestion.explanation.rule}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white/60 p-4 rounded-xl border border-white">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">经典例句</h4>
                            <p className="text-slate-700 italic">"{currentQuestion.explanation.example}"</p>
                          </div>
                          <div className="bg-white/60 p-4 rounded-xl border border-white">
                            <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2">常见错误辨析</h4>
                            <p className="text-slate-700">{currentQuestion.explanation.commonMistake}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer info */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-slate-400 text-sm">
          适合初二学生语法强化练习 • 即时反馈系统 v1.0
        </p>
      </footer>
    </div>
  );
}
