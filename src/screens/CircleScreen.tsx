import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function CircleScreen() {
  return (
    <ScreenShell
      title="Circle"
      subtitle="Close community — small by design."
    >
      <ComingSoonBlock heading="Trusted groups" accent="violet">
        Circle will hold trusted groups and shared space. No fake members in
        this shell.
      </ComingSoonBlock>
      <MockPanel
        title="Circle room"
        hint="Empty glass — no avatar grid"
        accent="violet"
      />
    </ScreenShell>
  );
}
