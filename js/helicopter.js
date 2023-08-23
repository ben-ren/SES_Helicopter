"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

class Helicopter{

	// Initialisation
	constructor() {
		this.translation = [0,0];
		this.rotation = 0;			//Uses radians
		this.scale = [1, 1];
		this.speed = 3;
		this.acceleration = 0;
		this.moving = false;
	}
	
	// update the helicopter on each frame
	update(deltaTime, rotor, b_rotor) {
		check(isNumber(deltaTime));
		
		//helicopter control inputs
		if (Input.leftPressed) {					//rotate helicopter by 1.5 degrees
			this.rotation += (this.speed * Math.PI)/180;
		}
		if (Input.rightPressed) {			//rotate helicopter by 1.5 degrees
			this.rotation -= (this.speed * Math.PI)/180;
		}
		if (Input.upPressed) {				//translate helicopter's location based off of current rotation
			if(this.acceleration < 3){
				this.acceleration+=0.05;
			}
			this.translation[1] += Math.cos(this.rotation) * this.acceleration * this.speed * deltaTime;
			this.translation[0] += -Math.sin(this.rotation) * this.acceleration * this.speed * deltaTime;
			this.moving = true;
		} else {
			this.moving = false;
			this.acceleration = 0;
		}

		rotor.updateChild(deltaTime);
		b_rotor.updateChild();
	}

	// draw the helicopter
	render(gl, worldMatrixUniform, colourUniform, rotor, b_rotor) {
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));		//check variable inputs
		
		//setup coordinate system
		let matrix = Matrix.identity();
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
		
		//Sets the object colour
		gl.uniform4f(colourUniform, 0.518, 0.525, 0.537, 1);		//shade of metal grey used is: R-132, G-134, B-137
		
		//draws the helicopter
		const chopper = new Float32Array([
		-0.5, -0.5, -0.5, 0.5, 0, -1, 			//helicopter port
		0.5, -0.5, 0.5, 0.5, 0, -1, 			//helicopter starboard
		-0.5, 0.5, 0.5, 0.5, 0, 1,				//helicopter bow
		-0.5, 0.5, 0.5, 0.5, 0, -2				//helicopter stern
		]);
		gl.bufferData(gl.ARRAY_BUFFER, chopper, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, chopper.length/2);
		
		//render the rotor
		rotor.renderChild(gl, worldMatrixUniform, colourUniform, matrix);
		b_rotor.renderChild(gl, worldMatrixUniform, colourUniform, matrix);
		b_rotor.translation = [0, -1.7];
	}
}

class mainRotor extends Helicopter{
	constructor(){
		super();
	}
	
	updateChild(deltaTime) {
		check(isNumber(deltaTime));
		this.rotation += (540 * Math.PI)/180 * deltaTime;
	}
	
	renderChild(gl, worldMatrixUniform, colourUniform, matrix){
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));
	
		//setup coordinate system
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
	
		//Sets the rotor colour
		gl.uniform4f(colourUniform, 0, 0, 0, 1);		//shade of metal grey used is: R-132, G-134, B-137
		
		//draws the helicopter rotor
		const rotor = new Float32Array([
		0, 0, -1.3, -0.25, -1.3, 0.25, 		//port rotor
		0, 0, 1.3, -0.25, 1.3, 0.25,		//starboard rotor
		0, 0, -0.25, -1.3, 0.25, -1.3, 		//stern rotor
		0, 0, -0.25, 1.3, 0.25, 1.3, 		//bow rotor
		]);
		gl.bufferData(gl.ARRAY_BUFFER, rotor, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, rotor.length/2);
	}
}

class backRotor extends Helicopter{
	constructor(){
		super();
		this.time = 0;
	}
	
	updateChild() {
		this.scale[1] += Math.cos(this.time + Math.PI);
		this.time ++;
	}
	
	renderChild(gl, worldMatrixUniform, colourUniform, matrix){
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));
	
		//setup coordinate system
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
	
		//Sets the rotor colour
		gl.uniform4f(colourUniform, 0, 0, 0, 1);		//shade of metal grey used is: R-132, G-134, B-137
		
		//draws the helicopter rotor
		const rotor = new Float32Array([
		0, 0, 0.25, -0.2, 0.25, 0.2			//back rotor
		]);
		gl.bufferData(gl.ARRAY_BUFFER, rotor, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, rotor.length/2);
	}
}