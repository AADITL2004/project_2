import { orNotListed, formatDate, countFailedChecks } from './helpers.js';

/**
 * CATEGORY VIEW - STUDENTS IMPLEMENT
 * Group data by categories
 */

function groupBy(data, field) {
  const groups = {};
  data.forEach((inspection) => {
    const key = orNotListed(inspection[field]);
    if (!groups[key]) groups[key] = [];
    groups[key].push(inspection);
  });
  return groups;
}

function summarise(groups) {
  return Object.entries(groups).map(([name, inspections]) => {
    const totalFailed = inspections.reduce((sum, inspection) => sum + countFailedChecks(inspection), 0);
    const withProblems = inspections.filter((inspection) => countFailedChecks(inspection) > 0).length;
    return {
      name,
      inspections,
      count: inspections.length,
      average: totalFailed / inspections.length,
      withProblems,
    };
  });
}

/* one row for one inspection */
function itemHTML(inspection) {
  const failed = countFailedChecks(inspection);
  return `
    <li class="category-item">
      <span>
        <strong>${inspection.name}</strong><br>
        <small>${orNotListed(inspection.city)} · ${formatDate(inspection.inspection_date)}</small>
      </span>
      <span class="fail-badge ${failed > 0 ? 'has-fails' : ''}">${failed} failed</span>
    </li>`;
}

function groupHTML(group) {
  const sortedItems = [...group.inspections].sort((a, b) => countFailedChecks(b) - countFailedChecks(a));

  return `
    <section class="category-section">
      <h3 class="category-header">${group.name}</h3>
      <div class="category-stats">
        <p><span class="category-number">${group.count}</span> inspections</p>
        <p><span class="category-number">${group.average.toFixed(1)}</span> failed checks on average</p>
        <p><span class="category-number">${group.withProblems}</span> failed at least one check</p>
      </div>
      <details class="category-items">
        <summary>Show the ${group.count} inspections</summary>
        <ul class="category-list">${sortedItems.map(itemHTML).join('')}</ul>
      </details>
    </section>`;
}
/* summary basically hides everything until its clicked*/

function showCategories(data) {
  // Requirements:
  // - Group data by one meaningful field (category, city, inspection result, etc.)
  // - Show how many records are in each group, plus one other number per group
  //   (an average, a highest, a lowest)
  // - Show items within each group
  // - Make the groups easy to compare, and visually distinct from their items
  const groups = summarise(groupBy(data, 'category'));
  groups.sort((a, b) => b.count - a.count);

  /*html*/
  return `
    <h2 class="view-title">📂 Category View</h2>
    <p class="view-description">
      For reporters: ${groups.length} types of business, largest first.
    </p>
    <div class="category-grid">
      ${groups.map(groupHTML).join('')}
    </div>`;
}

export default showCategories;