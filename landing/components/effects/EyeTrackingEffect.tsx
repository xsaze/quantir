import React, { useEffect, useRef } from 'react';
import { loadImageForWebGL } from '@/lib/imageLoader';

interface EyeTrackingEffectProps {
    backgroundImage?: 'hero' | 'features' | 'eye';
    sensitivity?: number;
    zoom?: number;
    className?: string;
    style?: React.CSSProperties;
}

export const EyeTrackingEffect: React.FC<EyeTrackingEffectProps> = ({
    backgroundImage = 'eye',
    sensitivity = 0.5,
    zoom = 1.0,
    className,
    style,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const glRef = useRef<WebGL2RenderingContext | null>(null);
    const programRef = useRef<WebGLProgram | null>(null);
    const textureRef = useRef<WebGLTexture | null>(null);
    const requestRef = useRef<number | undefined>(undefined);
    const pointerRef = useRef({ x: 0.5, y: 0.5 });
    const paramsRef = useRef({ sensitivity, zoom });

    useEffect(() => {
        paramsRef.current = { sensitivity, zoom };
    }, [sensitivity, zoom]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const gl = canvas.getContext('webgl2');
        if (!gl) {
            console.error('WebGL2 not supported');
            return;
        }
        glRef.current = gl;

        // --- Shader Helpers ---
        const createShader = (type: number, source: string) => {
            const shader = gl.createShader(type);
            if (!shader) return null;
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error('Shader compile error:', gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        };

        const createProgram = (vsSource: string, fsSource: string) => {
            const vs = createShader(gl.VERTEX_SHADER, vsSource);
            const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
            if (!vs || !fs) return null;
            const program = gl.createProgram();
            if (!program) return null;
            gl.attachShader(program, vs);
            gl.attachShader(program, fs);
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Program link error:', gl.getProgramInfoLog(program));
                return null;
            }
            return program;
        };

        // --- Shaders ---
        const vertexShader = `#version 300 es
      in vec2 aPosition;
      out vec2 vUv;
      void main () {
        vUv = aPosition * 0.5 + 0.5;
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

        const fragmentShader = `#version 300 es
      precision highp float;
      in vec2 vUv;
      out vec4 fragColor;
      uniform sampler2D uBackground;
      uniform vec2 uPointer;
      uniform float uSensitivity;
      uniform float uZoom;
      uniform float uAspectRatio;

      void main () {
        vec2 p = vUv - 0.5;
        vec2 pointerOffset = uPointer - 0.5;
        vec2 distortion = p * dot(p, pointerOffset) * uSensitivity;
        vec2 distortedUV = (p / uZoom) - distortion + 0.5;

        if (distortedUV.x < 0.0 || distortedUV.x > 1.0 || distortedUV.y < 0.0 || distortedUV.y > 1.0) {
           fragColor = texture(uBackground, clamp(distortedUV, 0.0, 1.0));
        } else {
           fragColor = texture(uBackground, distortedUV);
        }
      }
    `;

        const program = createProgram(vertexShader, fragmentShader);
        if (!program) return;
        programRef.current = program;

        // --- Setup Buffers ---
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);

        const elementBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);

        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(0);

        // --- Texture Loading ---
        const texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        // Placeholder 1x1 pixel
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
        textureRef.current = texture;

        // Load background image with responsive loader
        loadImageForWebGL(backgroundImage)
            .then((img) => {
                gl.bindTexture(gl.TEXTURE_2D, texture);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
            })
            .catch((error) => {
                console.error('Failed to load background image:', error);
            });

        // --- Animation Loop ---
        const render = () => {
            if (!gl || !program) return;

            // Resize
            const displayWidth = canvas.clientWidth;
            const displayHeight = canvas.clientHeight;
            if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
                canvas.width = displayWidth;
                canvas.height = displayHeight;
                gl.viewport(0, 0, displayWidth, displayHeight);
            }

            gl.clearColor(0, 0, 0, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.useProgram(program);

            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, textureRef.current);
            gl.uniform1i(gl.getUniformLocation(program, 'uBackground'), 0);

            gl.uniform2f(gl.getUniformLocation(program, 'uPointer'), pointerRef.current.x, pointerRef.current.y);
            gl.uniform1f(gl.getUniformLocation(program, 'uSensitivity'), paramsRef.current.sensitivity);
            gl.uniform1f(gl.getUniformLocation(program, 'uZoom'), paramsRef.current.zoom);
            gl.uniform1f(gl.getUniformLocation(program, 'uAspectRatio'), canvas.width / canvas.height);

            gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

            requestRef.current = requestAnimationFrame(render);
        };

        requestRef.current = requestAnimationFrame(render);

        // --- Event Listeners ---
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: (e.clientX - rect.left) / rect.width,
                y: 1.0 - (e.clientY - rect.top) / rect.height
            };
        };

        const handleTouchMove = (e: TouchEvent) => {
            const touch = e.targetTouches[0];
            const rect = canvas.getBoundingClientRect();
            pointerRef.current = {
                x: (touch.clientX - rect.left) / rect.width,
                y: 1.0 - (touch.clientY - rect.top) / rect.height
            };
        };

        if (!isMobile) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('touchmove', handleTouchMove, { passive: false });
        }

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
            if (!isMobile) {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('touchmove', handleTouchMove);
            }
            if (program) gl.deleteProgram(program);
            if (textureRef.current) gl.deleteTexture(textureRef.current);
        };
    }, [backgroundImage]); // Re-init if image changes

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ width: '100%', height: '100%', display: 'block', ...style }}
        />
    );
};
