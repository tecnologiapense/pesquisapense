// Envia uma linha de resposta para o Web App do Apps Script, que grava na
// planilha (aba "Respostas") e alimenta o Dashboard. Ver google-apps-script/Code.gs.
// A planilha é a única fonte de verdade: se essa chamada falhar, a rota
// /api/survey propaga o erro para o usuário poder tentar reenviar.
export async function appendToGoogleSheets(values: Array<string | number>) {
  const url = process.env.SHEETS_WEBHOOK_URL;
  const token = process.env.SHEETS_WEBHOOK_TOKEN;

  if (!url || !token) {
    throw new Error(
      "SHEETS_WEBHOOK_URL/SHEETS_WEBHOOK_TOKEN não configurados (ver .env.local.example)."
    );
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, values }),
    redirect: "follow",
  });

  if (!res.ok) {
    throw new Error(`Apps Script respondeu ${res.status}: ${await res.text()}`);
  }

  const data = (await res.json()) as { ok: boolean; error?: string };
  if (!data.ok) {
    throw new Error(`Apps Script retornou erro: ${data.error ?? "desconhecido"}`);
  }
}
