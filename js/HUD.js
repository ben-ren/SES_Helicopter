"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

class HUD{
	
	// Initialisation
	constructor() {
		this.translation = [0,0];
		this.rotation = 0;			//Uses radians
		this.scale = [1, 1];
		this.speed = 3.5;
	}
	
	// update the helicopter on each frame
	update(deltaTime, moving, accel, needle) {
		check(isNumber(deltaTime, accel), isBoolean(moving));
		needle.update(deltaTime, moving, accel);
	}

	// draw the hud
	render(gl, worldMatrixUniform, colourUniform, needle) {
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));		//check variable inputs
		
		const render_config = {gl, worldMatrixUniform, colourUniform};
		
		const white = [1, 1, 1, 1];
		const arc_one = new Bezier(white);
		const arc_two = new Bezier(white);
		const tick_one = new Box(white);
		const tick_two = new Box(white);
		const tick_three = new Box(white);
		const tick_four = new Box(white);
		const tick_five = new Box(white);
		const tick_six = new Box(white);
		const tick_seven = new Box(white);
		
		//speedo transformations
		//tick_one
		tick_one.translation = [5,-6];
		tick_one.rotation = (90 * Math.PI)/180;
		tick_one.scale = [0.1, 1];
		//tick_two
		tick_two.translation = [5.3,-4.8];
		tick_two.rotation = (60 * Math.PI)/180;
		tick_two.scale = [0.1, 1];
		//tick_three
		tick_three.translation = [6.2, -3.9];
		tick_three.rotation = (30 * Math.PI)/180;
		tick_three.scale = [0.1, 1];
		//tick_four
		tick_four.translation = [7.45,-3.64];
		tick_four.scale = [0.1, 1];
		//tick_five
		tick_five.translation = [8.65,-3.9];
		tick_five.rotation = -(30 * Math.PI)/180;
		tick_five.scale = [0.1, 1];
		//tick_six
		tick_six.translation = [9.7,-4.8];
		tick_six.rotation = -(60 * Math.PI)/180;
		tick_six.scale = [0.1, 1];
		//tick_seven
		tick_seven.translation = [10,-6];
		tick_seven.rotation = -(90 * Math.PI)/180;
		tick_seven.scale = [0.1, 1];
		
		//setup coordinate system
		let matrix = Matrix.identity();
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
		
		//Create bezier array points for large arc
		const ctrl_pts = ([
			[5, -6], 		//P0
			[5, -2.8],		//P1
			[10, -2.8], 	//P2
			[10, -6.1]		//P3
		]);
		
		//set curve offset for large arc
		var offset = 0.05;
		const ctrl_pts_offset = ([
			[5 - offset, -6], 		//P0
			[5, -2.8 + offset],		//P1
			[10, -2.8 + offset], 	//P2
			[10 + offset, -6.1]		//P3
		]);
		arc_one.render(render_config, ctrl_pts, ctrl_pts_offset);		//render large arc
		
		//Create bezier array points for small arc
		const pts = ([
			[5.5, -6], 		//P0
			[5.5, -3.5],	//P1
			[9.5, -3.5], 	//P2 
			[9.5, -6.1]		//P3
		]);
		
		//set curve offset for small arc
		var offset = 0.05;
		const pts_offset = ([
			[5.5 - offset, -6], 		//P0
			[5.5, -3.5 + offset],		//P1
			[9.5, -3.5 + offset], 		//P2
			[9.5 + offset, -6.1]		//P3
		]);
		arc_two.render(render_config, pts, pts_offset);		//render small arc
		
		tick_one.render(render_config);
		tick_two.render(render_config);
		tick_three.render(render_config);
		tick_four.render(render_config);
		tick_five.render(render_config);
		tick_six.render(render_config);
		tick_seven.render(render_config);
		
		needle.renderNeedle(render_config, matrix);
		needle.translation = [7.5, -6];
	}
}

class Needle extends HUD{
	// Initialisation
	constructor() {
		super();
	}
	
	// update the needle on each frame
	update(deltaTime, moving, acceleration) {
		check(isNumber(deltaTime), isBoolean(moving));
		
		if(!moving && this.rotation < (90 * Math.PI)/180){
			this.rotation += (120 * Math.PI)/180 * deltaTime;
		} else if (moving && this.rotation > -(30 * Math.PI)/180){
			this.rotation -= (acceleration * 60 * Math.PI)/180 * deltaTime;
		}
	}

	// draw the needle on the hud
	renderNeedle({gl, worldMatrixUniform, colourUniform}, matrix) {
		check(isContext(gl), isUniformLocation(worldMatrixUniform, colourUniform));		//check variable inputs
		
		const yellow = [1, 1, 0, 1];
		const needle_joint = new Circle(yellow);
		
		needle_joint.scale = [0.25, 0.25];
		
		//setup coordinate system
		matrix = Matrix.multiply(matrix, Matrix.translation(this.translation[0], this.translation[1]));
		matrix = Matrix.multiply(matrix, Matrix.rotation(this.rotation));
		matrix = Matrix.multiply(matrix, Matrix.scale(this.scale[0], this.scale[1]));
		
		needle_joint.render(gl, worldMatrixUniform, colourUniform, matrix);
		
		//set the uniforms
		gl.uniformMatrix3fv(worldMatrixUniform, false, matrix);
		
		//Sets the object colour
		gl.uniform4f(colourUniform, yellow[0], yellow[1], yellow[2], yellow[3]);		//colours lines yellow
		
		//draws the needle
		const needle = new Float32Array([
		0, 2.3, -0.165, 1.15, 0, 0,
		0, 2.3, 0.165, 1.15, 0, 0
		]);
		gl.bufferData(gl.ARRAY_BUFFER, needle, gl.STATIC_DRAW);
		gl.drawArrays(gl.TRIANGLES, 0, needle.length/2);
	}
}