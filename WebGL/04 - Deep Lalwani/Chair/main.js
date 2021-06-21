var canvas = null
var gl = null
var bFullscreen = false
var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame
var cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame
var canvas_og_width, canvas_og_height

var perspMat
var gbLight = false

var rotX = 0.0, rotY = 0.0

const macros = {
	DL_ATTRIB_POSITION:0,
	DL_ATTRIB_NORMAL:1,
	DL_ATTRIB_TEXCOORD:2
}

var dl_mvUniform
var dl_projUniform
var dl_lightPositionUniform
var dl_lightAmbientUniform
var dl_lightDiffuseUniform
var dl_lightSpecularUniform
var dl_matAmbientUniform
var dl_matDiffuseUniform
var dl_matSpecularUniform
var matShininessUniform
var isLightUniform

function main() {
	//Get Canvas from DOM
	canvas = document.getElementById("dl")
	if(!canvas) {
		console.log("Canvas Not Found")
	}

	//Get Canvas Width and Height
	canvas_og_width = canvas.width
	canvas_og_height = canvas.height

	window.addEventListener("keydown", keyDown, false)
	window.addEventListener("resize", reshape, false)

	init()
	reshape()
	render()
}

function keyDown(event) {
	switch(event.keyCode) {
		case 70:
			toggleFullscreen()
			break
		case 76:
			gbLight = !gbLight
			break
		case 37:
			rotY += 0.03
			break
		case 38:
			rotX += 0.03
			break
		case 39:
			rotY -= 0.03
			break
		case 40:
			rotX -= 0.03
			break
		case 27:
			uninit()
			window.close()
			break
	}
}

function toggleFullscreen() {
	fullscreenEle = document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement || null
	if(fullscreenEle == null) {
		if(canvas.requestFullscreen) {
			canvas.requestFullscreen()
		} else if(canvas.webkitRequestFullscreen) {
			canvas.webkitRequestFullscreen()
		} else if(canvas.mozRequestFullScreen) {
			canvas.mozRequestFullScreen()
		} else if(canvas.msRequestFullscreen) {
			canvas.msRequestFullscreen()
		}
		bFullscreen = true
	} else {
		if(document.exitFullscreen) {
			document.exitFullscreen()
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen()
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen()
		} else if(document.msExitFullscreen) {
			document.msExitFullscreen()
		}
		bFullscreen = false
	}

}

function init() {
	gl = canvas.getContext("webgl2")
	if(!gl) {
		console.log("WebGL Context not found")
	}

	gl.viewportWidth = canvas.width
	gl.viewportHeight = canvas.height

	DL_initChair()
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0)

	perspMat = mat4.create()

	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
}

function reshape() {
	if(bFullscreen) {
		canvas.width = window.innerWidth
		canvas.height = window.innerHeight
	} else {
		canvas.width = canvas_og_width
		canvas.height = canvas_og_height	
	}

	gl.viewport(0, 0, canvas.width, canvas.height)

	mat4.perspective(perspMat, 45.0 * Math.PI / 180.0, canvas.width / canvas.height, 0.1, 100.0)
}

function render() {
	DL_renderChair()
	animFrame(render, canvas)
}

function uninit() {
	gl.deleteVertexArray(dl_vao)
	gl.deleteBuffer(dl_vbo)
	gl.deleteProgram(dl_program)
}