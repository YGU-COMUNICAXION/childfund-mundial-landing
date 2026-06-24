import type { APIRoute } from "astro";
import { sendLeadEmail, type LeadPayload } from "../../lib/leadEmail";

export const prerender = false;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown) =>
  typeof value === "string" ? value.trim() : "";

const parsePayload = async (request: Request) => {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json().catch(() => null)) as
      | (Partial<LeadPayload> & { company?: string })
      | null;
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return null;

  return {
    nombres: clean(formData.get("nombres")),
    apellidos: clean(formData.get("apellidos")),
    correo: clean(formData.get("correo")),
    celular: clean(formData.get("celular")),
    company: clean(formData.get("company")),
  };
};

export const POST: APIRoute = async ({ request }) => {
  const body = await parsePayload(request);

  if (!body) {
    return Response.json({ message: "Solicitud inválida" }, { status: 400 });
  }

  if (clean(body.company)) {
    return Response.json({ ok: true }, { status: 200 });
  }

  const lead: LeadPayload = {
    nombres: clean(body.nombres),
    apellidos: clean(body.apellidos),
    correo: clean(body.correo),
    celular: clean(body.celular),
  };

  const missingFields = Object.entries(lead)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missingFields.length) {
    return Response.json(
      { message: "Faltan campos obligatorios", missingFields },
      { status: 400 },
    );
  }

  if (!emailPattern.test(lead.correo)) {
    return Response.json(
      { message: "Correo inválido" },
      { status: 400 },
    );
  }

  try {
    const sent = await sendLeadEmail(lead);

    if (!sent) {
      return Response.json(
        { message: "No se pudo enviar el correo" },
        { status: 502 },
      );
    }

    return Response.json({ ok: true }, { status: 200 });
  } catch (error) {
    console.error("[leads] Error enviando correo", error);

    return Response.json(
      { message: "Error interno al enviar el formulario" },
      { status: 500 },
    );
  }
};
