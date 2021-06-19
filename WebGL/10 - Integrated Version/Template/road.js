var program

var vao
var vbo
var texCol
var texNor
var modelUniform
var viewUniform
var projUniform
var lightPositionUniform
var lightAmbientUniform
var lightDiffuseUniform
var lightSpecularUniform
var matAmbientUniform
var matDiffuseUniform
var matSpecularUniform
var matShininessUniform
var texSamUniform
var texNorUniform

var vertices

function initNormalMapRoad() {
	var vertexSrc = 
	"#version 300 es\n"+
	//In Variables
	"in vec4 vPosition;\n"+
	"in vec3 vNormal;\n"+
	"in vec2 vTexCoord;\n"+
	"in vec3 vTangent;\n"+
	"in vec3 vBitangent;\n"+
	//Out Block
	"out vec3 L_out;\n"+
	"out vec3 V_out;\n"+
	"out vec3 normal_out;\n"+
	"out vec2 texCoord_out;\n"+
	//Light Uniform Block
	"uniform vec4 light_position;\n"+
	//Trandform Matrices
	"uniform mat4 modelMatrix;\n"+
	"uniform mat4 viewMatrix;\n"+
	"uniform mat4 projectionMatrix;\n"+
	//Main Function
	"void main(void) {\n"+
	//Vertex Calculation
	"gl_Position = projectionMatrix * viewMatrix * modelMatrix * vPosition;\n"+
	//Lighting Calculation
	"mat3 norMat = mat3(modelMatrix);\n"+
	"vec3 T = normalize(norMat * vTangent);\n"+
	"vec3 N = normalize(norMat * vNormal);\n"+
	"T = normalize(T - dot(T, N) * N);\n"+
	"vec3 B = cross(N, T);\n"+
	"mat3 TBN = transpose(mat3(T, B, N));\n"+
	"vec3 lightPos = TBN * light_position.xyz;\n"+
	"vec3 P = TBN  * mat3(modelMatrix) * vPosition.xyz;\n"+
	"L_out = lightPos - P;\n"+
	"V_out = -P;\n"+
	//Passing Normals and TexCoords
	"normal_out = vNormal;\n"+
	"texCoord_out = vTexCoord;\n"+
	"}\n"

	var fragSrc = 
	"#version 300 es\n"+
	"precision highp float;\n"+
	//Light Uniform Block
	"uniform vec4 light_position;\n"+
	"uniform vec4 light_ambient;\n"+
	"uniform vec4 light_diffuse;\n"+
	"uniform vec4 light_specular;\n"+
	//Material Uniform Block
	"uniform vec4 material_ambient;\n"+
	"uniform vec4 material_diffuse;\n"+
	"uniform vec4 material_specular;\n"+
	"uniform float material_shininess;\n"+
	//Model View Matrix
	"uniform mat4 modelMatrix;\n"+
	"uniform mat4 viewMatrix;\n"+
	//Texture Samplers
	"uniform sampler2D texSam;\n"+
	"uniform sampler2D norSam;\n"+
	//In Block
	"in vec3 L_out;\n"+
	"in vec3 V_out;\n"+
	"in vec3 normal_out;\n"+
	"in vec2 texCoord_out;\n"+
	//Out Variable
	"out vec4 FragColor;\n"+
	//Main Function
	"void main(void) {\n"+
	//Scaling TexCoord
	"vec2 texCoord = texCoord_out;\n"+
	//Sampling Texture
	"vec4 color = vec4(texture(texSam, texCoord).rgb, 1.0);\n"+
	"vec3 normal = texture(norSam, texCoord).rgb * 2.0 - 1.0;\n"+
	//Lighting Calculation
	"vec3 L = normalize(L_out);\n"+
	"vec3 N = normalize(mat3(modelMatrix)  * normal);\n"+
	"vec3 V = normalize(V_out);\n"+
	"vec3 R = reflect(-L, N);\n"+
	"vec4 ambient = light_ambient * material_ambient * color;\n"+
	"vec4 diffuse = max(dot(N, L), 0.0) * light_diffuse * material_diffuse * color;\n"+
	"vec4 specular = pow(max(dot(R, V), 0.0), material_shininess) * light_specular * material_specular;\n"+
	"FragColor = ambient + diffuse + specular;\n"+
	"}\n";
	
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

	program = gl.createProgram()
	gl.attachShader(program, vertShader)
	gl.attachShader(program, fragShader)
	gl.bindAttribLocation(program, macros.AMC_ATTRIB_POSITION, "vPosition")
	gl.bindAttribLocation(program, macros.AMC_ATTRIB_NORMAL, "vNormal")
	gl.bindAttribLocation(program, macros.AMC_ATTRIB_TEXCOORD, "vTexCoord")
	gl.bindAttribLocation(program, macros.DL_ATTRIB_TANGENT, "vTangent")
	gl.bindAttribLocation(program, macros.DL_ATTRIB_BITANGENT, "vBitangent")
	gl.linkProgram(program)
	if(!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(program)
		alert(error)
	}

	modelUniform = gl.getUniformLocation(program, "modelMatrix")
	viewUniform = gl.getUniformLocation(program, "viewMatrix")
	projUniform = gl.getUniformLocation(program, "projectionMatrix")
	lightPositionUniform = gl.getUniformLocation(program, "light_position")
	lightAmbientUniform = gl.getUniformLocation(program, "light_ambient")
	lightDiffuseUniform = gl.getUniformLocation(program, "light_diffuse")
	lightSpecularUniform = gl.getUniformLocation(program, "light_specular")
	matAmbientUniform = gl.getUniformLocation(program, "material_ambient")
	matDiffuseUniform = gl.getUniformLocation(program, "material_diffuse")
	matSpecularUniform = gl.getUniformLocation(program, "material_specular")
	matShininessUniform = gl.getUniformLocation(program, "material_shininess")
	texSamUniform = gl.getUniformLocation(program, "texSam")
	texNorUniform = gl.getUniformLocation(program, "norSam")

	gl.detachShader(program, vertShader)
	gl.deleteShader(vertShader)
	gl.detachShader(program, fragShader)
	gl.deleteShader(fragShader)

	texCol = gl.createTexture()
	texCol.image = new Image()
	texCol.image.src = "DeepResources/roadtex.png"
	texCol.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texCol)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texCol.image)
		gl.generateMipmap(gl.TEXTURE_2D)
	}

	texNor = gl.createTexture()
	texNor.image = new Image()
	texNor.image.src = "DeepResources/roadnor.png"
	texNor.image.onload = function() {
		gl.bindTexture(gl.TEXTURE_2D, texNor)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST)
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texNor.image)
		gl.generateMipmap(gl.TEXTURE_2D)
	}
	
	var pos1 = Array(6.0, 0.0, 7.0)
	var pos2 = Array(-6.0, 0.0, 7.0)
	var pos3 = Array(-6.0, -0.0, -7.0)
	var pos4 = Array(6.0, -0.0, -7.0)

	var normals = Array(0.0, 0.0, 1.0)

	var tex1 = Array(0.0, 0.0)
	var tex2 = Array(6.0, 0.0)
	var tex3 = Array(6.0, 7.0)
	var tex4 = Array(0.0, 7.0)

	var arr
	var f
		
	var edge1 = Array(3), edge2 = Array(3)
	var deltaTex1 = Array(2), deltaTex2 = Array(2)
	
	var tan1 = Array(3)
	var bit1 = Array(3)
	
	for(var i = 0; i < 3; i++) {
		edge1[i] = pos2[i] - pos1[i]
		edge2[i] = pos3[i] - pos1[i]
	}

	for(var i = 0; i < 2; i++) {
		deltaTex1[i] = tex2[i] - tex1[i]
		deltaTex2[i] = tex3[i] - tex1[i]
	}


	f = 1.0 / (deltaTex1[0] * deltaTex2[1] - deltaTex2[0] * deltaTex1[1]);
	
	tan1[0] = f * (deltaTex2[1] * edge1[0] - deltaTex1[1] * edge2[0])
	tan1[1] = f * (deltaTex2[1] * edge1[1] - deltaTex1[1] * edge2[1])
	tan1[2] = f * (deltaTex2[1] * edge1[2] - deltaTex1[1] * edge2[2])

	bit1[0] = f * (deltaTex1[0] * edge2[0] - deltaTex2[0] * edge1[0])
	bit1[1] = f * (deltaTex1[0] * edge2[1] - deltaTex2[0] * edge1[1])
	bit1[2] = f * (deltaTex1[0] * edge2[2] - deltaTex2[0] * edge1[2])

	for(var i = 0; i < 3; i++) {
		edge1[i] = pos3[i] - pos1[i]
		edge2[i] = pos4[i] - pos1[i]
	}
	for(var i = 0; i < 3; i++) {
		deltaTex1[i] = tex3[i] - tex1[i]
		deltaTex2[i] = tex4[i] - tex1[i]
	}
	f = 1.0 / (deltaTex1[0] * deltaTex2[1] - deltaTex2[0] * deltaTex1[1])

	var tan2 = Array(3)
	var bit2 = Array(3)

	tan2[0] = f * (deltaTex2[1] * edge1[0] - deltaTex1[1] * edge2[0])
	tan2[1] = f * (deltaTex2[1] * edge1[1] - deltaTex1[1] * edge2[1])
	tan2[2] = f * (deltaTex2[1] * edge1[2] - deltaTex1[1] * edge2[2])

	bit2[0] = f * (deltaTex1[0] * edge2[0] - deltaTex2[0] * edge1[0])
	bit2[1] = f * (deltaTex1[0] * edge2[1] - deltaTex2[0] * edge1[1])
	bit2[2] = f * (deltaTex1[0] * edge2[2] - deltaTex2[0] * edge1[2])

	//Vertex Initialization
	arr = Array()
	arr = arr.concat(
		pos1, normals, tan1, bit1, tex1,
		pos2, normals, tan1, bit1, tex2,
		pos3, normals, tan1, bit1, tex3,

		pos1, normals, tan2, bit1, tex1,
		pos3, normals, tan2, bit1, tex3,
		pos4, normals, tan2, bit1, tex4
	)
	vertices = Float32Array.from(arr)

	vao = gl.createVertexArray()
	gl.bindVertexArray(vao)

	vbo = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vbo)
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 4 * 14, 0)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT, false, 4 * 14, 4 * 3)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL)
	gl.vertexAttribPointer(macros.DL_ATTRIB_TANGENT, 3, gl.FLOAT, false, 4 * 14, 4 * 6)
	gl.enableVertexAttribArray(macros.DL_ATTRIB_TANGENT)
	gl.vertexAttribPointer(macros.DL_ATTRIB_BITANGENT, 3, gl.FLOAT, false, 4 * 14, 4 * 9)
	gl.enableVertexAttribArray(macros.DL_ATTRIB_BITANGENT)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_TEXCOORD, 2, gl.FLOAT, false, 4 * 14, 4 * 12)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_TEXCOORD)	
}

function renderNormalMapRoad() {
	gl.useProgram(program)

	var modelMat = mat4.create()
	mat4.translate(modelMat, modelMat, [0.0, -2.0, -10.0])
	mat4.rotateY(modelMat, modelMat, rotY)
	mat4.rotateX(modelMat, modelMat, rotX)
	var viewMat = mat4.create()
	mat4.identity(viewMat)

	gl.uniformMatrix4fv(projUniform, false, perspectiveMatrix)
	gl.uniformMatrix4fv(viewUniform, false, viewMat)
	gl.uniformMatrix4fv(modelUniform, false, modelMat)

	gl.uniform4f(lightPositionUniform, 0.0, 1.0, 10.0, 1.0)
	gl.uniform4f(lightAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(lightDiffuseUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(lightSpecularUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(matAmbientUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(matDiffuseUniform, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(matSpecularUniform, 0.1, 0.1, 0.1, 1.0)
	gl.uniform1f(matShininessUniform, 128.0)
	
	gl.activeTexture(gl.TEXTURE0)
	gl.bindTexture(gl.TEXTURE_2D, texCol)
	gl.activeTexture(gl.TEXTURE1)
	gl.bindTexture(gl.TEXTURE_2D, texNor)

	gl.uniform1i(texSamUniform, 0)
	gl.uniform1i(texNorUniform, 1)

	gl.bindVertexArray(vao)
	gl.drawArrays(gl.TRIANGLES, 0, 6)
}