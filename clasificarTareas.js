const raw = $input.first().json;
const body = typeof raw.data === 'string' ? JSON.parse(raw.data) : raw;
const items = body._embedded.elements;
const today = new Date(); today.setHours(0,0,0,0);
const in3days = new Date(today); in3days.setDate(in3days.getDate()+3);
const closedStatuses = ['Cerrado','Rechazado'];

const atrasadas = [];
const porVencer = [];

for (const wp of items) {
  const status = wp._links.status.title;
  if (closedStatuses.includes(status)) continue;
  if (!wp.dueDate) continue;
  const due = new Date(wp.dueDate);
  const project = wp._links.project.title;
  const row = { project, subject: wp.subject, due: wp.dueDate, status };
  if (due < today) atrasadas.push(row);
  else if (due <= in3days) porVencer.push(row);
}

const rowsHtml = (arr) => arr.map(r => `<tr><td>${r.project}</td><td>${r.subject}</td><td>${r.status}</td><td>${r.due}</td></tr>`).join('');

const html = `
  <h3>Tareas atrasadas (${atrasadas.length})</h3>
  <table border="1" cellpadding="5"><tr><th>Area</th><th>Tarea</th><th>Estado</th><th>Vence</th></tr>${rowsHtml(atrasadas)}</table>
  <h3>Tareas por vencer en los proximos 3 dias (${porVencer.length})</h3>
  <table border="1" cellpadding="5"><tr><th>Area</th><th>Tarea</th><th>Estado</th><th>Vence</th></tr>${rowsHtml(porVencer)}</table>
`;

return [{ json: { atrasadas, porVencer, total: atrasadas.length + porVencer.length, html } }];