# Setup — Pesquisa de Mercado Pense Revalida

Arquitetura: página estática (`index.html`) → o navegador envia o formulário direto para o Google Apps Script, que grava na planilha e alimenta o Dashboard. Sem servidor, sem build, sem variáveis de ambiente.

## 1. Planilha Google (Apps Script)

Planilha: https://docs.google.com/spreadsheets/d/1HU9cehcPPY87iNYj6tnb8rAlAdrlogkvPsxtij03Tyw/edit

1. Abra a planilha → menu **Extensões > Apps Script**.
2. Apague o conteúdo de `Code.gs` e cole o arquivo `google-apps-script/Code.gs` deste repositório.
3. No editor do Apps Script: ícone de engrenagem (**Configurações do projeto**) → **Propriedades do script** → **Adicionar propriedade do script**:
   - Nome: `SURVEY_TOKEN`
   - Valor: qualquer string secreta (gere uma senha longa aleatória)
4. No topo do editor, selecione a função `setup` na lista de funções e clique em **Executar**. Na primeira execução o Google vai pedir autorização de permissões — autorize.
   - Isso cria as abas **Respostas** (cabeçalho com as 10 perguntas da pesquisa — anônima, sem nome/contato) e **Dashboard** (contagens + gráficos por pergunta + seletor "ver resposta individual" por Data/Hora).
5. **Implantar > Nova implantação**:
   - Tipo: **Aplicativo da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   - Clique em Implantar e copie a **URL do Web App** (termina em `/exec`).

> Sempre que adicionar/remover uma pergunta, repita a mudança também no formulário em `index.html` (os `name=`/`value=` dos campos) e rode `setup` de novo — isso recria o Dashboard, mas preserva as linhas já salvas em "Respostas".

## 2. Conectar a página à planilha

Abra `index.html` e, perto do final, edite as duas constantes:

```js
var SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/XXXXXXXX/exec'; // URL do passo 1.5
var SHEETS_WEBHOOK_TOKEN = 'XXXXXXXX'; // mesmo valor do SURVEY_TOKEN do passo 1.3
```

Essas duas linhas já estão preenchidas com os valores atuais da planilha acima — só repita este passo se recriar o Web App ou trocar o token.

## 3. Rodar localmente

Como é um HTML estático, basta abrir `index.html` no navegador. Para testar o envio do formulário (alguns navegadores bloqueiam `fetch` em arquivos `file://`), suba um servidor local simples:

```bash
python3 -m http.server 8080
```

E acesse http://localhost:8080/. Envie um teste e confira se a linha apareceu na aba "Respostas" e se o "Dashboard" atualizou.

## 4. Publicar

Qualquer hospedagem de arquivo estático serve: Vercel, Netlify, GitHub Pages, ou o próprio WordPress (como um widget HTML, igual à LP original). Para Vercel: importe o repositório em https://vercel.com/new — como não há `package.json`, a Vercel detecta e publica como site estático automaticamente, sem configuração.
