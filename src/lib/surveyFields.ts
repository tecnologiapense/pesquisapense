// Fonte única de verdade para os campos da pesquisa.
// Usado para renderizar o form, validar no servidor (route.ts) e montar
// a linha enviada ao Google Sheets (mesma ordem do cabeçalho em
// google-apps-script/Code.gs — se adicionar/remover uma pergunta aqui,
// repita a mudança lá).

export type SurveyFieldType = "text" | "tel" | "email" | "textarea" | "single" | "multi";

export type SurveyFieldOption = {
  value: string;
  label: string;
  isOther?: boolean; // exibe um campo de texto livre quando selecionado
};

export type SurveyField = {
  key: string; // chave salva no Supabase (answers.<key>) — não mudar após publicar
  label: string;
  type: SurveyFieldType;
  required: boolean;
  placeholder?: string;
  options?: SurveyFieldOption[];
  maxSelections?: number; // apenas para type "multi"
};

export const LEAD_FIELDS: SurveyField[] = [
  {
    key: "nome",
    label: "Nome completo",
    type: "text",
    required: true,
    placeholder: "Digite seu nome completo",
  },
  {
    key: "whatsapp",
    label: "WhatsApp",
    type: "tel",
    required: true,
    placeholder: "(DDD) 00000-0000",
  },
  {
    key: "email",
    label: "E-mail",
    type: "email",
    required: true,
    placeholder: "seuemail@exemplo.com",
  },
];

export const QUESTION_FIELDS: SurveyField[] = [
  {
    key: "tentativas",
    label: "1. Quantas vezes você realizou a prova do Revalida até conseguir a aprovação?",
    type: "single",
    required: true,
    options: [
      { value: "1a", label: "1ª tentativa" },
      { value: "2a", label: "2ª tentativa" },
      { value: "3a", label: "3ª tentativa" },
      { value: "4a", label: "4ª tentativa" },
      { value: "5a_mais", label: "5 ou mais tentativas" },
    ],
  },
  {
    key: "empresas_conhecidas",
    label:
      "2. Antes de iniciar seus estudos, quais empresas/cursos de preparação para revalidação você conhecia?",
    type: "multi",
    required: true,
    options: [
      { value: "pense", label: "Pense Revalida" },
      { value: "medway", label: "Medway" },
      { value: "medcof", label: "MedCof" },
      { value: "medcel", label: "Medcel" },
      { value: "estrategia_med", label: "Estratégia MED" },
      { value: "presenciais", label: "Cursinhos presenciais" },
      { value: "autonomos", label: "Professores/autônomos" },
      { value: "nenhuma", label: "Não conhecia nenhuma empresa específica" },
      { value: "outro", label: "Outro", isOther: true },
    ],
  },
  {
    key: "conhecia_pense",
    label: "3. Você conhecia o Pense Revalida antes de escolher onde estudar?",
    type: "single",
    required: true,
    options: [
      { value: "bastante", label: "Sim, conhecia bastante" },
      { value: "pouco", label: "Sim, mas conhecia pouco" },
      { value: "ouvido_falar", label: "Já tinha ouvido falar, mas não conhecia o suficiente" },
      { value: "nao_conhecia", label: "Não conhecia" },
    ],
  },
  {
    key: "onde_preparou",
    label: "4. Onde você realizou sua preparação principal para a prova?",
    type: "single",
    required: true,
    options: [
      { value: "online_especializado", label: "Curso online especializado em revalidação" },
      { value: "presencial", label: "Curso presencial" },
      { value: "mais_de_um", label: "Mais de um curso/plataforma" },
      { value: "sozinho", label: "Estudei sozinho(a)" },
      { value: "grupo_estudos", label: "Grupo de estudos" },
      { value: "aulas_particulares", label: "Aulas particulares/professores" },
      { value: "material_apostilado", label: "Material apostilado/PDFs" },
      { value: "outro", label: "Outro", isOther: true },
    ],
  },
  {
    key: "empresa_escolhida",
    label: "5. Qual empresa ou solução você escolheu para se preparar?",
    type: "text",
    required: true,
    placeholder: "Digite o nome da empresa/solução",
  },
  {
    key: "motivo_escolha",
    label: "6. Qual foi o principal motivo que levou você a escolher essa empresa/solução?",
    type: "single",
    required: true,
    options: [
      { value: "preco", label: "Preço" },
      { value: "qualidade_material", label: "Qualidade do material" },
      { value: "metodologia", label: "Metodologia de ensino" },
      { value: "professores", label: "Professores" },
      { value: "resultados", label: "Aprovação/resultados divulgados" },
      { value: "indicacao", label: "Indicação de amigos/colegas" },
      { value: "reputacao", label: "Reputação da empresa" },
      { value: "simulados", label: "Simulados e questões" },
      { value: "plataforma", label: "Plataforma/tecnologia" },
      { value: "cronograma", label: "Cronograma de estudos" },
      { value: "suporte", label: "Suporte/acompanhamento" },
      { value: "conteudo_gratuito", label: "Conteúdo gratuito nas redes sociais" },
      { value: "pagamento", label: "Condições de pagamento" },
      { value: "outro", label: "Outro", isOther: true },
    ],
  },
  {
    key: "considerou_pense",
    label: "7. Antes de escolher onde estudar, você chegou a considerar o Pense Revalida?",
    type: "single",
    required: true,
    options: [
      { value: "principal_opcao", label: "Sim, foi uma das minhas principais opções" },
      { value: "nao_serio", label: "Sim, mas não cheguei a considerar seriamente" },
      { value: "conhecia_nao_considerou", label: "Conhecia, mas não considerei" },
      { value: "nao_conhecia_epoca", label: "Não conhecia na época" },
    ],
  },
  {
    key: "motivo_outra_escolha",
    label: "8. Se você considerou o Pense Revalida, o que fez você escolher outra opção?",
    type: "multi",
    required: false,
    options: [
      { value: "preco", label: "Preço" },
      { value: "metodologia", label: "Não me identifiquei com a metodologia" },
      { value: "falta_info", label: "Não encontrei informações suficientes sobre o curso" },
      { value: "reputacao_outra", label: "Preferi outra empresa pela reputação" },
      { value: "resultados_outra", label: "Preferi outra empresa pelos resultados/aprovações" },
      { value: "professores_outra", label: "Preferi outros professores" },
      { value: "material_outra", label: "Preferi o material de outra empresa" },
      { value: "plataforma_outra", label: "Preferi outra plataforma" },
      { value: "indicacao_outra", label: "Recebi indicação de outra empresa" },
      { value: "oferta_diferente", label: "A outra empresa oferecia algo que o Pense Revalida não oferecia" },
      { value: "sem_diferenca", label: "Não percebi diferença relevante entre as opções" },
      { value: "nao_considerei", label: "Não considerei o Pense Revalida" },
      { value: "outro", label: "Outro", isOther: true },
    ],
  },
  {
    key: "fatores_importantes",
    label:
      "9. Quais são os 3 fatores mais importantes para você ao escolher uma preparação para a revalidação? (escolha até 3)",
    type: "multi",
    required: true,
    maxSelections: 3,
    options: [
      { value: "preco", label: "Preço" },
      { value: "professores", label: "Professores" },
      { value: "metodologia", label: "Metodologia" },
      { value: "material_didatico", label: "Material didático" },
      { value: "banco_questoes", label: "Banco de questões" },
      { value: "simulados", label: "Simulados" },
      { value: "resultados_aprovacao", label: "Resultados de aprovação" },
      { value: "acompanhamento", label: "Acompanhamento individual" },
      { value: "suporte", label: "Suporte ao aluno" },
      { value: "flexibilidade", label: "Flexibilidade para estudar" },
      { value: "reputacao", label: "Reputação da empresa" },
      { value: "comunidade", label: "Comunidade/grupo de alunos" },
      { value: "conteudo_gratuito", label: "Conteúdo gratuito nas redes sociais" },
      { value: "outro", label: "Outro", isOther: true },
    ],
  },
  {
    key: "sugestao_melhoria",
    label:
      "10. Se você pudesse mudar ou melhorar alguma coisa no Pense Revalida para torná-lo mais atrativo para você, o que seria?",
    type: "textarea",
    required: false,
    placeholder: "Fique à vontade para escrever sua sugestão...",
  },
];

export const ALL_FIELDS: SurveyField[] = [...LEAD_FIELDS, ...QUESTION_FIELDS];

// Cabeçalho da planilha — precisa casar com HEADER_() em google-apps-script/Code.gs
export const SHEET_HEADER = ["Data/Hora", ...ALL_FIELDS.map((f) => f.label)];
