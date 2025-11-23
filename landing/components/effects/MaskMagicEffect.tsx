/**
 * MaskMagicEffect - Standalone TypeScript Component
 * Pixelated Distortion Lens Effect
 *
 * Configuration:
 * - Blob Size: 0.50
 * - Pixel Size: 50
 * - Noise Scale: 0.50
 * - Growth Speed: 0.3
 * - Distortion Strength: 0.1
 * - Background: background1.png
 *
 * Requirements:
 * - React 16.8+
 * - WebGL2 support
 * - EXT_color_buffer_float extension
 */

import React, { useEffect, useRef } from 'react';

interface MaskMagicEffectProps {
  backgroundImage?: string;
  className?: string;
  style?: React.CSSProperties;

  // Scroll-responsive parameters (optional overrides)
  maskSize?: number;
  pixelSize?: number;
  noiseScale?: number;
  growthSpeed?: number;
  distortionStrength?: number;

  // Scroll context
  scrollProgress?: number; // 0-1 range
  isActive?: boolean; // Whether this effect is currently active
}

export const MaskMagicEffect: React.FC<MaskMagicEffectProps> = ({
  backgroundImage = '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
  className = '',
  style = {},
  // Scroll-responsive parameters
  maskSize,
  pixelSize,
  noiseScale,
  growthSpeed,
  distortionStrength,
  scrollProgress,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const backgroundTextureRef = useRef<WebGLTexture | null>(null);
  const pointerRef = useRef({ x: 0.5, y: 0.5 });
  const startTimeRef = useRef(Date.now());
  const animationIdRef = useRef<number | undefined>(undefined);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const frameSkipCounterRef = useRef(0);

  // Configuration (use props if provided, otherwise fall back to defaults)
  const config = {
    MASK_SIZE: maskSize ?? 0.5,
    PIXEL_SIZE: pixelSize ?? 50.0,
    NOISE_SCALE: noiseScale ?? 0.65,
    GROWTH_SPEED: growthSpeed ?? 0.2,
    DISTORTION_STRENGTH: distortionStrength ?? 0.1
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL2
    const gl = canvas.getContext('webgl2');
    if (!gl) {
      console.error('WebGL2 not supported');
      return;
    }

    glRef.current = gl;

    // Check for required extension
    const ext = gl.getExtension('EXT_color_buffer_float');
    if (!ext) {
      console.error('EXT_color_buffer_float not supported');
      return;
    }

    // Set canvas size
    const resizeCanvas = () => {
      const displayWidth = canvas.clientWidth;
      const displayHeight = canvas.clientHeight;

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Shaders
    const vertexShader = `#version 300 es
      in vec2 aPosition;
      out vec2 vUv;
      void main() {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShader = `#version 300 es
      precision highp float;
      precision highp sampler2D;

      in vec2 vUv;
      out vec4 fragColor;

      uniform sampler2D uBackground;
      uniform vec2 uPointer;
      uniform float uTime;
      uniform float uAspectRatio;
      uniform float uMaskSize;
      uniform float uPixelSize;
      uniform float uNoiseScale;
      uniform float uGrowthSpeed;
      uniform float uDistortionStrength;
      uniform vec2 uResolution;

      // Simplex noise
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                            -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v - i + dot(i, C.xx);
        vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for(int i = 0; i < 4; i++) {
          value += amplitude * snoise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 pixelCoord = vUv * uResolution;
        vec2 pixelIndex = floor(pixelCoord / uPixelSize);
        vec2 pixelCenter = (pixelIndex + 0.5) * uPixelSize / uResolution;

        vec2 p = pixelCenter - uPointer;
        p.x *= uAspectRatio;
        float blobDist = length(p);

        float inBlob = step(blobDist, uMaskSize);

        vec2 noiseCoord = pixelIndex * 0.1 * uNoiseScale;
        float noise = fbm(noiseCoord + uTime * uGrowthSpeed);
        noise = noise * 0.5 + 0.5;

        float distanceFactor = smoothstep(0.0, uMaskSize, blobDist);
        float threshold = mix(0.3, 0.7, distanceFactor);
        float animatedThreshold = threshold + sin(uTime * 2.0) * 0.1;
        float pixelVisible = step(animatedThreshold, noise) * inBlob;

        vec2 distortionOffset = vec2(0.0);
        if (pixelVisible > 0.5) {
          float noiseX = fbm(pixelIndex * 0.15 + vec2(uTime * 0.2, 0.0));
          float noiseY = fbm(pixelIndex * 0.15 + vec2(0.0, uTime * 0.25));
          distortionOffset = vec2(noiseX, noiseY) * uDistortionStrength;
        }

        vec2 distortedUV = vUv + distortionOffset;
        vec4 bgColor = texture(uBackground, distortedUV);

        fragColor = bgColor * 0.5;
      }
    `;

    // Compile shaders
    const compileShader = (type: number, source: string): WebGLShader | null => {
      const shader = gl.createShader(type);
      if (!shader) return null;

      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }

      return shader;
    };

    const vShader = compileShader(gl.VERTEX_SHADER, vertexShader);
    const fShader = compileShader(gl.FRAGMENT_SHADER, fragmentShader);

    if (!vShader || !fShader) {
      console.error('Failed to compile shaders');
      return;
    }

    // Create program
    const program = gl.createProgram();
    if (!program) {
      console.error('Failed to create program');
      return;
    }

    gl.attachShader(program, vShader);
    gl.attachShader(program, fShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program linking error:', gl.getProgramInfoLog(program));
      gl.deleteProgram(program);
      return;
    }

    programRef.current = program;

    // Get uniform locations
    const uniforms = {
      uBackground: gl.getUniformLocation(program, 'uBackground'),
      uPointer: gl.getUniformLocation(program, 'uPointer'),
      uTime: gl.getUniformLocation(program, 'uTime'),
      uAspectRatio: gl.getUniformLocation(program, 'uAspectRatio'),
      uMaskSize: gl.getUniformLocation(program, 'uMaskSize'),
      uPixelSize: gl.getUniformLocation(program, 'uPixelSize'),
      uNoiseScale: gl.getUniformLocation(program, 'uNoiseScale'),
      uGrowthSpeed: gl.getUniformLocation(program, 'uGrowthSpeed'),
      uDistortionStrength: gl.getUniformLocation(program, 'uDistortionStrength'),
      uResolution: gl.getUniformLocation(program, 'uResolution')
    };

    // Setup geometry
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Load background image
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = backgroundImage;

    image.onload = () => {
      gl.activeTexture(gl.TEXTURE0);
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);

      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      backgroundTextureRef.current = texture;
    };

    // Mouse handling - track globally on window
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (e.clientX - rect.left) / rect.width;
      pointerRef.current.y = 1.0 - (e.clientY - rect.top) / rect.height;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.targetTouches[0];
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = (touch.clientX - rect.left) / rect.width;
      pointerRef.current.y = 1.0 - (touch.clientY - rect.top) / rect.height;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Scroll detection for performance optimization
    const handleScroll = () => {
      isScrollingRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      scrollTimeoutRef.current = setTimeout(() => {
        isScrollingRef.current = false;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Render loop with scroll-aware frame skipping
    const render = () => {
      // Skip rendering if not active
      if (!isActive) {
        animationIdRef.current = requestAnimationFrame(render);
        return;
      }

      // Reduce frame rate during scrolling (render every 3rd frame)
      if (isScrollingRef.current) {
        frameSkipCounterRef.current++;
        if (frameSkipCounterRef.current % 3 !== 0) {
          animationIdRef.current = requestAnimationFrame(render);
          return;
        }
      } else {
        frameSkipCounterRef.current = 0;
      }

      resizeCanvas();

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!backgroundTextureRef.current || !programRef.current) {
        animationIdRef.current = requestAnimationFrame(render);
        return;
      }

      const currentTime = (Date.now() - startTimeRef.current) * 0.001;

      gl.useProgram(programRef.current);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, backgroundTextureRef.current);
      gl.uniform1i(uniforms.uBackground, 0);

      gl.uniform2f(uniforms.uPointer, pointerRef.current.x, pointerRef.current.y);
      gl.uniform1f(uniforms.uTime, currentTime);
      gl.uniform1f(uniforms.uAspectRatio, canvas.width / canvas.height);
      gl.uniform1f(uniforms.uMaskSize, config.MASK_SIZE);
      gl.uniform1f(uniforms.uPixelSize, config.PIXEL_SIZE);
      gl.uniform1f(uniforms.uNoiseScale, config.NOISE_SCALE);
      gl.uniform1f(uniforms.uGrowthSpeed, config.GROWTH_SPEED);
      gl.uniform1f(uniforms.uDistortionStrength, config.DISTORTION_STRENGTH);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('scroll', handleScroll);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (backgroundTextureRef.current) {
        gl.deleteTexture(backgroundTextureRef.current);
      }

      if (programRef.current) {
        gl.deleteProgram(programRef.current);
      }
    };
  }, [backgroundImage, maskSize, pixelSize, noiseScale, growthSpeed, distortionStrength, isActive]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        ...style
      }}
    />
  );
};

export default MaskMagicEffect;
