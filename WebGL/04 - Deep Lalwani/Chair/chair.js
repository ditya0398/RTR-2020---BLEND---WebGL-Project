var dl_vao
var dl_vbo
var dl_program
var dl_numOfTri

var dl_mvUniform
var dl_projUniform
var dl_lightPositionUniform
var dl_lightAmbientUniform
var dl_lightDiffuseUniform
var dl_lightSpecularUniform
var dl_matAmbientUniform
var dl_matDiffuseUniform
var dl_matSpecularUniform
var dl_matShininessUnifom
var dl_texSamUniform
var dl_isLightUniform
var dl_directorTex_chair

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
		[0.45, 0.0, 0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, -0.06, 0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, -0.06, 0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	

	array = array.concat(
		[-0.65, -0.06, -0.3],
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
		[-0.65, 0.0, 0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, -0.06, 0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.65, -0.06, -0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	

	array = array.concat(
		[0.45, -0.06, -0.5],
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
		[-0.45, 0.0, -0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[-0.45, -0.06, -0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.45, -0.06, -0.5],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);

	
	array = array.concat(
		[0.65, -0.06, -0.3],
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
	array = array.concat(
		[0.65, 0.0, 0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.65, -0.06, 0.3],
		[0.0, 1.0, 0.0],
		[0.0, 0.0]
	);
	array = array.concat(
		[0.65, -0.06, -0.3],
		[0.0, 1.0, 0.0],
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
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);
		array = array.concat(
			[sin_0 + x, 0.0, cos_0 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);
		array = array.concat(
			[sin_1 + x, 0.0, cos_1 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);		
		
		array = array.concat(
			[sin_1 + x, 0.0, cos_1 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);		
		array = array.concat(
			[sin_1 + x, -0.06, cos_1 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);		
		array = array.concat(
			[sin_0 + x, -0.06, cos_0 + z],
			[0.0, 1.0, 0.0],
			[0.0, 0.0]
		);
	}

	var angle = Math.PI / 180 * 25;
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.6, 0.9, -0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.62, 0.55]
	);

	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.6, 0.9, -0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.37, 0.55]
	);

	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.6, 0.6, -0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.37, 0.45]
	);

	
	array = array.concat(
		DL_getRotatedVertices(angle, 0, [-0.6, 0.6, -0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.37, 0.45]
	);

	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.6, 0.6, -0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.62, 0.45]
	);

	array = array.concat(
		DL_getRotatedVertices(angle, 0, [0.6, 0.9, -0.01]), 
		DL_getRotatedVertices(angle, 0, [0.0, 0.0, 1.0]), 
		[0.62, 0.55]
	);

	return Float32Array.from(array)
}

function createFontTexture(font, color, str) {
	var textCanvas = document.createElement("canvas")
	textCanvas.width = 1024
	textCanvas.height = 1024
	var context = textCanvas.getContext("2d")
	if(!context) {
		console.log("Context Not Found")
	}

	context.fillStyle = "rgba(0, 0, 0, 0.0)"
	context.fillRect(0, 0, textCanvas.width, textCanvas.height)
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.font = font

	context.fillStyle = color
	context.fillText(str, textCanvas.width / 2, textCanvas.height / 2)
	return textCanvas
}

function DL_initChair() {
	var vertexSrc = 
	"#version 300 es\n"+
	"in vec4 vPos;\n"+
	"in vec3 vNormal;\n"+
	"in vec2 vTexCoord;\n"+
	"uniform mat4 u_mvMat;\n"+
	"uniform mat4 u_projMat;\n"+
	"uniform vec4 lightPosition;\n"+
	"out vec3 vs_N;\n"+
	"out vec3 vs_L;\n"+
	"out vec3 vs_V;\n"+
	"out vec2 vs_texCoord;\n"+
	"void main(void) {\n"+
	"gl_Position = u_projMat * u_mvMat * vPos;\n"+
	"vec4 P = u_mvMat * vPos;\n"+
	"vs_N = mat3(u_mvMat) * vNormal;\n"+
	"vs_L = vec3(lightPosition - P);\n"+
	"vs_V = -P.xyz;\n"+
	"vs_texCoord = vec2(vTexCoord.x, 1.0 - vTexCoord.y);\n"+
	"}\n"

	var fragSrc = 
	"#version 300 es\n"+
	"precision highp float;\n"+
	"in vec3 vs_N;\n"+
	"in vec3 vs_L;\n"+
	"in vec3 vs_V;\n"+
	"in vec2 vs_texCoord;\n"+
	"uniform vec4 lightAmbient;\n"+
	"uniform vec4 lightDiffuse;\n"+
	"uniform vec4 lightSpecular;\n"+
	"uniform vec4 matAmbient;\n"+
	"uniform vec4 matDiffuse;\n"+
	"uniform vec4 matSpecular;\n"+
	"uniform float matShininess;\n"+
	"uniform bool isLight;\n"+
	"uniform sampler2D texSam;\n"+
	"out vec4 FragColor;\n"+
	"void main(void) {\n"+
	"if(isLight) {\n"+
	"vec3 N = normalize(vs_N);\n"+
	"vec3 L = normalize(vs_L);\n"+
	"vec3 V = normalize(vs_V);\n"+
	"vec3 R = reflect(-L, N);\n"+
	"vec4 ambient = lightAmbient * matAmbient;\n"+
	"vec4 diffuse = max(dot(N, L), 0.0) * lightDiffuse * matDiffuse;\n"+
	"vec4 specular = pow(max(dot(R, V), 0.0), matShininess) * lightSpecular * matSpecular;\n"+
	"FragColor = ambient + diffuse + specular;\n"+
	"FragColor.w = 1.0;\n"+
	"} else {\n"+
	"FragColor = texture(texSam, vs_texCoord);\n"+
	"}\n"+
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
	gl.bindAttribLocation(dl_program, macros.DL_ATTRIB_POSITION, "vPos")
	gl.bindAttribLocation(dl_program, macros.DL_ATTRIB_NORMAL, "vNormal")
	gl.bindAttribLocation(dl_program, macros.DL_ATTRIB_TEXCOORD, "vTexCoord")
	gl.linkProgram(dl_program)
	if(!gl.getProgramParameter(dl_program, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(dl_program)
		alert("prog" + error)
	}

	dl_mvUniform = gl.getUniformLocation(dl_program, "u_mvMat")
	dl_projUniform = gl.getUniformLocation(dl_program, "u_projMat")
	dl_lightPositionUniform = gl.getUniformLocation(dl_program, "lightPosition")
	dl_lightAmbientUniform = gl.getUniformLocation(dl_program, "lightAmbient")
	dl_lightDiffuseUniform = gl.getUniformLocation(dl_program, "lightDiffuse")
	dl_lightSpecularUniform = gl.getUniformLocation(dl_program, "lightSpecular")
	dl_matAmbientUniform = gl.getUniformLocation(dl_program, "matAmbient")
	dl_matDiffuseUniform = gl.getUniformLocation(dl_program, "matDiffuse")
	dl_matSpecularUniform = gl.getUniformLocation(dl_program, "matSpecular")
	matShininessUniform = gl.getUniformLocation(dl_program, "matShininess")
	dl_texSamUniform = gl.getUniformLocation(dl_program, "texSam")
	dl_isLightUniform = gl.getUniformLocation(dl_program, "isLight")
	
	gl.detachShader(dl_program, vertShader)
	gl.deleteShader(vertShader)
	gl.detachShader(dl_program, fragShader)
	gl.deleteShader(fragShader)

	dl_directorTex_chair = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, dl_directorTex_chair)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("44px SansSerif", "white", "DIRECTOR"))
	gl.generateMipmap(gl.TEXTURE_2D)
	
	dl_vao = gl.createVertexArray()
	gl.bindVertexArray(dl_vao)

	var vertexData = DL_getChairVertexData()
	dl_numOfTri = vertexData.length / 8

	dl_vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, dl_vbo)
	gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW)
	
	gl.vertexAttribPointer(macros.DL_ATTRIB_POSITION, 3, gl.FLOAT, false, 8 * 4, 0)
	gl.enableVertexAttribArray(macros.DL_ATTRIB_POSITION)
	gl.vertexAttribPointer(macros.DL_ATTRIB_NORMAL, 3, gl.FLOAT, false, 8 * 4, 3 * 4)
	gl.enableVertexAttribArray(macros.DL_ATTRIB_NORMAL)
	gl.vertexAttribPointer(macros.DL_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 8 * 4, 6 * 4)
	gl.enableVertexAttribArray(macros.DL_ATTRIB_TEXCOORD)
}

function DL_renderChair() {
	gl.clear(gl.COLOR_BUFFER_BIT)
	gl.useProgram(dl_program)
	
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

	var mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, 0.0, -4.0])
	mat4.rotateY(mvMat, mvMat, rotY)
	mat4.rotateX(mvMat, mvMat, rotX)
	
	gl.uniformMatrix4fv(dl_projUniform, false, perspMat)
	gl.uniformMatrix4fv(dl_mvUniform, false, mvMat)

	gl.uniform4f(dl_lightPositionUniform, 10.0, 10.0, 10.0, 1.0)
	gl.uniform4f(dl_lightAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(dl_lightDiffuseUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_lightSpecularUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_matAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(dl_matDiffuseUniform, 0.5, 0.2, 0.7, 1.0)
	gl.uniform4f(dl_matSpecularUniform, 0.7, 0.7, 0.7, 1.0)
	gl.uniform1f(matShininessUniform, 50.0)
	gl.uniform1i(dl_texSamUniform, 0)
	gl.uniform1i(dl_isLightUniform, 1)

	gl.bindVertexArray(dl_vao)
	gl.drawArrays(gl.TRIANGLES, 0, dl_numOfTri-6)

	gl.uniform4f(dl_lightPositionUniform, 10.0, 10.0, 10.0, 1.0)
	gl.uniform4f(dl_lightAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(dl_lightDiffuseUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_lightSpecularUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_matAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(dl_matDiffuseUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(dl_matSpecularUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform1f(matShininessUniform, 50.0)
	gl.uniform1i(dl_texSamUniform, 0)
	gl.uniform1i(dl_isLightUniform, 0)
	gl.drawArrays(gl.TRIANGLES, dl_numOfTri-6, 6)
	gl.bindVertexArray(null)
	gl.useProgram(null)

	gl.disable(gl.BLEND)
}