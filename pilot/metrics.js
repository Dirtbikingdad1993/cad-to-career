/* Deliberately synthetic data for pilot UX only. No production data or external API calls. */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.CAD_PILOT = api;
})(typeof window === "undefined" ? null : window, function () {
  "use strict";
  const COHORTS = Object.freeze([
    { id: "school-a", name: "Demo school A", type: "Training school", track: "2D Drafting", size: 8 },
    { id: "school-b", name: "Demo school B", type: "Community education", track: "CAD Fundamentals", size: 7 },
    { id: "shop-c", name: "Demo workshop C", type: "Small manufacturer", track: "3D Product Design", size: 6 },
    { id: "shop-d", name: "Demo employer D", type: "Training employer", track: "Mechanical CAD", size: 7 },
    { id: "workforce-e", name: "Demo workforce E", type: "Workforce program", track: "Career Portfolio", size: 8 }
  ]);
  function rowsFor(cohort) {
    const orgIndex = COHORTS.findIndex(c => c.id === cohort.id);
    return Array.from({ length: cohort.size }, (_, index) => {
      const lessons = Math.min(20, (index * 3 + orgIndex * 2 + 2) % 21);
      const submitted = Math.min(5, Math.floor((index + orgIndex) / 2));
      const reviewed = Math.min(submitted, Math.floor((index + orgIndex) / 3));
      // Not a real reviewer confirmation, only a fictional sample of what one would mean.
      return {
        code: "DEMO-" + String(orgIndex + 1) + "-" + String(index + 1).padStart(2, "0"),
        practiceLessons: lessons,
        projectsSubmitted: submitted,
        projectsReviewed: reviewed,
        certificateRecorded: false,
        synthetic: true
      };
    });
  }
  function summary(cohorts) {
    const list = Array.isArray(cohorts) ? cohorts : [];
    const rows = list.flatMap(rowsFor);
    return {
      cohorts: list.length,
      learners: rows.length,
      activeLearners: rows.filter(r => r.practiceLessons > 0).length,
      practiceLessons: rows.reduce((sum, r) => sum + r.practiceLessons, 0),
      projectsSubmitted: rows.reduce((sum, r) => sum + r.projectsSubmitted, 0),
      projectsReviewed: rows.reduce((sum, r) => sum + r.projectsReviewed, 0),
      reviewedPortfolioLearners: rows.filter(r => r.projectsReviewed >= 1).length,
      fullyReviewedPortfolios: rows.filter(r => r.projectsReviewed >= 5).length,
      certificates: rows.filter(r => r.certificateRecorded === true).length,
      synthetic: true
    };
  }
  function exportAggregateCsv(cohorts) {
    const heading = "cohort,program,simulated_learners,practice_lessons,submissions,reviewed_projects,verified_portfolios";
    const rows = (Array.isArray(cohorts) ? cohorts : []).map(c => {
      const m = summary([c]);
      return [c.id, c.track, m.learners, m.practiceLessons, m.projectsSubmitted, m.projectsReviewed, m.fullyReviewedPortfolios]
        .map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",");
    });
    return [heading, ...rows].join("\r\n");
  }
  return Object.freeze({ COHORTS, rowsFor, summary, exportAggregateCsv });
});
