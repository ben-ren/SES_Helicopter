"use strict";

/*	Name:	Benjamin rendell
	Number:	44655010 */

class Matrix {
    static identity() {
        return new Float32Array([ 
            1,0,0,  0,1,0,  0,0,1
        ]);
    }

    // Translate by (dx,dy)
    static translation(dx, dy) {
        check(isNumber(dx, dy));

        return new Float32Array([
            1, 0, 0,			//first column
			0, 1, 0,			//second column
			dx, dy, 1		//third column
        ]);
    }

    // Rotate by angle (in radians)
    static rotation(angle) {
        check(isNumber(angle));

        return new Float32Array([
            Math.cos(angle), Math.sin(angle), 0,		//first column
			-Math.sin(angle), Math.cos(angle), 0,		//second column
			0, 0, 1										//third column
        ]);
    }

    // Scale axes by (sx,sy)
    static scale(sx, sy) {
        check(isNumber(sx, sy));

        return new Float32Array([
            sx, 0, 0,		//first column
			0, sy, 0,		//second column
			0, 0, 1			//third column
        ]);
    }

    // Multiply two matrices and return the result
    static multiply(a, b) {
        check(isMat3(a, b));

        let m = new Float32Array(9); // initially all zeros

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    m[i + 3*j] += a[i + 3*k] * b[k+3*j];
                }
            }
        }

        return m;
    }



    // Multiply a vector by a matrix, and return the result
    static multiplyVector(m, v) {
        check(isMat3(m), isVec3(v));

        let v2 = new Float32Array(3);   //initially all zeros

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                v2[j] += m[3*i + j] * v[i];
            }
        }

        return v2;
    }

	static trs(dx, dy, angle, sx, sy){
		check(isNumber(dx, dy, angle, sx, sy));
		
		return new Float32Array([
            sx * Math.cos(angle), Math.sin(angle), 0,		//first column
			-Math.sin(angle), sy * Math.cos(angle), 0,		//second column
			dx, dy, 1										//third column
        ]);
	}
}

