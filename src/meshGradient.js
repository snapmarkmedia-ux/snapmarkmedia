

/**
 * meshGradient.js
 * GPU-accelerated animated mesh gradient background using WebGL.
 * Replicates the @paper-design/shaders-react MeshGradient effect
 * without any npm dependencies.
 *
 * Colors: Deep blue / indigo / sky blue / steel blue palette.
 */
(function () {
  "use strict";

  /* ── Configuration ─────────────────────────────────────────── */
  const CONFIG = {
    /* HSL converted to linear RGB (0-1) */
    colors: [
      [0.027, 0.22, 0.51],   /* hsl(216, 90%, 27%)  — deep navy      */
      [0.14,  0.12, 0.60],   /* hsl(243, 68%, 36%)  — dark indigo     */
      [0.31,  0.69, 0.97],   /* hsl(205, 91%, 64%)  — bright sky blue */
      [0.31,  0.56, 0.83],   /* hsl(211, 61%, 57%)  — steel blue      */
    ],
    speed: 1.0,
    distortion: 0.8,
    scale: 1.0,
  };

  /* ── Shaders ───────────────────────────────────────────────── */
  const VERT = `
    attribute vec2 a_pos;
    void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }
  `;

  const FRAG = `
    precision highp float;

    uniform float uTime;
    uniform vec2  uRes;
    uniform vec3  uC0, uC1, uC2, uC3;
    uniform float uDist;
    uniform float uScale;

    /* ── simplex 2-D noise (Ashima Arts) ──────────────────── */
    vec3 mod289(vec3 x){ return x - floor(x/289.0)*289.0; }
    vec2 mod289(vec2 x){ return x - floor(x/289.0)*289.0; }
    vec3 perm(vec3 x){ return mod289((x*34.0+1.0)*x); }

    float snoise(vec2 v){
      const vec4 C = vec4(
        0.211324865405187, 0.366025403784439,
       -0.577350269189626, 0.024390243902439);
      vec2 i = floor(v + dot(v,C.yy));
      vec2 x0 = v - i + dot(i,C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod289(i);
      vec3 p = perm(perm(i.y+vec3(0.0,i1.y,1.0))+i.x+vec3(0.0,i1.x,1.0));
      vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
      m = m*m; m = m*m;
      vec3 xn = 2.0*fract(p*C.www)-1.0;
      vec3 h  = abs(xn)-0.5;
      vec3 ox = floor(xn+0.5);
      vec3 a0 = xn-ox;
      m *= 1.79284291400159 - 0.85373472095314*(a0*a0+h*h);
      vec3 g;
      g.x  = a0.x*x0.x  + h.x*x0.y;
      g.yz = a0.yz*x12.xz + h.yz*x12.yw;
      return 130.0*dot(m,g);
    }

    /* ── swirl helper ─────────────────────────────────────── */
    float fbm(vec2 p, float t){
      float f = 0.0;
      f += 0.5000 * snoise(p*1.0 + t*0.15);
      f += 0.2500 * snoise(p*2.0 - t*0.12 + 100.0);
      f += 0.1250 * snoise(p*4.0 + t*0.08 + 50.0);
      return f;
    }

    void main(){
      vec2 uv = gl_FragCoord.xy / uRes * uScale;
      float t = uTime;

      /* multi-layer distortion */
      float n1 = fbm(uv * 1.2, t) * uDist;
      float n2 = fbm(uv * 1.0 + 30.0, -t * 0.9) * uDist;
      vec2 d = uv + vec2(n1, n2) * 0.45;

      /* colour blending via noise */
      float b1 = snoise(d * 0.7 + t*0.06) * 0.5 + 0.5;
      float b2 = snoise(d * 0.5 - t*0.08 + 30.0) * 0.5 + 0.5;
      float b3 = snoise(d * 0.35 + t*0.04 + 70.0) * 0.5 + 0.5;

      vec3 c  = mix(
        mix(uC0, uC1, smoothstep(0.18, 0.82, b1)),
        mix(uC2, uC3, smoothstep(0.18, 0.82, b2)),
        smoothstep(0.12, 0.88, b3)
      );

      /* soft vignette */
      vec2 ctr = gl_FragCoord.xy / uRes - 0.5;
      c *= 1.0 - dot(ctr, ctr) * 0.35;

      gl_FragColor = vec4(c, 1.0);
    }
  `;

  /* ── Bootstrap ─────────────────────────────────────────────── */
  function init() {
    var container = document.querySelector(".global-background");
    if (!container) return;

    var canvas = document.createElement("canvas");
    canvas.style.cssText = "width:100%;height:100%;display:block;";
    container.appendChild(canvas);

    var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) { console.warn("WebGL not supported — mesh gradient disabled"); return; }

    /* compile shader */
    function makeShader(src, type) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        console.error("Shader error:", gl.getShaderInfoLog(s));
      return s;
    }

    var prog = gl.createProgram();
    gl.attachShader(prog, makeShader(VERT, gl.VERTEX_SHADER));
    gl.attachShader(prog, makeShader(FRAG, gl.FRAGMENT_SHADER));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS))
      console.error("Program link error:", gl.getProgramInfoLog(prog));
    gl.useProgram(prog);

    /* fullscreen quad */
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    var aPos = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    /* uniforms */
    var uTime  = gl.getUniformLocation(prog, "uTime");
    var uRes   = gl.getUniformLocation(prog, "uRes");
    var uDist  = gl.getUniformLocation(prog, "uDist");
    var uScale = gl.getUniformLocation(prog, "uScale");
    var uC = [
      gl.getUniformLocation(prog, "uC0"),
      gl.getUniformLocation(prog, "uC1"),
      gl.getUniformLocation(prog, "uC2"),
      gl.getUniformLocation(prog, "uC3"),
    ];

    /* set static uniforms */
    gl.uniform1f(uDist, CONFIG.distortion);
    gl.uniform1f(uScale, CONFIG.scale);
    CONFIG.colors.forEach(function (c, i) {
      gl.uniform3f(uC[i], c[0], c[1], c[2]);
    });

    /* resize handler */
    function resize() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width  = canvas.clientWidth  * dpr;
      canvas.height = canvas.clientHeight * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    }
    window.addEventListener("resize", resize);
    resize();

    /* render loop */
    var start = performance.now();
    function frame() {
      var t = ((performance.now() - start) / 1000) * CONFIG.speed;
      gl.uniform1f(uTime, t);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* run when DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
