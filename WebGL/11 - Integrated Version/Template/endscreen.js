var program_end

var vao_end
var vbo_end
var texGrpName1_end
var texGrpName2_end
var texGrpLeaderTitle_end
var texGrpMemberTitle_end
var texGrpLeader_end
var texGrpMember1_end
var texGrpMember2_end
var texGrpMember3_end
var texGrpMember4_end
var texGrpMember5_end
var texGrpMember6_end
var texTeacherTitle_end
var texTeacherSir_end
var texTeacherMaam_end
var texTeacherPradnyaMaam_end
var texAstromedicomp_end
var texPresents_end
var mvUniform_end
var projUniform_end
var samplerUniform_end
var isTexUniform_end

var dl_wait_end = 0.0

var dl_trans_grp1_x_end = -3.0
var dl_trans_grp1_y_end = 0.0
var dl_trans_grp1_z_end = 0.0
var dl_shear_grp1_x_end = -0.5
var dl_shear_grp1_z_end = -0.5

var dl_trans_grp2_x_end = 3.2
var dl_trans_grp2_y_end = 0.0
var dl_trans_grp2_z_end = 0.0
var dl_shear_grp2_x_end = 0.5
var dl_shear_grp2_z_end = 0.5

var dl_astromedicomp_end = 1.0
var dl_presents_end = -1.0

var dl_trans_title1_z_end = 3.0
var dl_rot_title1_x_end = Math.PI * 8.0

var dl_trans_title2_z_end = 3.0
var dl_rot_title2_x_end = Math.PI * 8.0

var dl_trans_leadermember_y_end = 0.0

var dl_trans_leader_z_end = -10.0
var dl_rot_leader_y_end = Math.PI * 8.0

var dl_trans_member1_x_end = 3.0
var dl_rot_member1_y_end = Math.PI * 4.0

var dl_trans_member2_x_end = -3.0
var dl_rot_member2_y_end = -Math.PI * 4.0

var dl_trans_member3_x_end = 3.0
var dl_rot_member3_y_end = Math.PI * 4.0

var dl_trans_member4_x_end = -3.0
var dl_rot_member4_y_end = -Math.PI * 4.0

var dl_trans_member5_x_end = 3.0
var dl_rot_member5_y_end = Math.PI * 4.0

var dl_trans_member6_x_end = -3.01
var dl_rot_member6_y_end = -Math.PI * 4.0

var dl_trans_teacher_y = -2.0
var dl_rot_teacher_x = Math.PI * 8.0

var rot_end = 0.0

function createFontTexture(font, color, str) {
	var textCanvas = document.createElement("canvas")
	textCanvas.width = 1024
	textCanvas.height = 1024
	var context = textCanvas.getContext("2d")
	if(!context) {
		console.log("Context Not Found")
	}

	context.fillStyle = "rgba(0.0, 0, 0, 0.0)"
	context.fillRect(0, 0, textCanvas.width, textCanvas.height)
	context.textAlign = "center"
	context.textBaseline = "middle"
	context.font = font

	context.fillStyle = color
	context.fillText(str, textCanvas.width / 2, textCanvas.height / 2)
	return textCanvas
}

function initEndScreen() {
	var vertexSrc = 
	"#version 300 es\n"+
	"in vec4 vPos;\n"+
	"in vec2 vTexCoord;\n"+
	"uniform mat4 u_mvMat;\n"+
	"uniform mat4 u_projMat;\n"+
	"out vec2 texcoord\n;"+
	"void main(void) {\n"+
	"gl_Position = u_projMat * u_mvMat * vPos;\n"+
	"texcoord = vec2(vTexCoord.x, 1.0-vTexCoord.y);\n"+
	"}\n"

	var fragSrc = 
	"#version 300 es\n"+
	"precision highp float;\n"+
	"in vec2 texcoord;\n"+
	"uniform sampler2D texSam;\n"+
	"uniform bool isTex;\n"+
	"out vec4 FragColor;\n"+
	"void main(void) {\n"+
	"vec4 c = texture(texSam, texcoord);\n"+
	"FragColor = c;\n"+
	"}\n"

	var vertShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertShader, vertexSrc)
	gl.compileShader(vertShader)
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(vertShader)
		alert(error)
	}

	var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragShader, fragSrc)
	gl.compileShader(fragShader)
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(fragShader)
		alert(error)
	}

	program_end = gl.createProgram()
	gl.attachShader(program_end, vertShader)
	gl.attachShader(program_end, fragShader)
	gl.bindAttribLocation(program_end, macros.AMC_ATTRIB_POSITION, "vPos")
	gl.bindAttribLocation(program_end, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord")
	gl.linkProgram(program_end)
	if(!gl.getProgramParameter(program_end, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(program_end)
		alert(error)
	}

	mvUniform_end = gl.getUniformLocation(program_end, "u_mvMat")
	projUniform_end = gl.getUniformLocation(program_end, "u_projMat")
	samplerUniform_end = gl.getUniformLocation(program_end, "texSam")
	isTexUniform_end = gl.getUniformLocation(program_end, "isTex")

	gl.detachShader(program_end, vertShader)
	gl.deleteShader(vertShader)
	gl.detachShader(program_end, fragShader)
	gl.deleteShader(fragShader)

	
	texGrpName1_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpName1_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("216px betsy flanagan", "white", "BLEND"))
	gl.generateMipmap(gl.TEXTURE_2D)
	
	texGrpName2_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpName2_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("216px betsy flanagan", "white", "GROUP"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpLeaderTitle_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpLeaderTitle_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("60px LiberationSerif", "white", "Group Leader"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMemberTitle_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMemberTitle_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("60px LiberationSerif", "white", "Group Members"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpLeader_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpLeader_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Hemi Head, Bold Italics", "white", "Aditya Boob"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMember1_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember1_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Hastoler", "white", "Abhijeet Kandalkar"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMember2_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember2_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Chopin Script", "white", "Akhilesh Jalamkar"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMember3_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember3_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Fonesia Bold", "white", "Darshan Mali"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMember4_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember4_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Mystery Quest", "white", "Deep Lalwani"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMember5_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember5_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Trade Winds", "white", "Gauri Ranade"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texGrpMember6_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember6_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("50px Sweet Cherry Free", "white", "Tejaswini Nimburkar"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texTeacherTitle_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texTeacherTitle_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("60px LiberationSerif", "white", "Special Thanks To"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texTeacherTitle_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texTeacherTitle_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("60px LiberationSerif", "white", "Special Thanks"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texTeacherSir_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texTeacherSir_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("55px Nimbus Roman", "white", "Gokhale Sir"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texTeacherMaam_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texTeacherMaam_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("55px Nimbus Roman", "white", "Gokhale Ma'am"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texTeacherPradnyaMaam_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texTeacherPradnyaMaam_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("55px Nimbus Roman", "white", "Pradnya Ma'am"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texAstromedicomp_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texAstromedicomp_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("180px Chopin Script", "white", "Astromedicomp's"))
	gl.generateMipmap(gl.TEXTURE_2D)

	texPresents_end = gl.createTexture()
	gl.bindTexture(gl.TEXTURE_2D, texPresents_end)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR)
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, createFontTexture("90px Fonesia Bold", "white", "presents..."))
	gl.generateMipmap(gl.TEXTURE_2D)

	var quadVertices = new Float32Array([
		//GrpName
		0.66, 0.2, 0.0,				0.83, 0.66,
		-0.66, 0.2, 0.0,			0.17, 0.66,
		-0.66, -0.2, 0.0,			0.17, 0.46,
		0.66, -0.2, 0.0,			0.83, 0.46,
		//Grp Title
		0.49, 0.1, 0.0,				0.75, 0.55,
		-0.49, 0.1, 0.0,			0.25, 0.55,
		-0.49, -0.1, 0.0,			0.25, 0.45,
		0.49, -0.1, 0.0,			0.75, 0.45,
		//Grp Names
		0.49, 0.08, 0.0,			0.75, 0.53,
		-0.49, 0.08, 0.0,			0.25, 0.53,
		-0.49, -0.08, 0.0,			0.25, 0.47,
		0.49, -0.08, 0.0,			0.75, 0.47,
		//Teacher
		0.6, 0.08, 0.0,				0.8, 0.53,
		-0.6, 0.08, 0.0,			0.2, 0.53,
		-0.6, -0.08, 0.0,			0.2, 0.47,
		0.6, -0.08, 0.0,			0.8, 0.47,
		//Astromedicomp
		1.0, 0.25, 0.0,				1.0, 0.625,
		-1.0, 0.25, 0.0,			0.0, 0.625,
		-1.0, -0.25, 0.0,			0.0, 0.375,
		1.0, -0.25, 0.0,			1.0, 0.375
	])

	vao_end = gl.createVertexArray()
	gl.bindVertexArray(vao_end)

	vbo_end = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo_end)
	gl.bufferData(gl.ARRAY_BUFFER, quadVertices, gl.STATIC_DRAW)
	
	gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 5 * 4, 0)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION)

	gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 5 * 4, 3 * 4)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD)

	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
}

function renderStartScreen() {
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.useProgram(program_end)

	gl.bindVertexArray(vao_end)
	
	gl.uniform1i(samplerUniform_end, 0)
	
	var mvMat
	var shearMatrix = mat4.fromValues(
		1.0, 0.0, 0.0, 0.0,
		0.0, 1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 0.0,
		0.0, 0.0, 0.0, 1.0
	)
	var perspMat = mat4.create()
	mat4.perspective(perspMat, 45.0 * Math.PI / 180.0, canvas.width / canvas.height, 0.1, 10.0)

	gl.uniformMatrix4fv(projUniform_end, false, perspMat)

	shearMatrix[4] = dl_shear_grp1_x_end
	// shearMatrix[6] = dl_shear_grp1_z_end

	//Astromedicomp
	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [-0.9, 0.6 + dl_astromedicomp_end, -3.0])
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	
	gl.bindTexture(gl.TEXTURE_2D, texAstromedicomp_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4)

	//Grp Name 1
	mvMat = mat4.create()
	mat4.multiply(mvMat, mvMat, shearMatrix)
	mat4.translate(mvMat, mvMat, [-0.5 + dl_trans_grp1_x_end, 0.18 + dl_trans_grp1_y_end, -3.0 + dl_trans_grp1_z_end])
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	
	gl.bindTexture(gl.TEXTURE_2D, texGrpName1_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
	
	shearMatrix[4] = dl_shear_grp2_x_end
	// shearMatrix[6] = dl_shear_grp2_z_end

	//Grp Name 2
	mvMat = mat4.create()
	mat4.multiply(mvMat, mvMat, shearMatrix)
	mat4.translate(mvMat, mvMat, [0.5 + dl_trans_grp2_x_end, -0.18 + dl_trans_grp2_y_end, -3.0 + dl_trans_grp2_z_end])
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	
	gl.bindTexture(gl.TEXTURE_2D, texGrpName2_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [1.0, -0.6 + dl_presents_end, -3.0])
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	
	gl.bindTexture(gl.TEXTURE_2D, texPresents_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 16, 4)

	gl.disable(gl.BLEND)

	if(dl_current_update_start == dl_update_macros_start.end_start)
		{
			if(SceneTransitionValue <= 1.0)
				SceneTransitionValue += globalQuadBlendingValue +0.002;
			else
			{
				currentScene  = scenes.SCENE_1;
				x_audio.play();
			}

		}

		
}

function renderEndScreen() {
	gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.useProgram(program_end)

	gl.bindVertexArray(vao_end)
	
	gl.uniform1i(samplerUniform_end, 0)
	
	var mvMat
	var perspMat = mat4.create()
	mat4.perspective(perspMat, 45.0 * Math.PI / 180.0, canvas.width / canvas.height, 0.1, 10.0)

	gl.uniformMatrix4fv(projUniform_end, false, perspMat)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, 0.8 + dl_trans_leadermember_y_end, -3.0 + dl_trans_title1_z_end])
	mat4.rotateX(mvMat, mvMat, dl_rot_title1_x_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpLeaderTitle_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4)
	
	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, 0.65 + dl_trans_leadermember_y_end, -3.0 + dl_trans_leader_z_end])
	mat4.rotateY(mvMat, mvMat, dl_rot_leader_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpLeader_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)
	




	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, 0.45 + dl_trans_leadermember_y_end, -3.0 + dl_trans_title2_z_end])
	mat4.rotateX(mvMat, mvMat, dl_rot_title2_x_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMemberTitle_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 4, 4)
	

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0 + dl_trans_member1_x_end, 0.28 + dl_trans_leadermember_y_end, -3.0])
	mat4.rotateY(mvMat, mvMat, dl_rot_member1_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember1_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)
	
	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0 + dl_trans_member2_x_end, 0.11 + dl_trans_leadermember_y_end, -3.0])
	mat4.rotateY(mvMat, mvMat, dl_rot_member2_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember2_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)
	
	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0 + dl_trans_member3_x_end, -0.06 + dl_trans_leadermember_y_end, -3.0])
	mat4.rotateY(mvMat, mvMat, dl_rot_member3_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember3_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)
	
	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0 + dl_trans_member4_x_end, -0.23 + dl_trans_leadermember_y_end, -3.0])
	mat4.rotateY(mvMat, mvMat, dl_rot_member4_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember4_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0 + dl_trans_member5_x_end, -0.40 + dl_trans_leadermember_y_end, -3.0])
	mat4.rotateY(mvMat, mvMat, dl_rot_member5_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember5_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0 + dl_trans_member6_x_end, -0.55 + dl_trans_leadermember_y_end, -3.0])
	mat4.rotateY(mvMat, mvMat, dl_rot_member6_y_end)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texGrpMember6_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 8, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, 0.4 + dl_trans_teacher_y, -3.0])
	mat4.rotateX(mvMat, mvMat, dl_rot_teacher_x)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texTeacherTitle_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, 0.15 + dl_trans_teacher_y, -3.0])
	mat4.rotateX(mvMat, mvMat, dl_rot_teacher_x)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texTeacherSir_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, -0.04 + dl_trans_teacher_y, -3.0])
	mat4.rotateX(mvMat, mvMat, dl_rot_teacher_x)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texTeacherMaam_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4)

	mvMat = mat4.create()
	mat4.translate(mvMat, mvMat, [0.0, -0.23 + dl_trans_teacher_y, -3.0])
	mat4.rotateX(mvMat, mvMat, dl_rot_teacher_x)
	gl.uniformMatrix4fv(mvUniform_end, false, mvMat)
	gl.bindTexture(gl.TEXTURE_2D, texTeacherPradnyaMaam_end)
	gl.drawArrays(gl.TRIANGLE_FAN, 12, 4)

	gl.disable(gl.BLEND)
}

const dl_update_macros_start = {
	grp_astromedicomp_translate:0,
	grp_name_1_translate:1,
	grp_name_1_shear:2,
	grp_name_1_shear_back:3,
	grp_name_2_translate:4,
	grp_name_2_shear:5,
	grp_name_2_shear_back:6,
	grp_prensets_translate:7,
	end_start:8
}
const dl_update_macros_end = {
	grp_title_1_translate:1,
	grp_leader_translate:2,
	grp_title_2_translate:3,
	grp_member_1_translate:4,
	grp_member_2_translate:5,
	grp_member_3_translate:6,
	grp_member_4_translate:7,
	grp_member_5_translate:8,
	grp_member_6_translate:9,
	grp_leadermember_translate_up:10,
	grp_teacher_translate_init:11,
	grp_teacher_wait:12,
	grp_teacher_translate_up:13,
	end_end:14
}

var dl_current_update_end = dl_update_macros_end.grp_title_1_translate
var dl_current_update_start = dl_update_macros_start.grp_astromedicomp_translate

function updateStartScene() {
	if(dl_current_update_start == dl_update_macros_start.grp_astromedicomp_translate) {
		if(dl_astromedicomp_end > 0.0) {
			dl_astromedicomp_end -= 0.006
		} else {
			dl_current_update_start = dl_update_macros_start.grp_name_1_translate
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_name_1_translate) {
		if(dl_trans_grp1_x_end < 0.0) {
			dl_trans_grp1_x_end += 0.1
		} else {
			dl_current_update_start = dl_update_macros_start.grp_name_1_shear
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_name_1_shear) {
		if(dl_shear_grp1_x_end < 1.0) {
			dl_shear_grp1_x_end += 0.2
			dl_shear_grp1_z_end += 0.2
		} else {
			dl_current_update_start = dl_update_macros_start.grp_name_1_shear_back
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_name_1_shear_back) {
		if(dl_shear_grp1_x_end > 0.0) {
			dl_shear_grp1_x_end -= 0.2
			dl_shear_grp1_z_end -= 0.2
		} else {
			dl_current_update_start = dl_update_macros_start.grp_name_2_translate
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_name_2_translate) {
		if(dl_trans_grp2_x_end > 0.0) {
			dl_trans_grp2_x_end -= 0.1
		} else {
			dl_current_update_start = dl_update_macros_start.grp_name_2_shear
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_name_2_shear) {
		if(dl_shear_grp2_x_end < 1.0) {
			dl_shear_grp2_x_end += 0.2
			dl_shear_grp2_z_end += 0.2
		} else {
			dl_current_update_start = dl_update_macros_start.grp_name_2_shear_back
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_name_2_shear_back) {
		if(dl_shear_grp2_x_end > 0.0) {
			dl_shear_grp2_x_end -= 0.2
			dl_shear_grp2_z_end -= 0.2
		} else {
			dl_current_update_start = dl_update_macros_start.grp_prensets_translate
		}
	} else if(dl_current_update_start == dl_update_macros_start.grp_prensets_translate) {
		if(dl_presents_end < 0.0) {
			dl_presents_end += 0.006
		} else {
			dl_current_update_start = dl_update_macros_start.end_start
		}
	}
} 

function updateEndScene() {
	console.log("into the update EndScene");
	if(dl_current_update_end == dl_update_macros_end.grp_title_1_translate) {
		if(dl_trans_title1_z_end > 0.0) {
			dl_trans_title1_z_end -= 0.01
			dl_rot_title1_x_end -= 0.0836
		} else {
			dl_current_update_end = dl_update_macros_end.grp_leader_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_leader_translate) {
		if(dl_trans_leader_z_end < 0.0) {
			dl_trans_leader_z_end += 0.05
			dl_rot_leader_y_end -= 0.1256
		} else {
			dl_current_update_end = dl_update_macros_end.grp_title_2_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_title_2_translate) {
		if(dl_trans_title2_z_end > 0.0) {
			dl_trans_title2_z_end -= 0.01
			dl_rot_title2_x_end -= 0.0836
		} else {
			dl_current_update_end = dl_update_macros_end.grp_member_1_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_member_1_translate) {
		if(dl_trans_member1_x_end > 0.01) {
			dl_trans_member1_x_end -= 0.02
			dl_rot_member1_y_end -= 0.0837
		} else {
			dl_current_update_end = dl_update_macros_end.grp_member_2_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_member_2_translate) {
		if(dl_trans_member2_x_end < -0.01) {
			dl_trans_member2_x_end += 0.02
			dl_rot_member2_y_end += 0.0837
		} else {
			dl_current_update_end = dl_update_macros_end.grp_member_3_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_member_3_translate) {
		if(dl_trans_member3_x_end > 0.01) {
			dl_trans_member3_x_end -= 0.02
			dl_rot_member3_y_end -= 0.0837
		} else {
			dl_current_update_end = dl_update_macros_end.grp_member_4_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_member_4_translate) {
		if(dl_trans_member4_x_end < 0.01) {
			dl_trans_member4_x_end += 0.02
			dl_rot_member4_y_end += 0.0837
		} else {
			dl_current_update_end = dl_update_macros_end.grp_member_5_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_member_5_translate) {
		if(dl_trans_member5_x_end > 0.01) {
			dl_trans_member5_x_end -= 0.02
			dl_rot_member5_y_end -= 0.0837
		} else {
			dl_current_update_end = dl_update_macros_end.grp_member_6_translate
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_member_6_translate) {
		if(dl_trans_member6_x_end < 0.01) {
			dl_trans_member6_x_end += 0.02
			dl_rot_member6_y_end += 0.0837
		} else {
			dl_current_update_end = dl_update_macros_end.grp_leadermember_translate_up
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_leadermember_translate_up) {
		if(dl_trans_leadermember_y_end < 2.0) {
			dl_trans_leadermember_y_end += 0.005
		} else {
			dl_current_update_end = dl_update_macros_end.grp_teacher_translate_init
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_teacher_translate_init) {
		if(dl_trans_teacher_y < 0.0) {
			dl_trans_teacher_y += 0.01
			dl_rot_teacher_x -= 0.1256
		} else {
			dl_current_update_end = dl_update_macros_end.grp_teacher_wait
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_teacher_wait) {
		if(dl_wait_end < 100.0) {
			dl_wait_end += 1.0
		} else {
			dl_current_update_end = dl_update_macros_end.grp_teacher_translate_up
		}
	} else if(dl_current_update_end == dl_update_macros_end.grp_teacher_translate_up) {
		if(dl_trans_teacher_y < 2.0) {
			dl_trans_teacher_y += 0.005
		} else {
			dl_current_update_end = dl_update_macros_end.end_end
		}
	}
}