// Revenue configuration for CAD to Career. Public file: put ONLY public
// checkout/payment-link URLs here, never secret keys.
//
// Paste links you create in Stripe (Payment Links), GitHub Sponsors, Ko-fi,
// Open Collective or PayPal. A tier or button with an empty URL stays hidden,
// so the site never shows a broken "Donate" button. See docs/MONETIZATION_SETUP.md.
window.CAD_FUNDING = {
  // Monthly supporter tiers (recurring payment links).
  monthly: [
    { id: "drafter", name: "Drafter", amount: 5, perks: "Keeps 53 lessons and the CAD lab free for one more learner each month.", url: "https://buy.stripe.com/6oUaEZafZenx9b8ddDgbm00" },
    { id: "designer", name: "Designer", amount: 10, perks: "Covers hosting and assessment costs for a small class, plus a vote on which lessons we build next.", url: "https://buy.stripe.com/7sYcN70Fp4MXafc6Pfgbm01" },
    { id: "engineer", name: "Engineer", amount: 25, perks: "Funds human project review for learners, plus your name on the supporters list if you want it.", url: "https://buy.stripe.com/6oU9AVbk32EP0ECddDgbm02" }
  ],
  // One-time donation link (lets the donor choose the amount).
  oneTime: { label: "Give once", url: "https://donate.stripe.com/cNi28tbk3djt3QOddDgbm03" },
  // Stripe customer portal sign-in page: donors manage or cancel monthly gifts here.
  manageUrl: "https://billing.stripe.com/p/login/6oUaEZafZenx9b8ddDgbm00",
  // Optional extra channels.
  githubSponsors: "",
  // Paid service for schools, workforce programs and employers.
  teams: {
    contactEmail: "dirtbikingdad1993@gmail.com",
    bookingUrl: "",
    packages: [
      { name: "Classroom cohort", price: "From $299 / cohort", detail: "Up to 30 learners, instructor guide, weekly progress summary and a kickoff session." },
      { name: "Reviewed portfolio", price: "$49 / learner", detail: "Dedicated, fast-turnaround review of your learners' five portfolio projects with written rubric feedback for the instructor. Individual learners keep free review." },
      { name: "Custom workshop", price: "Quoted", detail: "Live remote CAD workshop built around your team's parts, drawings and software." }
    ]
  }
};
