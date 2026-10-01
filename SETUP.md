# Setup — Pesquisa de Mercado Pense Revalida

Arquitetura: Formulário (Next.js/Vercel) → API Route → Google Apps Script (grava na planilha + dashboard).

## 1. Planilha Google (Apps Script)

Planilha: https://docs.google.com/spreadsheets/d/1HU9cehcPPY87iNYj6tnb8rAlAdrlogkvPsxtij03Tyw/edit

1. Abra a planilha → menu **Extensões > Apps Script**.
2. Apague o conteúdo de `Code.gs` e cole o arquivo `google-apps-script/Code.gs` deste repositório.
3. No editor do Apps Script: ícone de engrenagem (**Configurações do projeto**) → **Propriedades do script** → **Adicionar propriedade do script**:
   - Nome: `SURVEY_TOKEN`
   - Valor: qualquer string secreta (gere uma senha longa aleatória)
4. No topo do editor, selecione a função `setup` na lista de funções e clique em **Executar**. Na primeira execução o Google vai pedir autorização de permissões — autorize.
   - Isso cria as abas **Respostas** (cabeçalho com as 3 perguntas de contato + as 10 perguntas da pesquisa) e **Dashboard** (contagens + gráficos por pergunta + seletor "ver resposta individual").
5. **Implantar > Nova implantação**:
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em Implantar e copie a **URL do Web App** (termina em `/exec`).

Guarde dois valores: a URL do Web App e o `SURVEY_TOKEN` que você definiu no passo 3.

> Sempre que adicionar/remover uma pergunta do formulário, repita a mudança em `src/lib/surveyFields.ts` **e** em `google-apps-script/Code.gs` (array `QUESTIONS`), depois rode `setup` de novo — isso recria o Dashboard, mas preserva as linhas já salvas em "Respostas".

## 2. Variáveis de ambiente

Copie `.env.local.example` para `.env.local` e preencha:

```
SHEETS_WEBHOOK_URL=...        # URL do Web App (passo 1.5)
SHEETS_WEBHOOK_TOKEN=...      # mesmo valor do SURVEY_TOKEN (passo 1.3)
```

## 3. Rodar localmente

```bash
npm install
npm run dev
```

Abra http://localhost:3000, role até o formulário e envie um teste. Confira se a linha apareceu na aba "Respostas" e se as contagens do "Dashboard" atualizaram (pode levar alguns segundos).

## 4. Deploy na Vercel

1. Importe o repositório do GitHub (`tecnologiapense/pesquisapense`) em https://vercel.com/new.
2. Em **Environment Variables**, adicione as 2 variáveis do passo 2.
3. Deploy. Qualquer novo push na branch principal gera um novo deploy automaticamente.
