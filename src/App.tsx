import React, { useState, useEffect, useCallback } from 'react';
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
  Loader2, 
  Sparkles 
} from 'lucide-react';
import { generateGrammarQuestions } from './services/geminiService';
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
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const newQuestions = await generateGrammarQuestions();
      setQuestions(newQuestions);
      setCurrentIndex(0);
      setSelectedOption(null);
      setIsSubmitted(false);
      setAnswers([]);
      setShowResults(false);
    } catch (err) {
      setError("魔法能量不足（生成题目失败），请稍后再试。");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const currentQuestion = questions[currentIndex];
  const isCorrect = selectedOption === currentQuestion?.correctAnswer;

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption || !currentQuestion) return;
    
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

  const score = answers.filter(a => a.isCorrect).length * 5;
  const progress = questions.length > 0 ? ((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100 : 0;

  const getEncouragement = (score: number) => {
    const ratio = score / 100;
    if (ratio === 1) return "太棒了！你是芙莉莲级别的语法大师！🌟";
    if (ratio >= 0.8) return "做得好！你的魔法（语法）造诣很高！🚀";
    if (ratio >= 0.6) return "不错，还需要更多的旅行（练习）！💪";
    return "加油，像芙莉莲一样在漫长岁月中积累知识吧！📚";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.alphacoders.com/133/1333488.png")' }}
        />
        <div className="fixed inset-0 z-[-1] bg-indigo-950/60 backdrop-blur-md" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-indigo-400 mb-6"
        >
          <Loader2 size={64} />
        </motion.div>
        <h2 className="text-2xl font-black text-white tracking-widest animate-pulse">
          正在通过魔法生成新题目...
        </h2>
        <p className="text-indigo-200 mt-4 font-medium">芙莉莲正在翻阅她的魔导书</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.alphacoders.com/133/1333488.png")' }}
        />
        <div className="fixed inset-0 z-[-1] bg-indigo-950/60 backdrop-blur-md" />
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 text-center max-w-md">
          <AlertCircle size={48} className="text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-4">{error}</h2>
          <button 
            onClick={fetchQuestions}
            className="px-8 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all"
          >
            重试魔法
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm relative">
        <div 
          className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("https://images.alphacoders.com/133/1333488.png")' }}
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 max-w-md w-full text-center border border-indigo-100"
        >
          <div className="mb-6 inline-flex p-4 bg-indigo-50 rounded-full text-indigo-600">
            <Trophy size={48} />
          </div>
          <h2 className="text-3xl font-bold mb-2 text-slate-800">练习完成!</h2>
          <p className="text-slate-500 mb-6 font-medium">你的最终得分</p>
          
          <div className="text-6xl font-black text-indigo-600 mb-4">
            {score}<span className="text-2xl text-slate-300 font-normal"> / 100</span>
          </div>
          
          <p className="text-lg font-medium text-slate-700 mb-8">
            {getEncouragement(score)}
          </p>

          <div className="space-y-3">
            <button 
              onClick={fetchQuestions}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
            >
              <Sparkles size={20} />
              开启新一轮挑战 (生成新题)
            </button>
            <div className="pt-4 border-t border-slate-100">
              <p className="text-sm text-slate-400 mb-3 font-bold">推荐复习内容</p>
              <div className="flex flex-wrap justify-center gap-2">
                <a href="#" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-bold">
                  <BookOpen size={12} /> 虚拟语气魔法
                </a>
                <a href="#" className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-bold">
                  <BookOpen size={12} /> 倒装句秘籍
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans relative overflow-hidden selection:bg-indigo-500/30">
      {/* Main Frieren Background Image */}
      <div 
        className="fixed inset-0 z-[-1] bg-cover bg-center bg-no-repeat transition-transform duration-[60s] scale-125 animate-[pulse_10s_infinite]"
        style={{ 
          backgroundImage: 'url("https://images.alphacoders.com/133/1333488.png")',
        }}
      />
      {/* Overlay for readability - deeper blue/purple for magical feel */}
      <div className="fixed inset-0 z-[-1] bg-indigo-950/40 backdrop-blur-[3px]" />
      
      {/* Floating Frieren Character Sprite - More prominent */}
      <motion.div 
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="fixed bottom-0 right-[-5%] z-0 pointer-events-none hidden xl:block"
      >
        <img 
          src="https://static.zerochan.net/Frieren.full.4046187.png" 
          alt="Frieren" 
          className="h-[90vh] object-contain drop-shadow-[0_0_50px_rgba(165,180,252,0.4)]"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      {/* Header */}
      <header className="bg-white/10 backdrop-blur-xl border-b border-white/10 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600/80 p-2 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <GraduationCap size={20} />
            </div>
            <h1 className="font-black text-xl tracking-tight text-white drop-shadow-md">FRIEREN GRAMMAR</h1>
          </div>
          
          <div className="flex-1 max-w-xs mx-6">
            <div className="h-2.5 bg-white/10 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-indigo-400 to-purple-400 shadow-[0_0_15px_rgba(129,140,248,0.6)]"
              />
            </div>
          </div>

          <div className="text-sm font-black text-white bg-indigo-600/40 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-md">
            {currentIndex + 1} / {questions.length}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-8"
          >
            {/* Question Card */}
            <div className="bg-white/15 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] border border-white/20 p-8 md:p-12 overflow-hidden relative">
              {/* Decorative magic circle background element */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
              
              <div className="flex items-center justify-between mb-8 relative z-10">
                <div className="flex items-center gap-4">
                  <DifficultyBadge difficulty={currentQuestion.difficulty} />
                  <span className="text-xs font-black text-indigo-200 uppercase tracking-[0.3em] drop-shadow-sm">
                    {currentQuestion.category}
                  </span>
                </div>
                <div className="text-xs font-black text-white/60 tracking-widest">5 MANA POINTS</div>
              </div>

              <div className="text-2xl md:text-3xl leading-relaxed text-white font-bold mb-12 drop-shadow-md relative z-10">
                {currentQuestion.text.split('______').map((part, i, arr) => (
                  <React.Fragment key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <span className={`inline-flex items-center justify-center min-w-[160px] px-6 py-1.5 mx-2 border-b-4 transition-all duration-500 ${
                        isSubmitted 
                          ? isCorrect 
                            ? 'border-emerald-400 text-emerald-300 bg-emerald-500/20 rounded-t-2xl' 
                            : 'border-rose-400 text-rose-300 bg-rose-500/20 rounded-t-2xl'
                          : selectedOption 
                            ? 'border-pink-400 text-pink-300' 
                            : 'border-white/20 text-white/20'
                      }`}>
                        {selectedOption || '______'}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 relative z-10">
                {currentQuestion.options.map((option) => (
                  <button
                    key={option}
                    disabled={isSubmitted}
                    onClick={() => handleOptionSelect(option)}
                    className={`group relative flex items-center justify-between p-6 rounded-[1.5rem] border-2 transition-all duration-300 text-left ${
                      selectedOption === option
                        ? isSubmitted
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-[0_0_30px_rgba(52,211,153,0.3)]'
                            : 'bg-rose-500/30 border-rose-400 text-white shadow-[0_0_30px_rgba(251,113,133,0.3)]'
                          : 'bg-pink-500/30 border-pink-400 text-white shadow-[0_0_30px_rgba(244,114,182,0.3)]'
                        : isSubmitted && option === currentQuestion.correctAnswer
                          ? 'bg-emerald-500/20 border-emerald-400/50 text-white'
                          : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10 text-white/80'
                    }`}
                  >
                    <span className="font-black text-xl">{option}</span>
                    {isSubmitted && option === currentQuestion.correctAnswer && (
                      <CheckCircle2 className="text-emerald-400" size={28} />
                    )}
                    {isSubmitted && selectedOption === option && option !== currentQuestion.correctAnswer && (
                      <XCircle className="text-rose-400" size={28} />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-12 flex justify-end relative z-10">
                {!isSubmitted ? (
                  <button
                    disabled={!selectedOption}
                    onClick={handleSubmit}
                    className={`px-12 py-5 rounded-2xl font-black transition-all flex items-center gap-3 text-xl tracking-wider ${
                      selectedOption 
                        ? 'bg-indigo-500 text-white shadow-[0_20px_40px_-10px_rgba(99,102,241,0.5)] hover:translate-y-[-4px] hover:shadow-[0_25px_50px_-12px_rgba(99,102,241,0.6)] active:translate-y-0' 
                        : 'bg-white/5 text-white/20 cursor-not-allowed border border-white/10'
                    }`}
                  >
                    释放魔法 (提交)
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all flex items-center gap-3 shadow-[0_20px_40px_-10px_rgba(255,255,255,0.3)] hover:translate-y-[-4px] active:translate-y-0 text-xl tracking-wider"
                  >
                    {currentIndex < questions.length - 1 ? '继续旅程' : '结算魔法值'}
                    <ChevronRight size={28} />
                  </button>
                )}
              </div>
            </div>

            {/* Explanation Card */}
            <AnimatePresence>
              {isSubmitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className={`rounded-[2.5rem] p-8 md:p-12 border-2 backdrop-blur-3xl shadow-2xl ${
                    isCorrect 
                      ? 'bg-emerald-500/10 border-emerald-400/30' 
                      : 'bg-rose-500/10 border-rose-400/30'
                  }`}
                >
                  <div className="flex items-start gap-8">
                    <div className={`p-5 rounded-3xl shadow-lg ${isCorrect ? 'bg-emerald-400/20 text-emerald-300' : 'bg-rose-400/20 text-rose-300'}`}>
                      {isCorrect ? <Lightbulb size={40} /> : <AlertCircle size={40} />}
                    </div>
                    <div className="flex-1">
                      <h3 className={`text-2xl font-black mb-8 tracking-tight ${isCorrect ? 'text-emerald-300' : 'text-rose-300'}`}>
                        {isCorrect ? '魔法共鸣成功！' : '魔法解析'}
                      </h3>
                      
                      <div className="space-y-10">
                        <div>
                          <h4 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-4">语法奥秘</h4>
                          <p className="text-white/90 leading-relaxed text-xl font-medium drop-shadow-sm">{currentQuestion.explanation.rule}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-inner">
                            <h4 className="text-xs font-black text-indigo-300 uppercase tracking-[0.3em] mb-4">魔法咒语 (例句)</h4>
                            <p className="text-white/80 italic font-serif text-xl leading-relaxed">"{currentQuestion.explanation.example}"</p>
                          </div>
                          <div className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-inner">
                            <h4 className="text-xs font-black text-rose-300 uppercase tracking-[0.3em] mb-4">魔法陷阱 (辨析)</h4>
                            <p className="text-white/80 font-medium text-lg leading-relaxed">{currentQuestion.explanation.commonMistake}</p>
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
      <footer className="max-w-4xl mx-auto px-4 py-12 text-center relative z-10">
        <p className="text-white/40 text-sm font-black tracking-widest uppercase drop-shadow-md">
          Frieren: Beyond Journey's End • Grammar Master Edition
        </p>
      </footer>
    </div>
  );
}
