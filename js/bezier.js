"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

class Bezier{
	//Initialization
	constructor(colour){
		check(isArray(colour));
	
		this.translation = [0,0];
		this.rotation = 0;			//Uses radians
		this.scale = [1, 1];
		this.colour = colour;
	}

	//renders the river
	render({gl, worldMatrixUniform, colourUniform}, ctrl_points, ctrl_points_offset){
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));
		
		//setup coordinate system
		let matrix = Matrix.identity();
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
		
		//Sets the river colour
		gl.uniform4f(colourUniform, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);
		
		var segment_size = 0.01;	//sets the size of each segment
		var curveSegments = [];		//empty array for storing points
		
		//calculates the points on the bezier curve
		for(var t=0; t<1; t+=segment_size){
			var crv = this.bezier(ctrl_points, t);				//stores primary curve 
			var offset = this.bezier(ctrl_points_offset, t);	//stores curve offset
			curveSegments.push(crv.x)
			curveSegments.push(crv.y)
			curveSegments.push(offset.x);
			curveSegments.push(offset.y);
		}
		
		//draws the bezier curve
		const curve = new Float32Array(curveSegments);
		gl.bufferData(gl.ARRAY_BUFFER, curve, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLE_STRIP, 0, curve.length/2);
	}
	
	/**	Here's the code I used as a reference for calculating the points in a bezier curve:
	*	https://stackoverflow.com/questions/16227300/how-to-draw-bezier-curves-with-native-javascript-code-without-ctx-beziercurveto 
	*/
	bezier(pts, t){
		check(isArray(pts));
		const P0 = pts[0];
		const P1 = pts[1];
		const P2 = pts[2];
		const P3 = pts[3];
		
		//Equation for finding a point on a bezier curve; B(t) = (1-t)^3 P0 + 3t(1-t)^2 P1 + 3t^2(1-t) P2 + t^3 P3. 
		var x = (Math.pow((1-t), 3) * P0[0]) + (3*t*Math.pow((1-t), 2) * P1[0]) + (3*Math.pow(t, 2)*(1-t) * P2[0]) + (Math.pow(t, 3) * P3[0]);
		var y = (Math.pow((1-t), 3) * P0[1]) + (3*t*Math.pow((1-t), 2) * P1[1]) + (3*Math.pow(t, 2)*(1-t) * P2[1]) + (Math.pow(t, 3) * P3[1]);
		
		return {x, y};
	}
}