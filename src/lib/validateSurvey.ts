import { ALL_FIELDS, LEAD_FIELDS, QUESTION_FIELDS, type SurveyField } from "./surveyFields";

export type SurveyAnswers = Record<string, string | string[]>;

export type SurveyPayload = {
  nome: string;
  whatsapp: string;
  email: string;
  answers: SurveyAnswers;
};

export type ValidationResult =
  | { ok: true; payload: SurveyPayload }
  | { ok: false; errors: Record<string, string> };

function isBlank(v: unknown) {
  if (v == null) return true;
  if (typeof v === "string") return v.trim().length === 0;
  if (Array.isArray(v)) return v.length === 0;
  return false;
}

function validateField(field: SurveyField, value: unknown): string | null {
  if (field.required && isBlank(value)) {
    return "Campo obrigatório.";
  }
  if (isBlank(value)) return null; // opcional e vazio, ok

  if (field.type === "multi") {
    if (!Array.isArray(value)) return "Formato inválido.";
    if (field.maxSelections && value.length > field.maxSelections) {
      return `Escolha no máximo ${field.maxSelections} opções.`;
    }
  } else if (typeof value !== "string") {
    return "Formato inválido.";
  }

  return null;
}

// body esperado: { nome, whatsapp, email, answers: { [fieldKey]: string | string[] } }
export function validateSurveyPayload(body: unknown): ValidationResult {
  const errors: Record<string, string> = {};

  if (typeof body !== "object" || body === null) {
    return { ok: false, errors: { _root: "Payload inválido." } };
  }
  const b = body as Record<string, unknown>;
  const answers = (typeof b.answers === "object" && b.answers !== null ? b.answers : {}) as Record<
    string,
    unknown
  >;

  for (const field of LEAD_FIELDS) {
    const err = validateField(field, b[field.key]);
    if (err) errors[field.key] = err;
  }
  for (const field of QUESTION_FIELDS) {
    const err = validateField(field, answers[field.key]);
    if (err) errors[field.key] = err;
  }

  if (Object.keys(errors).length > 0) {
    return { ok: false, errors };
  }

  const cleanAnswers: SurveyAnswers = {};
  for (const field of QUESTION_FIELDS) {
    const v = answers[field.key];
    if (!isBlank(v)) cleanAnswers[field.key] = v as string | string[];
  }

  return {
    ok: true,
    payload: {
      nome: String(b.nome).trim(),
      whatsapp: String(b.whatsapp).trim(),
      email: String(b.email).trim(),
      answers: cleanAnswers,
    },
  };
}

// Monta a linha na MESMA ordem de ALL_FIELDS (e de HEADER_() no Apps Script).
export function buildSheetRow(payload: SurveyPayload, timestamp: string): Array<string> {
  const row: string[] = [timestamp];
  for (const field of ALL_FIELDS) {
    const value =
      field.key === "nome" || field.key === "whatsapp" || field.key === "email"
        ? (payload as unknown as Record<string, string>)[field.key]
        : payload.answers[field.key];

    if (Array.isArray(value)) row.push(value.join("; "));
    else row.push(value ?? "");
  }
  return row;
}
