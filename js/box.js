"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

class Box{

	//Initialization
	constructor(colour){
		check(isArray(colour));
	
		this.translation = [0,0];
		this.rotation = 0;			//Uses radians
		this.scale = [1, 1];
		this.colour = colour;
	}

	//draw the building
	render({gl, worldMatrixUniform, colourUniform}, opts = {}){
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));
		
		//setup coordinate system
		let matrix = Matrix.identity();
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
		
		//Sets the object colour
		gl.uniform4f(colourUniform, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);
		
		//draws a box with origin at its center
		const box = new Float32Array([-0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, 0.5]);
		gl.bufferData(gl.ARRAY_BUFFER, box, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, box.length/2);
		
		//lines for drawing roof on box
		if(opts.roof){
			gl.uniform4f(colourUniform, 0, 0, 0, 1);
			const lines = new Float32Array([
			-0.25, 0, 0.25, 0,			//center
			-0.5, -0.5, -0.25, 0, 		//bottom-left
			-0.5, 0.5, -0.25, 0, 		//top-left
			0.5, 0.5, 0.25, 0,			//top-right
			0.5, -0.5, 0.25, 0			//bottom-right
			]);
			
			gl.bufferData(gl.ARRAY_BUFFER, lines, gl.STATIC_DRAW);
			gl.drawArrays(gl.LINES, 0, lines.length/2);
		}
		
		//draws a helipad inside the box
		if(opts.helipad){
		gl.uniform4f(colourUniform, 1, 1, 1, 1);
			const Hpad = new Float32Array([
			-0.25, -0.25, -0.25, 0.25, -0.125, -0.25, -0.125, -0.25, -0.25, 0.25, -0.125, 0.25,					//left rect
			0.25, -0.25, 0.25, 0.25, 0.125, -0.25, 0.125, -0.25, 0.25, 0.25, 0.125, 0.25,						//right rect
			-0.125, -0.0625, -0.125, 0.0625, 0.125, -0.0625, -0.125, 0.0625, 0.125, 0.0625, 0.125, -0.0625	//bridging rect
			]);
			
			gl.bufferData(gl.ARRAY_BUFFER, Hpad, gl.STATIC_DRAW);
			gl.drawArrays(gl.TRIANGLES, 0, Hpad.length/2);
		}
	}
}