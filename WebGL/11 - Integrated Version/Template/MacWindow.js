var fbo_laptopwindow

var macwindowTexture_laptopwindow
var sphereTexutreColor_laptopwindow
var sphereTexutreDepth_laptopwindow

var dl_program_laptopwindow
var dl_program2_laptopwindow
var dl_mUniform_laptopwindow
var dl_projUniform_laptopwindow
var dl_vUniform_laptopwindow
var dl_texSampler_laptopwindow

var mvUniform_laptopwindow
var projUniform_laptopwindow
var lightPositionUniform_laptopwindow
var lightAmbientUniform_laptopwindow
var lightDiffuseUniform_laptopwindow
var lightSpecularUniform_laptopwindow
var matAmbientUniform_laptopwindow
var matDiffuseUniform_laptopwindow
var matSpecularUniform_laptopwindow
var matShininessUniform_laptopwindow

var vao_laptopwindow
var vboPos_laptopwindow
var vboNor_laptopwindow
var eabo_laptopwindow

var angRot_laptopwindow = 0.0

var obj_sphere_laptopwindow

function init_macWindow() {
    var vertexShaderScreenSource =
    "#version 300 es" +
    "\n" +
    "out vec2 out_tex_coord;" +
    "uniform mat4 u_model_matrix;" +
    "uniform mat4 u_view_matrix;" +
    "uniform mat4 u_projection_matrix;" +
    "void main(void)" +
    "{" +
    "vec3 vPos[] = vec3[8](\n"+
    "vec3(0.133 - 0.03, 0.1, 0.2),\n"+
    "vec3(-0.133 - 0.03, 0.1, 0.2),\n"+
    "vec3(-0.133 - 0.03, -0.1, 0.2),\n"+
    "vec3(0.133 - 0.03, -0.1, 0.2),\n"+
    "vec3(0.08 - 0.03, 0.08, 0.21),\n"+
    "vec3(-0.08 - 0.03, 0.08, 0.21),\n"+
    "vec3(-0.08 - 0.03, -0.08, 0.21),\n"+
    "vec3(0.08 - 0.03, -0.08, 0.21)\n"+
    ");\n"+
    "vec2 vTex[] = vec2[8](\n"+
    "vec2(1.0, 1.0),\n"+
    "vec2(0.0, 1.0),\n"+
    "vec2(0.0, 0.0),\n"+
    "vec2(1.0, 0.0),\n"+
    "vec2(1.0, 1.0),\n"+
    "vec2(0.0, 1.0),\n"+
    "vec2(0.0, 0.0),\n"+
    "vec2(1.0, 0.0)\n"+
    ");\n"+
    "gl_Position=u_projection_matrix * u_view_matrix * u_model_matrix * vec4(vPos[gl_VertexID], 1.0);" +
    "out_tex_coord=vTex[gl_VertexID];" +
    "}";

    var fragmentShaderScreenSource =
    "#version 300 es" +
    "\n" +
    "precision highp float;" +
    "out vec4 FragColor;" +
    "in vec2 out_tex_coord;" +
    "uniform sampler2D u_texture_sampler;" +
    "void main(void)" +
    "{" +
    "FragColor= texture(u_texture_sampler, out_tex_coord);" +
    "}";

    var vertShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertShader, vertexShaderScreenSource)
	gl.compileShader(vertShader)
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(vertShader)
		alert("vert" + error)
	}

	var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragShader, fragmentShaderScreenSource)
	gl.compileShader(fragShader)
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(fragShader)
		alert("frag" + error)
	}

	dl_program_laptopwindow = gl.createProgram()
	gl.attachShader(dl_program_laptopwindow, vertShader)
	gl.attachShader(dl_program_laptopwindow, fragShader)
	gl.linkProgram(dl_program_laptopwindow)
	if(!gl.getProgramParameter(dl_program_laptopwindow, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(dl_program_laptopwindow)
		alert("prog" + error)
	}

	dl_mUniform_laptopwindow = gl.getUniformLocation(dl_program_laptopwindow, "u_model_matrix")
	dl_vUniform_laptopwindow = gl.getUniformLocation(dl_program_laptopwindow, "u_view_matrix")
	dl_projUniform_laptopwindow = gl.getUniformLocation(dl_program_laptopwindow, "u_projection_matrix")
	dl_texSampler_laptopwindow = gl.getUniformLocation(dl_program_laptopwindow, "u_texture_sampler")
	
    var vertShaderTexSrc = 
    "#version 300 es\n"+
	"in vec4 vPos;\n"+
	"in vec3 vNormal;\n"+
	"uniform mat4 u_mvMat;\n"+
	"uniform mat4 u_projMat;\n"+
	"uniform vec4 lightPosition[3];\n"+
	"out vec3 vs_N;\n"+
	"out vec3 vs_L[3];\n"+
	"out vec3 vs_V;\n"+
    "void main(void) {\n"+
	"gl_Position = u_projMat * u_mvMat * vPos;\n"+
	"vec4 P = u_mvMat * vPos;\n"+
	"vs_N = mat3(u_mvMat) * vNormal;\n"+
	"for(int i = 0; i < 3; i++) {\n"+
	"vs_L[i] = vec3(lightPosition[i] - P);\n"+
	"}\n"+
	"vs_V = -P.xyz;\n"+
    "}\n"

    var fragShaderTexSrc = 
    "#version 300 es\n"+
	"precision highp float;\n"+
	"in vec3 vs_N;\n"+
	"in vec3 vs_L[3];\n"+
	"in vec3 vs_V;\n"+
    "uniform bool isLight;\n"+
	"uniform vec4 lightAmbient[3];\n"+
	"uniform vec4 lightDiffuse[3];\n"+
	"uniform vec4 lightSpecular[3];\n"+
	"uniform vec4 matAmbient;\n"+
	"uniform vec4 matDiffuse;\n"+
	"uniform vec4 matSpecular;\n"+
	"uniform float matShininess;\n"+
	"out vec4 FragColor;\n"+
	"void main(void) {\n"+
	"vec4 ambient = vec4(0.0);\n"+
	"vec4 diffuse = vec4(0.0);\n"+
	"vec4 specular = vec4(0.0);\n"+
	"vec3 N = normalize(vs_N);\n"+
	"vec3 V = normalize(vs_V);\n"+
	"for(int i = 0; i < 3; i++) {\n"+
	"vec3 L = normalize(vs_L[i]);\n"+
	"vec3 R = reflect(-L, N);\n"+
	"ambient += lightAmbient[i] * matAmbient;\n"+
	"diffuse += max(dot(N, L), 0.0) * lightDiffuse[i] * matDiffuse;\n"+
	"specular += pow(max(dot(R, V), 0.0), matShininess) * lightSpecular[i] * matSpecular;\n"+
	"}\n"+
	"FragColor = ambient + diffuse + specular;\n"+
	"FragColor.w = 1.0;\n"+
    "}\n"


    var vertShader2 = gl.createShader(gl.VERTEX_SHADER)
    gl.shaderSource(vertShader2, vertShaderTexSrc)
    gl.compileShader(vertShader2)
    if(!gl.getShaderParameter(vertShader2, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(vertShader2)
        alert(error)
    }

    var fragShader2 = gl.createShader(gl.FRAGMENT_SHADER)
    gl.shaderSource(fragShader2, fragShaderTexSrc)
    gl.compileShader(fragShader2)
    if(!gl.getShaderParameter(fragShader2, gl.COMPILE_STATUS)) {
        var error = gl.getShaderInfoLog(fragShader2)
        alert(error)
    }

    dl_program2_laptopwindow = gl.createProgram()
    gl.attachShader(dl_program2_laptopwindow, vertShader2)
    gl.attachShader(dl_program2_laptopwindow, fragShader2)
    gl.bindAttribLocation(dl_program2_laptopwindow, macros.AMC_ATTRIB_POSITION, "vPos")
    gl.bindAttribLocation(dl_program2_laptopwindow, macros.AMC_ATTRIB_NORMAL, "vNormal")
    gl.linkProgram(dl_program2_laptopwindow)
    if(!gl.getProgramParameter(dl_program2_laptopwindow, gl.LINK_STATUS)) {
        var error = gl.getProgramInfoLog(dl_program2_laptopwindow)
        alert(error)
    }

    mvUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "u_mvMat")
    projUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "u_projMat")
    lightPositionUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "lightPosition")
    lightAmbientUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "lightAmbient")
    lightDiffuseUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "lightDiffuse")
    lightSpecularUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "lightSpecular")
    matAmbientUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "matAmbient")
    matDiffuseUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "matDiffuse")
    matSpecularUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "matSpecular")
    matShininessUniform_laptopwindow = gl.getUniformLocation(dl_program2_laptopwindow, "matShininess")
    
 
    gl.detachShader(dl_program2_laptopwindow, vertShader2)
    gl.deleteShader(vertShader)
    gl.detachShader(dl_program2_laptopwindow, fragShader2)
    gl.deleteShader(fragShader)
    
    macwindowTexture_laptopwindow = gl.createTexture();
	macwindowTexture_laptopwindow.image = new Image();
	macwindowTexture_laptopwindow.image.src = "AkhileshResources/macwindow.png";
	macwindowTexture_laptopwindow.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, macwindowTexture_laptopwindow);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, macwindowTexture_laptopwindow.image);
		gl.bindTexture(gl.TEXTURE_2D, null);
	}

    fbo_laptopwindow = gl.createFramebuffer()
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo_laptopwindow)
    sphereTexutreColor_laptopwindow = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, sphereTexutreColor_laptopwindow)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.RGBA8, 1024, 1024)

    sphereTexutreDepth_laptopwindow = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, sphereTexutreDepth_laptopwindow)
    gl.texStorage2D(gl.TEXTURE_2D, 1, gl.DEPTH_COMPONENT32F, 1024, 1024)

    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sphereTexutreColor_laptopwindow, 0)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, sphereTexutreDepth_laptopwindow, 0)

    gl.drawBuffers([gl.COLOR_ATTACHMENT0])
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)

    var stacks = 25
    var slices = 25
    var radius = 1.0

	var pos = Array()
	var nor = Array()
	for(var i = 0; i <= stacks; i++) {
		var phi = Math.PI * i / stacks;
		for(var j = 0; j <= slices; j++) {
			var theta = 2.0 * Math.PI * j / slices;
			pos.push(Math.sin(phi) * Math.sin(theta) * radius)
			pos.push(Math.cos(phi) * radius)
			pos.push(Math.sin(phi) * Math.cos(theta) * radius)
			
			nor.push(Math.sin(phi) * Math.sin(theta))
			nor.push(Math.cos(phi))
			nor.push(Math.sin(phi) * Math.cos(theta))
		}
	}
	var elements = Array()
	for(var i = 0; i < stacks; i++) {
		var e1 = i * (slices + 1)
		var e2 = e1 + slices + 1
		for(var j = 0; j < slices; j++, e1++, e2++) {
			if(i != 0) {
				elements.push(e1)	
				elements.push(e2)
				elements.push(e1 + 1)
			}
			if(i != (stacks - 1)) {
				elements.push(e1 + 1)
				elements.push(e2)
				elements.push(e2 + 1)
			}
		}
	}
	elementIndices = Uint16Array.from(elements)
	positionArray = Float32Array.from(pos)
	normalArray = Float32Array.from(nor)
    
	vao_laptopwindow = gl.createVertexArray()
	gl.bindVertexArray(vao_laptopwindow)


	vboPos_laptopwindow = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vboPos_laptopwindow)
	gl.bufferData(gl.ARRAY_BUFFER, positionArray, gl.STATIC_DRAW)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_POSITION, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_POSITION)
	

	vboNor_laptopwindow = gl.createBuffer()
	gl.bindBuffer(gl.ARRAY_BUFFER, vboNor_laptopwindow)
	gl.bufferData(gl.ARRAY_BUFFER, normalArray, gl.STATIC_DRAW)
	gl.vertexAttribPointer(macros.AMC_ATTRIB_NORMAL, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(macros.AMC_ATTRIB_NORMAL)
	
	eabo_laptopwindow = gl.createBuffer()
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eabo_laptopwindow)
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, elementIndices, gl.STATIC_DRAW)

}

function render_macWindow() {
    gl.useProgram(dl_program2_laptopwindow)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo_laptopwindow)
    gl.clearColor(0.0, 0.0, 0.0, 1.0)
    gl.clearDepth(1.0)
    gl.viewport(0, 0, 1024, 1024)
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
    var lightPosition = new Float32Array([
		0.0, Math.sin(angRot_laptopwindow) * 4.0, Math.cos(angRot_laptopwindow) * 4.0, 1.0,
		Math.cos(angRot_laptopwindow) * 4.0, 0.0, Math.sin(angRot_laptopwindow) * 4.0, 1.0,
		Math.sin(angRot_laptopwindow) * 4.0, Math.cos(angRot_laptopwindow) * 4.0, 0.0, 1.0
	])

	const lightAmbient = new Float32Array([
		0.1, 0.1, 0.1, 1.0,
		0.1, 0.1, 0.1, 1.0,
		0.1, 0.1, 0.1, 1.0
	])

	const lightDiffuse = new Float32Array([
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	])

	const lightSpecular = new Float32Array([
		0.7, 0.3, 0.3, 1.0,
		0.3, 0.7, 0.3, 1.0,
		0.3, 0.3, 0.7, 1.0
	])

	var mvMat = mat4.create()
    var perspMat = mat4.create()
    mat4.perspective(perspMat, 45.0, 1.0, 0.1, 100.0)
	mat4.translate(mvMat, mvMat, [0.0, 0.0, -4.0])
	
	gl.uniformMatrix4fv(projUniform_laptopwindow, false, perspMat)
	gl.uniformMatrix4fv(mvUniform_laptopwindow, false, mvMat)

	gl.uniform4fv(lightPositionUniform_laptopwindow, lightPosition)
	gl.uniform4fv(lightAmbientUniform_laptopwindow, lightAmbient)
	gl.uniform4fv(lightDiffuseUniform_laptopwindow, lightDiffuse)
	gl.uniform4fv(lightSpecularUniform_laptopwindow, lightSpecular)
	gl.uniform4f(matAmbientUniform_laptopwindow, 0.1, 0.1, 0.1, 1.0)
	gl.uniform4f(matDiffuseUniform_laptopwindow, 1.0, 1.0, 1.0, 1.0)
	gl.uniform4f(matSpecularUniform_laptopwindow, 0.7, 0.7, 0.7, 1.0)
	gl.uniform1f(matShininessUniform_laptopwindow, 50.0)

	gl.bindVertexArray(vao_laptopwindow)
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, eabo_laptopwindow)
	gl.drawElements(gl.TRIANGLES, 3600, gl.UNSIGNED_SHORT, 0)

    angRot_laptopwindow += 0.03
    if(angRot_laptopwindow > 2.0 * Math.PI) {
        angRot_laptopwindow -= 2.0 * Math.PI
    }

	gl.viewport(0, 0, canvas.width, canvas.height)
    gl.useProgram(dl_program_laptopwindow)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	var mMat = mat4.create()
    mat4.translate(mMat, mMat, ASJ_trans)
    gl.uniformMatrix4fv(dl_mUniform_laptopwindow, false, mMat)
    gl.uniformMatrix4fv(dl_vUniform_laptopwindow, false, DM_View_Matrix)
	gl.uniformMatrix4fv(dl_projUniform_laptopwindow, false, DM_Projection_Matrix)
    gl.activeTexture(gl.TEXTURE0)
    gl.uniform1i(dl_texSampler_laptopwindow, 0)
    gl.bindTexture(gl.TEXTURE_2D, macwindowTexture_laptopwindow)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    gl.bindTexture(gl.TEXTURE_2D, sphereTexutreColor_laptopwindow)
    gl.drawArrays(gl.TRIANGLE_FAN, 4, 4)
    gl.disable(gl.BLEND)
}