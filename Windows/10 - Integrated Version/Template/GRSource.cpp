#include"GRStack.h"
#include<gl\glew.h>
#include<gl\GL.h>
#include<windows.h>
#include<stdio.h>
#include"GRSourceHeader.h"


enum
{
	GR_ATTRIBUTE_POSITION = 0,
	GR_ATTRIBUTE_COLOR,
	GR_ATTRIBUTE_TEXCOORD,
	GR_ATTRIBUTE_NORMAL
};
FILE* grgpFile = NULL;
GLuint grgVertexShaderObject;
GLuint grgFragmentShadeerObject;
GLuint grgShaderProgramObject;
// project specific global variables declaration
GLuint grgModelMatrixUniform;
GLuint grgViewMatrixUniform;
GLuint grgProjectionMatrixUniform;
mat4 grgPerspectiveProjectionMatrix;
GLuint grgVaoRadio;
GLuint grgVboPositionRadio;
GLuint grgVboTextureRadio;

GLfloat grfangleX = 0.0f;
GLfloat grfangleY = 0.0f;
int gri;

// texture
GLuint grtextureBench;
GLuint grtextureRadio;
GLuint grtextureBenchLegs;
GLuint grtextureAntenna;
GLuint grtextureRoad;
GLuint grtextureFootpath;
GLuint grgtextureSamplerUniform;

// bench
GLuint grgVaoBenchTable;
GLuint grgVboPositionBenchTable;
GLuint grgVboTextureBenchTable;
GLuint grgVaoBenchLegs;
GLuint grgVboPositionBenchLegs;
GLuint grgVboTextureBenchLegs;

extern "C" void GROpenLogFile()
{
	if (fopen_s(&grgpFile, "GRLog.txt", "w") != 0)
	{
		MessageBox(NULL, TEXT("Cannot open desired file"), TEXT("Error"), MB_OK | MB_ICONERROR);
		exit(0);
	}
	else
	{
		fprintf_s(grgpFile, "Log file created successfully. \n Program started successfully\n **** Logs ***** \n");
	}
}

extern "C" void printLog(char* msg)
{

}

extern "C" void GRIncrementX()
{
	grfangleX = grfangleX + 1.0f;
}

extern "C" void GRIncrementY()
{
	grfangleY = grfangleY + 1.0f;
}

extern "C" void GRInitShaders()
{
	// create shader
	grgVertexShaderObject = glCreateShader(GL_VERTEX_SHADER);

	///// Vertex Shader
	const GLchar* grvertexShaderSourceCode =					// also called as "pass-through shader" as it does not have any code (main is empty, no code is there in main)
		"#version 450 core" \
		"\n" \
		"in vec4 vPosition;" \
		"in vec2 vTexCoord;" \
		"uniform mat4 u_model_matrix;" \
		"uniform mat4 u_view_matrix;" \
		"uniform mat4 u_projection_matrix;" \
		"out vec2 out_texcoord;" \
		"void main(void)" \
		"{" \
		"gl_Position = u_projection_matrix * u_view_matrix * u_model_matrix * vPosition;" \
		"out_texcoord = vTexCoord;" \
		"}";

	glShaderSource(grgVertexShaderObject, 1, (const GLchar**)&grvertexShaderSourceCode, NULL);

	// compile shader
	glCompileShader(grgVertexShaderObject);
	// error check for compilation
	GLint griInfoLength = 0;
	GLint griShaderCompileStatus = 0;
	char* grszInfoLog = NULL;

	glGetShaderiv(grgVertexShaderObject, GL_COMPILE_STATUS, &griShaderCompileStatus);
	if (griShaderCompileStatus == GL_FALSE)
	{
		glGetShaderiv(grgVertexShaderObject, GL_INFO_LOG_LENGTH, &griInfoLength);
		if (griInfoLength > 0)
		{
			grszInfoLog = (char*)malloc(sizeof(char) * sizeof(griInfoLength));
			if (grszInfoLog != NULL)
			{
				GLsizei grwritten;
				glGetShaderInfoLog(grgVertexShaderObject, griInfoLength, &grwritten, grszInfoLog);
				fprintf(grgpFile, "\n Vertex Shader Compilation Log : %s", grszInfoLog);
				free(grszInfoLog);
				
			}
		}
		GRUninitialize();
	}

	////// Fragment Shader
	grgFragmentShadeerObject = glCreateShader(GL_FRAGMENT_SHADER);

	// source code of shader
	const GLchar* grfragmentShaderSourceCode =
		"#version 450 core" \
		"\n" \
		"in vec2 out_texcoord;"
		"uniform sampler2D u_texture_sampler;" \
		"out vec4 FragColor;" \
		"void main(void)" \
		"{" \
		"FragColor = texture(u_texture_sampler, out_texcoord);" \
		"}";

	glShaderSource(grgFragmentShadeerObject, 1, (const GLchar**)&grfragmentShaderSourceCode, NULL);

	// compile shader
	glCompileShader(grgFragmentShadeerObject);
	// error check for compiation
	glGetShaderiv(grgFragmentShadeerObject, GL_COMPILE_STATUS, &griShaderCompileStatus);
	if (griShaderCompileStatus == GL_FALSE)
	{
		glGetShaderiv(grgFragmentShadeerObject, GL_INFO_LOG_LENGTH, &griInfoLength);
		if (griInfoLength > 0)
		{
			grszInfoLog = (char*)malloc(sizeof(char) * sizeof(griInfoLength));
			if (grszInfoLog != NULL)
			{
				GLsizei grwritten;
				glGetShaderInfoLog(grgFragmentShadeerObject, griInfoLength, &grwritten, grszInfoLog);
				fprintf(grgpFile, "\n Fragment Shader Compilation Log : %s", grszInfoLog);
				free(grszInfoLog);
				
			}
		}
		GRUninitialize();
	}

	//****** Shader Program *****//
	// create
	grgShaderProgramObject = glCreateProgram();

	// attach vertex shader to shader program
	glAttachShader(grgShaderProgramObject, grgVertexShaderObject);

	// attach fragment shader to shader program
	glAttachShader(grgShaderProgramObject, grgFragmentShadeerObject);

	// pre-link our attribute enum with shader's attributes
	glBindAttribLocation(grgShaderProgramObject, GR_ATTRIBUTE_POSITION, "vPosition");
	glBindAttribLocation(grgShaderProgramObject, GR_ATTRIBUTE_TEXCOORD, "vTexCoord");

	// link shader
	glLinkProgram(grgShaderProgramObject);
	// error check for linking
	GLint griShaderProgramLinkStatus = 0;
	glGetProgramiv(grgShaderProgramObject, GL_LINK_STATUS, &griShaderProgramLinkStatus);
	if (griShaderProgramLinkStatus == GL_FALSE)
	{
		glGetProgramiv(grgShaderProgramObject, GL_INFO_LOG_LENGTH, &griInfoLength);
		if (griInfoLength > 0)
		{
			grszInfoLog = (char*)malloc(sizeof(griInfoLength) * sizeof(char));
			if (grszInfoLog != NULL)
			{
				GLsizei grwritten;
				glGetProgramInfoLog(grgShaderProgramObject, griInfoLength, &grwritten, grszInfoLog);
				fprintf(grgpFile, "\n Shader Program Link Log : %s", grszInfoLog);
				
			}
		}
		GRUninitialize();
	}

	// set unifrom attributes in shaders
	grgModelMatrixUniform = glGetUniformLocation(grgShaderProgramObject, "u_model_matrix");
	grgViewMatrixUniform = glGetUniformLocation(grgShaderProgramObject, "u_view_matrix");
	grgProjectionMatrixUniform = glGetUniformLocation(grgShaderProgramObject, "u_projection_matrix");
	grgtextureSamplerUniform = glGetUniformLocation(grgShaderProgramObject, "u_texture_sampler");


	GLfloat grradioVertices[] =
	{
		// front face
		1.0f, 0.5f, 0.2f,
		-1.0f, 0.5f, 0.2f,
		-1.0f, -0.5f, 0.2f,
		1.0f, -0.5f, 0.2f,
		// right face
		1.0f, 0.5f, -0.2f,
		1.0f, 0.5f, 0.2f,
		1.0f, -0.5f, 0.2f,
		1.0f, -0.5f, -0.2f,
		// back face
		-1.0f, 0.5f, -0.2f,
		1.0f, 0.5f, -0.2f,
		1.0f, -0.5f, -0.2f,
		-1.0f, -0.5f, -0.2f,
		// left face
		-1.0f, 0.5f, 0.2f,
		-1.0f, 0.5f, -0.2f,
		-1.0f, -0.5f, -0.2f,
		-1.0f, -0.5f, 0.2f,
		// top face
		1.0f, 0.5f, -0.2f,
		-1.0f, 0.5f, -0.2f,
		-1.0f, 0.5f, 0.2f,
		1.0f, 0.5f, 0.2f,
		// bottom face
		1.0f, -0.5f, -0.2f,
		-1.0f, -0.5f, -0.2f,
		-1.0f, -0.5f, 0.2f,
		1.0f, -0.5f, 0.2f
	};
	GLfloat grradioTexCoords[] =
	{
		0.98f, 0.92f,						// left bottom	rt
		0.015f, 0.92f,						// left top     lt
		0.015f, 0.08f,						// right top	lb
		0.98f, 0.08f,						// right bottom	rb

		0.13f, 0.08f,							// right
		0.1f, 0.08f,
		0.1f, 0.067f,
		0.13f, 0.067f,

		0.13f, 0.08f,							// back rt
		0.1f, 0.08f,								// lt
		0.1f, 0.069f,							// lb
		0.13f, 0.069f,								// rb

		0.13f, 0.08f,							// left
		0.1f, 0.08f,
		0.1f, 0.07f,
		0.13f, 0.07f,

		0.13f, 0.08f,							// right
		0.1f, 0.08f,
		0.1f, 0.067f,
		0.13f, 0.067f,

		0.13f, 0.08f,							// right
		0.1f, 0.08f,
		0.1f, 0.067f,
		0.13f, 0.067f,
	};

	GLfloat grbenchVertices[] =
	{
		1.0f, 1.0f, 1.0f,
		-1.0f, 1.0f, 1.0f,
		-1.0f, -1.0f, 1.0f,
		1.0f, -1.0f, 1.0f,

		1.0f, 1.0f, -1.0f,
		1.0f, 1.0f, 1.0f,
		1.0f, -1.0f, 1.0f,
		1.0f, -1.0f, -1.0f,

		-1.0f, 1.0f, -1.0f,
		1.0f, 1.0f, -1.0f,
		1.0f, -1.0f, -1.0f,
		-1.0f, -1.0f, -1.0f,

		-1.0f, 1.0f, 1.0f,
		-1.0f, 1.0f, -1.0f,
		-1.0f, -1.0f, -1.0f,
		-1.0f, -1.0f, 1.0f,

		1.0f, 1.0f, -1.0f,
		-1.0f, 1.0f, -1.0f,
		-1.0f, 1.0f, 1.0f,
		1.0f, 1.0f, 1.0f,

		1.0f, -1.0f, -1.0f,
		-1.0f, -1.0f, -1.0f,
		-1.0f, -1.0f, 1.0f,
		1.0f, -1.0f, 1.0f
	};
	GLfloat grbenchTexCoords[] =
	{
		1.0f, 1.0f,
		0.0f, 1.0f,
		0.0f, 0.0f,
		1.0f, 0.0f,

		1.0f, 0.0f,
		1.0f, 1.0f,
		0.0f, 1.0f,
		0.0f, 0.0f,

		1.0f, 1.0f,
		0.0f, 1.0f,
		0.0f, 0.0f,
		1.0f, 0.0f,

		0.0f, 0.0f,
		1.0f, 0.0f,
		1.0f, 1.0f,
		0.0f, 1.0f,

		1.0f, 0.0f,
		0.0f, 0.0f,
		0.0f, 1.0f,
		1.0f, 1.0f,

		1.0f, 0.0f,
		0.0f, 0.0f,
		0.0f, 1.0f,
		1.0f, 1.0f
	};



	//** initialize radio **//
	glGenVertexArrays(1, &grgVaoRadio);
	glBindVertexArray(grgVaoRadio);

	glGenBuffers(1, &grgVboPositionRadio);
	glBindBuffer(GL_ARRAY_BUFFER, grgVboPositionRadio);
	glBufferData(GL_ARRAY_BUFFER, sizeof(grradioVertices), grradioVertices, GL_STATIC_DRAW);
	glVertexAttribPointer(GR_ATTRIBUTE_POSITION, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(GR_ATTRIBUTE_POSITION);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	// texture for radio
	glGenBuffers(1, &grgVboTextureRadio);
	glBindBuffer(GL_ARRAY_BUFFER, grgVboTextureRadio);
	glBufferData(GL_ARRAY_BUFFER, sizeof(grradioTexCoords), grradioTexCoords, GL_STATIC_DRAW);
	glVertexAttribPointer(GR_ATTRIBUTE_TEXCOORD, 2, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(GR_ATTRIBUTE_TEXCOORD);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	glBindVertexArray(0);


	// vao for bench table/desk
	glGenVertexArrays(1, &grgVaoBenchTable);
	glBindVertexArray(grgVaoBenchTable);

	glGenBuffers(1, &grgVboPositionBenchTable);
	glBindBuffer(GL_ARRAY_BUFFER, grgVboPositionBenchTable);
	glBufferData(GL_ARRAY_BUFFER, sizeof(grbenchVertices), grbenchVertices, GL_STATIC_DRAW);
	glVertexAttribPointer(GR_ATTRIBUTE_POSITION, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(GR_ATTRIBUTE_POSITION);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	// texture
	glGenBuffers(1, &grgVboTextureBenchTable);
	glBindBuffer(GL_ARRAY_BUFFER, grgVboTextureBenchTable);
	glBufferData(GL_ARRAY_BUFFER, sizeof(grbenchTexCoords), grbenchTexCoords, GL_STATIC_DRAW);
	glVertexAttribPointer(GR_ATTRIBUTE_TEXCOORD, 2, GL_FLOAT, GL_FALSE, 0, NULL);						// 2nd param is 2 because texutre has only S and T i.e 2 params
	glEnableVertexAttribArray(GR_ATTRIBUTE_TEXCOORD);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	glBindVertexArray(0);

	// vao for bench legs
	glGenVertexArrays(1, &grgVaoBenchLegs);
	glBindVertexArray(grgVaoBenchLegs);

	glGenBuffers(1, &grgVboPositionBenchLegs);
	glBindBuffer(GL_ARRAY_BUFFER, grgVboPositionBenchLegs);
	glBufferData(GL_ARRAY_BUFFER, sizeof(grbenchVertices), grbenchVertices, GL_STATIC_DRAW);
	glVertexAttribPointer(GR_ATTRIBUTE_POSITION, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(GR_ATTRIBUTE_POSITION);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	// texture
	glGenBuffers(1, &grgVboTextureBenchLegs);
	glBindBuffer(GL_ARRAY_BUFFER, grgVboTextureBenchLegs);
	glBufferData(GL_ARRAY_BUFFER, sizeof(grbenchTexCoords), grbenchTexCoords, GL_STATIC_DRAW);
	glVertexAttribPointer(GR_ATTRIBUTE_TEXCOORD, 2, GL_FLOAT, GL_FALSE, 0, NULL);						// 2nd param is 2 because texutre has only S and T i.e 2 params
	glEnableVertexAttribArray(GR_ATTRIBUTE_TEXCOORD);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	glBindVertexArray(0);


	LoadGLTexture(&grtextureRadio, MAKEINTRESOURCE(GRRADIO));
	LoadGLTexture(&grtextureBench, MAKEINTRESOURCE(GRBENCH));
	LoadGLTexture(&grtextureBenchLegs, MAKEINTRESOURCE(GRBENCH_LEGS));
	LoadGLTexture(&grtextureAntenna, MAKEINTRESOURCE(GRANTENNA));

	// initialize stack's logs
	bool isSuccess = initLog();
	if (isSuccess == false)
	{
		GRUninitialize();
	}

	grgPerspectiveProjectionMatrix = mat4::identity();

}

extern "C" void GRInitPerspMatrixInResize(int width, int height)
{
	grgPerspectiveProjectionMatrix = vmath::perspective(45.0f, (GLfloat)width / (GLfloat)height, 0.1f, 100.0f);
}

extern "C" bool LoadGLTexture(GLuint* texture, TCHAR resourceID[])
{
	// variable declarations
	bool bResult = false;
	HBITMAP hBitmap = NULL;
	BITMAP bmp;

	//code
	// OS dependent code starts from here
	hBitmap = (HBITMAP)LoadImage(GetModuleHandle(NULL), resourceID, IMAGE_BITMAP, 0, 0, LR_CREATEDIBSECTION);		// cx and cy  is 0,0 for bitmap img, for icon, give width and height
	if (hBitmap)
	{
		bResult = true;
		GetObject(hBitmap, sizeof(bmp), &bmp);

		// from here starts OpenGL actual code
		glPixelStorei(GL_UNPACK_ALIGNMENT, 4);
		glGenTextures(1, texture);
		glBindTexture(GL_TEXTURE_2D, *texture);
		// setting of texture parameters
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, GL_REPEAT);			// wrap the texture around x axis (Texture's "S" = x axis)
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, GL_REPEAT);
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR);		// MAG - Magnification
		glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR_MIPMAP_LINEAR);				// MIN - Minification

		glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, bmp.bmWidth, bmp.bmHeight, 0, GL_BGR, GL_UNSIGNED_BYTE, bmp.bmBits);
		glGenerateMipmap(GL_TEXTURE_2D);

		DeleteObject(hBitmap);

	}

	return(bResult);

}

extern "C" void GRDisplayGeometry()
{
	// start use of shader program
	glUseProgram(grgShaderProgramObject);

	// OpenGL drawing code will start here
	mat4 grmodelMatrix = mat4::identity();
	mat4 grviewMatrix = mat4::identity();
	mat4 grprojectionMatrix = mat4::identity();
	mat4 grmodelViewMatrix2 = mat4::identity();
	mat4 grrotateMatrix = mat4::identity();
	mat4 grtranslateMatrix = mat4::identity();
	mat4 grscaleMatrix = mat4::identity();


#pragma region radio
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(0.0f, 0.0f, -6.0f);
	//grscaleMatrix = vmath::scale(1.0f, 1.0f, 1.0f);
	grrotateMatrix = vmath::rotate(grfangleX, 1.0f, 0.0f, 0.0f);
	grrotateMatrix = grrotateMatrix * vmath::rotate(grfangleY, 0.0f, 1.0f, 0.0f);
	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;
	PushToStack(grmodelMatrix);
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	// apply texture to cube
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureRadio);
	glUniform1i(grgtextureSamplerUniform, 0);

	// bind vao of square
	glBindVertexArray(grgVaoRadio);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);												// In Programmable pipeline, there's no GL_QUADS, hence we have used GL_TRIANGLE_FAN
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);

	///// antenna - 1
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(-0.9f, 0.9f, -0.0f);
	grscaleMatrix = vmath::scale(0.015f, 1.0f, 0.08f);
	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;
	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	// apply texture to cube
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureAntenna);
	glUniform1i(grgtextureSamplerUniform, 0);

	// bind vao of square
	glBindVertexArray(grgVaoRadio);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);												// In Programmable pipeline, there's no GL_QUADS, hence we have used GL_TRIANGLE_FAN
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);

	///// antenna -2
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(-0.9f, 1.4f, -0.0f);
	grscaleMatrix = vmath::scale(0.008f, 0.1f, 0.06f);
	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;
	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	// apply texture to cube
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureAntenna);
	glUniform1i(grgtextureSamplerUniform, 0);

	// bind vao of square
	glBindVertexArray(grgVaoRadio);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);												// In Programmable pipeline, there's no GL_QUADS, hence we have used GL_TRIANGLE_FAN
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);

	//// antenna 3
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(-0.9f, 1.45f, -0.0f);
	grscaleMatrix = vmath::scale(0.017f, 0.03f, 0.08f);
	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;
	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	// apply texture to cube
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureAntenna);
	glUniform1i(grgtextureSamplerUniform, 0);

	// bind vao of square
	glBindVertexArray(grgVaoRadio);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);												// In Programmable pipeline, there's no GL_QUADS, hence we have used GL_TRIANGLE_FAN
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);

	PopFromStack();
#pragma endregion radio 


#pragma region bench
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	// push matrix for whole bench
	grtranslateMatrix = vmath::translate(-4.0f, -0.7f, -18.4f);
	grrotateMatrix = vmath::rotate(grfangleX, 1.0f, 0.0f, 0.0f);
	grrotateMatrix = grrotateMatrix * vmath::rotate(grfangleY, 0.0f, 1.0f, 0.0f);

	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;

	// push matrix to stack
	grmodelMatrix = PushToStack(grmodelMatrix);


	///////////// bench desk
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(0.0f, 0.0f, 0.0f);
	grscaleMatrix = vmath::scale(3.8f, 0.1f, 1.2f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix * grrotateMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBench);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchTable);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);


	///////////////////// bench legs
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	//left leg of bench
	grtranslateMatrix = vmath::translate(-2.2f, -1.2f, 0.0f);
	grscaleMatrix = vmath::scale(1.2f, 0.1f, 1.0f);
	grrotateMatrix = vmath::rotate(90.0f, 0.0f, 0.0f, 1.0f);

	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);


	//right leg of bench
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(2.2f, -1.2f, 0.0f);
	grscaleMatrix = vmath::scale(1.2f, 0.1f, 1.0f);
	grrotateMatrix = vmath::rotate(90.0f, 0.0f, 0.0f, 1.0f);

	grmodelMatrix = grtranslateMatrix * grrotateMatrix * grscaleMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	grprojectionMatrix = grgPerspectiveProjectionMatrix;
	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	// unbind vao
	glBindVertexArray(0);

	PopFromStack();
#pragma endregion bench


#pragma region chai table

	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	// matrix config for whole table
	grtranslateMatrix = vmath::translate(4.0f, -0.7f, -18.4f);
	grrotateMatrix = vmath::rotate(grfangleX, 1.0f, 0.0f, 0.0f);
	grrotateMatrix = grrotateMatrix * vmath::rotate(grfangleY, 0.0f, 1.0f, 0.0f);

	grmodelMatrix = grtranslateMatrix * grscaleMatrix * grrotateMatrix;

	// push matrix for whole table
	grmodelMatrix = PushToStack(grmodelMatrix);

	//////////// table surface
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(0.0f, 0.0f, 0.0f);
	grscaleMatrix = vmath::scale(4.0f, 0.1f, 1.5f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);


	///////////// table holder - front
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(0.0f, -0.25f, 1.2f);
	grscaleMatrix = vmath::scale(3.0f, 0.14f, 0.1f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	//////////////// table holder - back
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(0.0f, -0.25f, -1.2f);
	grscaleMatrix = vmath::scale(3.2f, 0.14f, 0.1f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	////////////////// table holder - right
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(3.1f, -0.25f, 0.0f);
	grscaleMatrix = vmath::scale(0.1f, 0.14f, 1.12f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	////////////// table holder - left
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(-3.1f, -0.3f, 0.0f);
	grscaleMatrix = vmath::scale(0.1f, 0.2f, 1.12f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	///////// table legs - front left
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(-3.15f, -1.8f, 1.2f);
	grscaleMatrix = vmath::scale(0.15f, 1.7f, 0.12f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	/////// table legs - front right
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(3.15f, -1.8f, 1.2f);
	grscaleMatrix = vmath::scale(0.15f, 1.7f, 0.12f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	/////// table legs - back left
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(-3.15f, -1.8f, -1.2f);
	grscaleMatrix = vmath::scale(0.15f, 1.7f, 0.12f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);

	////// table legs - back right
	grtranslateMatrix = mat4::identity();
	grrotateMatrix = mat4::identity();
	grscaleMatrix = mat4::identity();
	grmodelMatrix = mat4::identity();
	grviewMatrix = mat4::identity();
	grprojectionMatrix = mat4::identity();

	grtranslateMatrix = vmath::translate(3.15f, -1.8f, -1.2f);
	grscaleMatrix = vmath::scale(0.15f, 1.7f, 0.12f);
	grmodelMatrix = grtranslateMatrix * grscaleMatrix;
	grprojectionMatrix = grgPerspectiveProjectionMatrix;

	grmodelMatrix = PushToStack(grmodelMatrix);
	PopFromStack();

	glUniformMatrix4fv(grgModelMatrixUniform, 1, GL_FALSE, grmodelMatrix);
	glUniformMatrix4fv(grgViewMatrixUniform, 1, GL_FALSE, grviewMatrix);
	glUniformMatrix4fv(grgProjectionMatrixUniform, 1, GL_FALSE, grprojectionMatrix);

	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, grtextureBenchLegs);
	glUniform1i(grgtextureSamplerUniform, 0);

	glBindVertexArray(grgVaoBenchLegs);
	glDrawArrays(GL_TRIANGLE_FAN, 0, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 4, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 8, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 12, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 16, 4);
	glDrawArrays(GL_TRIANGLE_FAN, 20, 4);
	glBindVertexArray(0);


	PopFromStack();
#pragma endregion chai table


	// stop use of shader program
	glUseProgram(0);

}

extern "C" void GRUninitialize()
{
	// close log file of stack
	destroyLog();

	// vao
	if (grgVaoRadio)
	{
		glDeleteVertexArrays(1, &grgVaoRadio);
		grgVaoRadio = 0;
	}
	if (grgVaoBenchTable)
	{
		glDeleteVertexArrays(1, &grgVaoBenchTable);
		grgVaoBenchTable = 0;
	}
	if (grgVaoBenchLegs)
	{
		glDeleteVertexArrays(1, &grgVaoBenchLegs);
		grgVaoBenchLegs = 0;
	}
	// position
	if (grgVboPositionBenchLegs)
	{
		glDeleteBuffers(1, &grgVboPositionBenchLegs);
		grgVboPositionBenchLegs = 0;
	}
	if (grgVboPositionBenchTable)
	{
		glDeleteBuffers(1, &grgVboPositionBenchTable);
		grgVboPositionBenchTable = 0;
	}
	if (grgVboPositionRadio)
	{
		glDeleteBuffers(1, &grgVboPositionRadio);
		grgVboPositionRadio = 0;
	}
	// texture
	if (grgVboTextureRadio)
	{
		glDeleteBuffers(1, &grgVboTextureRadio);
		grgVboTextureRadio = 0;
	}
	if (grgVboTextureBenchLegs)
	{
		glDeleteBuffers(1, &grgVboTextureBenchLegs);
		grgVboTextureBenchLegs = 0;
	}
	if (grgVboTextureBenchTable)
	{
		glDeleteBuffers(1, &grgVboTextureBenchTable);
		grgVboTextureBenchTable = 0;
	}

	// free texture memory
	if (grtextureBench)
	{
		glDeleteTextures(1, &grtextureBench);
		grtextureBench = 0;
	}
	if (grtextureBenchLegs)
	{
		glDeleteTextures(1, &grtextureBenchLegs);
		grtextureBenchLegs = 0;
	}
	if (grtextureRadio)
	{
		glDeleteTextures(1, &grtextureRadio);
		grtextureRadio = 0;
	}
	if (grtextureAntenna)
	{
		glDeleteTextures(1, &grtextureAntenna);
		grtextureAntenna = 0;
	}

	// free shader objects
	// detach vertex shader
	glDetachShader(grgShaderProgramObject, grgVertexShaderObject);
	// detach fragment shader
	glDetachShader(grgShaderProgramObject, grgFragmentShadeerObject);

	// delete vertex object
	glDeleteShader(grgVertexShaderObject);
	grgVertexShaderObject = 0;

	// delete fragment shader object
	glDeleteShader(grgFragmentShadeerObject);
	grgFragmentShadeerObject = 0;

	// unlink shader program
	glUseProgram(0);

	if (grgpFile)
	{
		fprintf(grgpFile, "\n **** End ****\nLog File closed successfully. \n Program terminated successfully");
		fclose(grgpFile);
		grgpFile = NULL;
	}

}