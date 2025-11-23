/**
 * WaveEffect - Standalone TypeScript Component
 * Animated wave distortion effect on background image
 *
 * Requirements:
 * - React 16.8+
 * - WebGL 1.0 support
 */

import React, { useEffect, useRef } from 'react';

interface WaveEffectProps {
  backgroundImage?: string;
  frequencyX?: number;      // Wave frequency on X axis (1-50, default: 10)
  frequencyY?: number;      // Wave frequency on Y axis (1-50, default: 8)
  amplitude?: number;       // Wave amplitude (0.0-0.1, default: 0.02)
  speed?: number;           // Wave animation speed (0.1-5.0, default: 1.0)
  className?: string;
  style?: React.CSSProperties;

  // Scroll context (for compatibility with BackgroundController)
  scrollProgress?: number;  // 0-1 range
  isActive?: boolean;       // Whether this effect is currently active
}

export const WaveEffect: React.FC<WaveEffectProps> = ({
  backgroundImage = '/assets/2b8b3b39-e23c-43e6-be7b-500fa586c81f_3840w.jpg',
  frequencyX = 10.0,
  frequencyY = 8.0,
  amplitude = 0.02,
  speed = 1.0,
  className = '',
  style = {},
  scrollProgress,
  isActive = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const glRef = useRef<WebGLRenderingContext | null>(null);
  const programRef = useRef<WebGLProgram | null>(null);
  const backgroundTextureRef = useRef<WebGLTexture | null>(null);
  const bufferRef = useRef<WebGLBuffer | null>(null);
  const startTimeRef = useRef(Date.now());
  const animationIdRef = useRef<number | undefined>(undefined);

  // Use refs for parameters to avoid recreating WebGL context
  const paramsRef = useRef({ frequencyX, frequencyY, amplitude, speed });

  // Update params ref when props change (doesn't trigger effect)
  useEffect(() => {
    paramsRef.current = { frequencyX, frequencyY, amplitude, speed };
  }, [frequencyX, frequencyY, amplitude, speed]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize WebGL 1.0
    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    glRef.current = gl;

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

    // Shaders (WebGL 1.0)
    const vertexShader = `
      attribute vec2 a_position;
      varying vec2 v_texCoord;

      void main() {
        gl_Position = vec4(a_position, 0.0, 1.0);
        v_texCoord = a_position * 0.5 + 0.5;
      }
    `;

    const fragmentShader = `
      precision mediump float;

      uniform sampler2D u_texture;
      uniform float u_time;
      uniform vec2 u_resolution;
      uniform float u_frequencyX;
      uniform float u_frequencyY;
      uniform float u_amplitude;
      uniform float u_speed;

      varying vec2 v_texCoord;

      void main() {
        vec2 uv = v_texCoord;

        // Create wave distortion with configurable parameters
        float wave1 = sin(uv.y * u_frequencyX + u_time * 0.001 * u_speed) * u_amplitude;
        float wave2 = sin(uv.x * u_frequencyY + u_time * 0.0015 * u_speed) * u_amplitude;

        uv.x += wave1;
        uv.y += wave2;

        // Add subtle color shift
        vec4 color = texture2D(u_texture, uv);
        color.rgb += vec3(wave1, wave2, -wave1) * 0.1;

        gl_FragColor = color;
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

    // Get uniform and attribute locations
    const uniforms = {
      uTexture: gl.getUniformLocation(program, 'u_texture'),
      uTime: gl.getUniformLocation(program, 'u_time'),
      uResolution: gl.getUniformLocation(program, 'u_resolution'),
      uFrequencyX: gl.getUniformLocation(program, 'u_frequencyX'),
      uFrequencyY: gl.getUniformLocation(program, 'u_frequencyY'),
      uAmplitude: gl.getUniformLocation(program, 'u_amplitude'),
      uSpeed: gl.getUniformLocation(program, 'u_speed')
    };

    const aPosition = gl.getAttribLocation(program, 'a_position');

    // Setup geometry (fullscreen quad)
    const buffer = gl.createBuffer();
    bufferRef.current = buffer;
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1
      ]),
      gl.STATIC_DRAW
    );

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

    // Render loop
    const render = () => {
      resizeCanvas();

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      if (!backgroundTextureRef.current || !programRef.current) {
        animationIdRef.current = requestAnimationFrame(render);
        return;
      }

      const currentTime = Date.now() - startTimeRef.current;

      gl.useProgram(programRef.current);

      // Bind texture
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, backgroundTextureRef.current);
      gl.uniform1i(uniforms.uTexture, 0);

      // Set uniforms (use ref values for smooth parameter updates)
      gl.uniform1f(uniforms.uTime, currentTime);
      gl.uniform2f(uniforms.uResolution, canvas.width, canvas.height);
      gl.uniform1f(uniforms.uFrequencyX, paramsRef.current.frequencyX);
      gl.uniform1f(uniforms.uFrequencyY, paramsRef.current.frequencyY);
      gl.uniform1f(uniforms.uAmplitude, paramsRef.current.amplitude);
      gl.uniform1f(uniforms.uSpeed, paramsRef.current.speed);

      // Draw
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);

      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }

      if (backgroundTextureRef.current) {
        gl.deleteTexture(backgroundTextureRef.current);
      }

      if (programRef.current) {
        gl.deleteProgram(programRef.current);
      }

      if (bufferRef.current) {
        gl.deleteBuffer(bufferRef.current);
      }
    };
  }, [backgroundImage]); // Only recreate on background image change

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

export default WaveEffect;
