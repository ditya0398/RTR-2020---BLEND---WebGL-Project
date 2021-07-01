var dl_program_sir_shadow
var dl_mUniform_sir_shadow
var dl_vUniform_sir_shadow
var dl_pUniform_sir_shadow
var dl_sampleruniform_sir_shadow
var dl_tex_sir_shadow

function dl_init_sir_shadow() {
    var vertexShaderSourceCode =
	"#version 300 es"+
	"\n" +
    "in vec3 vColor;" +
    "out vec3 outColor;" +
	"out vec2 outTexture;" +
	"uniform mat4 u_m_matrix;"+
	"uniform mat4 u_v_matrix;"+
	"uniform mat4 u_p_matrix;"+
	"void main(void)"+
	"{" +
    "vec2 vPos[] = vec2[4](\n"+
    "vec2(1.0, 1.0),\n"+
    "vec2(-1.0, 1.0),\n"+
    "vec2(-1.0, -1.0),\n"+
    "vec2(1.0, -1.0)\n"+
    ");\n"+
    "vec2 vTex[] = vec2[4](\n"+
    "vec2(0.0, 0.9),\n"+
    "vec2(0.9, 0.9),\n"+
    "vec2(0.9, 0.0),\n"+
    "vec2(0.0, 0.0)\n"+
    ");\n"+
    "outTexture = vTex[gl_VertexID];\n" +
	"gl_Position = u_p_matrix * u_v_matrix * u_m_matrix * vec4(vPos[gl_VertexID], 0.0, 1.0);"+
	"}";
	
	//fragmentShader
	var fragmentShaderSourceCode =
	"#version 300 es"+
	"\n"+
	"precision highp float;"+
	"out vec4 FragColor;"+
	"in vec3 outColor;"+
	"in vec2 outTexture;"+
	"uniform highp sampler2D u_texture_sampler;"+
	"void main(void)"+
	"{"+
	"vec4 Color = texture(u_texture_sampler, outTexture);"+
	"if(Color.a > 0.5) { Color.a = 1.0; } else { Color.a = 0.0; }"+
	"FragColor = Color;"+
	"}";
	
    var vertShader = gl.createShader(gl.VERTEX_SHADER)
	gl.shaderSource(vertShader, vertexShaderSourceCode)
	gl.compileShader(vertShader)
	if(!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(vertShader)
		alert(error)
	}

	var fragShader = gl.createShader(gl.FRAGMENT_SHADER)
	gl.shaderSource(fragShader, fragmentShaderSourceCode)
	gl.compileShader(fragShader)
	if(!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		var error = gl.getShaderInfoLog(fragShader)
		alert(error)
	}

	dl_program_sir_shadow = gl.createProgram()
	gl.attachShader(dl_program_sir_shadow, vertShader)
	gl.attachShader(dl_program_sir_shadow, fragShader)
    gl.linkProgram(dl_program_sir_shadow)
	if(!gl.getProgramParameter(dl_program_sir_shadow, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(dl_program_sir_shadow)
		alert(error)
	}

    dl_mUniform_sir_shadow = gl.getUniformLocation(dl_program_sir_shadow, "u_m_matrix")
    dl_vUniform_sir_shadow = gl.getUniformLocation(dl_program_sir_shadow, "u_v_matrix")
    dl_pUniform_sir_shadow = gl.getUniformLocation(dl_program_sir_shadow, "u_p_matrix")
	dl_sampleruniform_sir_shadow = gl.getUniformLocation(dl_program_sir_shadow, "u_texture_sampler")

    dl_tex_sir_shadow = gl.createTexture();
	dl_tex_sir_shadow.image = new Image();
	dl_tex_sir_shadow.image.src = "DeepResources/sirhead.png";
	dl_tex_sir_shadow.image.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, dl_tex_sir_shadow);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		var ext = (
			gl.getExtension('EXT_texture_filter_anisotropic') ||
			gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
			gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
		);
		if (ext){
			var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
			console.log(max)
			gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
		}
		gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dl_tex_sir_shadow.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
	
	dl_tex_sirleg_shadow = gl.createTexture();
	dl_tex_sirleg_shadow.image = new Image();
	dl_tex_sirleg_shadow.image.src = "DeepResources/sirleg.png";
	dl_tex_sirleg_shadow.image.onload = function ()
	{
		gl.bindTexture(gl.TEXTURE_2D, dl_tex_sirleg_shadow);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		var ext = (
			gl.getExtension('EXT_texture_filter_anisotropic') ||
			gl.getExtension('MOZ_EXT_texture_filter_anisotropic') ||
			gl.getExtension('WEBKIT_EXT_texture_filter_anisotropic')
		);
		if (ext){
			var max = gl.getParameter(ext.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
			console.log(max)
			gl.texParameterf(gl.TEXTURE_2D, ext.TEXTURE_MAX_ANISOTROPY_EXT, max);
		}
		gl.texImage2D(gl.TEXTURE_2D, 0 , gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, dl_tex_sirleg_shadow.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
		gl.generateMipmap(gl.TEXTURE_2D)
		gl.bindTexture(gl.TEXTURE_2D, null);
	}
}

function dl_render_sir_shadow() {
    gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.useProgram(dl_program_sir_shadow)
    
    gl.uniformMatrix4fv(dl_vUniform_sir_shadow, false, gViewMatrix)
    gl.uniformMatrix4fv(dl_pUniform_sir_shadow, false, perspectiveMatrix)
    
	var modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -4.0, -13.5]);
	mat4.scale(modelMatrix, modelMatrix, [1.5, 1.5, 1.0])
    gl.uniformMatrix4fv(dl_mUniform_sir_shadow, false, modelMatrix)
    gl.uniform1i(dl_sampleruniform_sir_shadow, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, dl_tex_sirleg_shadow)

	gl.drawArrays(gl.TRIANGLE_FAN, 0,4);


	modelMatrix = mat4.create()
	mat4.translate(modelMatrix, modelMatrix, [0.0, -1.3, -10.7]);
	mat4.rotateX(modelMatrix, modelMatrix, Math.PI * 0.10)
	mat4.scale(modelMatrix, modelMatrix, [2.5, 2.5, 2.5])
	gl.uniformMatrix4fv(dl_mUniform_sir_shadow, false, modelMatrix)
    gl.uniform1i(dl_sampleruniform_sir_shadow, 0)
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, dl_tex_sir_shadow)

	gl.drawArrays(gl.TRIANGLE_FAN, 0,4);

	
    gl.bindTexture(gl.TEXTURE_2D, null)
    gl.useProgram(null)
    gl.disable(gl.BLEND)

}