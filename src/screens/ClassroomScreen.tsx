import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function ClassroomScreen() {
  return (
    <ScreenShell title="Classroom" subtitle="Lessons and live sessions.">
      <ComingSoonBlock heading="Lessons & sessions">
        Classrooms are coming soon.
      </ComingSoonBlock>
      <MockPanel
        title="Lesson card"
        hint="Lessons will show here."
        accent="cyan"
      />
    </ScreenShell>
  );
}
