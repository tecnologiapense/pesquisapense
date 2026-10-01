/**
 * Pense Revalida — Pesquisa de Mercado
 * Apps Script vinculado à planilha de respostas.
 *
 * COMO INSTALAR (passo a passo completo também em SETUP.md):
 * 1. Abra a planilha -> Extensões -> Apps Script.
 * 2. Apague o conteúdo padrão de Code.gs e cole este arquivo inteiro.
 * 3. Em "Editor" (ícone de engrenagem) -> Propriedades do projeto ->
 *    Propriedades do script -> adicione SURVEY_TOKEN com um valor secreto
 *    à sua escolha (ex: uma senha aleatória longa).
 * 4. Rode a função `setup` uma vez (selecione no topo e clique em Executar).
 *    Na primeira vez o Google vai pedir autorização — aceite.
 *    Isso cria as abas "Respostas" e "Dashboard".
 * 5. Implantar -> Nova implantação -> tipo "Aplicativo da Web".
 *    Executar como: "Eu". Quem pode acessar: "Qualquer pessoa".
 *    Copie a URL do Web App gerada.
 * 6. Em index.html, preencha SHEETS_WEBHOOK_URL com a URL do passo 5 e
 *    SHEETS_WEBHOOK_TOKEN com o mesmo valor do SURVEY_TOKEN do passo 3.
 *
 * Sempre que adicionar/remover uma pergunta, repita a mudança também no
 * formulário em index.html e rode `setup` de novo (ela recria o Dashboard
 * do zero, mas preserva as linhas já salvas em "Respostas").
 */

const SHEET_RESPOSTAS = 'Respostas';
const SHEET_DASHBOARD = 'Dashboard';

// Mesma ordem de src/lib/surveyFields.ts -> LEAD_FIELDS
const LEAD_FIELDS = ['Nome completo', 'WhatsApp', 'E-mail'];

// Mesma ordem/labels de src/lib/surveyFields.ts -> QUESTION_FIELDS
const QUESTIONS = [
  {
    key: 'tentativas',
    label: '1. Quantas vezes você realizou a prova do Revalida até conseguir a aprovação?',
    type: 'single',
    options: ['1ª tentativa', '2ª tentativa', '3ª tentativa', '4ª tentativa', '5 ou mais tentativas'],
  },
  {
    key: 'empresas_conhecidas',
    label: '2. Antes de iniciar seus estudos, quais empresas/cursos de preparação para revalidação você conhecia?',
    type: 'multi',
    options: [
      'Pense Revalida', 'Medway', 'MedCof', 'Medcel', 'Estratégia MED',
      'Cursinhos presenciais', 'Professores/autônomos', 'Não conhecia nenhuma empresa específica',
    ],
  },
  {
    key: 'conhecia_pense',
    label: '3. Você conhecia o Pense Revalida antes de escolher onde estudar?',
    type: 'single',
    options: ['Sim, conhecia bastante', 'Sim, mas conhecia pouco', 'Já tinha ouvido falar, mas não conhecia o suficiente', 'Não conhecia'],
  },
  {
    key: 'onde_preparou',
    label: '4. Onde você realizou sua preparação principal para a prova?',
    type: 'single',
    options: [
      'Curso online especializado em revalidação', 'Curso presencial', 'Mais de um curso/plataforma',
      'Estudei sozinho(a)', 'Grupo de estudos', 'Aulas particulares/professores', 'Material apostilado/PDFs',
    ],
  },
  {
    key: 'empresa_escolhida',
    label: '5. Qual empresa ou solução você escolheu para se preparar?',
    type: 'text',
  },
  {
    key: 'motivo_escolha',
    label: '6. Qual foi o principal motivo que levou você a escolher essa empresa/solução?',
    type: 'single',
    options: [
      'Preço', 'Qualidade do material', 'Metodologia de ensino', 'Professores', 'Aprovação/resultados divulgados',
      'Indicação de amigos/colegas', 'Reputação da empresa', 'Simulados e questões', 'Plataforma/tecnologia',
      'Cronograma de estudos', 'Suporte/acompanhamento', 'Conteúdo gratuito nas redes sociais', 'Condições de pagamento',
    ],
  },
  {
    key: 'considerou_pense',
    label: '7. Antes de escolher onde estudar, você chegou a considerar o Pense Revalida?',
    type: 'single',
    options: [
      'Sim, foi uma das minhas principais opções', 'Sim, mas não cheguei a considerar seriamente',
      'Conhecia, mas não considerei', 'Não conhecia na época',
    ],
  },
  {
    key: 'motivo_outra_escolha',
    label: '8. Se você considerou o Pense Revalida, o que fez você escolher outra opção?',
    type: 'multi',
    options: [
      'Preço', 'Não me identifiquei com a metodologia', 'Não encontrei informações suficientes sobre o curso',
      'Preferi outra empresa pela reputação', 'Preferi outra empresa pelos resultados/aprovações',
      'Preferi outros professores', 'Preferi o material de outra empresa', 'Preferi outra plataforma',
      'Recebi indicação de outra empresa', 'A outra empresa oferecia algo que o Pense Revalida não oferecia',
      'Não percebi diferença relevante entre as opções', 'Não considerei o Pense Revalida',
    ],
  },
  {
    key: 'fatores_importantes',
    label: '9. Quais são os 3 fatores mais importantes para você ao escolher uma preparação para a revalidação? (escolha até 3)',
    type: 'multi',
    options: [
      'Preço', 'Professores', 'Metodologia', 'Material didático', 'Banco de questões', 'Simulados',
      'Resultados de aprovação', 'Acompanhamento individual', 'Suporte ao aluno', 'Flexibilidade para estudar',
      'Reputação da empresa', 'Comunidade/grupo de alunos', 'Conteúdo gratuito nas redes sociais',
    ],
  },
  {
    key: 'sugestao_melhoria',
    label: '10. Se você pudesse mudar ou melhorar alguma coisa no Pense Revalida para torná-lo mais atrativo para você, o que seria?',
    type: 'text',
  },
];

function HEADER_() {
  var header = ['Data/Hora'];
  LEAD_FIELDS.forEach(function (l) { header.push(l); });
  QUESTIONS.forEach(function (q) { header.push(q.label); });
  return header;
}

/** Rode uma vez (ou de novo após mudar perguntas) para (re)criar abas e dashboard. */
function setup() {
  var ss = SpreadsheetApp.getActive();
  var sheet = ss.getSheetByName(SHEET_RESPOSTAS) || ss.insertSheet(SHEET_RESPOSTAS);
  var header = HEADER_();
  sheet.getRange(1, 1, 1, header.length).setValues([header]).setFontWeight('bold');
  sheet.setFrozenRows(1);
  try { sheet.autoResizeColumns(1, header.length); } catch (e) {}

  buildDashboard_();
  SpreadsheetApp.flush();
}

function buildDashboard_() {
  var ss = SpreadsheetApp.getActive();
  var old = ss.getSheetByName(SHEET_DASHBOARD);
  if (old) { ss.deleteSheet(old); }
  var dash = ss.insertSheet(SHEET_DASHBOARD, 0);

  dash.getRange('A1').setValue('Dashboard — Pesquisa de Mercado Pense Revalida').setFontSize(16).setFontWeight('bold');
  dash.getRange('A3').setValue('Total de respostas:');
  dash.getRange('B3').setFormula('=COUNTA(' + SHEET_RESPOSTAS + '!A2:A)').setFontWeight('bold');
  dash.getRange('A4').setValue('Última resposta:');
  dash.getRange('B4').setFormula('=IFERROR(INDEX(' + SHEET_RESPOSTAS + '!A2:A;COUNTA(' + SHEET_RESPOSTAS + '!A2:A));"—")');

  var row = 7;
  var leadColCount = LEAD_FIELDS.length;

  QUESTIONS.forEach(function (q, qIdx) {
    var col = 2 + leadColCount + qIdx; // col 1 = Data/Hora, depois os LEAD_FIELDS, depois as perguntas
    var colLetter = columnToLetter_(col);

    dash.getRange(row, 1).setValue((qIdx + 1) + '. ' + q.label).setFontWeight('bold').setWrap(true);
    dash.getRange(row, 1, 1, 3).merge();
    row += 1;

    if (q.type === 'text') {
      dash.getRange(row, 1).setValue('Pergunta aberta — respostas completas na aba "Respostas", coluna ' + colLetter + '.').setFontStyle('italic');
      row += 2;
      return;
    }

    var tableStartRow = row;
    var range = SHEET_RESPOSTAS + '!' + colLetter + '2:' + colLetter;
    q.options.forEach(function (opt) {
      dash.getRange(row, 1).setValue(opt);
      var escaped = opt.replace(/"/g, '""');
      var formula = q.type === 'multi'
        ? '=SUMPRODUCT(--ISNUMBER(SEARCH("' + escaped + '";' + range + ')))'
        : '=COUNTIF(' + range + ';"' + escaped + '")';
      dash.getRange(row, 2).setFormula(formula);
      row += 1;
    });

    var chartRange = dash.getRange(tableStartRow, 1, q.options.length, 2);
    var chart = dash.newChart()
      .asColumnChart()
      .addRange(chartRange)
      .setPosition(tableStartRow, 4, 0, 0)
      .setOption('title', q.label)
      .setOption('legend', { position: 'none' })
      .setOption('width', 480)
      .setOption('height', 260)
      .build();
    dash.insertChart(chart);

    row = Math.max(row + 1, tableStartRow + 10);
  });

  dash.autoResizeColumns(1, 2);
  buildRespondentViewer_(dash, row);
}

/** Cria, mais abaixo na própria aba Dashboard, um seletor para ver a resposta completa de 1 pessoa. */
function buildRespondentViewer_(dash, startRow) {
  var ss = SpreadsheetApp.getActive();
  var resp = ss.getSheetByName(SHEET_RESPOSTAS);
  var header = HEADER_();
  var lastRow = Math.max(resp.getLastRow(), 2);

  var anchorRow = startRow + 2;
  dash.getRange(anchorRow, 1).setValue('Ver resposta individual').setFontWeight('bold').setFontSize(13);
  dash.getRange(anchorRow + 1, 1).setValue('Nome do respondente:');

  var selectorCell = dash.getRange(anchorRow + 1, 2);
  selectorCell.setDataValidation(
    SpreadsheetApp.newDataValidation()
      .requireValueInRange(resp.getRange('B2:B' + lastRow), true)
      .setAllowInvalid(true)
      .build()
  );

  var selectorA1 = selectorCell.getA1Notation();
  header.forEach(function (label, i) {
    var r = anchorRow + 3 + i;
    dash.getRange(r, 1).setValue(label);
    var colLetter = columnToLetter_(i + 1);
    dash.getRange(r, 2).setFormula(
      '=IFERROR(INDEX(' + SHEET_RESPOSTAS + '!' + colLetter + '2:' + colLetter + ';MATCH(' + selectorA1 + ';' + SHEET_RESPOSTAS + '!$B$2:$B;0));"")'
    );
  });
}

function columnToLetter_(column) {
  var letter = '';
  while (column > 0) {
    var rem = (column - 1) % 26;
    letter = String.fromCharCode(65 + rem) + letter;
    column = Math.floor((column - 1) / 26);
  }
  return letter;
}

/** Endpoint chamado direto pelo navegador (fetch em index.html) a cada novo envio do formulário. */
function doPost(e) {
  try {
    var token = PropertiesService.getScriptProperties().getProperty('SURVEY_TOKEN');
    var body = JSON.parse(e.postData.contents);

    if (!token || body.token !== token) {
      return jsonOutput_({ ok: false, error: 'invalid_token' });
    }
    if (!Array.isArray(body.values)) {
      return jsonOutput_({ ok: false, error: 'invalid_values' });
    }

    var sheet = SpreadsheetApp.getActive().getSheetByName(SHEET_RESPOSTAS);
    sheet.appendRow(body.values);
    return jsonOutput_({ ok: true });
  } catch (err) {
    return jsonOutput_({ ok: false, error: String(err) });
  }
}

function jsonOutput_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
