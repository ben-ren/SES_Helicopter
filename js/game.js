"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

// Shader code; extracted from a copy of week 4 practical

const vertexShaderSource = `
attribute vec4 a_position;
uniform mat3 u_worldMatrix;
uniform mat3 u_viewMatrix;

void main() {
	// convert to homogeneous coordinates 
	vec3 pos = vec3(a_position.xy, 1);

	// multiply by world martix
	pos = u_worldMatrix * pos;

	// multiply by view martix
	pos = u_viewMatrix * pos;

	// output to gl_Position
	gl_Position = vec4(pos.xy,0,1);
	
	//change pointsize;
	gl_PointSize = 4.0;
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec4 u_colour;

void main() {
	// set the fragment colour

	gl_FragColor = u_colour; 
}
`;

function createShader(gl, type, source) {			//extracted from a copy of week 4 practical
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!success) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {		//extracted from a copy of week 4 practical
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!success) {
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }
    return program;
}

 function resize(canvas) {		//extracted from a copy of week 4 practical
    const resolution = window.devicePixelRatio || 1.0;

    const displayWidth = Math.floor(canvas.clientWidth * resolution);
    const displayHeight = Math.floor(canvas.clientHeight * resolution);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
        return true;
    }
    else {
        return false;
    }    
}

function main() {
	
	// === Initialisation; extracted from a copy of week 4 practical ===
    const resolution = 50;

    // get the canvas element & gl rendering; extracted from a copy of week 4 practical
    const canvas = document.getElementById("c");
    const gl = canvas.getContext("webgl"); 

    if (gl === null) {
        window.alert("WebGL not supported!");
        return;
    }
    
    // create GLSL shaders, upload the GLSL source, compile the shaders; extracted from a copy of week 4 practical
    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program =  createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);

    // Initialise the shader attributes & uniforms; extracted from a copy of week 4 practical
    const positionAttribute = gl.getAttribLocation(program, "a_position");
    const worldMatrixUniform = gl.getUniformLocation(program, "u_worldMatrix");
    const viewMatrixUniform = gl.getUniformLocation(program, "u_viewMatrix");
    const colourUniform = gl.getUniformLocation(program, "u_colour");

    // Initialise the array buffer; extracted from a copy of week 4 practical
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionAttribute);
    gl.vertexAttribPointer(positionAttribute, 2, gl.FLOAT, false, 0, 0);
	
	
	//=== Instantiate Objects ===
	const blue = [0,0.2,1,1];
	const terrain = new Terrain();
	const chopper = new Helicopter();
	const main_rotor = new mainRotor();
	const back_rotor = new backRotor();
	const hud = new HUD();
	const speedo = new Needle();
	const rain = new Points(blue);
	const other_rain = new Points(blue);
	
	// === Per Frame operations; extracted from a copy of week 4 practical modified for functionality ===
    // update objects in the scene
    let update = function(deltaTime) {
        check(isNumber(deltaTime));
        // update things
		chopper.update(deltaTime, main_rotor, back_rotor);
		hud.update(deltaTime, chopper.moving, chopper.acceleration, speedo);
		rain.update(deltaTime, 50, 1, 0);
		other_rain.update(deltaTime, 50, -3, 0.5);	//time between frame updates, number of particles, rain reset timer start_point, offset
    };

    // redraw the scene
    let render = function() {
        // clear the screen
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0.7, 0.5, 1);							//set background colour to green
        gl.clear(gl.COLOR_BUFFER_BIT);

        // scale the view matrix to the canvas size & resolution; extracted from a copy of week 4 practical
        const sx = 2 * resolution / canvas.width;
        const sy = 2 * resolution / canvas.height;
        const viewMatrix = Matrix.scale(sx, sy);
        gl.uniformMatrix3fv(viewMatrixUniform, false, viewMatrix);
		
        // renders everything
		gl.uniformMatrix3fv(worldMatrixUniform, false, Matrix.identity());
		terrain.render(gl, worldMatrixUniform, colourUniform)
		chopper.render(gl, worldMatrixUniform, colourUniform, main_rotor, back_rotor);
		hud.render(gl, worldMatrixUniform, colourUniform, speedo);
		rain.render(gl, worldMatrixUniform, colourUniform);
		other_rain.render(gl, worldMatrixUniform, colourUniform); 
    };

    // animation loop; extracted from a copy of week 5 practical
    let oldTime = 0;
    let animate = function(time) {
        time = time / 1000;
        let deltaTime = time - oldTime;
        oldTime = time;

        resize(canvas);
        update(deltaTime);
        render();

        requestAnimationFrame(animate);
    }

    // start it going
    animate(0);
}

