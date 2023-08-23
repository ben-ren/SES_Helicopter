"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

/**
*	Code obtained from week 5 practicals. 
*	
*	Modified to work with program.
*/
class Circle{
	constructor(colour) {
        check(isArray(colour));
		this.translation = [0,0];
		this.rotation = 0;			//Uses radians
		this.scale = [1, 1];
		this.colour = colour;
		
        const nSides = 12;
        this.points = new Float32Array(nSides * 2);

		//sets circumference points
        for (let i = 0; i < nSides; i++) {
            this.points[2*i] = Math.cos(i * (2*Math.PI)/nSides);     // TODO: set the x coordinate;
            this.points[2*i+1] = Math.sin(i * (2*Math.PI)/nSides);   // TODO: set the y coordiante
        }
    }

    render(gl, worldMatrixUniform, colourUniform, matrix) {
        check(isContext(gl), isUniformLocation(colourUniform));
		
		//setup coordinate system
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
		
		//set colour
		gl.uniform4f(colourUniform, this.colour[0], this.colour[1], this.colour[2], this.colour[3]);
		
		//draw circle using a TRIANGLE_FAN
		gl.bufferData(gl.ARRAY_BUFFER, this.points, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLE_FAN, 0, this.points.length/2);
    }
}