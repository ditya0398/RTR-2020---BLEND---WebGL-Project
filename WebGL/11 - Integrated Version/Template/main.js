var canvas = null
var gl = null
var bFullscreen = false
var animFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame
var cancelFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame || window.webkitCancelRequestAnimationFrame || window.mozCancelRequestAnimationFrame || window.mozCancelAnimationFrame || window.oCancelRequestAnimationFrame || window.oCancelAnimationFrame || window.msCancelRequestAnimationFrame || window.msCancelAnimationFrame
var canvas_og_width, canvas_og_height

var gViewMatrix
var perspectiveMatrix
var gbLight = false

var gbInitializeScene2Camera = true

var gbAnim = false

var rotX = 0.0, rotY = 0.0

var x_audio;

//first scene view 
var view =[2.49, -1.05, -1.899]
//[2.49, -1.19, -1.899]


var SceneTransitionValue = 0.0;

var globalQuadBlendingValue = 0.001; 
var secondSceneCamera = false;

var firstSceneFadeInTransition = true;
var firstSceneFadeOutTransition = false;
var secondSceneFadeInTransition = false;
var secondSceneFadeOutTransition = false;
var thirdSceneFadeOutTransition = false;
var thirdSceneFadeInTransition = false;
var fourthSceneFadeOutTransition = false;
var fourthSceneFadeInTransition = false;
//Scene 2 camera positions [0.0, 15.133, -47.1]
//Scene 2 z = -47.1 -> 1.3

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
	SCENE_4:4,
	SCENE_5:5,
}





var currentScene = scenes.SCENE_1







var blackWhiteDistortion = 1.0

function main() {
	//Get Canvas from DOM
	canvas = document.getElementById("dl")
	if(!canvas) {
		console.log("Canvas Not Found")
	}

	x_audio = document.createElement("audio");



    x_audio.src = "FootSteps2.mp3";


	x_audio.onended = function() {
		x_audio.src = "MainSong.mp3";
		x_audio.play();
	}; 

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
			//x_audio.play();
			toggleFullscreen()
			break
			case 71:
                SBR_DM_angle += 0.1;
            break;
            case 72:
                SBR_DM_angle -= 0.1;
            break;
		case 76://L
			blackWhiteDistortion += 0.1
			if(blackWhiteDistortion > 1.0) {
				blackWhiteDistortion = 1.0
			}
			break
		case 79: //O
			blackWhiteDistortion -= 0.1
			if(blackWhiteDistortion < 0.0) {
				blackWhiteDistortion = 0.0
			}
			break
		case 88 :                   // x key
			gbAnim = true
			break
		case 89 :                   // y key
			secondSceneCamera = true;
			break
		case 65: //A
			SBR_DM_X_ -= 0.1
			break
		case 83: //S
			view[2] += 0.1
			SBR_DM_Z_ += 0.1
			//view[1] -= 0.033
			break
		case 68: //D
			SBR_DM_X_ += 0.1
			break
		case 87: //W
			view[2] -= 0.1
			SBR_DM_Z_ -= 0.1
			//view[1] += 0.033
			break
		case 81: //Q
			SBR_DM_Y_ -= 0.1
			break
		case 69: //E
			SBR_DM_Y_ += 0.1
			break
		case 77: //M
			break
		case 78: //N
			break
		case 38: //up arrow
		MercTransZ -= 0.05
			break
		case 40: //down arrow
		MercTransZ += 0.05
			break
		case 37: //left arrow

		mercTransX -= 0.05
			break
		case 39: //right arrow
		mercTransX += 0.025
			break

		case 84: //Y
		MercTransY += 0.05
			break

		case 85: //U
		MercTransY -= 0.05
			break

		case 100: //4
			MercScale -= 0.0005
			break

		case 102: //6
		MercScale += 0.0005
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


// Scene 1


initEndScreen()
	 GRInit()
	 GRInitRoadside();
	 initNormalMapRoad()
	 ASJ_init_stove();
	 tejswini_hut_init()
	initCubeMap();
	// tvn_init_lamp_arch();
	GRInitChaiCup();

	

	//initShadow();

	



	//Scene 2
	  GRInitMic();
	   tvn_script_init();
	   tvn_speaker_init();
	   tvn_init_tripod();
	   tvn_drama_init();
	

	  GRInitScene2();
	  DL_initChair()
	  GRInitStageLights();
	  GRInitCamera();


	init_InteriorStarbucks();
	dl_init_sir_shadow()

	//utensil_init();

	dl_init_fade();
	init_macWindow()
	initStarbucksOuter();
	ASJ_init_laptop()
	GRInitBluetooth();
	


	




	loadModel('Models/teapot.obj',vao_teapot,vbo_teapot,function(parts_teapot,numElem){
		console.log("succeeded");
		numElements_Teapot = numElem;
		console.log(numElements_Teapot);
		 gParts_Teapot = parts_teapot;
		console.log(gParts_Teapot.length);
		//numElem = null;
	});


	// loadModel('Models/Coffee Cup_final.obj',vao_teacup,vbo_teacup,function(parts_teacup,numElem1){
	// 	console.log("succeeded");
	// 	numElements_Teacup = numElem1;
	// 	console.log(numElements_Teacup);
	// 	 gParts_TeaCup = parts_teacup;
	// 	console.log(gParts_TeaCup.length);
	// 	//numElem = null;
	// });


	// loadModel('Models/car.obj',vao_car,vbo_car,function(parts_car,numElem2){
	// 	console.log("succeeded");
	// 	numElements_Car = numElem2;
	// 	console.log(numElements_Car);
	// 	 gParts_Car = parts_car;
	// 	console.log(gParts_Car.length);
	// 	//numElem = null;
	// });

	loadModel_Merc('Models/modiferMercedes.obj',vao_teapot_Merc,vbo_teapot_Merc,function(parts_teapotMerc,numElem2){
		console.log("succeeded");
		numElements_table = numElem2;
		gParts_Teapot_Merc = parts_teapotMerc;
		console.log(gParts_Teapot_Merc.length);

	});



	modelLoadingProgramObject = initializeModel();


	MercedesProgramObject_Merc = initializeModel_Merc();

	initFire();
	

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
	
	gWindowHeight_FboFire = canvas.height;
	gWindowWidth_FboFire = canvas.width;
}

function render() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.lookAt(gViewMatrix, view, [0.0, view[1], view[2] - 20.0], [0.0, 1.0, 0.0])

	switch(currentScene)
	{
		case scenes.SCENE_0:
			//Intro
			renderStartScreen()
		break;

		case scenes.SCENE_1:

			
			tvn_speaker_draw();
			//Display_CubeMap()
			drawFire();
			GRDisplay()
			
			tejswini_hut_draw()
			renderNormalMapRoad()
		
			GRDisplayRoadside();
			//  //tvn_draw_lamp_arch();
			drawModel();
			ASJ_draw_stove();
			GRDisplayChaiCup();
			
		break;

		case scenes.SCENE_2:
			GRDisplayScene2();
			GRDisplayStageLights();
			tvn_tripod_draw();
			GRDisplayMic();
			tvn_speaker_draw();
			DL_renderChair()
			GRDisplayCamera();
			tvn_script_draw();
			tvn_drama_draw();
			dl_render_sir_shadow()
		break;
		case scenes.SCENE_3:
			 displayStarBucksOuter();
			 //drawCar();

			 drawModel_Merc();
		
		break;
		case scenes.SCENE_4:
			display_InteriorStarbucks();
			ASJ_draw_laptop();
			render_macWindow()
			GRDisplayBluetooth();
		break;
		case scenes.SCENE_5:
			renderEndScreen()
		break
	}

	if(secondSceneCamera)
	{	
		view[0] = 0.0;
		view[1] = 15.133;
		view[2] =  -47.1;
		secondSceneCamera = false;
	}

	
	if(gbAnim) {
		update()
	}


	if(currentScene == scenes.SCENE_5)
	{
		SceneTransitionValue = 0.0
		updateEndScene();
	}
	else
	{
		SceneTransitions();
		dl_render_fade();
	}
	

//	Draw_Shadow();

	animFrame(render, canvas)
}

function update() {

	if(currentScene == scenes.SCENE_0) {
		updateStartScene()
	} else if(currentScene == scenes.SCENE_2) {
		if(gbInitializeScene2Camera) {
			 view = [0.0, 15.133, -47.1]
			//view = [0.0, 0.0, 1.6]
			gbInitializeScene2Camera = false
		} else {
			
			if(view[2] < 1.6) {
				view[2] += 0.037
				view[1] -= 0.011
			 } else
			if(tvn_trans_z_drama_main_1 > -53.9) {
				if(blackWhiteDistortion <= 1.0)
					blackWhiteDistortion += 0.007;
				if(tvn_trans_z_drama_main_1 < -40.0) {
					dl_drama_blend_1 -= 0.01
				}
				tvn_trans_z_drama_main_1 -= 0.1
				tvn_trans_y_drama_main_1 += 0.011
				tvn_trans_x_drama_main_1 += 0.03
				tvn_scale_drama_Main_1 += 0.007
			} else if(tvn_trans_z_drama_main_2 > -53.9) {
				if(tvn_trans_z_drama_main_2 < -40.0) {
					dl_drama_blend_2 -= 0.01
				}
				tvn_trans_z_drama_main_2 -= 0.1
				tvn_trans_y_drama_main_2 += 0.011
				tvn_trans_x_drama_main_2 -= 0.03
				tvn_scale_drama_Main_2 += 0.007
			} else if(tvn_trans_z_drama_main_3 > -53.9) {
				if(tvn_trans_z_drama_main_3 < -40.0) {
					dl_drama_blend_3 -= 0.01
				}
				tvn_trans_z_drama_main_3 -= 0.1
				tvn_trans_y_drama_main_3 += 0.011
				tvn_trans_x_drama_main_3 += 0.03
				tvn_scale_drama_Main_3 += 0.007
			} else if(tvn_trans_z_drama_main_4 > -53.9) {
				if(tvn_trans_z_drama_main_4 < -40.0) {
					dl_drama_blend_4 -= 0.01
				}
				tvn_trans_z_drama_main_4 -= 0.1
				tvn_trans_y_drama_main_4 += 0.011
				tvn_trans_x_drama_main_4 -= 0.03
				tvn_scale_drama_Main_4 += 0.007
			} else if(tvn_trans_z_drama_main_5 > -53.9) {
				if(tvn_trans_z_drama_main_5 < -40.0) {
					dl_drama_blend_5 -= 0.01
				}
				tvn_trans_z_drama_main_5 -= 0.1
				tvn_trans_y_drama_main_5 += 0.011
				tvn_trans_x_drama_main_5 += 0.03
				tvn_scale_drama_Main_5 += 0.007
			} else if(tvn_trans_z_drama_main_6 > -53.9) {
				if(tvn_trans_z_drama_main_6 < -40.0) {
					dl_drama_blend_6 -= 0.01
				}
				tvn_trans_z_drama_main_6 -= 0.1
				tvn_trans_y_drama_main_6 += 0.011
				tvn_trans_x_drama_main_6 -= 0.03
				tvn_scale_drama_Main_6 += 0.007
			}
		}
	}
	else if(currentScene == scenes.SCENE_1)
	{
		
		/* Old Camera
		view[0] += 0.0008;
		view[2] -= 0.002;
		view[1] += 0.0001;*/

		if(view[2] > -13.0)
		{
			view[2] -= 0.005;
			view[1] += 0.00012
		}
		else
		{
			
		}
		
	} else if(currentScene == scenes.SCENE_4 && SceneTransitionValue < 0.2) {
		if(SBR_DM_Y_ < -0.4) {
			// SBR_DM_Y_ += 0.005
			// SBR_DM_Z_ += 0.0165

			SBR_DM_Y_ += 0.001
			SBR_DM_Z_ += 0.0035


		} else if(SBR_DM_EYE_Y_ < 0.3) {
			SBR_DM_EYE_Y_ += 0.0045
			SBR_DM_EYE_X_ -= 0.007
		}
	// } else if(currentScene == scenes.SCENE_5) {
	// 	updateEndScene()
	 }
}

function SceneTransitions()
{
	switch(currentScene)
	{

	case scenes.SCENE_1:
		if(SceneTransitionValue >= 0.0 && firstSceneFadeInTransition)
		{
				SceneTransitionValue -= globalQuadBlendingValue + 0.001;
				if(SceneTransitionValue < 0.0)
				{
					SceneTransitionValue = 0.0;					
				}
				if(view[2] <= -13.0)
				{				
					console.log("playing the AUDIO");	
				//	x_audio.play();
					SceneTransitionValue = -1.1; // -0.8 was the start
					firstSceneFadeInTransition = false;
					firstSceneFadeOutTransition = true;					
				}
		}
		if(SceneTransitionValue <= 1.0 && firstSceneFadeOutTransition)
		{
			SceneTransitionValue += globalQuadBlendingValue + 0.0000001;
			if(SceneTransitionValue >= 1.0)
			{
				SceneTransitionValue = 1.0;
				firstSceneFadeOutTransition = false;
				secondSceneFadeInTransition = true;
			//	fourthSceneFadeInTransition = true;
				view[0] = 0.0;
				view[1] = 15.133;
				view[2] =  -47.1;
				currentScene = scenes.SCENE_2;

			}
		}
	break;
	
	case scenes.SCENE_2:
		if(secondSceneFadeInTransition && SceneTransitionValue >= 0.0)
		{
			SceneTransitionValue -= globalQuadBlendingValue;
			if(SceneTransitionValue <= 0.0)
			{
				SceneTransitionValue = -4.0;
				secondSceneFadeInTransition = false;	
				secondSceneFadeOutTransition = true;			
			}
		}
		else if(secondSceneFadeOutTransition && SceneTransitionValue <= 1.0){
			SceneTransitionValue += globalQuadBlendingValue + 0.000001;
		}
		if(SceneTransitionValue >= 1.0 && secondSceneFadeOutTransition)
		{
			secondSceneFadeOutTransition = false;
			currentScene = scenes.SCENE_3;
			thirdSceneFadeInTransition = true;
		}



	break;

		case scenes.SCENE_3:
			if(thirdSceneFadeInTransition && SceneTransitionValue >= 0.0)
			{
				SceneTransitionValue -= globalQuadBlendingValue;
				if(SceneTransitionValue <= 0.0)
				{
					SceneTransitionValue = -1.3;
					thirdSceneFadeInTransition = false;	
					thirdSceneFadeOutTransition = true;			
				}				
			}
			else if(thirdSceneFadeOutTransition && SceneTransitionValue <= 1.0){
				SceneTransitionValue += globalQuadBlendingValue + 0.0002;
			}

		//	if(SceneTransitionValue >= -0.5)
		//	{
				if(MercTransZ > -5.5)
					MercTransZ -= 0.007
		//	}
			if(SceneTransitionValue >= 1.0 && thirdSceneFadeOutTransition)
			{
				SceneTransitionValue = 1.0;
				thirdSceneFadeOutTransition = false;
				currentScene = scenes.SCENE_4;
				fourthSceneFadeInTransition = true;
			}
			
		break;


		case scenes.SCENE_4:

			if(fourthSceneFadeInTransition && SceneTransitionValue >= 0.0)
			{
				SceneTransitionValue -= globalQuadBlendingValue;
				if(SceneTransitionValue <= 0.0)
				{
					SceneTransitionValue = -0.4;
					fourthSceneFadeInTransition = false;	
					fourthSceneFadeOutTransition = true;			
				}				
			}
			else if(fourthSceneFadeOutTransition && SceneTransitionValue <= 1.0){
				SceneTransitionValue += globalQuadBlendingValue;
			}
			if(SceneTransitionValue >= 1.0 && fourthSceneFadeOutTransition)
			{
				fourthSceneFadeOutTransition = false;
				currentScene = scenes.SCENE_5;
				//thirdSceneFadeInTransition = true;
			}
		break;

	}	
}
function uninit() {

	//GRUninitialize()
	//tvn_uninit_lamp_arch();
	//tvn_uninit_script();
	//tvn_speaker_uninit();
	//tvn_tripod_uninit();

	tvn_uninit_drama();

	GRUninitialize()
	GRUninitializeScene2()
	GRUninitializeStageLights()
	GRUninitializeRoadside()
	GRUninitializeChaiCup();
	GRUninitializeMic();
	GRUninitializeCamera();
	GRUninitializeBluetooth();
	gl.deleteVertexArray(vao_footpath)
	gl.deleteBuffer(vbo_footpath)
	gl.deleteProgram(program)
}

function deg2rad(degrees)
{
    var rad = degrees * Math.PI / 180.0;
    return rad;
}
