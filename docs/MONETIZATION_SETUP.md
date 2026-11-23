# Turning on income for CAD to Career

The site now has a **Support** page (`/support`), a "Support us" link in the app sidebar and footer, and a supporter prompt on the dashboard once a learner has confirmed 3 lessons. This works like freeCodeCamp: every lesson stays free, and supporters and organizations pay for it.

No payment links are set up yet, so the page shows "Online donations are opening soon". Follow the steps below to start taking money. **You do not need any backend code or secret keys.**

## 1. Monthly and one-time donations (about 15 minutes)
1. Create a Stripe account at stripe.com and complete identity and bank (payout) verification.
2. In Stripe go to **Product catalog**, then **Add product**. Create three recurring monthly prices: $5 "Drafter", $10 "Designer" and $25 "Engineer".
3. For each price, go to **Payment Links**, then **New**. Turn on "Let customers adjust quantity" only if you want it. Copy the `https://buy.stripe.com/...` link.
4. Create one more Payment Link with **"Customers choose what to pay"** for one-time gifts.
5. Paste the links into `funding-config.js` (`monthly[].url` and `oneTime.url`), then commit. Vercel deploys automatically.
6. In Stripe go to **Settings**, then **Billing**, then **Customer portal**, and enable it so donors can cancel themselves. The receipt email links to it.

Alternatives that also work: GitHub Sponsors (`githubSponsors`), Ko-fi, Open Collective, PayPal or Buy Me a Coffee links. Only links on those hosts are shown, and they must be `https`. See the `ALLOWED_HOSTS` list in `support.js`.

## 2. Paid school / team packages (where the bigger money is)
1. Set `teams.contactEmail` to a business email address, and optionally `teams.bookingUrl` to a Calendly or cal.com link.
2. Adjust the package names and prices in `teams.packages`.
3. Bill organizations with Stripe Invoices or a Payment Link after a call. Don't build in-app billing until a few organizations have paid (see `docs/PRODUCT_SEQUENCE.md`).

## 3. Affiliate links (optional)
See `docs/AFFILIATE_PARTNERSHIPS.md` for Autodesk, Prusa and Bambu programs, plus the disclosure rules.

## Before you take money
- Name the legal operator (you, or an LLC) and a support email in `terms.html` and `privacy.html`.
- Donations to an individual or LLC are **not tax-deductible**. The page already says so. Talk to an accountant about reporting the income.
- Keep the promise: support never unlocks lessons, speeds up review or buys a credential. `tests/funding.cjs` checks the tier text for this.
