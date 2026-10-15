import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function DatingScreen() {
  return (
    <ScreenShell
      title="Dating"
      subtitle="Meet people who share your goals."
    >
      <ComingSoonBlock heading="Discovery" accent="magenta">
        Dating is coming soon.
      </ComingSoonBlock>
      <MockPanel
        title="Match panel"
        hint="Matches will show here."
        accent="magenta"
      />
    </ScreenShell>
  );
}
