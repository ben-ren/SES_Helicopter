"use strict"

/*	Name:	Benjamin rendell
	Number:	44655010 */

class Terrain{
	render(gl, worldMatrixUniform, colourUniform){
		const render_config = {gl, worldMatrixUniform, colourUniform}
	
		const red = [1,0.3,0,1];
		const cyan = [0,1,1,1];
		const black = [0,0,0,1];
	
		//Instantiate terrain components
		const helipad = new Box(black);
		const houseA = new Box(red);
		const houseB = new Box(red);
		const houseC = new Box(red);
		const houseD = new Box(red);
		const houseE = new Box(red);
		const river = new Bezier(cyan);
		const other_river = new Bezier(cyan);
		
		helipad.translation = [9,6];
		helipad.scale = [2, 2];
		//house by helipad
		houseA.translation = [9,8];
		houseA.scale = [2, 1.4];
		//first diagonal house
		houseB.translation = [-2.2, 2];
		houseB.rotation = (3 * Math.PI)/4;			//135 degrees = 3 * pi/4; on the unit circle
		houseB.scale = [3.5, 1.4];
		//second diagonal house
		houseC.translation = [-5.1, 4.9];
		houseC.rotation = (3 * Math.PI)/4;			//135 degrees = 3 * pi/4; on the unit circle
		houseC.scale = [2.5, 1.4];
		//high house
		houseD.translation = [-9, 6];
		houseD.scale = [2.5, 1.4];
		//big house
		houseE.translation = [-9.5,3];
		houseE.scale = [3.5, 2];
		
		//Render terrain components					*JavaObject options are: roof, helipad.		E.g. {helipad: true}
		helipad.render(render_config, {helipad: true});						//render the helipad
		houseA.render(render_config, { roof: true });						//render house by helipad
		houseB.render(render_config, { roof: true });						//render house
		houseC.render(render_config, { roof: true });						//render house
		houseD.render(render_config, { roof: true });						//render house
		houseE.render(render_config, { roof: true });						//render house
		
		//Create bezier array points
		const control_points = ([
			[0, 10], 	//P0
			[7, 1],		//P1
			[-4, 0], 	//P2
			[2, -10]	//P3
		]);
		
		//set curve offset
		var x_offset = 4;
		const control_points_offset = ([
			[0 + x_offset, 10], 	//P0
			[7 + x_offset, 1],		//P1
			[-4 + x_offset, 0], 	//P2
			[2 + x_offset, -10]		//P3
		]);
		
		river.render(render_config, control_points, control_points_offset);		//render bezier river
		
		
		//Create bezier array points
		const c_p_other = ([
			[-18, 1], 		//P0
			[-6, -12],		//P1
			[0, 7], 		//P2
			[2, -10]		//P3
		]);
		
		//set curve offset
		var y_offset = 1;
		const c_p_other_offset = ([
			[-18, 1 + y_offset], 		//P0
			[-6, -12 + y_offset],		//P1
			[0, 7 + y_offset], 		//P2
			[2, -10 + y_offset]		//P3
		]);
		
		other_river.render(render_config, c_p_other, c_p_other_offset);		//render bezier river.render(render_config, ctrl_points, ctrl_points_offset);		//render lower bezier river
	}
}
