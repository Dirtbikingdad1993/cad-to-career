import PageHeader from '@/components/site/PageHeader';
import ProfileGate from '@/components/workspace/ProfileGate';
import { useWorkspace } from '@/components/workspace/WorkspaceProvider';
import { skillDomains, skills, coreSkillCount } from '@/content/skills';
import { recordMap, summarize } from '@/lib/progress';
import SkillRow from '@/components/skills/SkillRow';

function Checklist() {
  const { records, saveRecord } = useWorkspace();
  const map = recordMap(records);
  const s = summarize(records);

  return (
    <div>
      <PageHeader
        kicker={`${skills.length} skills · ${coreSkillCount} core`}
        title="Skills, and the proof each one needs"
        intro="A skill is not earned by finishing a lesson. Attach the artefact that demonstrates it and send it for confirmation."
      >
        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-hairline pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <span>{s.confirmedCore}/{s.totalCore} core confirmed</span>
          <span>{s.confirmedSkills}/{s.totalSkills} total confirmed</span>
        </div>
      </PageHeader>

      <div className="mx-auto max-w-5xl px-5 py-10 lg:px-8 lg:py-14">
        {skillDomains.map((domain) => {
          const group = skills.filter((skill) => skill.domain === domain);
          const confirmed = group.filter((skill) => map[`skill:${skill.id}`]?.status === 'confirmed').length;
          return (
            <section key={domain} className="mb-10">
              <div className="flex items-baseline justify-between border-b border-ink pb-2">
                <h2 className="font-heading text-lg font-medium tracking-tight">{domain}</h2>
                <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
                  {confirmed}/{group.length} confirmed
                </span>
              </div>
              {group.map((skill) => (
                <SkillRow
                  key={skill.id}
                  skill={skill}
                  record={map[`skill:${skill.id}`]}
                  onSave={(id, payload) => saveRecord({ kind: 'skill', item: id, ...payload })}
                />
              ))}
            </section>
          );
        })}
      </div>
    </div>
  );
}

export default function Skills() {
  return (
    <ProfileGate>
      <Checklist />
    </ProfileGate>
  );
}