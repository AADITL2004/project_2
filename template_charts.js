import { orNotListed, CHECKS, countFailedChecks } from './helpers.js';

/**
 * CHARTS VIEW - STUDENTS IMPLEMENT
 * Show patterns in your data as charts, using Chart.js
 *
 * This view has two parts:
 *   showCharts(data) returns the HTML: one <canvas> per chart, with a text alternative under each
 *   drawCharts(data) runs after that HTML is on the page, and draws a chart into each <canvas>
 *
 * Chart.js docs: https://www.chartjs.org/docs/latest/getting-started/
 */

let charts = [];

function failuresByCheck(data) {
  const counts = {};
  Object.entries(CHECKS).forEach(([field, label]) => {
    counts[label] = data.filter((inspection) => inspection[field] === 'Out of Compliance').length;
  });
  const sorted = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map(([label]) => label),
    numbers: sorted.map(([, count]) => count),
  };
}

function countResults(data) {
  const counts = {};
  data.forEach((inspection) => {
    const result = orNotListed(inspection.inspection_results);
    counts[result] = (counts[result] || 0) + 1;
  });
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return {
    labels: sorted.map(([label]) => label),
    numbers: sorted.map(([, count]) => count),
  };
}

function showCharts(data) {
  // TODO: Replace each TODO sentence below with text that says what that chart shows.
  // Charts are drawn as pictures, so screen readers can't read them.
  const checks = failuresByCheck(data);
  const results = countResults(data);
  const passedEverything = data.filter((inspection) => countFailedChecks(inspection) === 0).length;

  /*html*/
  return `
    <h2 class="view-title">📈 Charts View</h2>
    <p class="view-description">For diners: the big picture across all ${data.length} inspections</p>
    <div class="charts-grid">
      <figure class="chart-figure">
        <div class="chart-box">
          <canvas id="chart-one" role="img" aria-label="Bar chart of the food safety checks failed most often. Described below."></canvas>
        </div>
        <figcaption class="chart-summary">
          ${checks.labels[0]} was the check failed most often: in ${checks.numbers[0]} of ${data.length} inspections,
          followed by ${checks.labels[1].toLowerCase()} (${checks.numbers[1]}).
          ${passedEverything} of ${data.length} inspections passed all 15 checks.
        </figcaption>
      </figure>
      <figure class="chart-figure">
        <div class="chart-box">
          <canvas id="chart-two" role="img" aria-label="Doughnut chart of inspection results. Described below."></canvas>
        </div>
        <figcaption class="chart-summary">
          The most common result was "${results.labels[0]}" (${results.numbers[0]} of ${data.length} inspections).
          ${results.numbers[results.labels.indexOf('Not listed')] || 0} inspections had no result listed.
        </figcaption>
      </figure>
    </div>`;
}

function drawCharts(data) {
  // Chart.js is loaded by a <script> tag in index.html. If it didn't load, say so instead of breaking.
  if (typeof Chart === 'undefined') {
    document.querySelector('.charts-grid').innerHTML =
      '<p class="error">Chart.js did not load, so the charts can\'t be drawn. Check the &lt;script&gt; tag in index.html.</p>';
    return;
  }

  charts.forEach((chart) => chart.destroy());
  charts = [];

  // TODO 1: Reshape your data for the first chart.
  // Chart.js doesn't take your array of records.
  // It wants a list of labels and a matching list of numbers.
  // Example: count inspections by type of business.
  //
  //   const counts = {};
  //   data.forEach((item) => {
  //     counts[item.category] = (counts[item.category] || 0) + 1;
  //   });
  //   const labels = Object.keys(counts);
  //   const numbers = Object.values(counts);
  const checks = failuresByCheck(data);

  // TODO 2: Draw the first chart into <canvas id="chart-one">.
  // Every chart needs a title, and every axis needs a label.
  //
  //   new Chart(document.querySelector('#chart-one'), {
  //     type: 'bar',
  //     data: {
  //       labels: labels,
  //       datasets: [{ label: 'Number of inspections', data: numbers }]
  //     },
  //     options: {
  //       plugins: { title: { display: true, text: 'Inspections by type of business' } },
  //       scales: {
  //         x: { title: { display: true, text: 'Type of business' } },
  //         y: { title: { display: true, text: 'Inspections' }, beginAtZero: true }
  //       }
  //     }
  //   });
  charts.push(
    new Chart(document.querySelector('#chart-one'), {
      type: 'bar',
      data: {
        labels: checks.labels,
        datasets: [{ label: 'Inspections that failed this check', data: checks.numbers, backgroundColor: '#c0392b' }],
      },
      options: {
        indexAxis: 'y',
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'Which food safety checks fail most often?' },
          legend: { display: false },
        },
        scales: {
          x: { title: { display: true, text: 'Number of inspections' }, beginAtZero: true, ticks: { precision: 0 } },
          y: { title: { display: true, text: 'Food safety check' } },
        },
      },
    })
  );

  // TODO 3: Reshape your data again, and draw a second chart of a DIFFERENT type
  // (pie, line, scatter...) into <canvas id="chart-two">, answering a different question.
  // Ideas: inspection results as a pie, inspections per month as a line,
  // or how many "Out of Compliance" checks each type of business averages.
  const results = countResults(data);
  charts.push(
    new Chart(document.querySelector('#chart-two'), {
      type: 'doughnut',
      data: {
        labels: results.labels,
        datasets: [{
          label: 'Inspections',
          data: results.numbers,
          backgroundColor: ['#e67e22', '#95a5a6', '#27ae60', '#c0392b', '#2c3e50', '#8e44ad', '#2980b9', '#16a085'],
        }],
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          title: { display: true, text: 'How did the inspections turn out?' },
          legend: { position: 'bottom' },
        },
      },
    })
  );
}

export { showCharts, drawCharts };