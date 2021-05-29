

GLdouble angle1 = 0.0f;
GLfloat rangle = 0.0f;
GLfloat radius = 0.5f;

GLint i = 0;

GLuint gVertexShaderObject;
GLuint gFragmentShaderObject;
GLuint gShaderrogramObject;
GLuint vbo_cylinder_position;

/*****cylinder attributes*/


float* vertices;

GLuint stone_texture;


void Initialize(void)
{
	
	
	vertices = (float*)malloc(6280 * 3 * 2 * sizeof(float));

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
		"out_textCoord.x = vPosition.x;" \
		"out_textCoord.y = vPosition.y;" \
		"}";

	
	glShaderSource(gVertexShaderObject, 1/*how many shader to be feed*/, (const GLchar**)&vertexShaderSourceCode, NULL); /*if multiple code is there void main void etc..so we give array , it contains size*/
	glCompileShader(gVertexShaderObject);

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

	gFragmentShaderObject = glCreateShader(GL_FRAGMENT_SHADER);

	//change 3
	const GLchar* fragmentShaderSourceCode =
		"#version 440 core" \
		"\n" \
		"in vec2 out_textCoord;" \
		"uniform sampler2D u_texture_sampler;" \
		"out vec4 fragColor;" \
		"void main(void)" \
		"{" \
		"fragColor = texture(u_texture_sampler, out_textCoord);" \
		"}";
	

	glShaderSource(gFragmentShaderObject, 1/*how many shader to be feed*/, (const GLchar**)&fragmentShaderSourceCode, NULL); /*if multiple code is there void main void etc..so we give array , it contains size*/
	glCompileShader(gFragmentShaderObject);
	

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

	gShaderrogramObject = glCreateProgram();
	glAttachShader(gShaderrogramObject, gVertexShaderObject);//attach whatever shaders u have
	glAttachShader(gShaderrogramObject, gFragmentShaderObject);//attach whatever shaders u have

	glBindAttribLocation(gShaderrogramObject, tvn_attribute_position, "vPosition");// dont do mistake
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

	//removed mvpmatrix
	textureSamplerUniform = glGetUniformLocation(gShaderrogramObject, "u_texture_sampler");

	
	// vao
	glGenVertexArrays(1, &vao_cylinder);
	glBindVertexArray(vao_cylinder);


	//position
	glGenBuffers(1, &vbo_cylinder_position);
	glBindBuffer(GL_ARRAY_BUFFER, vbo_cylinder_position);
	glBufferData(GL_ARRAY_BUFFER, 6280 * 3 * 2 * sizeof(float), vertices, GL_STATIC_DRAW);
	glVertexAttribPointer(tvn_attribute_position, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(tvn_attribute_position);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	/**********************/
	loadGlTexture(&stone_texture, MAKEINTRESOURCE(STONE_BITMAP));
	/************************/
	glBindVertexArray(0);

	
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
	glDrawArrays(GL_TRIANGLE_STRIP,0,6280 * 6);
	glBindVertexArray(0);

	/*************************/
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



	void uninitialize()
	{
		if (vertices) {
		free(vertices);
	}

}