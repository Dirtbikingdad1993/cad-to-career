import { jsPDF } from 'jspdf';
import { skills } from '@/content/skills';

const INK = [20, 24, 29];
const GREY = [120, 126, 136];
const SIGNAL = [214, 78, 42];

function frame(doc, title, subtitle) {
  const w = doc.internal.pageSize.getWidth();
  doc.setDrawColor(...INK);
  doc.setLineWidth(0.4);
  doc.rect(12, 12, w - 24, doc.internal.pageSize.getHeight() - 24);
  doc.setFont('courier', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...GREY);
  doc.text('CAD TO CAREER — FREE CAD TRADE EDUCATION', 18, 20);
  doc.text('REV A', w - 30, 20);
  doc.setFontSize(13);
  doc.setTextColor(...INK);
  doc.text(title, 18, 32);
  doc.setFontSize(8);
  doc.setTextColor(...SIGNAL);
  doc.text(subtitle, 18, 38);
  doc.setDrawColor(...GREY);
  doc.setLineWidth(0.15);
  doc.line(18, 42, w - 18, 42);
  return { w, y: 50 };
}

function footer(doc, note) {
  const w = doc.internal.pageSize.getWidth();
  const h = doc.internal.pageSize.getHeight();
  doc.setDrawColor(...GREY);
  doc.setLineWidth(0.15);
  doc.line(18, h - 22, w - 18, h - 22);
  doc.setFont('courier', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(...GREY);
  doc.text(note, 18, h - 17);
  doc.text('Nothing is marked complete until a reviewer confirms the attached work.', 18, h - 13);
}

function wrap(doc, text, width, x, y, size = 9, color = GREY) {
  doc.setFontSize(size);
  doc.setTextColor(...color);
  const lines = doc.splitTextToSize(text, width);
  doc.text(lines, x, y);
  return y + lines.length * (size * 0.45) + 3;
}

function sectionTitle(doc, text, y) {
  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(...SIGNAL);
  doc.text(text.toUpperCase(), 18, y);
  doc.setFont('courier', 'normal');
  return y + 6;
}

export function downloadProjectPacket(project) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  const { y: start } = frame(doc, project.packet.title, project.packet.subtitle);
  let y = start;

  y = sectionTitle(doc, 'Brief', y);
  y = wrap(doc, project.brief, w - 40, 18, y, 9, INK);

  y = sectionTitle(doc, 'Specification', y + 2);
  doc.setDrawColor(...GREY);
  doc.setLineWidth(0.15);
  project.packet.dims.forEach((row, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(246, 244, 238);
      doc.rect(18, y - 4, w - 36, 6, 'F');
    }
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text(`${row[0]}`, 21, y);
    doc.setTextColor(...GREY);
    doc.text(row[1], 33, y);
    doc.setTextColor(...INK);
    doc.text(String(row[2]), w - 24, y, { align: 'right' });
    y += 6;
  });

  y = sectionTitle(doc, 'Steps', y + 6);
  project.steps.forEach((step, i) => {
    doc.setFontSize(8.5);
    doc.setTextColor(...SIGNAL);
    doc.text(String(i + 1).padStart(2, '0'), 18, y);
    y = wrap(doc, step, w - 46, 26, y, 8.5, INK);
  });

  y = sectionTitle(doc, 'Notes and tolerances', y + 4);
  project.packet.notes.forEach((note) => {
    doc.setFontSize(8.5);
    doc.setTextColor(...GREY);
    doc.text('— ' + note, 20, y);
    y += 5.5;
  });

  if (y < 232) {
    y = sectionTitle(doc, 'Reviewer sign-off', y + 8);
    doc.setDrawColor(...GREY);
    doc.setLineWidth(0.2);
    doc.rect(18, y, w - 36, 24);
    doc.setFontSize(7.5);
    doc.setTextColor(...GREY);
    doc.text('REVIEWER NAME', 22, y + 6);
    doc.text('DATE', w - 70, y + 6);
    doc.text('PROJECT STATUS', 22, y + 17);
    doc.line(w - 66, y + 5, w - 26, y + 5);
    doc.line(60, y + 16, 110, y + 16);
  }

  footer(doc, `Project ${project.n} · ${project.slug} · estimated ${project.time}`);
  doc.save(`CAD to Career-${project.slug}-packet.pdf`);
}

export function downloadStageWorksheet(stage) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  let y = frame(doc, `Stage ${stage.n} — worksheet`, stage.title).y;

  y = wrap(doc, stage.promise, w - 40, 18, y, 9, INK);
  y = sectionTitle(doc, 'Lessons and proof required', y + 3);

  stage.lessons.forEach((lesson, i) => {
    doc.setFont('courier', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...INK);
    doc.text(`${String(i + 1).padStart(2, '0')}  ${lesson.title}`, 18, y);
    doc.setFont('courier', 'normal');
    y += 4.5;
    y = wrap(doc, `Proof: ${lesson.artifact}`, w - 50, 24, y, 7.5, GREY);
    y += 1;
  });

  y = sectionTitle(doc, 'Move on when', y + 4);
  y = wrap(doc, stage.moveOn, w - 40, 18, y, 9, INK);

  y = sectionTitle(doc, 'My log', y + 6);
  for (let i = 0; i < 12; i += 1) {
    doc.setDrawColor(...GREY);
    doc.setLineWidth(0.1);
    doc.line(18, y, w - 18, y);
    y += 8;
    if (y > 250) break;
  }

  footer(doc, `Stage ${stage.n} · ${stage.lessons.length} lessons · ${stage.tools.join(' / ')}`);
  doc.save(`CAD to Career-stage-${stage.n}-worksheet.pdf`);
}

export function downloadSkillChecklist() {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const w = doc.internal.pageSize.getWidth();
  let y = frame(doc, 'Skill checklist', 'Core skills must be confirmed before a certificate is issued').y;

  let lastDomain = '';
  skills.forEach((skill) => {
    if (skill.domain !== lastDomain) {
      if (y > 258) {
        doc.addPage();
        y = 24;
      }
      y = sectionTitle(doc, skill.domain, y + 3);
      lastDomain = skill.domain;
    }
    doc.setDrawColor(...GREY);
    doc.setLineWidth(0.2);
    doc.rect(18, y - 3, 4, 4);
    doc.setFontSize(8);
    doc.setTextColor(...INK);
    const lines = doc.splitTextToSize(skill.label + (skill.core ? '  [CORE]' : ''), w - 50);
    doc.text(lines, 25, y);
    y += lines.length * 3.6 + 3;
    if (y > 268) {
      doc.addPage();
      y = 26;
    }
  });

  footer(doc, `${skills.length} skills · ${skills.filter((s) => s.core).length} core · self-assessment is not confirmation`);
  doc.save('CAD to Career-skill-checklist.pdf');
}

function csvEscape(value) {
  return `"${String(value ?? '').replace(/"/g, '""')}"`;
}

export function downloadSkillCsv() {
  const rows = [['domain', 'skill_id', 'skill', 'core', 'how_it_is_proven']];
  skills.forEach((s) => rows.push([s.domain, s.id, s.label, s.core ? 'yes' : 'no', s.how]));
  const csv = rows.map((r) => r.map(csvEscape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'CAD to Career-skills.csv';
  a.click();
  URL.revokeObjectURL(url);
}