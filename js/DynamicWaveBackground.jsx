const { motion: dwb } = Motion;

function DynamicWaveBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#030305]">
      {/* Primary Purple Glow */}
      <dwb.div
        className="absolute rounded-full"
        style={{ 
          top: "-20%", left: "-10%", width: "70vw", height: "70vw", 
          background: "radial-gradient(circle, rgba(76, 29, 149, 0.45) 0%, transparent 70%)", 
          filter: "blur(60px)",
          willChange: "transform"
        }}
        animate={{
          x: ["0%", "15%", "-5%", "0%"],
          y: ["0%", "-10%", "10%", "0%"],
          scale: [1, 1.15, 0.9, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      
      {/* Primary Blue Glow */}
      <dwb.div
        className="absolute rounded-full"
        style={{ 
          bottom: "-10%", right: "-20%", width: "65vw", height: "65vw", 
          background: "radial-gradient(circle, rgba(29, 78, 216, 0.4) 0%, transparent 70%)", 
          filter: "blur(80px)",
          willChange: "transform"
        }}
        animate={{
          x: ["0%", "-20%", "10%", "0%"],
          y: ["0%", "15%", "-15%", "0%"],
          scale: [1, 1.2, 0.85, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      {/* Deep Teal/Cyan Center Glow */}
      <dwb.div
        className="absolute rounded-full"
        style={{ 
          top: "30%", left: "30%", width: "50vw", height: "50vw", 
          background: "radial-gradient(circle, rgba(45, 212, 191, 0.25) 0%, transparent 70%)", 
          filter: "blur(70px)",
          willChange: "transform"
        }}
        animate={{
          x: ["0%", "25%", "-25%", "0%"],
          y: ["0%", "-20%", "20%", "0%"],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
      
      {/* Soft Pink Accent */}
      <dwb.div
        className="absolute rounded-full"
        style={{ 
          bottom: "20%", left: "10%", width: "40vw", height: "40vw", 
          background: "radial-gradient(circle, rgba(219, 39, 119, 0.2) 0%, transparent 70%)", 
          filter: "blur(60px)",
          willChange: "transform"
        }}
        animate={{
          x: ["0%", "30%", "-10%", "0%"],
          y: ["0%", "20%", "-30%", "0%"],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
    </div>
  );
}
