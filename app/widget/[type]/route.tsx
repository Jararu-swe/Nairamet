import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { type: string } }
) {
  const { searchParams } = new URL(request.url);
  const currency = (searchParams.get("currency") || "USD").toUpperCase();
  const type = params.type || "rates";

  const html = `<!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width,initial-scale=1" />
      <style>
        body { font-family: Arial, sans-serif; margin:0; padding:8px; }
        .widget { border-radius:8px; padding:12px; background:#fff; color:#0f172a; box-shadow:0 4px 12px rgba(2,6,23,0.06); width:100%; height:100%; }
        .row { display:flex; justify-content:space-between; margin-bottom:6px; }
        .label { font-size:12px; color:#64748b }
        .value { font-weight:700; font-size:16px }
      </style>
    </head>
    <body>
      <div id="root" class="widget">
        <div>Loading ${currency}…</div>
      </div>

      <script>
        async function render() {
          try {
            const res = await fetch('/api/tracker')
            const body = await res.json()
            const rates = body.rates || []
            const r = rates.find(x => String(x.currency).toUpperCase() === '${currency}') || {}
            const official = r.cbn ?? r.cbnRate ?? r.official ?? ''
            const black = r.blackMarket ?? r.black_market ?? r.rate ?? ''
            const parallel = r.parallel ?? r.parallelMarket ?? r.parallel_market ?? ''
            document.getElementById('root').innerHTML =
              '<div class="row"><div class="label">Official</div><div class="value">₦' + official + '</div></div>' +
              '<div class="row"><div class="label">Black Market</div><div class="value">₦' + black + '</div></div>' +
              '<div class="row"><div class="label">Parallel</div><div class="value">₦' + parallel + '</div></div>'
          } catch (e) {
            document.getElementById('root').innerHTML = '<div>Error loading rates</div>'
          }
        }
        render()
        // simple auto-refresh
        setInterval(render, 60_000)
      </script>
    </body>
  </html>`;

  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
