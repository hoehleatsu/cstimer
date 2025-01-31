(function(circle) {
	function l(a, c) {
		var ax = a % 12;
		a = ~~(a / 12);
		var e = [];
		mathlib.set8Perm(e, a << 1, 6);
		1 == mathlib.getNParity(a << 1, 6) && circle(e, 4, 5);
		0 == c && circle(e, 0, 3, 1);
		2 == c && circle(e, 1, 5, 2);
		1 == c && circle(e, 0, 2, 4);
		3 == c && circle(e, 3, 4, 5);
		return (mathlib.get8Perm(e, 6) >> 1) * 12 + cornerpermmv[ax][c];
	}

	function i(idx, move) {
		var fixedtwst = [];
		var twst = [];
		for (var i = 0; i < 4; i++) {
			fixedtwst[i] = idx % 3;
			idx = ~~(idx / 3);
		}
		for (var i = 0; i < 3; i++) {
			twst[i] = idx % 3;
			idx = ~~(idx / 3);
		}
		twst[3] = (6 - twst[0] - twst[1] - twst[2]) % 3;
		fixedtwst[move] = (fixedtwst[move] + 1) % 3;
		var t;
		switch (move) {
			case 0:
				t = twst[0];
				twst[0] = twst[2] + 2;
				twst[2] = twst[1] + 2;
				twst[1] = t + 2;
				break;
			case 1:
				t = twst[0];
				twst[0] = twst[1] + 2;
				twst[1] = twst[3] + 2;
				twst[3] = t + 2;
				break;
			case 2:
				t = twst[0];
				twst[0] = twst[3] + 2;
				twst[3] = twst[2] + 2;
				twst[2] = t + 2;
				break;
			case 3:
				t = twst[1];
				twst[1] = twst[2] + 2;
				twst[2] = twst[3] + 2;
				twst[3] = t + 2;
				break;
			default:
		}
		for (var i = 2; i >= 0; i--) {
			idx = idx * 3 + twst[i] % 3;
		}
		for (var i = 3; i >= 0; i--) {
			idx = idx * 3 + fixedtwst[i];
		}
		return idx;
	}

	var cornerpermmv = [
		[6, 5, 10, 1],
		[9, 7, 4, 2],
		[3, 11, 8, 0],
		[10, 1, 6, 5],
		[0, 8, 11, 3],
		[7, 9, 2, 4],
		[4, 2, 9, 7],
		[11, 3, 0, 8],
		[1, 10, 5, 6],
		[8, 0, 3, 11],
		[2, 4, 7, 9],
		[5, 6, 1, 10]
	];

	var solv = new mathlib.Solver(4, 2, [
		[0, l, 4320],
		[0, i, 2187]
	]);

	function getSolution(sol) {
		var ret = [];
		var move2str = ["L", "R", "B", "U"]; //RLDB (in jaap's notation) rotated by z2
		for (var i = 0; i < sol.length; i++) {
			var axis = sol[i][0];
			var pow = 1 - sol[i][1];
			if (axis == 2) { //step two.
				for (var p = 0; p <= pow; p++) {
					circle(move2str, 0, 3, 1);
				}
			}
			ret.push(move2str[axis] + ((pow == 1) ? "'" : ""));
		}
		return ret.join(" ");
	}
	var ori = [0, 1, 2, 0, 2, 1, 1, 2, 0, 2, 1, 0];

	function getScramble(type) {
		var perm, twst, lim = 6,
			l = type == 'skbso' ? 8 : 0;
		do {
			perm = mathlib.rn(4320);
			twst = mathlib.rn(2187);
		} while (perm == 0 && twst == 0 || ori[perm % 12] != (twst + ~~(twst / 3) + ~~(twst / 9) + ~~(twst / 27)) % 3 || solv.search([perm, twst], 0, lim) != null);
		var sol = solv.search([perm, twst], l).reverse();
		return getSolution(sol);
	}
	scrMgr.reg(['skbo', 'skbso'], getScramble);
})(mathlib.circle);