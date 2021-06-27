var dl_program_fade
var dl_alphaUniform_fade

function dl_init_fade() {
    var vertexSrc = 
	"#version 300 es\n"+
	"void main(void) {\n"+
    "vec2 vPos[] = vec2[4](\n"+
    "vec2(1.0, 1.0),\n"+
    "vec2(-1.0, 1.0),\n"+
    "vec2(-1.0, -1.0),\n"+
    "vec2(1.0, -1.0)\n"+
    ");\n"+
    "gl_Position = vec4(vPos[gl_VertexID], 0.0, 1.0);\n"+
    "}\n"

    var fragSrc = 
    "#version 300 es\n"+
	"precision highp float;\n"+
    "uniform float alpha;\n"+
    "out vec4 FragColor;\n"+
    "void main() {\n"+
    "FragColor = vec4(vec3(0.0), alpha);\n"+
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

	dl_program_fade = gl.createProgram()
	gl.attachShader(dl_program_fade, vertShader)
	gl.attachShader(dl_program_fade, fragShader)
	gl.linkProgram(dl_program_fade)
	if(!gl.getProgramParameter(dl_program_fade, gl.LINK_STATUS)) {
		var error = gl.getProgramInfoLog(dl_program_fade)
		alert(error)
	}

	dl_alphaUniform_fade = gl.getUniformLocation(dl_program_fade, "alpha")
}

function dl_render_fade() {
    gl.enable(gl.BLEND)
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)
	gl.useProgram(dl_program_fade)
    gl.uniform1f(dl_alphaUniform_fade, 0.0)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, 4)
    gl.disable(gl.BLEND)
}