import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function ClassroomScreen() {
  return (
    <ScreenShell title="Classroom" subtitle="Learn at a human pace.">
      <ComingSoonBlock heading="Lessons & sessions">
        Classroom lessons and sessions will live here. Shell only for now.
      </ComingSoonBlock>
      <MockPanel
        title="Lesson card"
        hint="Empty seat — curriculum arrives later"
        accent="cyan"
      />
    </ScreenShell>
  );
}
