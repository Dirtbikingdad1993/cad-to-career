// Revenue configuration for CAD to Career. Public file: put ONLY public
// checkout/payment-link URLs here, never secret keys.
//
// Paste links you create in Stripe (Payment Links), GitHub Sponsors, Ko-fi,
// Open Collective or PayPal. A tier or button with an empty URL stays hidden,
// so the site never shows a broken "Donate" button. See docs/MONETIZATION_SETUP.md.
window.CAD_FUNDING = {
  // Monthly supporter tiers (recurring payment links).
  monthly: [
    { id: "drafter", name: "Drafter", amount: 5, perks: "Keeps 53 lessons and the CAD lab free for one more learner each month.", url: "" },
    { id: "designer", name: "Designer", amount: 10, perks: "Covers hosting and assessment costs for a small class, plus a vote on which lessons we build next.", url: "" },
    { id: "engineer", name: "Engineer", amount: 25, perks: "Funds human project review for learners, plus your name on the supporters list if you want it.", url: "" }
  ],
  // One-time donation link (lets the donor choose the amount).
  oneTime: { label: "Give once", url: "" },
  // Optional extra channels.
  githubSponsors: "",
  // Paid service for schools, workforce programs and employers.
  teams: {
    contactEmail: "",
    bookingUrl: "",
    packages: [
      { name: "Classroom cohort", price: "From $299 / cohort", detail: "Up to 30 learners, instructor guide, weekly progress summary and a kickoff session." },
      { name: "Reviewed portfolio", price: "$49 / learner", detail: "Dedicated, fast-turnaround review of your learners' five portfolio projects with written rubric feedback for the instructor. Individual learners keep free review." },
      { name: "Custom workshop", price: "Quoted", detail: "Live remote CAD workshop built around your team's parts, drawings and software." }
    ]
  }
};
