function asNumber(value) {
  if (value === null || value === undefined || value === '') return NaN;
  const raw = String(value).trim().replace(',', '.');
  if (!/^[-+]?(?:[0-9]+(?:[.][0-9]*)?|[.][0-9]+)$/.test(raw)) return NaN;
  const n = Number(raw);
  return Number.isFinite(n) ? n : NaN;
}

function isChecked(value) {
  return value === true || value === 'true' || value === 'on' || value === 'yes';
}

/**
 * Runs the automatic checks for a project submission.
 * These validate only what can be measured from the learner's own inputs
 * (dimensions, tolerances, naming, required fields). They never inspect a CAD file.
 */
export function evaluateRules(rules, values) {
  return rules.map((rule) => {
    const raw = values[rule.field];
    let pass = false;
    let detail = '';

    switch (rule.type) {
      case 'range': {
        const n = asNumber(raw);
        pass = Number.isFinite(n) && n >= rule.min && n <= rule.max;
        detail = `expected ${rule.min}–${rule.max}`;
        break;
      }
      case 'min': {
        const n = asNumber(raw);
        pass = Number.isFinite(n) && n >= rule.min;
        detail = `expected ≥ ${rule.min}`;
        break;
      }
      case 'max': {
        const n = asNumber(raw);
        pass = Number.isFinite(n) && n <= rule.max;
        detail = `expected ≤ ${rule.max}`;
        break;
      }
      case 'equals': {
        pass = String(raw ?? '').trim().toLowerCase() === String(rule.value).trim().toLowerCase();
        detail = `expected “${rule.value}”`;
        break;
      }
      case 'checkbox': {
        pass = isChecked(raw);
        detail = 'needs to be confirmed';
        break;
      }
      case 'filled': {
        pass = String(raw ?? '').trim().length > 0;
        detail = 'needs a value';
        break;
      }
      case 'text_pattern': {
        const value = String(raw ?? '').trim();
        pass = value.length > 0 && new RegExp(rule.pattern, 'i').test(value);
        detail = 'does not match the required convention';
        break;
      }
      default:
        pass = false;
        detail = 'unknown rule';
    }

    if (pass) detail = rule.type === 'text_pattern' || rule.type === 'equals' ? 'match' : 'within tolerance';
    return { id: `${rule.field}:${rule.type}`, label: rule.label, pass, detail };
  });
}

export function rulesPassed(results) {
  return results.length > 0 && results.every((r) => r.pass);
}

export function valuesFromSubmission(answersJson) {
  try {
    return JSON.parse(answersJson || '{}');
  } catch {
    return {};
  }
}