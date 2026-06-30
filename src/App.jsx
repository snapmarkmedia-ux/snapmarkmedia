import React, {  useState, useEffect, useRef, useMemo, useCallback  } from 'react';
import CinematicHero from './CinematicHero';
import ContentSections from './ContentSections';
import CursorGlow from './CursorGlow';
import DynamicWaveBackground from './DynamicWaveBackground';
import ProfileSection from './ProfileSection';
import ReviewsSection from './ReviewsSection';
import TestReviews from './TestReviews';









function App() {
  return <><DynamicWaveBackground /><CursorGlow /><CinematicHero /><ProfileSection /><ReviewsSection /><ContentSections /><TestReviews /></>;
}

export default App;
