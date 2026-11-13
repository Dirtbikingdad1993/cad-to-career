(function () {
  "use strict";
  const api = window.CAD_PILOT;
  if (!api) return;
  const select = document.getElementById("cohort");
  const cards = document.getElementById("cards");
  const pipeline = document.getElementById("pipeline-rows");
  const tbody = document.getElementById("cohort-table");
  const exportButton = document.getElementById("export");
  const labels = [
    ["learners", "Synthetic learners"],
    ["activeLearners", "Practice started"],
    ["projectsSubmitted", "Project submissions"],
    ["projectsReviewed", "Reviewed projects"],
    ["fullyReviewedPortfolios", "Complete reviewed portfolios"],
    ["certificates", "Issued certificates (none)"]
  ];
  for (const cohort of api.COHORTS) {
    const option = document.createElement("option");
    option.value = cohort.id;
    option.textContent = cohort.name + " · " + cohort.type;
    select.appendChild(option);
  }
  function addText(tag, text, className, parent) {
    const element = document.createElement(tag);
    element.textContent = text;
    if (className) element.className = className;
    parent.appendChild(element);
    return element;
  }
  function chosen() {
    return select.value === "all" ? api.COHORTS : api.COHORTS.filter(c => c.id === select.value);
  }
  function render() {
    const cohorts = chosen(), data = api.summary(cohorts);
    cards.replaceChildren(); pipeline.replaceChildren(); tbody.replaceChildren();
    for (const [key, label] of labels) {
      const card = document.createElement("div");
      card.className = "card";
      addText("div", String(data[key]), "value", card);
      addText("div", label, "caption", card);
      cards.appendChild(card);
    }
    const denominators = [
      ["Practice started", data.activeLearners, data.learners],
      ["Submitted a project", cohorts.flatMap(api.rowsFor).filter(r => r.projectsSubmitted > 0).length, data.learners],
      ["At least one project reviewed", data.reviewedPortfolioLearners, data.learners],
      ["Five projects reviewed", data.fullyReviewedPortfolios, data.learners]
    ];
    for (const [label, count, total] of denominators) {
      const row = document.createElement("div");
      row.style.marginBottom = "18px";
      addText("p", label + ": " + count + " / " + total, "small", row);
      const track = document.createElement("div");
      track.className = "progress";
      const fill = document.createElement("span");
      fill.style.width = (total ? 100 * count / total : 0) + "%";
      track.appendChild(fill);row.appendChild(track);pipeline.appendChild(row);
    }
    for (const cohort of cohorts) {
      const subtotal = api.summary([cohort]);
      const tr = document.createElement("tr");
      addText("td", cohort.name, "", tr);
      addText("td", String(subtotal.learners), "", tr);
      addText("td", String(subtotal.projectsReviewed), "", tr);
      tbody.appendChild(tr);
    }
  }
  select.addEventListener("change", render);
  exportButton.addEventListener("click", function () {
    const url = URL.createObjectURL(new Blob([api.exportAggregateCsv(chosen())], {type: "text/csv;charset=utf-8"}));
    const link = document.createElement("a");
    link.href = url;
    link.download = "cad-to-career-SYNTHETIC-pilot-summary.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });
  render();
})();
