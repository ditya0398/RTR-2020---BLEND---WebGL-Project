//Headers
#include<Windows.h>
#include<stdio.h>

#include<gl\glew.h>
#include<gl\GL.h>
//#include<gl\GLU.h> - remove this for
#include "vmath.h"
#include <stdlib.h>
#include "Sphere.h"
using namespace vmath;
#include"MyWindow.h"
#define WIDTH 800
#define HEIGTH 600

#pragma comment(lib, "glew32.lib")
#pragma comment(lib,"OpenGL32.lib")
#pragma comment(lib,"Sphere.lib")


//#pragma comment(lib, "GLU32.lib")// remove additional libraries

enum {
	VDG_ATTRIBUTE_VERTEX = 0,
	VDG_ATTRIBUTE_NORMAL,
	tvn_attribute_position,
	tvn_attribute_color,
	tvn_attribute_texcoord,
	tvn_attribute_normal
}; //entity


GLuint vao; //vertex aray uniform
GLuint vbo;//vertex buffer objects
//change:1
GLuint vbo_colour;

GLuint nvpMatrixUniform;
GLint glInfoLogLength = 0;
GLint shaderCompiledStatus = 0;

float sphere_vertices[1146];
float sphere_normals[1146];
float sphere_textures[764];
unsigned short sphere_elements[2280];
GLuint gNumVertices;
GLuint gNumElements;

GLuint textureSamplerUniform;

//change-1
mat4 perspectiveProjectionMatrix; //mat4 data type

//Global Function Declarations
LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);


FILE* tvn_gpfile = NULL;
DWORD tvn_dwStyle;
WINDOWPLACEMENT tvn_wpPrev = { sizeof(WINDOWPLACEMENT) };
bool tvn_gbFullScreen = FALSE;
bool tvn_gbActiveWindow = false;
HWND tvn_ghwnd = NULL;
HDC tvn_ghdc = NULL;
HGLRC tvn_ghrc;
int tvn_width;
int tvn_height;
GLfloat tvn_gheight = 0;
GLfloat tvn_gwidth = 0;
GLchar* szBuffer = NULL;
GLsizei written;
GLdouble angle1 = 0.0f;
GLdouble angle2 = 0.0f;
GLfloat rangle = 0.0f;
GLfloat radius = 0.5f;

GLint i = 0;

//1 - create shader object
//feed data to shader object
//
GLuint gVertexShaderObject;
GLuint gFragmentShaderObject;
GLuint gShaderrogramObject;
GLint shaderProgramLinkStatus;
GLuint vbo_position;
GLuint vbo_color;
GLuint vao_cylinder;
GLuint vbo_indices;




/*****cylinder attributes*/
GLuint  vertexCount;
GLuint triangleCount;
float* vertices;
float* normals;
float* texCoords;
float* indices;
int du;
GLuint stone_texture;


GLfloat* archVertices;
GLint angleCount = 0;



//WinMain()
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpszCmdLine, int iCmdShow)
{
	//Function Declaration
	void Initialize(void);
	void Display(void);

	//Variable Declaration
	WNDCLASSEX tvn_wndclass;
	HWND tvn_hwnd;
	MSG tvn_msg;
	TCHAR tvn_szAppName[] = TEXT("MyApp");
	bool tvn_BDone = false;

	//opengl related log
	if (fopen_s(&tvn_gpfile, "TVNLog.txt", "w") != 0)
	{
		MessageBox(NULL, TEXT("Cannot Create Desired File."), TEXT("ERROR"), MB_OK);
		exit(0);
	}
	else
	{
		fprintf(tvn_gpfile, "Log File Successfully Created. Program Started Successfully\n");
	}


	int tvn_mid_width;
	int tvn_mid_height;


	//Code
	//Initialization Of WNDCLASSEX
	tvn_wndclass.cbSize = sizeof(WNDCLASSEX);
	tvn_wndclass.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
	tvn_wndclass.cbClsExtra = 0;
	tvn_wndclass.cbWndExtra = 0;
	tvn_wndclass.lpfnWndProc = WndProc;
	tvn_wndclass.hInstance = hInstance;
	tvn_wndclass.hIcon = LoadIcon(hInstance, MAKEINTRESOURCE(MYICON));
	tvn_wndclass.hCursor = LoadCursor(NULL, IDC_ARROW);
	tvn_wndclass.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	tvn_wndclass.lpszClassName = tvn_szAppName;
	tvn_wndclass.lpszMenuName = NULL;
	tvn_wndclass.hIconSm = LoadIcon(hInstance, MAKEINTRESOURCE(MYICON));

	//Get the width of Main Window
	tvn_width = GetSystemMetrics(SM_CXSCREEN);
	tvn_height = GetSystemMetrics(SM_CYSCREEN);

	tvn_mid_width = tvn_width / 2;
	tvn_mid_height = tvn_height / 2;

	//Register above Class
	RegisterClassEx(&tvn_wndclass);

	//Create Window
	tvn_hwnd = CreateWindowEx(WS_EX_APPWINDOW,
		tvn_szAppName,
		TEXT("OpenGL Blue Screen"),
		WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN | WS_CLIPSIBLINGS | WS_VISIBLE,
		tvn_mid_width - 400,
		tvn_mid_height - 300,
		WIDTH,
		HEIGTH,
		NULL,
		NULL,
		hInstance,
		NULL);

	tvn_ghwnd = tvn_hwnd;

	Initialize();

	ShowWindow(tvn_hwnd, iCmdShow);
	SetForegroundWindow(tvn_hwnd);
	SetFocus(tvn_hwnd);
	while (tvn_BDone == false)
	{
		if (PeekMessage(&tvn_msg, NULL, 0, 0, PM_REMOVE))
		{
			if (tvn_msg.message == WM_QUIT)
			{
				tvn_BDone = true;
			}
			else
			{
				TranslateMessage(&tvn_msg);
				DispatchMessage(&tvn_msg);
			}
		}
		else
		{
			if (tvn_gbActiveWindow == true)
			{
				//Here You should Call update function for your OpenGL Rendering. 

				//Here you Should Call Display function for your OpenGL Rendering.
				Display();
			}
		}
	}

	return((int)tvn_msg.wParam);
}


LRESULT CALLBACK WndProc(HWND hwnd, UINT iMsg, WPARAM wParam, LPARAM lParam)
{
	//Local Function Declaration
	void ToggleFullScreen(void);
	void Resize(int, int);
	void Uninitialize(void);


	tvn_width = GetSystemMetrics(SM_CXSCREEN);
	tvn_height = GetSystemMetrics(SM_CYSCREEN);

	//Local Variable Declaration

	//Code
	switch (iMsg)
	{
	case WM_CREATE:
		fprintf(tvn_gpfile, "India Is My Country.");
		break;

	case WM_SETFOCUS:
		tvn_gbActiveWindow = true;
		break;

	case WM_KILLFOCUS:
		tvn_gbActiveWindow = false;
		break;
		break;

	case WM_ERASEBKGND:
		return(0);

	case WM_SIZE:
		Resize(LOWORD(lParam), HIWORD(lParam));
		break;

	case WM_KEYDOWN:
		switch (wParam)
		{
		case VK_ESCAPE:
			DestroyWindow(hwnd);
			break;
		case 0x46:
		case 0x66:
			ToggleFullScreen();
			break;
		default:
			break;
		}
		break;

	case WM_CHAR:
		switch (wParam)
		{
		case  'x':
			rangle = rangle + 1.0f;
			break;
		}
		break;

	case WM_CLOSE:
		DestroyWindow(hwnd);
		break;

	case WM_DESTROY:
		fprintf(tvn_gpfile, "Jai Hind \n\n");
		Uninitialize();
		PostQuitMessage(0);
		break;
	
	default:
		break;
	}
	return(DefWindowProc(hwnd, iMsg, wParam, lParam));
}

void ToggleFullScreen(void)
{
	//Local Variable Declaration
	MONITORINFO tvn_mi = { sizeof(MONITORINFO) };

	//Code
	if (tvn_gbFullScreen == false)
	{
		tvn_dwStyle = GetWindowLong(tvn_ghwnd, GWL_STYLE);
		if (tvn_dwStyle & WS_OVERLAPPEDWINDOW)
		{
			if (GetWindowPlacement(tvn_ghwnd, &tvn_wpPrev) && GetMonitorInfo(MonitorFromWindow(tvn_ghwnd, MONITORINFOF_PRIMARY), &tvn_mi))
			{
				SetWindowLong(tvn_ghwnd, GWL_STYLE, (tvn_dwStyle & ~WS_OVERLAPPEDWINDOW));
				SetWindowPos(tvn_ghwnd, HWND_TOP, tvn_mi.rcMonitor.left, tvn_mi.rcMonitor.top, tvn_mi.rcMonitor.right - tvn_mi.rcMonitor.left, tvn_mi.rcMonitor.bottom - tvn_mi.rcMonitor.top, SWP_NOZORDER | SWP_FRAMECHANGED);
			}
		}
		ShowCursor(FALSE);
		tvn_gbFullScreen = true;

	}
	else
	{
		SetWindowLong(tvn_ghwnd, GWL_STYLE, (tvn_dwStyle | WS_OVERLAPPEDWINDOW));
		SetWindowPlacement(tvn_ghwnd, &tvn_wpPrev);
		SetWindowPos(tvn_ghwnd, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOOWNERZORDER | SWP_NOZORDER | SWP_FRAMECHANGED);
		ShowCursor(TRUE);
		tvn_gbFullScreen = false;
	}

}


void Initialize(void)
{
	//Function Declaration
	void Resize(int, int);
	bool loadGlTexture(GLuint*, TCHAR[]);



	//Variable Declaration
	PIXELFORMATDESCRIPTOR tvn_pfd;
	int tvn_iPixelFormatIndex;

	//Code
	tvn_ghdc = GetDC(tvn_ghwnd);
	ZeroMemory(&tvn_pfd, sizeof(PIXELFORMATDESCRIPTOR));
	tvn_pfd.nSize = sizeof(PIXELFORMATDESCRIPTOR);
	tvn_pfd.nVersion = 1;
	tvn_pfd.dwFlags = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER;
	tvn_pfd.iPixelType = PFD_TYPE_RGBA;
	tvn_pfd.cColorBits = 32;
	tvn_pfd.cRedBits = 8;
	tvn_pfd.cGreenBits = 8;
	tvn_pfd.cBlueBits = 8;
	tvn_pfd.cAlphaBits = 8;
	tvn_pfd.cDepthBits = 32;

	tvn_iPixelFormatIndex = ChoosePixelFormat(tvn_ghdc, &tvn_pfd);

	if (tvn_iPixelFormatIndex == 0)
	{
		fprintf(tvn_gpfile, "ChoosePixelFormat Function Falied\n");
		DestroyWindow(tvn_ghwnd);
	}

	if (SetPixelFormat(tvn_ghdc, tvn_iPixelFormatIndex, &tvn_pfd) == false)
	{
		fprintf(tvn_gpfile, "SetPixelFormat Function Falied\n");
		DestroyWindow(tvn_ghwnd);
	}

	tvn_ghrc = wglCreateContext(tvn_ghdc);

	if (tvn_ghrc == NULL)
	{
		fprintf(tvn_gpfile, "wglCreateContext Function Falied\n");
		DestroyWindow(tvn_ghwnd);
	}

	if (wglMakeCurrent(tvn_ghdc, tvn_ghrc) == FALSE)
	{
		fprintf(tvn_gpfile, "wglMakeCurrent Function Falied\n");
		DestroyWindow(tvn_ghwnd);
	}


	GLenum glew_error = glewInit();
	if (glew_error != GLEW_OK)
	{
		wglDeleteContext(tvn_ghrc);
		tvn_ghrc = NULL;
		ReleaseDC(tvn_ghwnd, tvn_ghdc);
		tvn_ghdc = NULL;
		//Uninitialize();
	}

	glEnable(GL_PROGRAM_POINT_SIZE);

	//opengl related log
	fprintf(tvn_gpfile, "openGL vendor: %s \n ", glGetString(GL_VENDOR));
	fprintf(tvn_gpfile, "openGL renderer: %s \n ", glGetString(GL_RENDERER));
	fprintf(tvn_gpfile, "openGL version: %s \n ", glGetString(GL_VERSION));
	//glsl version graphics lib shading language
	fprintf(tvn_gpfile, "openGL glsl version : %s \n ", glGetString(GL_SHADING_LANGUAGE_VERSION));

	//openGL enabled extensions
	GLint numExtensions;

	glGetIntegerv(GL_NUM_EXTENSIONS, &numExtensions);
	for (int i = 0; i < numExtensions; i++)
	{
		fprintf(tvn_gpfile, "openGL Extensions: %s \n ", glGetStringi(GL_EXTENSIONS, i));
	}


	//dCylinder(4, 8, 10, 0, 0);
	vertices = (float*)malloc(6280 * 3 * 2 * sizeof(float));
	//fprintf(tvn_gpfile, "vertices[i]: %d", i);


	//fprintf(tvn_gpfile, "vertices[i]: %d\n", sizeof(float));

	for (angle1 = 0.0f; angle1 < 2 * 3.14; angle1 = angle1 + 0.001f)
	{
		//6280 * (3)* 2
		vertices[i++] = cos(angle1) * radius;
		vertices[i++] = 1.0f;
		vertices[i++] = sin(angle1) * radius;

		vertices[i++] = cos(angle1) * radius;
		vertices[i++] = -1.0f;
		vertices[i++] = sin(angle1) * radius;
	}


	archVertices = (float*)malloc(3140 * 3 * sizeof(float));

	for (angle2 = 2.0f; angle2 < 3.14; angle2 = angle2 + 0.001f)
	{
		archVertices[angleCount++] = cos(angle2);
		archVertices[angleCount++] = sin(angle2);
		archVertices[angleCount++] = 0.0f;
	}



	/**************************Vertex shader*******************************************/
	// create object of shader
	// feed source code to shader
	// compile

	//1.create object of shader
	gVertexShaderObject = glCreateShader(GL_VERTEX_SHADER);

	//2. provide source code to shader  // multiple string as single string // shader language version  - 4.5
	const GLchar* vertexShaderSourceCode =
		"#version 440 core" \
		"\n" \
		"in vec4 vPosition;" \
		"in vec2 vtexcoord;" \
		"uniform mat4 u_mvpMatrix;"\
		"out vec2 out_textCoord;" \
		"void main(void)" \
		"{" \
		"gl_Position = u_mvpMatrix * vPosition;" \
		"}";

	//vertex shader gives postion
	/*const GLchar* vertexShaderSourceCode =
		"#version 450 core" \ //use core profile, means programmable pipeline //old opengL, (compatibility profile/hybrid profile<transition between fixed and programmable>)
		"\n" \
		"in vec4  vposition;" \ //main program varun aat yenar//postion type ch array  - in - ekdach yeto
		"uniform mat4 u_mvpMatrix;" \ //uniform data yenare - parat parat yeto
		"void main(void)" \
		"{" \
		"gl_Position = u_mvpMatrix * vposition;"\
		"}";
		*/
		//core - 4.0 onwards started using in shader, shader compiler checks if there is any deprecated feature in programmable 
	   //pass through shader, not doing any processing
	   //in -  whenever in shader in and out is there, shader's glsl(graphic library shading language) languages specifier it is.from main program to shader through in 
	   //vec4 - type vposition - gives vertex postion
	   //uniform - uniform data comes from main to shader
	   //in - data comes only once
	   //uniform - repeatedly coming data should come from unifrom
	   //mat4 is not same as global
	   //this is shader's mat4
	   //gl_Position - inbuilt var of vertex shaders  - vertex shader runs as per vertex shader
	   //(3 vertices - 3 times vertex shader)
	   //11 lac vertices - 11 lac times vertex shader runs - but speed does not get impact as GPU is fast

	glShaderSource(gVertexShaderObject, 1/*how many shader to be feed*/, (const GLchar**)&vertexShaderSourceCode, NULL); /*if multiple code is there void main void etc..so we give array , it contains size*/
	glCompileShader(gVertexShaderObject);


	//3. compile shader
	//here there should be shader conpilation error shading checking


	//pass thorugh shader, not doing any processing

	//3. compile
	glGetShaderiv(gVertexShaderObject, GL_COMPILE_STATUS, &shaderCompiledStatus);
	if (shaderCompiledStatus == GL_FALSE)
	{
		glGetShaderiv(gVertexShaderObject, GL_INFO_LOG_LENGTH, &glInfoLogLength);

		if (glInfoLogLength > 0)
		{
			szBuffer = (GLchar*)malloc(glInfoLogLength);
			if (szBuffer != NULL)
			{
				glGetShaderInfoLog(gVertexShaderObject, glInfoLogLength, &written, szBuffer); //1.47
				fprintf(tvn_gpfile, "shader compilation log %s \n", szBuffer);
				free(szBuffer);
				DestroyWindow(tvn_ghwnd);
			}
		}
	}




	/***********************same will repeat for fragment shader**********************************/
	//1.create object of shader //1.50
	gFragmentShaderObject = glCreateShader(GL_FRAGMENT_SHADER);

	//attributes comes from only vertex shader
	//2. provide source code to shader  // multiple string as single string // shader language version  - 4.5

	//change 3
	glPointSize(10);    
	const GLchar* fragmentShaderSourceCode =
		"#version 440 core" \
		"\n" \
		"in vec2 out_textCoord;" \
		"uniform sampler2D u_texture_sampler;" \
		"out vec4 fragColor;" \
		"void main(void)" \
		"{" \
		
		"fragColor = texture(u_texture_sampler, gl_PointCoord);" \
		"}";
	//whatever comes out from fragment shader that is visible

	glShaderSource(gFragmentShaderObject, 1/*how many shader to be feed*/, (const GLchar**)&fragmentShaderSourceCode, NULL); /*if multiple code is there void main void etc..so we give array , it contains size*/
	glCompileShader(gFragmentShaderObject);
	//here there should be shader conpilation error checking// for now no code


	glInfoLogLength = 0;
	szBuffer = NULL;
	shaderCompiledStatus = 0;
	written = 0;

	glGetShaderiv(gFragmentShaderObject, GL_COMPILE_STATUS, &shaderCompiledStatus);
	if (shaderCompiledStatus == GL_FALSE)
	{
		glGetShaderiv(gFragmentShaderObject, GL_INFO_LOG_LENGTH, &glInfoLogLength);
		if (glInfoLogLength > 0)
		{
			szBuffer = (GLchar*)malloc(glInfoLogLength);
			if (szBuffer != NULL)
			{
				glGetShaderInfoLog(gFragmentShaderObject, glInfoLogLength, &written, szBuffer); //1.47
				fprintf(tvn_gpfile, "fragment shader compilation log %s \n", szBuffer);
				free(szBuffer);
				DestroyWindow(tvn_ghwnd);

			}
		}

	}


	////////******************************shader linking code******************/////////////
	//1. create shader prgrm capable of linking shaders
	//2. Attach whichever shaders u have to this shader prgrm object
	//3.link all those shaders at once

	gShaderrogramObject = glCreateProgram();
	glAttachShader(gShaderrogramObject, gVertexShaderObject);//attach whatever shaders u have
	glAttachShader(gShaderrogramObject, gFragmentShaderObject);//attach whatever shaders u have

	//main program should know where is in and out
	//post attach and pre linking you should bind the attributes in shader with enum in main program
	glBindAttribLocation(gShaderrogramObject, tvn_attribute_position, "vPosition");// dont do mistake
//	glBindAttribLocation(gShaderrogramObject, tvn_attribute_texcoord, "vtexcoord");// dont do mistake // not required basicaaly as we kept the tect corrds in vertex
	glLinkProgram(gShaderrogramObject); //link whatever shaders are compiled , here there should be shader linkage error checking

	glInfoLogLength = 0;
	szBuffer = NULL;
	glGetProgramiv(gShaderrogramObject, GL_LINK_STATUS, &shaderProgramLinkStatus);
	if (shaderProgramLinkStatus == GL_FALSE)
	{
		glGetProgramiv(gShaderrogramObject, GL_INFO_LOG_LENGTH, &glInfoLogLength);
		if (glInfoLogLength > 0)
		{
			szBuffer = (GLchar*)malloc(sizeof(char) * glInfoLogLength + 1);
			if (szBuffer != NULL)
			{
				glGetProgramInfoLog(gShaderrogramObject, glInfoLogLength, &written, szBuffer); //1.47
				fprintf(tvn_gpfile, "gShaderrogramObject link log %s \n", szBuffer);
				free(szBuffer);
				DestroyWindow(tvn_ghwnd);
			}
		}

	}

	//post linking
	nvpMatrixUniform = glGetUniformLocation(gShaderrogramObject, "u_mvpMatrix");
	textureSamplerUniform = glGetUniformLocation(gShaderrogramObject, "u_texture_sampler");
	/*getSphereVertexData(sphere_vertices, sphere_normals, sphere_textures, sphere_elements);
	gNumVertices = getNumberOfSphereVertices();
	gNumElements = getNumberOfSphereElements();
	*/

	
	const GLfloat textCoord[] = {
		vertices[0],
		vertices[2]
		
	};

	// vao
	glGenVertexArrays(1, &vao_cylinder);
	glBindVertexArray(vao_cylinder);


	//position
	glGenBuffers(1, &vbo_position);
	glBindBuffer(GL_ARRAY_BUFFER, vbo_position);
	glBufferData(GL_ARRAY_BUFFER, 3140 * 3 * sizeof(float), archVertices, GL_STATIC_DRAW);
	glVertexAttribPointer(tvn_attribute_position, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(tvn_attribute_position);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	/**********************/
	loadGlTexture(&stone_texture, MAKEINTRESOURCE(STONE_BITMAP));
	/************************/

	//color
	//glGenBuffers(1, &vbo_color); //generate
	//glBindBuffer(GL_ARRAY_BUFFER, vbo_color);
	//glBufferData(GL_ARRAY_BUFFER, sizeof(textCoord), textCoord, GL_STATIC_DRAW);
	//glVertexAttribPointer(tvn_attribute_texcoord, 2, GL_FLOAT, GL_FALSE, 0, NULL); // texture has 2 params
	//glEnableVertexAttribArray(tvn_attribute_texcoord);
	//glBindBuffer(GL_ARRAY_BUFFER, 0);
	glBindVertexArray(0);


	// unbind vao
	glBindVertexArray(0);

	//openGl progrm says whatevr u dont want, like back op geometry//culling on
	//glEnable(GL_CULL_FACE);

	//Set Clear Color 
	//glClearColor(0.0f, 0.0f, 1.0f, 1.0f); blue color
	glClearColor(0.0f, 0.0f, 0.0f, 1.0f);
	glClearDepth(1.0f);
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LEQUAL);

	glShadeModel(GL_SMOOTH);
	glHint(GL_PERSPECTIVE_CORRECTION_HINT, GL_NICEST);

	perspectiveProjectionMatrix = vmath::mat4::identity();

	Resize(WIDTH, HEIGTH);
}

bool loadGlTexture(GLuint* texture, TCHAR resourceId[]) {
	//variable declarations
	bool bResult = false;

	HBITMAP hBitmap = NULL;
	BITMAP bmp;

	//code
	hBitmap = (HBITMAP)LoadImage(GetModuleHandle(NULL)//always instance handle
		, resourceId, IMAGE_BITMAP, 0, 0, LR_CREATEDIBSECTION); //this is bitmap not icon(0,0) //device indepedent bitmap
										 //load resource
	if (hBitmap)
	{
		bResult = true;
		GetObject(hBitmap, sizeof(BITMAP), &bmp);
		//glPixelStorei(GL_UNPACK_ALIGNMENT, 4);//first 4 row);
		glPixelStorei(GL_UNPACK_ALIGNMENT, 1);//pp gives faster performance	
		glGenTextures(1, texture);
		glBindTexture(GL_TEXTURE_2D, *texture);

		//taking texture parameters
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);

		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);
		//this fun is only in ffp, its combination of two funcs, will use those
		//gluBuild2DMipmaps(GL_TEXTURE_2D, 3, bmp.bmWidth, bmp.bmHeight, GL_BGR_EXT, GL_UNSIGNED_BYTE, bmp.bmBits);

		glTexImage2D(GL_TEXTURE_2D, 0/*//level od=f details - 0 base details*/, GL_RGB/**same as 3*/, bmp.bmWidth,
			bmp.bmHeight, 0/*border width - default*/, GL_BGR_EXT, GL_UNSIGNED_BYTE, bmp.bmBits);

		glGenerateMipmap(GL_TEXTURE_2D);
		//////////////////////////////////////////

		DeleteObject(hBitmap);

	}
	return bResult;

}



void Resize(int width, int height)
{
	tvn_gheight = height;
	tvn_gwidth = width;

	//Code
	if (height == 0)
	{
		height = 1;
	}

	glViewport(0, 0, (GLsizei)width, (GLsizei)height);

	//change-3


	perspectiveProjectionMatrix = vmath::perspective(45.0f, ((GLfloat)width / (GLfloat)height), 0.1f, 100.0f);


}

void Display(void)
{

	
	//Code
	glClear(GL_COLOR_BUFFER_BIT | GL_DEPTH_BUFFER_BIT);
	mat4 modelviewmatrix;
	mat4 rotateMatrix;
	mat4 modelviewprojectionmatrix;

	//start using openGl program object
	glUseProgram(gShaderrogramObject); //whatever i have compiled and linked, use it
	modelviewmatrix = mat4::identity();
	modelviewprojectionmatrix = mat4::identity();

	//change-3
	//use different matrix 
	mat4 translateMatrix;
	rotateMatrix = mat4::identity();
	rotateMatrix = vmath::rotate(rangle, 1.0f, 0.0f, 0.0f);
	translateMatrix = vmath::translate(0.0f, 0.0f, -3.0f);

	//to whom we need to translate
	modelviewmatrix = translateMatrix * rotateMatrix;
	modelviewprojectionmatrix = perspectiveProjectionMatrix * modelviewmatrix;

	glUniformMatrix4fv(nvpMatrixUniform, 1, GL_FALSE, modelviewprojectionmatrix);

	/************************************/

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, stone_texture);
	glUniform1i(textureSamplerUniform, 0);

	/*************************************/
	
		
	
	// *** bind vao ***
	glBindVertexArray(vao_cylinder);

	// *** draw, either by glDrawTriangles() or glDrawArrays() or glDrawElements()
	//glBindBuffer(GL_ARRAY_BUFFER, vbo_position);

	
	glDrawArrays(GL_POINTS,0,3140 * 3);

	// *** unbind vao ***
	glBindVertexArray(0);


	glUseProgram(0); //	stop using it now
	SwapBuffers(tvn_ghdc);

}


void Uninitialize(void)
{

	//Code
	if (tvn_gbFullScreen == true)
	{
		tvn_dwStyle = GetWindowLong(tvn_ghwnd, GWL_STYLE);
		SetWindowLong(tvn_ghwnd, GWL_STYLE, tvn_dwStyle | WS_OVERLAPPEDWINDOW);
		SetWindowPlacement(tvn_ghwnd, &tvn_wpPrev);
		SetWindowPos(tvn_ghwnd, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOOWNERZORDER | SWP_NOZORDER | SWP_FRAMECHANGED);

		ShowCursor(TRUE);
	}

	if (wglGetCurrentContext() == tvn_ghrc)
	{
		wglMakeCurrent(NULL, NULL);
	}

	if (tvn_ghrc)
	{
		wglDeleteContext(tvn_ghrc);
		tvn_ghrc = NULL;
	}

	if (tvn_ghdc)
	{
		ReleaseDC(tvn_ghwnd, tvn_ghdc);
		tvn_ghdc = NULL;
	}

	if (tvn_gpfile)
	{
		fprintf(tvn_gpfile, "Log File Closed Successfully Program is Complete Successfully");
		fclose(tvn_gpfile);
		tvn_gpfile = NULL;
	}


	//safe shader cleanup
	if (gShaderrogramObject)
	{
		glUseProgram(gShaderrogramObject);
		GLsizei shaderCount;
		glGetProgramiv(gShaderrogramObject, GL_ATTACHED_SHADERS, &shaderCount); // how many attached shader are there
		GLuint* pShader = NULL;
		pShader = (GLuint*)malloc(sizeof(GLuint) * shaderCount);

		glGetAttachedShaders(gShaderrogramObject, shaderCount/*we give*/, &shaderCount/*actual how many*/, pShader/*give atached shader in this*/);

		for (GLsizei i = 0; i < shaderCount; i++)
		{
			glDetachShader(gShaderrogramObject, pShader[i]); //detah shaders
			glDeleteShader(pShader[i]); //delete shaders
			pShader[i] = 0;
		}
		free(pShader);

		//pShader[i] = 0;

		glDeleteProgram(gShaderrogramObject);
		gShaderrogramObject = 0;

		glUseProgram(0);
	}




	if (vertices) {
		free(vertices);
	}

	if (normals) {
		free(normals);
	}

	if (texCoords) {
		free(texCoords);
	}
	if (indices) {
		free(indices);
	}
}
