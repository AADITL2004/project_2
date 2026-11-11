import { orNotListed, formatDate, countFailedChecks } from './helpers.js';

/**
 * TABLE VIEW - STUDENTS IMPLEMENT
 * Display data in sortable rows - good for scanning specific information
 */

let tableData = [];
let sortState = { key: 'failed', direction: 'descending' };

const COLUMNS = [
  { key: 'name', label: 'Business' },
  { key: 'category', label: 'Type' },
  { key: 'city', label: 'City' },
  { key: 'date', label: 'Inspected' },
  { key: 'result', label: 'Result' },
  { key: 'failed', label: 'Checks failed' },
];

function makeRows(data) {
  return data.map((inspection) => ({
    name: inspection.name,
    address: orNotListed(inspection.address_line_1),
    category: orNotListed(inspection.category),
    city: orNotListed(inspection.city),
    date: inspection.inspection_date,
    result: orNotListed(inspection.inspection_results),
    failed: countFailedChecks(inspection),
  }));
}

function sortRows(rows, key, direction) {
  const sorted = [...rows].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return a.name < b.name ? -1 : 1;
  });
  return direction === 'ascending' ? sorted : sorted.reverse();
}

function headerCell(column) {
  const isSorted = sortState.key === column.key;
  const ariaSort = isSorted ? `aria-sort="${sortState.direction}"` : '';
  const arrow = isSorted ? (sortState.direction === 'ascending' ? '▲' : '▼') : '';
  return `
    <th scope="col" ${ariaSort}>
      <button type="button" class="sort-button" data-sort="${column.key}">
        ${column.label} <span aria-hidden="true">${arrow}</span>
      </button>
    </th>`;
}

function rowHTML(row) {
  return `
    <tr>
      <th scope="row">${row.name}<br><small>${row.address}</small></th>
      <td>${row.category}</td>
      <td>${row.city}</td>
      <td>${formatDate(row.date)}</td>
      <td>${row.result}</td>
      <td><span class="fail-badge ${row.failed > 0 ? 'has-fails' : ''}">${row.failed}</span></td>
    </tr>`;
}

function showTable(data) {
  // TODO: Students implement this function
  // Requirements:
  // - Use a real HTML <table>, with <th> header cells and a <caption> saying what the table shows
  // - Include the 4-6 most useful fields
  // - Show "Not listed" instead of undefined when a value is missing
  // - Optional: add sorting
  tableData = data;
  const rows = sortRows(makeRows(data), sortState.key, sortState.direction);
  const sortedBy = COLUMNS.find((column) => column.key === sortState.key).label;

  /*html*/
  return `
    <h2 class="view-title">📊 Table View</h2>
    <p class="view-description">For inspectors: which places failed the most checks? Click a column header to sort.</p>
    <div class="table-scroll" tabindex="0" role="region" aria-labelledby="table-caption">
      <table class="restaurant-table">
        <caption id="table-caption">
          ${rows.length} food safety inspections in Prince George's County,
          sorted by ${sortedBy.toLowerCase()} (${sortState.direction})
        </caption>
        <thead>
          <tr>${COLUMNS.map(headerCell).join('')}</tr>
        </thead>
        <tbody>
          ${rows.map(rowHTML).join('')}
        </tbody>
      </table>
    </div>`;
}

document.addEventListener('click', (event) => {
  const button = event.target.closest('[data-sort]');
  if (!button) return;

  const key = button.dataset.sort;
  if (sortState.key === key) {
    sortState.direction = sortState.direction === 'ascending' ? 'descending' : 'ascending';
  } else {
    sortState = { key, direction: key === 'failed' || key === 'date' ? 'descending' : 'ascending' };
  }

  document.getElementById('data-display').innerHTML = showTable(tableData);
  document.querySelector(`[data-sort="${key}"]`).focus();
});

export default showTable;