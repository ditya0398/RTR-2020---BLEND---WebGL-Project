//global variables
var canvas=null;
var gl=null; //for webgl context
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;

const WebGLMacros=
{
	AMC_ATTRIBUTE_POSITION:0,
	AMC_ATTRIBUTE_COLOR:1,
	AMC_ATTRIBUTE_TEXTURE0:2,
	AMC_ATTRIBUTE_NORMAL:3
	
};




//To start animation
var requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame||
							window.mozRequestAnimationFrame||
							window.oRequestAnimationFrame||
							window.msRequestAnimationFrame;

//To stop animation
var cancelAnimationFrage = 
			window.cancelAnimationFrame||
			window.webkitCancelRequestAnimationFrame||
			window.webkitCancelAnimationFrame||
			window.mozCancelRequestAnimationFrame||
			window.mozCancelAnimationFrame||
			window.oCancelRequestAnimationFrame||
			window.oCancelAnimationFrame||
			window.msCancelRequestAnimationFrame||
			window.msCancelAnimationFrame;
			
//on body load function
function main()
{
	//get canvas elementFromPoint
	canvas = document.getElementById("AMC");
	if(!canvas)
		console.log("Obtaining canvas from main document failed\n");
	else
		console.log("Obtaining canvas from main document succeeded\n");
	//print obtained canvas width and height on console
	console.log("Canvas width:" + canvas.width +" height:" +canvas.height);
	canvas_original_width = canvas.width;
	canvas_original_height = canvas.height;
	
	
	//register keyboard and mouse event with window class
	window.addEventListener("keydown", keydown, false);
	//window.addEventListener("click", mouseDown, false);
	window.addEventListener("resize", resize, false);
	
	init();
	resize();
	draw();

}

function init(){

	//Get OpenGL context
	gl=canvas.getContext("webgl2");
	if(gl == null)
		console.log("Obtaining 2D webgl2 failed\n");
	else
		console.log("Obtaining 2D webgl2 succeeded\n");
	
	gl.viewportWidth  = canvas.width;
	gl.viewportHeight  = canvas.height;

	initFire();
	perspectiveProjectionMatrix =  mat4.create();
}

function resize()
{
	if(bFullscreen == true)
	{
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;		
	}else
	{
		canvas.width = canvas_original_width;
		canvas.height = canvas_original_height;
	}
	
	//projection	
	//if(canvas.width <= canvas.height)
	//{
	//	mat4.ortho(orthographicProjectionMatrix, -100.0, 100.0, (-100.0 * (canvas.height/canvas.width)),
	//	(100.0 * (canvas.height/canvas.width)),-100.0, 100.0);		
	//}else
	//{
	//	mat4.ortho(orthographicProjectionMatrix, -100.0, 100.0, (-100.0 * (canvas.width/canvas.height)),
	//	(100.0 * (canvas.width/canvas.height)),-100.0, 100.0);		
    //}



	mat4.perspective(perspectiveProjectionMatrix,60.0, parseFloat(canvas.width/canvas.height),0.1, 1000.0);	
	gl.viewport(0,0,canvas.width,canvas.height);
}

var zVal = 0.0;
var zVal2 = 0.0;
function draw()
{
	animloop();
	

	requestAnimationFrame(draw,canvas);
	
	
}

function degreeToRadian(angleInDegree)
{
	return (angleInDegree *  Math.PI/ 180);
}
function toggleFullScreen()
{
	//code
	var fullScreen_element = 
		document.fullscreenElement||
		document.webkitFullscreenElement||
		document.mozFullScreenElement||
		document.msFullscreenElement||
		null;
		
	//if not full screen
	if(fullScreen_element == null)
	{
		if(canvas.requestFullscreen)
			canvas.requestFullscreen();
		else if(canvas.mozRequestFullScreen)
			canvas.mozRequestFullScreen();
		else if(canvas.webkitRequestFullscreen)
			canvas.webkitRequestFullscreen();
		else if(canvas.msRequestFullscreen)
		    canvas.msRequestFullscreen();
		bFullscreen = true;
	}
	else //restore from fullscreen
	{
			if(document.exitFullscreen)
				document.exitFullscreen();
			else if(document.mozCancelFullScreen)
				document.mozCancelFullScreen();
			else if(document.webkitExitFullscreen)
				document.webkitExitFullscreen();
			else if(document.msExitFullscreen)
			    document.msExitFullscreen();
			bFullscreen = false;

	}
}

function keydown(event)
{
	switch(event.keyCode)
	{
		case 27://Esc
			uninitialize();
			window.close();
			break;
		case 70: //for 'F' or 'f'
			toggleFullScreen();			
			break;
	    case 76:
	        if (gbLighting == 0)
	            gbLighting = 1
	        else
	            gbLighting = 0;
	        break;
	}
}

function mouseDown()
{
	alert("Mouse is clicked");
}

function uninitialize()
{
	if(vao)
	{
		gl.deleteVertexArray(vao);
		vao = null;
	}
	
	if(vbo)
	{
		gl.deleteBuffer(vbo);
		vbo=null;
	}
	
	if(program_Fire)
	{
		if(fragmentShaderObject)
		{
			gl.detachShader(program_Fire, fragmentShaderObject);
			fragmentShaderObject = null;
		}
		
		if(vertexShaderObject)
		{
			gl.detachShader(program_Fire, vertexShaderObject);
			vertexShaderObject = null;
		}
		gl.deleteProgram(program_Fire);
		program_Fire = null;
	}
}