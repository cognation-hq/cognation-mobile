import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function ProfileScreen() {
  return (
    <ScreenShell
      title="Profile"
      subtitle="You — settings, presence, and privacy."
    >
      <ComingSoonBlock heading="Account & presence">
        Profile and account controls will live here. No auth or fake user data
        in this shell.
      </ComingSoonBlock>
      <MockPanel
        title="Settings strip"
        hint="Empty glass — controls later"
        accent="cyan"
      />
    </ScreenShell>
  );
}
