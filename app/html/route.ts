import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Статическая HTML-версия лендинга (без React/Next), отдаётся по /html.
// Сам файл лежит в public/timeweb.html — он же доступен напрямую как /timeweb.html.
export async function GET() {
  const html = await readFile(join(process.cwd(), "public", "timeweb.html"), "utf8");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
