//global variables
var canvas=null;
var gl=null; //for webgl context
var bFullscreen = false;
var canvas_original_width;
var canvas_original_height;



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
async function main()
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
	



	
	loadModel('Coffee Cup_final.obj',vao_mercedes_modelLoading,vbo_mercedes_modelLoading);
	MercedesProgramObject = initializeModel();



	resize();
	drawModel();
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



	mat4.perspective(perspectiveProjectionMatrix_modelLoading, 45.0, parseFloat(canvas.width/canvas.height),0.1, 1000.0);	
	gl.viewport(0,0,canvas.width,canvas.height);
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
			case 76:
		case 108:
				if(gbLighting_modelLoading)
					gbLighting_modelLoading = false;
				else
					gbLighting_modelLoading = true;
			break;
		case 70: //for 'F' or 'f'
			toggleFullScreen();			
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
	
	if(modelLoadingProgramObject)
	{
		if(fragmentShaderObject_modelLoading)
		{
			gl.detachShader(modelLoadingProgramObject, fragmentShaderObject_modelLoading);
			fragmentShaderObject_modelLoading = null;
		}
		
		if(vertexShaderObject_modelLoading)
		{
			gl.detachShader(modelLoadingProgramObject, vertexShaderObject_modelLoading);
			vertexShaderObject_modelLoading = null;
		}
		gl.deleteProgram(modelLoadingProgramObject);
		modelLoadingProgramObject = null;
	}
}