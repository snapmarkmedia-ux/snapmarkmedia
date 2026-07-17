const Navbar = window.Navbar || (() => null);
const DynamicWaveBackground = window.DynamicWaveBackground || (() => null);
const CursorGlow = window.CursorGlow || (() => null);
const CinematicHero = window.CinematicHero || (() => null);
const ProfileSection = window.ProfileSection || (() => null);
const ReviewsSection = window.ReviewsSection || (() => null);
const ContentSections = window.ContentSections || (() => null);

function App() {
  return <><Navbar /><DynamicWaveBackground /><CursorGlow /><CinematicHero /><ProfileSection /><ReviewsSection /><ContentSections /></>;
}

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Each child in a list should have a unique")) return;
  originalError(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
window.App = App;
