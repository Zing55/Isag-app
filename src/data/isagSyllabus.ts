import { Subject, Lesson } from '../types';

export const INITIAL_ISAG_SUBJECTS: Subject[] = [
  // ==========================================
  // 1.º SEMESTRE (OFICIAL ISAG)
  // ==========================================
  {
    id: 'isag-gt205',
    code: 'GT205',
    name: 'Economia do Turismo',
    semester: 1,
    credits: 6,
    description: 'Análise económica do setor turístico: mecanismos de oferta e procura, utilidade, elasticidades, contabilidade nacional, efeito multiplicador e Conta Satélite do Turismo (CST).',
    modules: [
      {
        id: 'mod-gt205-l1',
        subjectId: 'isag-gt205',
        level: 1,
        title: 'Nível 1: Princípios Fundamentais & Procura Turística',
        topics: [
          'Definição e princípios básicos da economia aplicados ao turismo',
          'Âmbito da Economia do Turismo e políticas económicas setoriais',
          'Noção e formação da procura turística e utilidade turística',
          'Elasticidade-preço, elasticidade-rendimento e elasticidade-cruzada',
          'Consumo turístico e determinantes estruturais e conjunturais da procura'
        ],
        quizQuestions: [
          {
            id: 'q-gt205-l1-1',
            question: 'O que mede a elasticidade-preço da procura turística?',
            options: [
              'A variação percentual na quantidade procurada perante uma variação no preço do serviço turístico',
              'O custo total de produção de um alojamento hoteleiro',
              'A quantidade de turistas estrangeiros que visitam o Porto num ano',
              'O número de trabalhadores contratados na época alta'
            ],
            correctOptionIndex: 0,
            explanation: 'A elasticidade-preço da procura mede a sensibilidade da quantidade procurada em resposta a alterações no preço do produto ou serviço turístico.'
          },
          {
            id: 'q-gt205-l1-2',
            question: 'Qual das seguintes opções é um determinante conjuntural da procura turística?',
            options: [
              'Taxas de câmbio e estabilidade geopolítica momentânea',
              'Localização geográfica permanente de uma montanha',
              'O clima histórico de um continente',
              'A existência de um monumento do século XII'
            ],
            correctOptionIndex: 0,
            explanation: 'Fatores conjunturais são elementos temporários ou conjunturais, como flutuações cambiais, inflação e conjuntura económica ou política.'
          }
        ]
      },
      {
        id: 'mod-gt205-l2',
        subjectId: 'isag-gt205',
        level: 2,
        title: 'Nível 2: Oferta Turística & Equilíbrio de Mercado',
        topics: [
          'Noção, características únicas e classificação da oferta turística',
          'Destinos turísticos, produtos e a função de produção turística',
          'Elasticidade da oferta turística e rigidez do inventário hoteleiro',
          'Caracterização do equilíbrio na Cruz Marshalliana (Oferta vs. Procura)',
          'A questão dos preços em turismo e determinantes tarifários (Revenue Management)'
        ],
        quizQuestions: [
          {
            id: 'q-gt205-l2-1',
            question: 'Por que razão a oferta hoteleira é considerada inelástica a curto prazo?',
            options: [
              'Porque o número de quartos disponíveis num hotel não pode aumentar instantaneamente perante um pico súbito de procura',
              'Porque os hotéis mudam de edifício todas as semanas',
              'Porque a tarifa é sempre fixada pelo governo português',
              'Porque a procura não depende dos preços do alojamento'
            ],
            correctOptionIndex: 0,
            explanation: 'A oferta de alojamento hoteleiro exige capital fixo e tempo de construção, pelo que a capacidade de resposta (elasticidade) a curto prazo é muito reduzida.'
          }
        ]
      },
      {
        id: 'mod-gt205-l3',
        subjectId: 'isag-gt205',
        level: 3,
        title: 'Nível 3: O Turismo na Contabilidade Nacional e Macroeconomia',
        topics: [
          'Integração do turismo na política económica global de Portugal',
          'Contabilidade Nacional aplicada ao turismo: Produto e Rendimento nacional',
          'O consumo e os comportamentos sociais de consumo turístico',
          'Investimento turístico, criação de emprego e taxas de desemprego',
          'A Inflação e o impacto do turismo na Balança de Pagamentos'
        ],
        quizQuestions: [
          {
            id: 'q-gt205-l3-1',
            question: 'Qual é o contributo do consumo dos turistas estrangeiros para a Balança de Pagamentos de Portugal?',
            options: [
              'Conta como uma exportação de serviços (crédito na balança de viagens e turismo)',
              'Conta como uma importação de mercadorias agrícolas',
              'Não tem qualquer efeito nas contas externas do país',
              'Apenas afeta o orçamento municipal de Lisboa e Porto'
            ],
            correctOptionIndex: 0,
            explanation: 'Quando um turista não residente consome bens e serviços dentro de Portugal, esse gasto é contabilizado como uma exportação de serviços no rubro de Viagens e Turismo.'
          }
        ]
      },
      {
        id: 'mod-gt205-l4',
        subjectId: 'isag-gt205',
        level: 4,
        title: 'Nível 4: Avaliação Económica & Conta Satélite do Turismo (CST)',
        topics: [
          'Técnicas de avaliação económica dos recursos e património turístico',
          'A Conta Satélite do Turismo (CST) como instrumento estatístico oficial do INE',
          'Aplicações e exemplos práticos da CST no cálculo da VAB e do PIB do turismo',
          'Efeito Multiplicador direto, indireto e induzido na economia regional do Norte'
        ],
        quizQuestions: [
          {
            id: 'q-gt205-l4-1',
            question: 'Qual é a função principal da Conta Satélite do Turismo (CST)?',
            options: [
              'Mensurar com precisão rigorosa a percentagem do PIB e do emprego gerada diretamente pelo setor turístico na economia nacional',
              'Calcular o preço do bilhete de avião para viagens de negócios',
              'Substituir a contabilidade financeira privada de cada hotel',
              'Emitir vistos de entrada para turistas estrangeiros'
            ],
            correctOptionIndex: 0,
            explanation: 'A CST relaciona a oferta e a procura de turismo com o sistema de Contabilidade Nacional, permitindo isolar o verdadeiro peso do turismo no PIB.'
          }
        ]
      }
    ]
  },
  {
    id: 'isag-gt204',
    code: 'GT204',
    name: 'Princípios de Turismo',
    semester: 1,
    credits: 6,
    description: 'Estudo do sistema turístico, evolução histórica do turismo em Portugal e no mundo, organização institucional e tendências contemporâneas de sustentabilidade.',
    modules: [
      {
        id: 'mod-gt204-l1',
        subjectId: 'isag-gt204',
        level: 1,
        title: 'Nível 1: Conceitos, Classificações e Evolução Histórica',
        topics: [
          'Conceitos fundamentais: Lazer, Ócio, Visitante, Turista e Excursionista',
          'Classificações do sujeito turístico e motivações primárias de viagem',
          'Classificações formais do turismo: Inbound, Outbound e Domestic',
          'Evolução histórica global: Idade Clássica, Média, Moderna e Contemporânea',
          'Evolução histórica do turismo em Portugal e afirmação dos destinos nacionais'
        ],
        quizQuestions: [
          {
            id: 'q-gt204-l1-1',
            question: 'Segundo as definições da OMT, qual é a diferença entre um Turista e um Excursionista?',
            options: [
              'O turista pernoita no destino (pelo menos 1 noite), enquanto o excursionista não realiza pernoita (visita de um dia)',
              'O turista viaja de avião e o excursionista viaja a pé',
              'O turista viaja em trabalho e o excursionista viaja em lazer',
              'Não existe diferença, são termos sinónimos'
            ],
            correctOptionIndex: 0,
            explanation: 'A pernoita é o critério definidor fundamental: o turista permanece no destino pelo menos 24 horas/1 noite; o visitante de um dia é um excursionista.'
          }
        ]
      },
      {
        id: 'mod-gt204-l2',
        subjectId: 'isag-gt204',
        level: 2,
        title: 'Nível 2: Organização Institucional & O Sistema Turístico',
        topics: [
          'Organismos nacionais do turismo: Turismo de Portugal e TPNP (Porto e Norte)',
          'Organismos internacionais: UN Tourism (OMT), WTTC e ETC',
          'O Turismo como sistema interligado (Modelo de Neil Leiper)',
          'Região geradora, região de trânsito e região de destino turístico'
        ],
        quizQuestions: [
          {
            id: 'q-gt204-l2-1',
            question: 'Qual é a entidade nacional responsável pela promoção e regulação do turismo em Portugal?',
            options: [
              'Turismo de Portugal, I.P.',
              'Instituto Nacional de Estatística',
              'Banco de Portugal',
              'Associação Comercial do Porto'
            ],
            correctOptionIndex: 0,
            explanation: 'O Turismo de Portugal, I.P., integrado no Ministério da Economia, é a autoridade turística nacional.'
          }
        ]
      },
      {
        id: 'mod-gt204-l3',
        subjectId: 'isag-gt204',
        level: 3,
        title: 'Nível 3: Procura e Oferta Turística Estruturada',
        topics: [
          'Análise das motivações de viagem e comportamentos do consumidor',
          'Determinantes estruturais e conjunturais da procura turística',
          'Componentes do produto turístico: Alojamento, Restauração, Animação e Acessibilidades',
          'O Ciclo de Vida do Destino Turístico (Modelo de Butler: Exploração a Rejuvenescimento)'
        ],
        quizQuestions: [
          {
            id: 'q-gt204-l3-1',
            question: 'No modelo do Ciclo de Vida do Destino de Butler, o que sucede na fase de Estagnação?',
            options: [
              'A capacidade de carga é atingida ou ultrapassada, surgindo problemas ambientais e sociais',
              'O destino é visitado apenas por exploradores e pioneiros',
              'Inicia-se um crescimento exponencial de turistas sem qualquer impacto',
              'O destino deixa de ter infraestruturas de acolhimento'
            ],
            correctOptionIndex: 0,
            explanation: 'Na estagnação, os picos de acolhimento saturam a capacidade de carga física e sociocultural do destino, exigindo rejuvenescimento ou reconversão.'
          }
        ]
      },
      {
        id: 'mod-gt204-l4',
        subjectId: 'isag-gt204',
        level: 4,
        title: 'Nível 4: Tendências Globais, Sustentabilidade e Futuro',
        topics: [
          'Importância e perspetivas futuras do crescimento do turismo global',
          'Transição gémea no turismo: Transição Digital e Sustentabilidade Ambiental',
          'ODS (Objetivos de Desenvolvimento Sustentável da ONU) aplicados ao turismo no ISAG',
          'Determinantes emergentes do turismo pós-pandémico e inteligência turística'
        ],
        quizQuestions: [
          {
            id: 'q-gt204-l4-1',
            question: 'Qual das seguintes afirmações reflete a visão atual sobre o turismo sustentável?',
            options: [
              'Deve satisfazer as necessidades dos turistas e das regiões recetoras protegendo e incrementando as oportunidades para o futuro',
              'Deve proibir a entrada de qualquer visitante em cidades históricas',
              'Deve focar-se exclusivamente em maximizar os lucros do alojamento',
              'Deve eliminar os transportes aéreos a nível mundial'
            ],
            correctOptionIndex: 0,
            explanation: 'O turismo sustentável procura o equilíbrio tríplice entre viabilidade económica, equidade social e preservação ambiental para as gerações futuras.'
          }
        ]
      }
    ]
  },
  {
    id: 'isag-gt202',
    code: 'GT202',
    name: 'Língua Espanhola I',
    semester: 1,
    credits: 6,
    description: 'Aquisicão de competências de comunicação oral, escrita e gramatical em língua espanhola direcionadas para o acolhimento profissional no setor do turismo.',
    modules: [
      {
        id: 'mod-gt202-l1',
        subjectId: 'isag-gt202',
        level: 1,
        title: 'Nível 1: Primer Contacto, Léxico y Presentaciones',
        topics: [
          'Características del discurso oral en el entorno turístico e hoteleiro',
          'Fórmulas de saludo, cortesía y tratamiento formal (Usted / Ustedes)',
          'Gramática: Pronombres personales tónicos, alfabeto e fonética española',
          'Verbos en Presente de Indicativo: Ser, Tener, Llamarse, Apellidarse',
          'Concordancia de género y número, artículos y numerales'
        ],
        quizQuestions: [
          {
            id: 'q-gt202-l1-1',
            question: '¿Cuál es la fórmula formal de tratamiento de cortesía en español para un cliente en recepción?',
            options: [
              'Usted (singular) / Ustedes (plural)',
              'Tú (singular) / Vosotros (plural)',
              'Vos (singular)',
              'Güey / Tío'
            ],
            correctOptionIndex: 0,
            explanation: 'En el contexto profesional del turismo en español, se utiliza siempre "Usted" o "Ustedes" para mantener el tratamiento formal de cortesía.'
          }
        ]
      },
      {
        id: 'mod-gt202-l2',
        subjectId: 'isag-gt202',
        level: 2,
        title: 'Nível 2: Rutinas Profesionales & La Hora',
        topics: [
          'Experiencias cotidianas y medios de comunicación en el sector',
          'Expresión de la hora, horarios de apertura y hábitos profesionales',
          'Verbos regulares e irregulares de uso frecuente en Presente',
          'Verbos reflexivos en rutinas de trabajo hoteleiro',
          'Pronombres interrogativos para la gestión de datos de clientes'
        ],
        quizQuestions: [
          {
            id: 'q-gt202-l2-1',
            question: '¿Cómo se pregunta formalmente la hora de entrada al hotel (check-in)?',
            options: [
              '¿A qué hora es la entrada al hotel?',
              '¿Dónde está la hora?',
              '¿Cuántos relojes tiene el hotel?',
              '¿A qué hora te vas?'
            ],
            correctOptionIndex: 0,
            explanation: '"¿A qué hora es...?" es la estructura correcta en español para consultar horarios de servicios e instalaciones.'
          }
        ]
      },
      {
        id: 'mod-gt202-l3',
        subjectId: 'isag-gt202',
        level: 3,
        title: 'Nível 3: Expresión de Gustos, Servicios y Comparación',
        topics: [
          'Técnicas de producción textual para correos electrónicos de reserva',
          'Verbo "Soler" + Infinitivo para expresar costumbres turísticas',
          'Perífrasis "Estar + Gerundio" para acciones en desarrollo',
          'Verbos de preferencia: Gustar, Encantar, Odiar, Preferir',
          'Estructuras de comparación de servicios hoteleiros'
        ],
        quizQuestions: [
          {
            id: 'q-gt202-l3-1',
            question: '¿Cuál es la forma correcta para decir que a los clientes les agrada el desayuno del hotel?',
            options: [
              'A los clientes les gusta el desayuno del hotel',
              'Los clientes gustan el desayuno',
              'A los clientes gustan del desayuno',
              'A los clientes le gusta el desayuno'
            ],
            correctOptionIndex: 0,
            explanation: 'El verbo "gustar" concuerda en tercera persona singular ("gusta") con el sujeto posterior ("el desayuno"), usando el pronombre "les".'
          }
        ]
      },
      {
        id: 'mod-gt202-l4',
        subjectId: 'isag-gt202',
        level: 4,
        title: 'Nível 4: Pretérito Perfecto & Competencia Cultural Hispana',
        topics: [
          'Uso del Pretérito Perfecto de Indicativo para actividades turísticas realizadas',
          'Colocación de pronombres átonos de Objeto Directo e Indirecto (CD y CI)',
          'Introducción al comportamiento sociocultural e intercultural de los países hispanohablantes',
          'Simulación de atención al cliente ibérico en la ciudad del Porto'
        ],
        quizQuestions: [
          {
            id: 'q-gt202-l4-1',
            question: '¿Qué estructura corresponde al Pretérito Perfecto de Indicativo en español?',
            options: [
              'Verbo Haber en presente + Participio pasado (ej: "He visitado la bodega")',
              'Verbo Estar + Gerundio (ej: "Estoy visitando")',
              'Verbo Tener + Infinitivo (ej: "Tengo visitar")',
              'Verbo Ir a + Infinitivo (ej: "Voy a visitar")'
            ],
            correctOptionIndex: 0,
            explanation: 'El Pretérito Perfecto compuesto se forma con el auxiliar "haber" en presente seguido del participio invariable (he, has, ha, hemos, habéis, han + participio).'
          }
        ]
      }
    ]
  },
  {
    id: 'isag-gt203',
    code: 'GT203',
    name: 'Língua Inglesa I',
    semester: 1,
    credits: 6,
    description: 'English for tourism and professional business context: workplace communications, international entrepreneurship, marketing and technical vocabulary.',
    modules: [
      {
        id: 'mod-gt203-l1',
        subjectId: 'isag-gt203',
        level: 1,
        title: 'Nível 1: English for the World of Work & Job Applications',
        topics: [
          'English in the workplace: rights, duties, and professional ethics',
          'Daily routines, job roles, and tourism business sectors',
          'Writing professional CVs (Resumes) and Cover Letters in English',
          'Formal job applications and professional interview vocabulary'
        ],
        quizQuestions: [
          {
            id: 'q-gt203-l1-1',
            question: 'Which section of a professional CV outlines your previous roles and responsibilities?',
            options: [
              'Work Experience / Employment History',
              'Personal Hobbies',
              'Marital Status',
              'References Available Upon Request'
            ],
            correctOptionIndex: 0,
            explanation: 'The "Work Experience" or "Employment History" section details past employment, job titles, and professional achievements.'
          }
        ]
      },
      {
        id: 'mod-gt203-l2',
        subjectId: 'isag-gt203',
        level: 2,
        title: 'Nível 2: International Entrepreneurship & Elevator Pitches',
        topics: [
          'Definition and concepts of international tourism entrepreneurship',
          'Case studies of famous global hospitality entrepreneurs',
          'Opportunities for young entrepreneurs in European tourism',
          'Delivering professional business presentations and pitches in English'
        ],
        quizQuestions: [
          {
            id: 'q-gt203-l2-1',
            question: 'What is a key feature of a professional "Elevator Pitch" in business English?',
            options: [
              'A concise, persuasive presentation of a business idea in under two minutes',
              'A written 50-page legal contract',
              'An informal chat about the weather',
              'A technical description of hotel plumbing'
            ],
            correctOptionIndex: 0,
            explanation: 'An elevator pitch is a brief, highly focused presentation designed to spark interest in a business concept or project quickly.'
          }
        ]
      },
      {
        id: 'mod-gt203-l3',
        subjectId: 'isag-gt203',
        level: 3,
        title: 'Nível 3: International Marketing & Digital Media',
        topics: [
          '21st-century communication technologies in destination marketing',
          'Pros and cons of social media channels for hospitality brands',
          'Advertising strategies and promotional campaigns in English',
          'Grammar focus: Passive Voice and Relative Clauses in press releases'
        ],
        quizQuestions: [
          {
            id: 'q-gt203-l3-1',
            question: 'Why is the Passive Voice frequently used in formal tourism promotional texts (e.g. "The hotel was awarded 5 stars")?',
            options: [
              'To emphasize the action or achievement rather than who performed it',
              'Because English grammar forbids active verbs',
              'To make the sentence longer and harder to understand',
              'Only when talking about ancient history'
            ],
            correctOptionIndex: 0,
            explanation: 'In business and marketing English, the passive voice places focus on the recipient or object of the action for formal, objective tone.'
          }
        ]
      },
      {
        id: 'mod-gt203-l4',
        subjectId: 'isag-gt203',
        level: 4,
        title: 'Nível 4: Advanced Hospitality Terms & Specialised Industry Analysis',
        topics: [
          'Grammar & Lexicon: Verb tenses, modal verbs for courtesy, and professional registers',
          'Specific industry terms: Front-Desk operations, booking terms, and refund policies',
          'Analyzing articles from international travel publications (TTG, Skift, Phocuswire)',
          'Simulated Front-Office customer service dialogues in ISAG case scenarios'
        ],
        quizQuestions: [
          {
            id: 'q-gt203-l4-1',
            question: 'Which modal verb is most appropriate for offering courteous assistance to an international hotel guest?',
            options: [
              'May I assist you with your luggage, Sir?',
              'You must give me your bags now!',
              'You should carry those bags yourself.',
              'I have to take your bags.'
            ],
            correctOptionIndex: 0,
            explanation: '"May I..." or "How may I help you?" represents the highest level of professional courtesy in hospitality English.'
          }
        ]
      }
    ]
  },
  {
    id: 'isag-gt201',
    code: 'GT201',
    name: 'Gestão de Organizações e Empresas Turísticas',
    semester: 1,
    credits: 6,
    description: 'Funcionamento estrutural, operacional e estratégico das empresas turísticas, hoteleiras e de restauração no ecossistema de acolhimento em Portugal.',
    modules: [
      {
        id: 'mod-gt201-l1',
        subjectId: 'isag-gt201',
        level: 1,
        title: 'Nível 1: Estrutura Organizacional e Front-Office Hoteleiro',
        topics: [
          'Organograma e departamentos de uma empresa turística e hoteleira',
          'Ciclo do Hóspede (Pré-reserva, Check-in, Estadia, Check-out e Faturação)',
          'Sistemas de Gestão Hoteleira (PMS - Property Management System)',
          'Indicadores operacionais: Taxa de Ocupação (TO), ADR e RevPAR'
        ],
        quizQuestions: [
          {
            id: 'q-gt201-l1-1',
            question: 'Qual é a fórmula correta do RevPAR na gestão hoteleira?',
            options: [
              'RevPAR = ADR × Taxa de Ocupação (%)',
              'RevPAR = Total de Quartos ÷ Preço da Refeição',
              'RevPAR = Salários da Receção × 30 dias',
              'RevPAR = Lucro Líquido + IVA'
            ],
            correctOptionIndex: 0,
            explanation: 'O RevPAR (Revenue Per Available Room) calcula-se multiplicando a tarifa média diária (ADR) pela taxa de ocupação percentual.'
          }
        ]
      },
      {
        id: 'mod-gt201-l2',
        subjectId: 'isag-gt201',
        level: 2,
        title: 'Nível 2: Gestão de F&B e Governança Operacional',
        topics: [
          'Gestão da secção de Housekeeping e controlo de lençaria e amenities',
          'Rácios de custos de Food & Beverage (F&B) e margens operacionais',
          'Implementação das normas HACCP na restauração turística',
          'Qualidade de serviço e gestão diplomática de reclamações'
        ],
        quizQuestions: [
          {
            id: 'q-gt201-l2-1',
            question: 'O que garante o sistema HACCP numa empresa de restauração turística?',
            options: [
              'A segurança alimentar através da identificação e controlo de pontos críticos de perigo',
              'A escolha da decoração das mesas do restaurante',
              'O preço dos vinhos na ementa',
              'O fardamento dos empregados de mesa'
            ],
            correctOptionIndex: 0,
            explanation: 'O HACCP (Hazard Analysis and Critical Control Points) é um sistema preventivo obrigatorio para garantir a higiene e inocuidade dos alimentos.'
          }
        ]
      },
      {
        id: 'mod-gt201-l3',
        subjectId: 'isag-gt201',
        level: 3,
        title: 'Nível 3: Marketing e Distribuição Hoteleira Avançada',
        topics: [
          'Canais de distribuição: Direct Booking, OTAs (Booking/Expedia) e GDS',
          'Paridade tarifária e estratégias de comissionamento de vendas',
          'Gestão da reputação online e reviews em plataformas digitais',
          'Políticas de cancelamento, overbooking e gestão de no-shows'
        ]
      },
      {
        id: 'mod-gt201-l4',
        subjectId: 'isag-gt201',
        level: 4,
        title: 'Nível 4: Estratégia de Negócio & Mestria de Exame ISAG',
        topics: [
          'Elaboração do Orçamento Operacional e Controlo Orçamental Hoteleiro',
          'Liderança de equipas e gestão de recursos humanos na hospitalidade',
          'Sustentabilidade ambiental e certificações ecológicas (Green Key)',
          'Estudo de caso executivo: Plano estratégico de um hotel na Região Norte'
        ]
      }
    ]
  },
  {
    id: 'isag-gt206',
    code: 'GT206',
    name: 'Criação de Produtos e Experiências Turísticas',
    semester: 2,
    credits: 6,
    description: 'Design de experiências turísticas memoráveis, empacotamento de serviços, precificação (pricing) e marketing de circuitos na Região Norte de Portugal.',
    modules: [
      {
        id: 'mod-gt206-l1',
        subjectId: 'isag-gt206',
        level: 1,
        title: 'Nível 1: Estruturação e Conceção de Roteiros',
        topics: [
          'Metodologia de design de experiências turísticas e Storytelling',
          'Identificação de recursos endógenos e atrativos territoriais',
          'Elaboração de itinerários temáticos passo a passo',
          'Análise de viabilidade operacional e parcerias com fornecedores'
        ]
      },
      {
        id: 'mod-gt206-l2',
        subjectId: 'isag-gt206',
        level: 2,
        title: 'Nível 2: Precificação (Pricing) e Custos Operacionais',
        topics: [
          'Cálculo de custos fixos e variáveis de um pacote turístico',
          'Aplicação de Markup, margens de lucro e Preço de Venda ao Público (PVP)',
          'Breakeven point (ponto de equilíbrio) de um circuito turístico',
          'Negociação de tarifas net e comissões com agências de viagens'
        ]
      },
      {
        id: 'mod-gt206-l3',
        subjectId: 'isag-gt206',
        level: 3,
        title: 'Nível 3: Comercialização e Parcerias Digitais',
        topics: [
          'Distribuição através de OTAs de experiências (Viator, GetYourGuide)',
          'Marketing de conteúdos e brochuras promocionais para circuitos',
          'Gestão de parcerias com restaurantes, monumentos e artesãos locais'
        ]
      },
      {
        id: 'mod-gt206-l4',
        subjectId: 'isag-gt206',
        level: 4,
        title: 'Nível 4: Testagem de Protótipos e Mestria no ISAG',
        topics: [
          'Execução de testes piloto de itinerários (Fam Trips)',
          'Avaliação da satisfação do cliente e métricas de net promoter score (NPS)',
          'Apresentação e defesa do projeto de produto turístico perante júri'
        ]
      }
    ]
  },
  {
    id: 'isag-gt207',
    code: 'GT207',
    name: 'Enogastronomia',
    semester: 2,
    credits: 5,
    description: 'Valorização do património gastronómico e vitivinícola de Portugal: Alto Douro Vinhateiro, Vinho do Porto, Vinhos Verdes e rotas enoturísticas.',
    modules: [
      {
        id: 'mod-gt207-l1',
        subjectId: 'isag-gt207',
        level: 1,
        title: 'Nível 1: Regiões Demarcadas e Castas Portuguesas',
        topics: [
          'As Regiões Demarcadas de Portugal: Douro, Vinhos Verdes, Dão e Alentejo',
          'História e processo produtivo do Vinho do Porto e Vinho de Madeira',
          'Castas autóctones portuguesas principais (Touriga Nacional, Alvarinho, etc.)'
        ]
      },
      {
        id: 'mod-gt207-l2',
        subjectId: 'isag-gt207',
        level: 2,
        title: 'Nível 2: Provas Organolépticas e Harmonização',
        topics: [
          'Metodologia técnica de análise sensorial de vinhos (Wine Tasting)',
          'Princípios de harmonização entre vinhos e gastronomia tradicional',
          'Serviço de vinhos, temperatura correta e decantação em restauração'
        ]
      },
      {
        id: 'mod-gt207-l3',
        subjectId: 'isag-gt207',
        level: 3,
        title: 'Nível 3: Rotas Enoturísticas e Quintas do Douro',
        topics: [
          'Conceção de visitas guiadas a caves e quintas vinhateiras',
          'Análise das Rotas dos Vinhos da Região Norte (Rota dos Vinhos Verdes, Rota do Douro)',
          'Integração de refeições vínicas e provas com harmonização regional'
        ]
      },
      {
        id: 'mod-gt207-l4',
        subjectId: 'isag-gt207',
        level: 4,
        title: 'Nível 4: Gestão do Enoturismo Executivo',
        topics: [
          'Estratégias de venda de vinho nas lojas de quinta (Cellar Door Sales)',
          'Tendências do turismo enogastronómico mundial e sustentabilidade vitivinícola'
        ]
      }
    ]
  },
  {
    id: 'isag-gt208',
    code: 'GT208',
    name: 'Geografia e Ordenamento em Turismo',
    semester: 2,
    credits: 5,
    description: 'Análise espacial de destinos turísticos, acessibilidades, capacidade de carga, planeamento do território e ordenamento sustentável.',
    modules: [
      {
        id: 'mod-gt208-l1',
        subjectId: 'isag-gt208',
        level: 1,
        title: 'Nível 1: A Geografia Turística de Portugal',
        topics: [
          'Principais polos e regiões turísticas continentais e insulares de Portugal',
          'Recursos turísticos naturais e paisagísticos da Região Norte',
          'Análise da rede de acessibilidades (Aeroporto Francisco Sá Carneiro, Porto Leixões, Ferrovias)'
        ]
      },
      {
        id: 'mod-gt208-l2',
        subjectId: 'isag-gt208',
        level: 2,
        title: 'Nível 2: Capacidade de Carga e Overtourism',
        topics: [
          'Conceito e cálculo da Capacidade de Carga Turística (física, ecológica e social)',
          'Fenómenos de sobreturismo (Overtourism) e gestão de fluxos em centros históricos',
          'Sistemas de Informação Geográfica (SIG) aplicados ao turismo'
        ]
      },
      {
        id: 'mod-gt208-l3',
        subjectId: 'isag-gt208',
        level: 3,
        title: 'Nível 3: Instrumentos de Gestão Territorial',
        topics: [
          'Planos Diretores Municipais (PDM) e Ordenamento do Território Turístico',
          'Gestão Integrada de Zonas Costeiras (POOC) e Parques Naturais (Peneda-Gerês)',
          'Reabilitação urbana e sustentabilidade em destinos saturados'
        ]
      },
      {
        id: 'mod-gt208-l4',
        subjectId: 'isag-gt208',
        level: 4,
        title: 'Nível 4: Planeamento Estratégico de Destinos',
        topics: [
          'Elaboração de Planos de Desenvolvimento Turístico Sustentável',
          'Defesa de estudo prático de ordenamento de um concelho da Região Norte'
        ]
      }
    ]
  },
  {
    id: 'isag-gt209',
    code: 'GT209',
    name: 'História da Arte, Etnografia e Património',
    semester: 2,
    credits: 6,
    description: 'Património cultural material e imaterial do Norte de Portugal, Centro Histórico do Porto (UNESCO), estilos artísticos e tradições populares.',
    modules: [
      {
        id: 'mod-gt209-l1',
        subjectId: 'isag-gt209',
        level: 1,
        title: 'Nível 1: Património do Porto UNESCO',
        topics: [
          'História urbana do Porto e candidatura UNESCO de 1996',
          'Monumentos principais: Sé Catedral, Palácio da Bolsa, Torre dos Clérigos',
          'A Ponte Luiz I e o Mosteiro da Serra do Pilar'
        ]
      },
      {
        id: 'mod-gt209-l2',
        subjectId: 'isag-gt209',
        level: 2,
        title: 'Nível 2: Estilos Artísticos na Região Norte',
        topics: [
          'A Rota do Românico no Norte de Portugal',
          'O estilo Gótico e Manuelino em edifícios religiosos',
          'O Barroco Joanino e a obra de Nicolau Nasoni no Porto'
        ]
      },
      {
        id: 'mod-gt209-l3',
        subjectId: 'isag-gt209',
        level: 3,
        title: 'Nível 3: Azulejaria, Etnografia e Imaterial',
        topics: [
          'A arte do azulejo em Portugal (Estação de São Bento, Igrejas do Carmo e Almas)',
          'Festividades populares: O São João do Porto e festas tradicionais',
          'Gastronomia tradicional e artesanato como património imaterial'
        ]
      },
      {
        id: 'mod-gt209-l4',
        subjectId: 'isag-gt209',
        level: 4,
        title: 'Nível 4: Interpretação e Gestão de Fluxos Museológicos',
        topics: [
          'Técnicas de interpretação patrimonial para guias intérpretes',
          'Gestão de bilheteira e acessibilidades em museus e monumentos do Porto'
        ]
      }
    ]
  },
  {
    id: 'isag-gt210',
    code: 'GT210',
    name: 'Língua Espanhola II',
    semester: 2,
    credits: 4,
    description: 'Aprofundamento da fluência em espanhol para negociação comercial, guiamento de grupos turísticos e comunicação promocional.',
    modules: [
      {
        id: 'mod-gt210-l1',
        subjectId: 'isag-gt210',
        level: 1,
        title: 'Nível 1: Guiamento y Narración Técnica en Español',
        topics: [
          'Vocabulario técnico para la explicación de monumentos e itinerarios',
          'Expresión de causas, consecuencias y conectores de discurso narrativo',
          'Simulación de visitas guiadas por el casco histórico del Porto'
        ]
      },
      {
        id: 'mod-gt210-l2',
        subjectId: 'isag-gt210',
        level: 2,
        title: 'Nível 2: Negociación Comercial con Operadores Ibéricos',
        topics: [
          'Gestión de reuniones comerciales con agencias de viajes españolas',
          'Elaboración de presupuestos, tarifas de grupo y condiciones de reserva',
          'Redacción de correspondencia comercial formal en español'
        ]
      },
      {
        id: 'mod-gt210-l3',
        subjectId: 'isag-gt210',
        level: 3,
        title: 'Nível 3: Resolución de Imprevistos & Reclamaciones',
        topics: [
          'Manejo diplomático de quejas y reclamaciones de clientes hispanohablantes',
          'Vocabulario de imprevistos, emergencias médicas y pérdida de equipaje'
        ]
      },
      {
        id: 'mod-gt210-l4',
        subjectId: 'isag-gt210',
        level: 4,
        title: 'Nível 4: Maestría y Presentación del Destino Norte',
        topics: [
          'Presentación oral completa de un paquete turístico en español ante un jurado',
          'Dominio de los tiempos del pasado (Indefinido vs. Imperfecto) en la narración'
        ]
      }
    ]
  },
  {
    id: 'isag-gt211',
    code: 'GT211',
    name: 'Língua Inglesa II',
    semester: 2,
    credits: 4,
    description: 'Advanced professional English: contract negotiations, online reputation management, digital media campaigns and crisis communication.',
    modules: [
      {
        id: 'mod-gt211-l1',
        subjectId: 'isag-gt211',
        level: 1,
        title: 'Nível 1: Contract Negotiations & Allotment Agreements',
        topics: [
          'Negotiation phrasing for tour operator allotment contracts',
          'Discussing net rates, rack rates, and commission percentages',
          'Drafting professional business proposals in English'
        ]
      },
      {
        id: 'mod-gt211-l2',
        subjectId: 'isag-gt211',
        level: 2,
        title: 'Nível 2: Online Reputation & Customer Reviews',
        topics: [
          'Managing online reviews on TripAdvisor, Google, and Booking.com',
          'Writing diplomatic responses to negative guest feedback in English',
          'Tone of voice, empathy, and brand reputation management'
        ]
      },
      {
        id: 'mod-gt211-l3',
        subjectId: 'isag-gt211',
        level: 3,
        title: 'Nível 3: Digital Marketing Campaigns & Press Releases',
        topics: [
          'Creating English promotional copy for digital ads and social media',
          'Writing formal press releases for international travel trade publications'
        ]
      },
      {
        id: 'mod-gt211-l4',
        subjectId: 'isag-gt211',
        level: 4,
        title: 'Nível 4: Crisis Communication & Final Mastery',
        topics: [
          'Handling crisis situations, flight cancellations, and emergency protocols in English',
          'Final professional oral defense of a tourism marketing strategy'
        ]
      }
    ]
  }
];

export const SAMPLE_INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-gt205-l1-doc',
    subjectId: 'isag-gt205',
    subjectName: 'Economia do Turismo',
    moduleId: 'mod-gt205-l1',
    moduleTitle: 'Nível 1: Princípios Fundamentais & Procura Turística',
    title: 'Princípios da Procura e Elasticidade-Preço no Setor Turístico',
    estimatedReadTimeMinutes: 5,
    createdAt: new Date().toISOString(),
    paragraphs: [
      {
        number: 1,
        title: '1. Contexto & Enquadramento Conceitual',
        content: 'Na ciência económica aplicada ao turismo, a procura turística representa a quantidade total de serviços e bens que os viajantes estão dispostos a adquirir a determinados níveis de preço num determinado período. Compreender o comportamento dos consumidores é vital para os gestores turísticos em Portugal, uma vez que a tomada de decisão de viagem é influenciada pelo rendimento disponível, tempo livre de lazer e expetativas de utilidade.',
        keyTerms: ['procura turística', 'quantidade procurada', 'rendimento disponível', 'utilidade']
      },
      {
        number: 2,
        title: '2. Fundamentos Teóricos e Conceitos-Chave',
        content: 'O conceito de Elasticidade-Preço da Procura (EPP) mede o grau de sensibilidade da quantidade procurada em resposta a uma variação no preço do serviço turístico. Quando a EPP é superior a 1 em valor absoluto, a procura é classificada como elástica, significando que pequenos aumentos de preço reduzem substancialmente as vendas. No turismo de lazer, a procura tende a ser altamente elástica devido à existência de destinos concorrentes substitutos.',
        keyTerms: ['elasticidade-preço', 'procura elástica', 'destinos substitutos', 'EPP']
      },
      {
        number: 3,
        title: '3. Aplicação Prática no Setor Turístico em Portugal',
        content: 'Na Região Norte de Portugal e em particular na oferta hoteleira e de restauração do Porto, a elasticidade manifesta-se de forma distinta entre o turismo corporativo (MICE) e o turismo de férias. Enquanto as viagens de negócios apresentam uma procura mais inelástica durante os dias da semana, as estadias de fim de semana na Baixa do Porto reagem fortemente a variações de tarifa, obrigando as unidades a praticar preços dinâmicos de Revenue Management.',
        keyTerms: ['Porto', 'MICE vs Lazer', 'preços dinâmicos', 'Revenue Management']
      },
      {
        number: 4,
        title: '4. Análise Crítica e Desafios Atuais',
        content: 'A sensibilidade da procura a fatores conjunturais, como taxas de inflação, volatilidade cambial e custos dos combustíveis de aviação, representa um desafio permanente para as empresas nacionais. O aumento inflacionário nos custos de vida reduz o poder de compra das famílias, provocando contrações rápidas nas viagens internacionais e desviando fluxos para o turismo interno.',
        keyTerms: ['inflação', 'poder de compra', 'turismo interno', 'volatilidade']
      },
      {
        number: 5,
        title: '5. Síntese e Pontos de Retenção para Exames',
        content: 'Para as frequências do ISAG em Economia do Turismo, fixe que a procura turística é altamente sensível a variações de preço e rendimento. Lembre-se de que bens turísticos de lazer são bens superiores/de luxo com elasticidade-rendimento positiva superior a 1, e que a aplicação de tarifários dinâmicos permite otimizar a receita global do alojamento.',
        keyTerms: ['EPP > 1', 'bens de luxo', 'tarifários dinâmicos', 'Fixação para Exames']
      }
    ]
  },
  {
    id: 'lesson-gt204-l1-doc',
    subjectId: 'isag-gt204',
    subjectName: 'Princípios de Turismo',
    moduleId: 'mod-gt204-l1',
    moduleTitle: 'Nível 1: Conceitos, Classificações e Evolução Histórica',
    title: 'Conceitos do Sujeito Turístico e Evolução Histórica em Portugal',
    estimatedReadTimeMinutes: 5,
    createdAt: new Date().toISOString(),
    paragraphs: [
      {
        number: 1,
        title: '1. Contexto & Enquadramento Conceitual',
        content: 'A ciência turística estabeleceu critérios internacionais padronizados para classificar os fluxos de mobilidade humana. Segundo as diretrizes da UN Tourism (Organização Mundial do Turismo), um visitante é qualquer pessoa que viaje para um local fora do seu ambiente habitual por uma duração inferior a doze meses consecutivos, desde que a finalidade principal não seja o exercício de uma atividade remunerada no local visitado.',
        keyTerms: ['UN Tourism', 'visitante', 'ambiente habitual', 'mobilidade']
      },
      {
        number: 2,
        title: '2. Fundamentos Teóricos e Conceitos-Chave',
        content: 'A distinção fundamental assenta na duração da permanência: se o visitante pernoita pelo menos uma noite num meio de alojamento coletivo ou privado no destino, é classificado como Turista; se a deslocação não envolve pernoita (visita de um dia com regresso no mesmo dia), é considerado um Excursionista. Além disso, o turismo divide-se formalmente em Interno (Domestic), Recetivo (Inbound) e Emissor (Outbound).',
        keyTerms: ['turista', 'excursionista', 'pernoita', 'inbound', 'outbound', 'domestic']
      },
      {
        number: 3,
        title: '3. Aplicação Prática no Setor Turístico em Portugal',
        content: 'Em Portugal e com grande destaque no polo recetivo da Região do Porto e Norte, os navios de cruzeiro que atracam no Terminal de Leixões trazem diariamente milhares de excursionistas que exploram o Centro Histórico do Porto durante poucas horas, enquanto os passageiros que chegam ao Aeroporto Francisco Sá Carneiro tendem a ser turistas com permanência média de 2,5 noites.',
        keyTerms: ['Porto e Norte', 'Terminal de Leixões', 'excursionistas de cruzeiro', 'estadia média']
      },
      {
        number: 4,
        title: '4. Análise Crítica e Desafios Atuais',
        content: 'Embora os excursionistas contribuam para a restauração e comércio local, a elevada concentração horária em áreas patrimoniais sensíveis pode gerar sobrelotação sem gerar receita de alojamento hoteleiro. A gestão equilibrada exige integrar estratégias de bilheteira prévia e incentivo à pernoita prolongada em concelhos do interior.',
        keyTerms: ['sobrelotação', 'receita hoteleira', 'descentralização', 'pernoita prolongada']
      },
      {
        number: 5,
        title: '5. Síntese e Pontos de Retenção para Exames',
        content: 'Em resumo, memorize para as provas no ISAG: Turista = com pernoita (≥ 24h); Excursionista = sem pernoita (< 24h). O Turismo Recetivo (Inbound) representa os não residentes que visitam Portugal e constitui uma das principais fontes de divisas e criação de emprego no país.',
        keyTerms: ['Turista vs Excursionista', 'Inbound', 'Divisas', 'Síntese de Exame']
      }
    ]
  }
];
