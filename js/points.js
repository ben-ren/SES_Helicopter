"use strict"

class Points{
	//Initialization
	constructor(colour){
		check(isArray(colour));
	
		this.translation = [0,0];
		this.rotation = 0;			//Uses radians
		this.scale = [1, 1];
		this.colour = colour;
		this.time = 0;
		this.reset_pos = [0,0];
		this.positions = [];
	}
	
	update(deltaTime, nPoints, time, offset){
		if(this.time < getRandomInt(7,9)){	//getRandomInt(7,10)
			var val = getRandomInt(5,6);
			this.translation[0] -= val * deltaTime;
			this.translation[1] -= val * deltaTime;
			this.time+=0.1;
			if((Math.cos(this.time)) < 0){
				this.positions.splice(getRandomInt(-20,20));
			}
		}else{
			this.translation[0] = this.reset_pos[0];
			this.translation[1] = this.reset_pos[1];
			this.time = time;
		}
		for(var i=0; i<nPoints; i+=2){
			this.positions.push(getRandomInt(-20, 20) + offset);
		}
	}

	//draw the points
	render(gl, worldMatrixUniform, colourUniform){
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
		
		//draws an array of points
		const points = new Float32Array(this.positions);
		gl.bufferData(gl.ARRAY_BUFFER, points, gl.STATIC_DRAW);
		gl.drawArrays(gl.POINTS, 0, points.length/2);
	}
	
	
	
}

//code obtained from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random 
const getRandomInt = function(min, max){
	//The maximum is exclusive and the minimum is inclusive
	return Math.floor(Math.random() * (max - min + 1)) + min;
}