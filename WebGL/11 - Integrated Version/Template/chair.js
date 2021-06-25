var dl_vao
var dl_vbo
var dl_program
var dl_numOfTri

var dl_mUniform
var dl_vUniform
var dl_projUniform
var dl_lightPositionUniform
var dl_lightAmbientUniform
var dl_lightDiffuseUniform
var dl_lightSpecularUniform
var dl_matAmbientUniform
var dl_matDiffuseUniform
var dl_matSpecularUniform
var dl_matShininessUnifom

var dl_trans_x = 0.0
var dl_trans_y = -3.6
var dl_trans_z = -11.5

var dl_scale = 2.21

function DL_getRotatedVertices(angle, axis, povars) {
	if(axis == 0) {
		return [
			povars[0], 
			povars[1] * Math.cos(angle) + povars[2] * Math.sin(angle), 
			povars[1] * Math.sin(angle) - povars[2] * Math.cos(angle)
		]
	} else if(axis == 1) {
		return [] //To Implement
	} else { 
		return [] //To Implement
	}
}


function DL_getChairVertexData() {
	var angle = Math.PI / 180 * 25;
	var array = [];

	//Chair Back Rest
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.7, 0.6, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[1.0, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.7, 0.8, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[1.0, 0.9]
	);

	for(var i = 8; i > 0; i--) {
		var theta = 2.0 * Math.PI * (i / 8) * 0.25;
		var theta_1 = 2.0 * Math.PI * ((i - 1) / 8) * 0.25;

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.01]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
			[0.5, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [Math.cos(theta) * 0.25 + 0.45, Math.sin(theta) * 0.2 + 0.8, 0.01]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
			[0.0, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [Math.cos(theta_1) * 0.25 + 0.45, Math.sin(theta_1) * 0.2 + 0.8, 0.01]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
			[0.0, 0.0]
		);
	}
	
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]),
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.45, 1.0, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]),
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.45, 1.0, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]),
		[0.5, 0.0]
	);

	for(var i = 0; i < 8; i++) {
		var theta = 2.0 * Math.PI * (i / 8) * 0.25;
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 8) * 0.25;	
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.01]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
			[0.5, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-Math.cos(theta) * 0.25 - 0.45, Math.sin(theta) * 0.2 + 0.8, 0.01]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
			[0.0, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-Math.cos(theta_1) * 0.25 - 0.45, Math.sin(theta_1) * 0.2 + 0.8, 0.01]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
			[0.0, 0.0]
		);
	}

	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.7, 0.8, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.0, 0.9]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.7, 0.6, 0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.0, 0.0]
	);
	


	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.7, 0.6, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
		[1.0, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.7, 0.8, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
		[1.0, 0.9]
	);

	for(var i = 8; i > 0; i--) {
		var theta = 2.0 * Math.PI * (i / 8) * 0.25;
		var theta_1 = 2.0 * Math.PI * ((i - 1) / 8) * 0.25;

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.0]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
			[0.5, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [Math.cos(theta) * 0.25 + 0.45, Math.sin(theta) * 0.2 + 0.8, 0.0]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
			[0.0, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [Math.cos(theta_1) * 0.25 + 0.45, Math.sin(theta_1) * 0.2 + 0.8, 0.0]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
			[0.0, 0.0]
		);
	}
	
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]),
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.45, 1.0, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]),
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.45, 1.0, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]),
		[0.5, 0.0]
	);

	for(var i = 0; i < 8; i++) {
		var theta = 2.0 * Math.PI * (i / 8) * 0.25;
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 8) * 0.25;	
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.0]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
			[0.5, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-Math.cos(theta) * 0.25 - 0.45, Math.sin(theta) * 0.2 + 0.8, 0.0]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
			[0.0, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-Math.cos(theta_1) * 0.25 - 0.45, Math.sin(theta_1) * 0.2 + 0.8, 0.0]), 
			DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
			[0.0, 0.0]
		);
	}

	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.0, 0.6, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
		[0.5, 0.0]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.7, 0.8, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
		[0.0, 0.9]
	);
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.7, 0.6, 0.0]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, -1.0]), 
		[0.0, 0.0]
	);
	
	//Front Legs
	for(var i = 0; i < 10; i++) {
		var theta = 2.0 * Math.PI * (i / 10);
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 10);
		var sin_0 = Math.sin(theta);
		var cos_0 = Math.cos(theta);
		var sin_1 = Math.sin(theta_1);
		var cos_1 = Math.cos(theta_1);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 - 0.68, 0.78, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 - 0.68, -1.0, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 - 0.68, 0.78, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 - 0.68, 0.78, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 - 0.68, -1.0, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 - 0.68, -1.0, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 0.0]
		);

		for(var j = 10; j < 20; j++) {
			var phi_0 = 2.0 * Math.PI * (j / 10) * 0.25;
			var phi_1 = 2.0 * Math.PI * ((j + 1) / 10) * 0.25;
			var sinp_0 = Math.sin(phi_0);
			var sinp_1 = Math.sin(phi_1);
			var cosp_0 = Math.cos(phi_0);
			var cosp_1 = Math.cos(phi_1);

			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_0) * cosp_0 - 0.43, (0.2 + 0.03 * cos_0) * sinp_0 + 0.78, 0.03 * sin_0 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_0 * cosp_0, cos_0 * sinp_0, sin_0]),
				[i / 9, 1.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_1) * cosp_0 - 0.43, (0.2 + 0.03 * cos_1) * sinp_0 + 0.78, 0.03 * sin_1 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_1 * cosp_0, cos_1 * sinp_0, sin_1]),
				[i / 9, 0.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_1) * cosp_1 - 0.43, (0.2 + 0.03 * cos_1) * sinp_1 + 0.78, 0.03 * sin_1 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_1 * cosp_1, cos_1 * sinp_1, sin_1]),
				[(i + 1) / 9, 1.0]
			);
		
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_0) * cosp_0 - 0.43, (0.2 + 0.03 * cos_0) * sinp_0 + 0.78, 0.03 * sin_0 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_0 * cosp_0, cos_0 * sinp_0, sin_0]),
				[i / 9, 1.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_1) * cosp_1 - 0.43, (0.2 + 0.03 * cos_1) * sinp_1 + 0.78, 0.03 * sin_1 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_1 * cosp_1, cos_1 * sinp_1, sin_1]),
				[i / 9, 0.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_0) * cosp_1 - 0.43, (0.2 + 0.03 * cos_0) * sinp_1 + 0.78, 0.03 * sin_0 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_0 * cosp_0, cos_0 * sinp_0, sin_0]),
				[(i + 1) / 9, 0.0]
			);	
		}

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.43, sin_0 * 0.03 + 0.98, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [0.0, sin_0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.43, sin_0 * 0.03 + 0.98, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [0.0, sin_0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.43, sin_1 * 0.03 + 0.98, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [0.0, sin_1, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.43, sin_1 * 0.03 + 0.98, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [0.0, sin_1, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.43, sin_0 * 0.03 + 0.98, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [0.0, sin_0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.43, sin_1 * 0.03 + 0.98, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [0.0, sin_1, cos_1]),
			[(i + 1) / 9, 0.0]
		);

		for(var j = 0; j < 10; j++) {
			var phi_0 = 2.0 * Math.PI * (j / 10) * 0.25;
			var phi_1 = 2.0 * Math.PI * ((j + 1) / 10) * 0.25;
			var sinp_0 = Math.sin(phi_0);
			var sinp_1 = Math.sin(phi_1);
			var cosp_0 = Math.cos(phi_0);
			var cosp_1 = Math.cos(phi_1);

			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_0) * cosp_0 + 0.43, (0.2 + 0.03 * cos_0) * sinp_0 + 0.78, 0.03 * sin_0 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_0 * cosp_0, cos_0 * sinp_0, sin_0]),
				[i / 9, 1.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_1) * cosp_0 + 0.43, (0.2 + 0.03 * cos_1) * sinp_0 + 0.78, 0.03 * sin_1 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_1 * cosp_0, cos_1 * sinp_0, sin_1]),
				[i / 9, 0.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_1) * cosp_1 + 0.43, (0.2 + 0.03 * cos_1) * sinp_1 + 0.78, 0.03 * sin_1 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_1 * cosp_1, cos_1 * sinp_1, sin_1]),
				[(i + 1) / 9, 1.0]
			);
		
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_0) * cosp_0 + 0.43, (0.2 + 0.03 * cos_0) * sinp_0 + 0.78, 0.03 * sin_0 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_0 * cosp_0, cos_0 * sinp_0, sin_0]),
				[i / 9, 1.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_1) * cosp_1 + 0.43, (0.2 + 0.03 * cos_1) * sinp_1 + 0.78, 0.03 * sin_1 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_1 * cosp_1, cos_1 * sinp_1, sin_1]),
				[i / 9, 0.0]
			);
			array = array.concat(
				DL_getRotatedVertices(angle, 0, [(0.25 + 0.03 * cos_0) * cosp_1 + 0.43, (0.2 + 0.03 * cos_0) * sinp_1 + 0.78, 0.03 * sin_0 - 0.03]),
				DL_getRotatedVertices(angle, 0, [cos_0 * cosp_1, cos_0 * sinp_1, sin_0]),
				[(i + 1) / 9, 0.0]
			);
		}

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 + 0.68, 0.78, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 + 0.68, -1.0, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 + 0.68, 0.78, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 + 0.68, 0.78, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 + 0.68, -1.0, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 + 0.68, -1.0, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 0.0]
		);
	}

	for(var i = 0; i < 10; i++) {
		var theta = 2.0 * Math.PI * (i / 10);
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 10);
		var sin_0 = Math.sin(theta);
		var cos_0 = Math.cos(theta);
		var sin_1 = Math.sin(theta_1);
		var cos_1 = Math.cos(theta_1);

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.67, sin_0 * 0.03 - 0.62, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.67, sin_0 * 0.03 - 0.62, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.67, sin_1 * 0.03 - 0.62, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.67, sin_1 * 0.03 - 0.62, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.67, sin_0 * 0.03 - 0.62, cos_0 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.67, sin_1 * 0.03 - 0.62, cos_1 * 0.03 - 0.03]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 0.0]
		);
	}

	angle = Math.PI / 180 * -25;
	
	//Back Legs
	for(var i = 0; i < 10; i++) {
		var theta = 2.0 * Math.PI * (i / 10);
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 10);
		var sin_0 = Math.sin(theta);
		var cos_0 = Math.cos(theta);
		var sin_1 = Math.sin(theta_1);
		var cos_1 = Math.cos(theta_1);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 - 0.68, 0.15, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 - 0.68, -1.0, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 - 0.68, 0.15, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 - 0.68, 0.15, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 - 0.68, -1.0, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 - 0.68, -1.0, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 0.0]
		);

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 + 0.68, 0.15, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 + 0.68, -1.0, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 + 0.68, 0.15, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 + 0.68, 0.15, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_0 * 0.03 + 0.68, -1.0, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [sin_1 * 0.03 + 0.68, -1.0, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 0.0]
		);
	}

	for(var i = 0; i < 10; i++) {
		var theta = 2.0 * Math.PI * (i / 10);
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 10);
		var sin_0 = Math.sin(theta);
		var cos_0 = Math.cos(theta);
		var sin_1 = Math.sin(theta_1);
		var cos_1 = Math.cos(theta_1);

		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.67, sin_0 * 0.03 - 0.62, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.67, sin_0 * 0.03 - 0.62, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.67, sin_1 * 0.03 - 0.62, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 1.0]
		);
	
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [-0.67, sin_1 * 0.03 - 0.62, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[i / 9, 1.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.67, sin_0 * 0.03 - 0.62, cos_0 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_0, 0.0, cos_0]),
			[i / 9, 0.0]
		);
		array = array.concat(
			DL_getRotatedVertices(angle, 0, [0.67, sin_1 * 0.03 - 0.62, cos_1 * 0.03 - 0.23]),
			DL_getRotatedVertices(angle, 0, [sin_1, 0.0, cos_1]),
			[(i + 1) / 9, 0.0]
		);
	}

	//Seat
	array = array.concat(
		[0.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);

	array = array.concat(
		[-0.45, 0.0, 0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	
	array = array.concat(
		[0.45, 0.0, 0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	

	array = array.concat(
		[0.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);

	array = array.concat(
		[-0.65, 0.0, -0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	
	array = array.concat(
		[-0.65, 0.0, 0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);


	array = array.concat(
		[0.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);

	array = array.concat(
		[0.45, 0.0, -0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	
	array = array.concat(
		[-0.45, 0.0, -0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);


	array = array.concat(
		[0.0, 0.0, 0.0],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);

	array = array.concat(
		[0.65, 0.0, -0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	
	array = array.concat(
		[0.65, 0.0, 0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);

	for(var i = 0; i < 40; i++) {
		array = array.concat(
			[0.0, 0.0, 0.0],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);

		var theta_0 = 2.0 * Math.PI * (i / 40);
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 40);

		var x = 0.0, z = 0.0;
		if(i < 10) {
			x = 0.45;
			z = 0.3;
		} else if(i < 20) {
			x = 0.45;
			z = -0.3;
		} else if(i < 30) {
			x = -0.45;
			z = -0.3;	
		} else {
			x = -0.45;
			z = 0.3;
		}

		array = array.concat(
			[Math.sin(theta_0) * 0.2 + x, 0.0, Math.cos(theta_0) * 0.2 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);
		array = array.concat(
			[Math.sin(theta_1) * 0.2 + x, 0.0, Math.cos(theta_1) * 0.2 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);		
	}

	array = array.concat(
		[-0.45, -0.06, 0.5],
		[0.0, 0.0, 1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, 0.0, 0.5],
		[0.0, 0.0, 1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, 0.0, 0.5],
		[0.0, 0.0, 1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, 0.0, 0.5],
		[0.0, 0.0, 1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, -0.06, 0.5],
		[0.0, 0.0, 1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, -0.06, 0.5],
		[0.0, 0.0, 1.0],
		[0.0, 0.0]
	);
	

	array = array.concat(
		[-0.65, -0.06, -0.3],
		[1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, 0.0, -0.3],
		[1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, 0.0, 0.3],
		[1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, 0.0, 0.3],
		[1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, -0.06, 0.3],
		[1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, -0.06, -0.3],
		[1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	

	array = array.concat(
		[0.45, -0.06, -0.5],
		[0.0, 0.0, -1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, 0.0, -0.5],
		[0.0, 0.0, -1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, 0.0, -0.5],
		[0.0, 0.0, -1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, 0.0, -0.5],
		[0.0, 0.0, -1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, -0.06, -0.5],
		[0.0, 0.0, -1.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, -0.06, -0.5],
		[0.0, 0.0, -1.0],
		[0.0, 0.0]
	);

	
	array = array.concat(
		[0.65, -0.06, -0.3],
		[-1.0, 0.0, 0.0],
		[0.0, 0.0]
	);	
	array = array.concat(
		[0.65, 0.0, -0.3],
		[-1.0, 0.0, 0.0],
		[0.0, 0.0]
	);	
	array = array.concat(
		[0.65, 0.0, 0.3],
		[-1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.65, 0.0, 0.3],
		[-1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.65, -0.06, 0.3],
		[-1.0, 0.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.65, -0.06, -0.3],
		[-1.0, 0.0, 0.0],
		[0.0, 0.0]
	);	
	
	for(var i = 0; i < 40; i++) {
		var theta_0 = 2.0 * Math.PI * (i / 40);
		var theta_1 = 2.0 * Math.PI * ((i + 1) / 40);
		var sin_0 = Math.sin(theta_0) * 0.2;
		var sin_1 = Math.sin(theta_1) * 0.2;
		var cos_0 = Math.cos(theta_0) * 0.2;
		var cos_1 = Math.cos(theta_1) * 0.2;

		var x = 0.0, z = 0.0;
		if(i < 10) {
			x = 0.45;
			z = 0.3;
		} else if(i < 20) {
			x = 0.45;
			z = -0.3;
		} else if(i < 30) {
			x = -0.45;
			z = -0.3;	
	 	} else {
			x = -0.45;
			z = 0.3;
		}

		array = array.concat(
			[sin_0 + x, -0.06, cos_0 + z],
			[sin_0, 0.0, cos_0],
			[0.0, 0.0]
		);
		array = array.concat(
			[sin_0 + x, 0.0, cos_0 + z],
			[sin_0, 0.0, cos_0],
			[0.0, 0.0]
		);
		array = array.concat(
			[sin_1 + x, 0.0, cos_1 + z],
			[sin_1, 0.0, cos_1],
			[0.0, 0.0]
		);		
		
		array = array.concat(
			[sin_1 + x, 0.0, cos_1 + z],
			[sin_1, 1.0, cos_1],
			[0.0, 0.0]
		);		
		array = array.concat(
			[sin_1 + x, -0.06, cos_1 + z],
			[sin_1, 1.0, cos_1],
			[0.0, 0.0]
		);		
		array = array.concat(
			[sin_0 + x, -0.06, cos_0 + z],
			[sin_0, 1.0, cos_0],
			[0.0, 0.0]
		);
	}
	return Float32Array.from(array)
}

function DL_initChair() {
	var vertexSrc = 
	"#version 300 es\n"+
	"in vec4 vPos;\n"+
	"in vec3 vNormal;\n"+
	"uniform mat4 u_mMat;\n"+
	"uniform mat4 u_vMat;\n"+
	"uniform mat4 u_projMat;\n"+
	"uniform vec4 lightPosition;\n"+
	"out vec3 vs_N;\n"+
	"out vec3 vs_L;\n"+
	"out vec3 vs_V;\n"+
	"void main(void) {\n"+
	"gl_Position = u_projMat * u_vMat * u_mMat * vPos;\n"+
	"vec4 P = u_vMat * u_mMat * vPos;\n"+
	"vs_N = mat3(u_vMat * u_mMat) * vNormal;\n"+
	"vs_L = vec3(lightPosition - P);\n"+
	"vs_V = -P.xyz;\n"+
	"}\n"

	var fragSrc = 
	"#version 300 es\n"+
	"precision highp float;\n"+
	"in vec3 vs_N;\n"+
	"in vec3 vs_L;\n"+
	"in vec3 vs_V;\n"+
	"uniform vec4 lightAmbient;\n"+
	"uniform vec4 lightDiffuse;\n"+
	"uniform vec4 lightSpecular;\n"+
	"uniform vec4 matAmbient;\n"+
	"uniform vec4 matDiffuse;\n"+
	"uniform vec4 matSpecular;\n"+
	"uniform float matShininess;\n"+
	"out vec4 FragColor;\n"+
	"void main(void) {\n"+
	"vec3 N = normalize(vs_N);\n"+
	"vec3 L = normalize(vs_L);\n"+
	"vec3 V = normalize(vs_V);\n"+
	"vec3 R = reflect(-L, N);\n"+
	"vec4 ambient = lightAmbient * matAmbient;\n"+
	"vec4 diffuse = max(dot(N, L), 0.0) * lightDiffuse * matDiffuse;\n"+
	"vec4 specular = pow(max(dot(R, V), 0.0), matShininess) * lightSpecular * matSpecular;\n"+
	"FragColor = ambient + diffuse + specular;\n"+
	"FragColor.w = 1.0;\n"+
	// "FragColor = vec4(1.0);\n"+
	"}\n"

	var vertShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertShader, vertexSrc)
	gl.compileShader(vertShader)
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(vertShader)
		alert("vert" + error)
	}

	var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragShader, fragSrc)
	gl.compileShader(fragShader)
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(fragShader)
		alert("frag" + error)
	}

	dl_program = gl.createProgram()
	gl.attachShader(dl_program, vertShader)
	gl.attachShader(dl_program, fragShader)
	gl.bindAttribLocation(dl_program, macros.AMC_ATTRIB_POSITION, "vPos")
	gl.bindAttribLocation(dl_program, macros.AMC_ATTRIB_NORMAL, "vNormal")
	gl.bindAttribLocation(dl_program, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord")
	gl.linkProgram(dl_program)
	if(!gl.getProgramParameter(dl_program, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(dl_program)
		alert("prog" + error)
	}

	dl_mUniform = gl.getUniformLocation(dl_program, "u_mMat")
	dl_vUniform = gl.getUniformLocation(dl_program, "u_vMat")
	dl_projUniform = gl.getUniformLocation(dl_program, "u_projMat")
	dl_lightPositionUniform = gl.getUniformLocation(dl_program, "lightPosition")
	dl_lightAmbientUniform = gl.getUniformLocation(dl_program, "lightAmbient")
	dl_lightDiffuseUniform = gl.getUniformLocation(dl_program, "lightDiffuse")
	dl_lightSpecularUniform = gl.getUniformLocation(dl_program, "lightSpecular")
	dl_matAmbientUniform = gl.getUniformLocation(dl_program, "matAmbient")
	dl_matDiffuseUniform = gl.getUniformLocation(dl_program, "matDiffuse")
	dl_matSpecularUniform = gl.getUniformLocation(dl_program, "matSpecular")
	matShininessUniform = gl.getUniformLocation(dl_program, "matShininess")
	
	gl.detachShader(dl_program, vertShader)
	gl.deleteShader(vertShader)
	gl.detachShader(dl_program, fragShader)
	gl.deleteShader(fragShader)

	dl_vao = gl.createVertexArray()
	gl.bindVertexArray(dl_vao)

	var vertexData = DL_getChairVertexData()
	dl_numOfTri = vertexData.length / 8

	dl_vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, dl_vbo)
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
	
	gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD)
}

function DL_renderChair() {
	gl.useProgram(dl_program)
	
	var mMat = mat4.create()
	mat4.translate(mMat, mMat, [dl_trans_x, dl_trans_y, dl_trans_z])
	mat4.scale(mMat, mMat, [dl_scale, dl_scale, dl_scale])

	gl.uniformMatrix4fv(dl_projUniform, false, perspectiveMatrix)
	gl.uniformMatrix4fv(dl_vUniform, false, gViewMatrix)
	gl.uniformMatrix4fv(dl_mUniform, false, mMat)

	gl.uniform4f(dl_lightPositionUniform, 10.0, 10.0, 10.0, 1.0)
	gl.uniform4f(dl_lightAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(dl_lightDiffuseUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_lightSpecularUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_matAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(dl_matDiffuseUniform, 0.2, 0.3, 0.15, 1.0)
	gl.uniform4f(dl_matSpecularUniform, 0.7, 0.7, 0.7, 1.0)
	gl.uniform1f(matShininessUniform, 50.0)

	gl.bindVertexArray(dl_vao)
	gl.drawArrays(gl.TRIANGLES, 0, dl_numOfTri)
	gl.bindVertexArray(null)
	gl.useProgram(null)
}