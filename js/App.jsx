function App() {
  return <><DynamicWaveBackground /><CursorGlow /><CinematicHero /><ProfileSection /><ReviewsSection /><ContentSections /></>;
}

const originalError = console.error;
console.error = (...args) => {
  if (typeof args[0] === "string" && args[0].includes("Each child in a list should have a unique")) return;
  originalError(...args);
};

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
window.App = App;
