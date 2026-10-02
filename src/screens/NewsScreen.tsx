import { ComingSoonBlock } from '../components/ComingSoonBlock';
import { MockPanel } from '../components/MockPanel';
import { ScreenShell } from '../components/ScreenShell';

export function NewsScreen() {
  return (
    <ScreenShell title="News" subtitle="Thoughtful updates — not a dopamine feed.">
      <ComingSoonBlock heading="Curated reading" accent="violet">
        News will surface curated, calm reading. No backend or seed content in
        this shell.
      </ComingSoonBlock>
      <MockPanel
        title="Masthead · empty"
        hint="Paper-style chrome — no articles yet"
        accent="violet"
      />
    </ScreenShell>
  );
}
