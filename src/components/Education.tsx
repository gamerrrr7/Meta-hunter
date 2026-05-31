import { useState } from 'react';
import { BookOpen, Award, CheckCircle, ChevronRight, HelpCircle, ArrowLeft, Clock, Bookmark, Sparkles } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface Article {
  id: string;
  titlePt: string;
  titleEn: string;
  descPt: string;
  descEn: string;
  readTimePt: string;
  readTimeEn: string;
  category: 'saving' | 'budget' | 'emergency' | 'discipline';
  contentPt: string[];
  contentEn: string[];
}

export default function Education() {
  const { t, language } = useLanguage();
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);

  // Simple quiz states for gamification!
  const [quizAnswer, setQuizAnswer] = useState<number | null>(null);
  const [isQuizChecked, setIsQuizChecked] = useState(false);

  const articles: Article[] = [
    {
      id: 'saving-money',
      titlePt: 'Fundamentos da Economia Prática',
      titleEn: 'Fundamentals of Practical Savings',
      descPt: 'Como transformar pequenos cortes de fluxo em acúmulo real e metas realizadas.',
      descEn: 'How to turn small flow reductions into massive real savings and funded goals.',
      readTimePt: '3 min de leitura',
      readTimeEn: '3 min read',
      category: 'saving',
      contentPt: [
        'A economia de dinheiro começa com uma mudança sutil de perspectiva: você não está se privando de gastar hoje, mas sim garantindo sua liberdade e bem-estar amanhã.',
        'Regra dos 3 Dias: Sempre que quiser comprar algo que não esteja planejado, espere 72 horas. Na maioria das vezes, o impulso passará e você perceberá que o item não era realmente necessário.',
        'Poupe Primeiro, Gaste o que Sobrar: O erro clássico é guardar apenas o que resta no final do mês. Mude a ordem! Assim que receber seus vencimentos, transfira sua contribuição de metas diretamente para um saldo separado de suas contas de consumo diário.',
        'Seja Específico e Caçador: Definir metas sem rostos ou nomes gera desmotivação rápida. Dar um nome claro (como "Minha Viagem para o Japão" ou "Novo PC Gamer") cria um vínculo motivacional real que facilita a disciplina.'
      ],
      contentEn: [
        'Saving money starts with a subtle shift in perspective: you make choices today to buy compound freedom and security tomorrow.',
        'The 3-Day Rule: Whenever you feel the urge to purchase an unplanned item, force a 72-hour delay. Most of the time, the emotional urge fades, saving you money.',
        'Save First, Spend What is Left: The classic mistake is saving only what is left at the end of the month. Reverse it! Secure your target contribution first, then adjust daily needs around the remaining balance.',
        'Be Precise and Track: Saving into a blank black hole is boring. Labeling goals specifically (e.g., "PlayStation 5" or "House Deposit") creates a powerful motivational link.'
      ]
    },
    {
      id: 'budgeting-basics',
      titlePt: 'Dominando o Orçamento 50-30-20',
      titleEn: 'Mastering the 50-30-20 Budget Plan',
      descPt: 'A técnica definitiva para dividir sua renda sem sofrimento.',
      descEn: 'The definitive breakdown pattern to allocate your income frictionlessly.',
      readTimePt: '4 min de leitura',
      readTimeEn: '4 min read',
      category: 'budget',
      contentPt: [
        'A regra do 50-30-20 é uma ferramenta amigável para gerenciar seu fluxo financeiro mensal de maneira organizada:',
        '1. 50% para Necessidades Básicas: Aluguel, contas de luz, plano de saúde, alimentação e transporte essencial.',
        '2. 30% para Desejos Pessoais: Lazer, jantares fora, assinaturas de streaming e hobbies.',
        '3. 20% para Poupança e Metas: Contribuições periódicas para seus objetivos do app Caçador de Metas e investimentos de futuro.',
        'Flexibilidade: Se sua renda atual estiver apertada, adapte os percentuais (por exemplo, 60-25-15). O importante é criar a rotina e manter a clareza sobre para onde seu dinheiro flui!'
      ],
      contentEn: [
        'The 50-30-20 rule is a friendly general framework to map your monthly cashflow simply and systematically:',
        '1. 50% for Needs: Housing, groceries, utilities, and essential loans.',
        '2. 30% for Wants: Restaurants, streaming subscriptions, dynamic shopping, and hobbies.',
        '3. 20% for Savings & Milestones: Active goals contributions and future-proofing investments.',
        'Flexibility is Key: If things are tight, toggle the percentages (e.g., 60-25-15). The main gold standard is developing consistency!'
      ]
    },
    {
      id: 'emergency-funds',
      titlePt: 'Sua Reserva de Emergência: O Escudo de Paz',
      titleEn: 'Your Emergency Fund: The Peace Shield',
      descPt: 'Por que ela deve ser sua prioridade absoluta antes de investir.',
      descEn: 'Why this protector must be your absolute high-priority before investing.',
      readTimePt: '5 min de leitura',
      readTimeEn: '5 min read',
      category: 'emergency',
      contentPt: [
        'Uma reserva de emergência é um colchão financeiro blindado feito para cobrir imprevistos como despesas médicas, reparos de carro ou meses de desemprego sem precisar contrair dívidas caras.',
        'Qual o Tamanho Ideal? Planeje acumular de 3 a 6 meses do seu custo de vida mensal de gastos essenciais.',
        'Onde Guardar? Busque aplicações financeiras seguras que possuam liquidez imediata (você pode retirar no mesmo dia) e baixíssimo risco, como CDBs de bancos sólidos ou títulos do Tesouro Direto.',
        'Dica de Caçador: Crie uma Meta no app com o nome "Reserva de Emergência" com seu alvo de 6 meses e acompanhe seu preenchimento!'
      ],
      contentEn: [
        'An emergency fund is a financial safety net designed to cover unexpected events like medical emergencies, car repairs, or short-term work gaps without falling into stressful high-interest debt.',
        'Ideal Metric Size: Aim to accumulate between 3 to 6 months of your active monthly essential cost of life.',
        'Where to Deposit: Look for safe vehicles offering immediate liquidity (same-day access) and very low risk, such as government bonds or highly protected savings reserves.',
        'Hunter Tip: Set up an active goal called "Emergency Shield" in the app, target your 6-month metric, and fuel it regularly!'
      ]
    },
    {
      id: 'mindset-discipline',
      titlePt: 'Mentalidade e Disciplina de Longo Prazo',
      titleEn: 'Mindset and Long-Term Financial Discipline',
      descPt: 'Como lidar com o consumo por impulso e focar na liberdade futura.',
      descEn: 'How to tackle impulse spending and prioritize compound future freedom.',
      readTimePt: '3 min de leitura',
      readTimeEn: '3 min read',
      category: 'discipline',
      contentPt: [
        'A disciplina financeira é como ir à academia: os resultados não aparecem no primeiro dia, mas o acúmulo de consistência gera efeitos exponenciais extraordinários.',
        'Evite Compras por Impulso: Reduza a exposição a anúncios e remova os cartões salvos em sites de compras rápidos.',
        'A Magia dos Juros Compostos: R$ 100 economizados hoje não são apenas R$ 100. Sob rendimentos constantes ao longo dos anos, esse valor cresce de forma acelerada, trabalhando duro para você enquanto você dorme.',
        'Comemore as Conquistas: Cada meta completada no app Caçador de Metas é um passo para sua emancipação e sucesso de vida. Comemore de maneira saudável!'
      ],
      contentEn: [
        'Financial discipline is like physical fitness: physical training results are invisible on day one, but consistent habit forms long-term extraordinary strength.',
        'Combat Impulse Triggers: Unsubscribe from sales marketing emails, and remove instant-buy card registrations from e-commerce sites.',
        'The Magic of Compound growth: $100 saved today is not just a hundred bills. Subjected to compound rates over decades, it multiplies itself while you sleep.',
        'Celebrate Milestones: Every successfully completed goal in Caçador de Metas marks a step toward financial sovereignty. Reward yourself gently!'
      ]
    }
  ];

  const handleQuizCheck = (answer: number) => {
    setQuizAnswer(answer);
    setIsQuizChecked(true);
  };

  const activeArticle = articles.find((a) => a.id === selectedArticleId);

  return (
    <div className="space-y-6" id="education_panel">
      {selectedArticleId && activeArticle ? (
        /* Reading Article View panel */
        <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-805 p-6 sm:p-8 rounded-2xl shadow-md space-y-6 animate-in slide-in-from-right duration-250">
          <button
            onClick={() => setSelectedArticleId(null)}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-emerald-600 dark:text-zinc-400 dark:hover:text-emerald-400 cursor-pointer transition-colors"
          >
            <ArrowLeft size={16} />
            <span>{language === 'pt' ? 'Voltar para Artigos' : 'Back to Articles'}</span>
          </button>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
              {language === 'pt' ? activeArticle.titlePt : activeArticle.titleEn}
            </h3>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-400 dark:text-zinc-500">
              <span className="flex items-center gap-1">
                <Clock size={13} />
                {language === 'pt' ? activeArticle.readTimePt : activeArticle.readTimeEn}
              </span>
              <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded uppercase tracking-wider text-[9px]">
                {activeArticle.category}
              </span>
            </div>
          </div>

          {/* Reading text columns paragraphs */}
          <div className="text-gray-700 dark:text-zinc-300 space-y-4 font-normal text-sm sm:text-base leading-relaxed border-t border-b border-gray-100 dark:border-zinc-800 py-6">
            {(language === 'pt' ? activeArticle.contentPt : activeArticle.contentEn).map((para, idx) => (
              <p key={idx} className="indent-2.5">
                {para}
              </p>
            ))}
          </div>

          {/* Practical action checklist suggestions */}
          <div className="p-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/10 rounded-xl space-y-2">
            <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
              <Sparkles size={16} className="text-amber-500" />
              {language === 'pt' ? 'Meta Prática de Hoje' : 'Today\'s Practical Takeaway'}
            </h4>
            <p className="text-xs text-emerald-700 dark:text-zinc-300 font-semibold leading-relaxed">
              {language === 'pt'
                ? 'Aplique o conceito lido agora mesmo! Adicione um novo item desejado em sua Lista de Desejos ou ajuste as contribuições mensais de suas Metas Ativas.'
                : 'Turn theory into practice! Head over to the Wishlist and register an item, or secure your savings streak in the dashboard.'}
            </p>
          </div>
        </div>
      ) : (
        /* List of Articles Grid view */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {articles.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticleId(art.id)}
                className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/20 text-amber-500 border border-amber-100 dark:border-amber-950/30">
                      {art.category}
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold">
                      {language === 'pt' ? art.readTimePt : art.readTimeEn}
                    </span>
                  </div>

                  <h3 className="text-base font-extrabold text-gray-900 dark:text-white leading-snug">
                    {language === 'pt' ? art.titlePt : art.titleEn}
                  </h3>
                  <p className="text-xs font-semibold text-gray-500 dark:text-zinc-400 leading-relaxed">
                    {language === 'pt' ? art.descPt : art.descEn}
                  </p>
                </div>

                <div className="flex justify-end mt-4 pt-3 border-t border-gray-50 dark:border-zinc-800/80">
                  <span className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 gap-1 hover:underline">
                    {language === 'pt' ? 'Ler Artigo' : 'Read Article'}
                    <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Mini Interactive Financial Quiz widget */}
          <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800/80 p-5 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-gray-800 dark:text-zinc-100 flex items-center gap-1.5">
              <HelpCircle size={18} className="text-emerald-500" />
              {language === 'pt' ? 'Desafio da Mente Próspera' : 'Prosperity Quiz Challenge'}
            </h3>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-zinc-300">
                {language === 'pt'
                  ? 'Qual a principal diferença entre juros simples e juros compostos no longo prazo?'
                  : 'What is the main compound interest differentiator compared to simple interest in long-term models?'}
              </p>

              <div className="grid grid-cols-1 gap-2.5 text-xs text-gray-700 dark:text-zinc-200">
                <button
                  type="button"
                  onClick={() => handleQuizCheck(1)}
                  className={`p-3 rounded-xl border text-left font-semibold active:scale-99 transition-all cursor-pointer ${
                    quizAnswer === 1
                      ? 'bg-red-50 dark:bg-red-950/20 border-red-200'
                      : 'bg-gray-50/50 dark:bg-zinc-950/20 border-gray-150 dark:border-zinc-850 hover:bg-gray-50'
                  }`}
                >
                  {language === 'pt'
                    ? 'A) Juros simples rendem sobre o montante acumulado atualizado.'
                    : 'A) Simple interest accrues over the newly accumulated updated balance.'}
                </button>

                <button
                  type="button"
                  onClick={() => handleQuizCheck(2)}
                  className={`p-3 rounded-xl border text-left font-semibold active:scale-99 transition-all cursor-pointer ${
                    quizAnswer === 2
                      ? 'bg-emerald-50 dark:bg-emerald-950/25 border-emerald-300'
                      : 'bg-gray-50/50 dark:bg-zinc-950/20 border-gray-150 dark:border-zinc-850 hover:bg-gray-50'
                  }`}
                >
                  {language === 'pt'
                    ? 'B) Juros compostos incidem sobre o capital inicial mais os juros acumulados de períodos anteriores ("juros sobre juros").'
                    : 'B) Compound interest calculates payments over initial capital plus accumulated historical dividends ("interest-on-interest").'}
                </button>
              </div>

              {isQuizChecked && (
                <div className={`p-3.5 rounded-xl text-xs flex gap-2.5 items-start shadow-inner ${
                  quizAnswer === 2
                    ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-400 border border-emerald-250 dark:border-emerald-900/50'
                    : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200'
                }`}>
                  <CheckCircle size={16} className="shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-extrabold mb-0.5">{quizAnswer === 2 ? 'Resposta Correta!' : 'Tente Novamente!'}</h4>
                    <p className="font-medium text-gray-500 dark:text-zinc-400">
                      {quizAnswer === 2
                        ? (language === 'pt'
                          ? 'Perfeito! Os juros compostos multiplicam o patrimônio de forma exponencial em prazos maiores trabalhando para o caçador de metas.'
                          : 'Spot on! Compound interest multiplies financial savings exponentially over longer timelines, helping goals be achieved faster.')
                        : (language === 'pt'
                          ? 'Opção incorreta! Juros simples só rendem em cima do capital inicial fixo.'
                          : 'Incorrect option! Simple interest only processes rates over the exact baseline initial capital.')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
