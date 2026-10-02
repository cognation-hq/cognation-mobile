import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function DatingScreen() {
  return (
    <ScreenShell
      title="Dating"
      subtitle="Intentional connection — not swipes as sport."
    >
      <ComingSoonBlock heading="Discovery" accent="magenta">
        Dating discovery will appear here later. No profiles or seed users in
        this shell.
      </ComingSoonBlock>
      <MockPanel
        title="Match panel"
        hint="Placeholder chrome — no cards to swipe"
        accent="magenta"
      />
    </ScreenShell>
  );
}
