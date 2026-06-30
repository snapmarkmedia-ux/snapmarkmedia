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

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Each child in a list should have a unique")) return;
  originalError(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
export default App;
