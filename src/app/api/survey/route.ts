import { NextResponse } from "next/server";
import { appendToGoogleSheets } from "@/lib/sheetsSync";
import { buildSheetRow, validateSurveyPayload } from "@/lib/validateSurvey";

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido." }, { status: 400 });
  }

  const result = validateSurveyPayload(body);
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  const now = new Date();

  try {
    const row = buildSheetRow(result.payload, now.toISOString());
    await appendToGoogleSheets(row);
  } catch (sheetsError) {
    console.error("[api/survey] falha ao gravar na planilha:", sheetsError);
    return NextResponse.json(
      { ok: false, error: "Não foi possível salvar sua resposta agora. Tente novamente em instantes." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
