var canvas = null
var gl = null
var bFullscreen = false
var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame
var cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame
var canvas_og_width, canvas_og_height

var gViewMatrix
var perspectiveMatrix
var gbLight = false

var rotX = 0.0, rotY = 0.0

var view = [0.0, 0.0, 5.0]

var val_AJ = 0;

const macros = {
	AMC_ATTRIB_POSITION:0,
	AMC_ATTRIB_NORMAL:1,
	AMC_ATTRIB_TEXCOORD:2,
	DL_ATTRIB_TANGENT:3,
	DL_ATTRIB_BITANGENT: 4
}

const scenes = {
	SCENE_0:0,
	SCENE_1:1,
	SCENE_2:2,
	SCENE_3:3,
	SCENE_4:4
}

var currentScene = scenes.SCENE_1

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
		case 88 :                   // x key
            grfangleX = grfangleX + 1.0;
            if(grfangleX >= 360.0)
            {
                grfangleX = 0.0;
            }
            break;
        case 89 :                   // y key
            grfangleY_radio = grfangleY_radio + 1.0;
            if(grfangleY_radio >= 360.0)
            {
                grfangleY_radio = 0.0;
            }
            break;
		case 65: //A
			view[0] -= 0.1
			break
		case 83: //S
			view[2] += 0.1
			break
		case 68: //D
			view[0] += 0.1
			break
		case 87: //W
			view[2] -= 0.1
			break
		case 81: //Q
			view[1] -= 0.1
			break
		case 69: //E
			view[1] += 0.1
			break
		case 77: //M
			grscaleStageLigth += 0.1
			break
		case 78: //N
			grscaleStageLigth -= 0.1
			break

			case 38: //up arrow
			TeacupTransZ -= 0.05
			break
			case 40: //down arrow
			TeacupTransZ += 0.05
			break
			case 37: //left arrow
			TeacupTransX -= 0.05
			break
			case 39: //right arrow
			TeacupTransX += 0.05
			break

			case 84: //Y
			TeacupTransY += 0.05
			break

			case 85: //U
			TeacupTransY -= 0.05
			break

			case 100: //4
			TeacupScale -= 0.02
			break

			case 102: //6
			TeacupScale += 0.02
			break
		case 104:
			val_AJ = val_AJ + 0.5;
			break;

		case 98:
			val_AJ = val_AJ -0.5;
			break;

		case 27:
			uninit()
			window.close()
			break
	}
	console.log(event.keyCode)
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
	//  initFire();
	GRInit()
	//GRInitRoadside();
	initNormalMapRoad()
	//initCubeMap()
//	tejswini_hut_init()
//	tvn_init_lamp_arch();

	// initShadow();

	//GRInitMic();
	//tvn_script_init();
	//tvn_speaker_init();
	//tvn_init_tripod();
	//GRInitScene2();
	//DL_initChair()
	//GRInitStageLights();
	//GRInitCamera();
	//ASJ_init_stove();
	//utensil_init();

	initStarbucksOuter();
	
	
	loadModel('Models/teapot.obj',vao_teapot,vbo_teapot,function(parts_teapot,numElem){
		console.log("succeeded");
		numElements_Teapot = numElem;
		console.log(numElements_Teapot);
		 gParts_Teapot = parts_teapot;
		console.log(gParts_Teapot.length);
		//numElem = null;
	});


	loadModel('Models/Coffee Cup_final.obj',vao_teacup,vbo_teacup,function(parts_teacup,numElem1){
		console.log("succeeded");
		numElements_Teacup = numElem1;
		console.log(numElements_Teacup);
		 gParts_TeaCup = parts_teacup;
		console.log(gParts_TeaCup.length);
		//numElem = null;
	});


	loadModel('Models/car.obj',vao_car,vbo_car,function(parts_car,numElem2){
		console.log("succeeded");
		numElements_Car = numElem2;
		console.log(numElements_Car);
		 gParts_Car = parts_car;
		console.log(gParts_Car.length);
		//numElem = null;
	});

	modelLoadingProgramObject = initializeModel();


	gViewMatrix = mat4.create()
	perspectiveMatrix = mat4.create()

	gl.enable(gl.DEPTH_TEST)
	gl.depthFunc(gl.LEQUAL)
	gl.clearColor(0.0, 0.0, 0.0, 1.0)
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

	mat4.perspective(perspectiveMatrix,45.0, parseFloat(canvas.width) / parseFloat(canvas.height), 0.1, 1000.0)
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.lookAt(gViewMatrix, view, [0.0, 3.0, view[2] - 20.0], [0.0, 1.0, 0.0])

	if(currentScene == scenes.SCENE_1) {
		// animateFire();
		// Display_CubeMap()
		GRDisplay()
		//tejswini_hut_draw()
		renderNormalMapRoad()
		 //GRDisplayRoadside();
		 //tvn_draw_lamp_arch();
		 // drawModel();
		//ASJ_draw_stove();
		// utensil_display();
	} else if(currentScene == scenes.SCENE_2) {
		GRDisplayScene2();
		GRDisplayStageLights();
		tvn_tripod_draw();
		GRDisplayMic();
		tvn_speaker_draw();
		DL_renderChair()
		GRDisplayCamera();
		tvn_script_draw();
	}
	else if(currentScene == scenes.SCENE_3){
		displayStarBucksOuter();
		drawCar();
	}
	

//	Draw_Shadow();

	animFrame(render, canvas)
}

function uninit() {

	//GRUninitialize()
	//tvn_uninit_lamp_arch();
	//tvn_uninit_script();
	//tvn_speaker_uninit();
	//tvn_tripod_uninit();



	GRUninitialize()
	GRUninitializeScene2()
	GRUninitializeStageLights()
	GRUninitializeRoadside()
	GRUninitializeCamera();
	gl.deleteVertexArray(vao_footpath)
	gl.deleteBuffer(vbo_footpath)
	gl.deleteProgram(program)
}

function deg2rad(degrees)
{
    var rad = degrees * Math.PI / 180.0;
    return rad;
}
