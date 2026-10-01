"use client";

import { useState, type FormEvent } from "react";
import { ALL_FIELDS, LEAD_FIELDS, QUESTION_FIELDS, type SurveyField } from "@/lib/surveyFields";

type Values = Record<string, string | string[]>;

function initialValues(): Values {
  const v: Values = {};
  for (const f of ALL_FIELDS) v[f.key] = f.type === "multi" ? [] : "";
  return v;
}

function otherLabelOf(field: SurveyField): string | undefined {
  return field.options?.find((o) => o.isOther)?.label;
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <path d="M22 4 12 14.01l-3-3" />
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function FieldLabel({ field }: { field: SurveyField }) {
  return (
    <label>
      {field.label}
      {!field.required && <span style={{ color: "var(--muted-2)", fontWeight: 400 }}> (opcional)</span>}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="field-error">{message}</p>;
}

function TextField({
  field,
  value,
  error,
  onChange,
}: {
  field: SurveyField;
  value: string;
  error?: string;
  onChange: (v: string) => void;
}) {
  const isTextarea = field.type === "textarea";
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <FieldLabel field={field} />
      {isTextarea ? (
        <textarea
          rows={4}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : "text"}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={field.key === "email" ? "email" : field.key === "whatsapp" ? "tel" : "name"}
        />
      )}
      <FieldError message={error} />
    </div>
  );
}

function SingleChoiceField({
  field,
  value,
  error,
  otherText,
  onOtherText,
  onChange,
}: {
  field: SurveyField;
  value: string;
  error?: string;
  otherText: string;
  onOtherText: (t: string) => void;
  onChange: (v: string) => void;
}) {
  const otherLabel = otherLabelOf(field);
  const showOther = !!otherLabel && value === otherLabel;
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <FieldLabel field={field} />
      <div className="radio-group">
        {field.options?.map((opt) => (
          <label className="radio-option" key={opt.value}>
            <input
              type="radio"
              name={field.key}
              checked={value === opt.label}
              onChange={() => onChange(opt.label)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>
      {showOther && (
        <input
          style={{ marginTop: 10 }}
          placeholder="Qual?"
          value={otherText}
          onChange={(e) => onOtherText(e.target.value)}
        />
      )}
      <FieldError message={error} />
    </div>
  );
}

function MultiChoiceField({
  field,
  value,
  error,
  otherText,
  onOtherText,
  onToggle,
}: {
  field: SurveyField;
  value: string[];
  error?: string;
  otherText: string;
  onOtherText: (t: string) => void;
  onToggle: (label: string, checked: boolean) => void;
}) {
  const otherLabel = otherLabelOf(field);
  const showOther = !!otherLabel && value.includes(otherLabel);
  const atMax = !!field.maxSelections && value.length >= field.maxSelections;
  return (
    <div className={`field${error ? " has-error" : ""}`}>
      <FieldLabel field={field} />
      <div className="radio-group">
        {field.options?.map((opt) => {
          const checked = value.includes(opt.label);
          return (
            <label className="radio-option" key={opt.value}>
              <input
                type="checkbox"
                checked={checked}
                disabled={!checked && atMax}
                onChange={(e) => onToggle(opt.label, e.target.checked)}
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
      {showOther && (
        <input
          style={{ marginTop: 10 }}
          placeholder="Qual?"
          value={otherText}
          onChange={(e) => onOtherText(e.target.value)}
        />
      )}
      <FieldError message={error} />
    </div>
  );
}

export default function SurveyForm() {
  const [values, setValues] = useState<Values>(initialValues);
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  function setValue(key: string, v: string | string[]) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  function toggleMulti(field: SurveyField, label: string, checked: boolean) {
    const current = (values[field.key] as string[]) ?? [];
    if (checked) {
      if (field.maxSelections && current.length >= field.maxSelections) return;
      setValue(field.key, [...current, label]);
    } else {
      setValue(field.key, current.filter((v) => v !== label));
    }
  }

  function resolveOtherLabel(field: SurveyField, label: string) {
    const otherLabel = otherLabelOf(field);
    if (label === otherLabel) {
      const text = otherText[field.key]?.trim();
      return text ? `Outro: ${text}` : "Outro";
    }
    return label;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const answers: Record<string, string | string[]> = {};
    for (const field of QUESTION_FIELDS) {
      const v = values[field.key];
      if (field.type === "multi") {
        answers[field.key] = (v as string[]).map((label) => resolveOtherLabel(field, label));
      } else if (field.options) {
        answers[field.key] = v ? resolveOtherLabel(field, v as string) : "";
      } else {
        answers[field.key] = v as string;
      }
    }

    const body = {
      nome: values.nome,
      whatsapp: values.whatsapp,
      email: values.email,
      answers,
    };

    try {
      const res = await fetch("/api/survey", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        if (data.errors) setErrors(data.errors);
        setErrorMessage("Verifique os campos destacados e tente novamente.");
        setStatus("error");
        return;
      }

      setStatus("success");
      setValues(initialValues());
      setOtherText({});
    } catch {
      setErrorMessage("Não foi possível enviar. Verifique sua conexão e tente novamente.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="alert success" role="status">
        <CheckIcon />
        <span>
          Recebemos sua resposta! Nosso time vai entrar em contato pelo WhatsApp informado com os
          próximos passos dos seus benefícios exclusivos.
        </span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {status === "error" && (
        <div className="alert error" role="alert">
          <AlertIcon />
          <span>{errorMessage}</span>
        </div>
      )}

      {LEAD_FIELDS.map((field) => (
        <TextField
          key={field.key}
          field={field}
          value={values[field.key] as string}
          error={errors[field.key]}
          onChange={(v) => setValue(field.key, v)}
        />
      ))}

      {QUESTION_FIELDS.map((field) => {
        if (field.type === "text" || field.type === "tel" || field.type === "email" || field.type === "textarea") {
          return (
            <TextField
              key={field.key}
              field={field}
              value={values[field.key] as string}
              error={errors[field.key]}
              onChange={(v) => setValue(field.key, v)}
            />
          );
        }
        if (field.type === "single") {
          return (
            <SingleChoiceField
              key={field.key}
              field={field}
              value={values[field.key] as string}
              error={errors[field.key]}
              otherText={otherText[field.key] ?? ""}
              onOtherText={(t) => setOtherText((p) => ({ ...p, [field.key]: t }))}
              onChange={(v) => setValue(field.key, v)}
            />
          );
        }
        if (field.type === "multi") {
          return (
            <MultiChoiceField
              key={field.key}
              field={field}
              value={values[field.key] as string[]}
              error={errors[field.key]}
              otherText={otherText[field.key] ?? ""}
              onOtherText={(t) => setOtherText((p) => ({ ...p, [field.key]: t }))}
              onToggle={(label, checked) => toggleMulti(field, label, checked)}
            />
          );
        }
        return null;
      })}

      <button type="submit" className="btn btn-primary submit-btn" disabled={status === "submitting"}>
        {status === "submitting" ? (
          <>
            <span className="spinner" /> Enviando...
          </>
        ) : (
          "Enviar minhas respostas"
        )}
      </button>
      <p className="form-note">
        <LockIcon /> Seus dados estão seguros e serão usados apenas para esta pesquisa.
      </p>
    </form>
  );
}
