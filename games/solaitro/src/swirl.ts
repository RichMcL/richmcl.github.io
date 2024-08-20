export class Swirl {
    doSwirl() {
        const canvas = document.getElementById('bg-canvas') as HTMLCanvasElement;
        console.log('canvas', canvas);
        // const gl = canvas.getContext('webgl');
        const gl =
            canvas.getContext('webgl') ||
            (canvas.getContext('experimental-webgl') as WebGLRenderingContext);

        console.log('gl', gl);

        if (!gl) {
            console.error('WebGL not supported');
            throw 'WebGL not supported';
        }

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const vertexShaderSource = `
            attribute vec4 aVertexPosition;
            varying vec2 vTextureCoord;
            void main(void) {
                vTextureCoord = aVertexPosition.xy * 0.5 + 0.5;
                gl_Position = aVertexPosition;
            }
        `;

        const fragmentShaderSource = `
            precision highp float;
            uniform float uTime;
            varying vec2 vTextureCoord;

            // Perturbation function
            vec2 perturb(vec2 pos, float time) {
                float perturbX = sin(pos.y * 10.0 + time * 0.5) * 0.05;
                float perturbY = cos(pos.x * 10.0 + time * 0.5) * 0.05;
                return pos + vec2(perturbX, perturbY);
            }

            void main(void) {
                vec2 uv = vTextureCoord;
                vec2 center = vec2(0.5, 0.5);
                vec2 pos = uv - center;
                pos = perturb(pos, uTime); // Apply perturbation
                float angle = atan(pos.y, pos.x);
                float radius = length(pos);
                float swirl = sin(angle * 10.0 + uTime * 0.5) * 0.5 + 0.5; // Slowed down
                float curve = sin(radius * 10.0 - uTime * 0.5) * 0.5 + 0.5; // Slowed down
                float colorFactor = sin(radius * 20.0 + angle * 5.0 - uTime * 0.5) * 0.5 + 0.5; // Slowed down
                vec3 color1 = vec3(0.0, 0.5, 0.0); // Dark green
                vec3 color2 = vec3(0.0, 1.0, 0.0); // Green
                vec3 color3 = vec3(0.5, 1.0, 0.5); // Light green
                vec3 color = mix(color1, color2, swirl);
                color = mix(color, color3, colorFactor);
                color = mix(color, vec3(0.0, 0.75, 0.0), curve); // Medium green
                gl_FragColor = vec4(color, 1.0);
            }
        `;

        function createShader(gl: WebGLRenderingContext, type: number, source: string) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error(
                    'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader)
                );
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error(
                'Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram)
            );
        }

        gl.useProgram(shaderProgram);

        const vertexPosition = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
        const vertices = new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.vertexAttribPointer(vertexPosition, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(vertexPosition);

        const uTime = gl.getUniformLocation(shaderProgram, 'uTime');

        function render(time: number) {
            gl.clear(gl.COLOR_BUFFER_BIT);

            gl.uniform1f(uTime, time * 0.001);

            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    }
}
