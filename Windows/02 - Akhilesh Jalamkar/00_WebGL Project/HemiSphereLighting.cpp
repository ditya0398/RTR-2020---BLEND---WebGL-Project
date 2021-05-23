


enum
{
	ASJ_ATTRIBUTE_POSITION = 0,
	ASJ_ATTRIBUTE_COLOR,
	ASJ_ATTRIBUTE_NORMAL,
	ASJ_ATTRIBUTE_TEXTURE,
};
//global function


GLuint ASJ_ShaderProgramObject;
GLuint ASJ_FragmentShaderObject;
GLuint ASJ_VertexShaderObject;

GLuint ASJ_VaoSphere;;//Vertex array object
GLuint ASJ_Vbo_Sphere_position;//vertex buffer object
GLuint ASJ_Vbo_Sphere_normals;
GLuint ASJ_Vbo_Sphere_elements;
GLuint ASJ_skyColorUniform;
GLuint ASJ_groundColorUniform;

GLuint ASJ_lightPositionUniform;
GLuint ASJ_viewMatrixUniform;
//GLuint normalMatrixUniform;

GLuint ASJ_gMVPUniform;
vmath::mat4 ASJ_PerspectiveProjectionMatrix;


GLfloat sphereVertices[1146];
GLfloat sphereNormals[1146];
GLfloat sphereTexCord[764];
unsigned short sphereElements[2280];

GLuint numSphereVetices;

GLuint numSphereElements;

//WinMain




void initializeHemiSphereLighting(void)
{
	



	

	//VERTEX SHADER
	//create shader
	ASJ_VertexShaderObject = glCreateShader(GL_VERTEX_SHADER);

	//provide source code to shader
	const GLchar* vertexShaderSourceCode =
		"#version 450 core" \
		"\n" \
		"uniform vec3 LightPosition;"\
		"uniform vec3 SkyColor;"\
		"uniform vec3 GroundColor;"\

		"in vec4 vPosition;"\
		"in vec3 MCNormal;"\

		"uniform mat4 u_view_matrix;" \
		"uniform mat4 u_mvp_matrix;" \
		"mat3 u_normal_matrix;" \

		"out vec3 Color;"\
		"void main(void)" \
		"{" \
		"vec3 ecPosition =vec3(u_view_matrix * vPosition);"\
		"u_normal_matrix=mat3((transpose(inverse(u_view_matrix))));"\
		"vec3 tnorm=normalize(u_normal_matrix * MCNormal);"\
		"vec3 lightVec=normalize(LightPosition-ecPosition);"\
		"float costheta=dot(tnorm,lightVec);"\
		"float a=costheta*0.5+0.5;"\
		"Color=mix(GroundColor,SkyColor,a);"\

		"gl_Position=u_mvp_matrix * vPosition;" \
		"}";

	glShaderSource(ASJ_VertexShaderObject, 1, (const GLchar**)&vertexShaderSourceCode, NULL); //NULL means FullLenght no multiple shader

	//compile shader
	glCompileShader(ASJ_VertexShaderObject);
	//error checking during shader compilation

	GLint iInfoLogLength = 0;
	GLint iShaderCompiledStatus = 0;
	GLchar* szInfoLog = NULL;

	glGetShaderiv(ASJ_VertexShaderObject, GL_COMPILE_STATUS, &iShaderCompiledStatus);

	if (iShaderCompiledStatus == GL_FALSE)
	{
		glGetShaderiv(ASJ_VertexShaderObject, GL_INFO_LOG_LENGTH, &iInfoLogLength);
		if (iInfoLogLength > 0)
		{
			szInfoLog = (GLchar*)malloc(iInfoLogLength);

			if (szInfoLog != NULL)
			{
				GLsizei written;
				glGetShaderInfoLog(ASJ_VertexShaderObject, iInfoLogLength, &written, szInfoLog);
				fprintf(gpFile, "ASJ Vertex shader compilation Log :%s\n ", szInfoLog);
				free(szInfoLog);
				DestroyWindow(ghwnd);
			}
		}
	}




	//**FRAGMENT SHADER**
	ASJ_FragmentShaderObject = glCreateShader(GL_FRAGMENT_SHADER);
	//provide source code to shader
	const GLchar* fragmentShaderSourceCode = "#version 450 core"\
		"\n"\
		"out  vec4 FragColor;"\
		"in vec3 Color;"\
		"void main(void)" \
		"{" \
		"FragColor = vec4(Color,1);"\
		"}";

	glShaderSource(ASJ_FragmentShaderObject, 1, (const GLchar**)&fragmentShaderSourceCode, NULL);

	//compile shader
	glCompileShader(ASJ_FragmentShaderObject);
	//error checking
	if (iShaderCompiledStatus == GL_FALSE)
	{
		glGetShaderiv(ASJ_FragmentShaderObject, GL_INFO_LOG_LENGTH, &iInfoLogLength);
		if (iInfoLogLength > 0)
		{
			szInfoLog = (GLchar*)malloc(iInfoLogLength);

			if (szInfoLog != NULL)
			{
				GLsizei written;
				glGetShaderInfoLog(ASJ_FragmentShaderObject, iInfoLogLength, &written, szInfoLog);
				fprintf(gpFile, "ASJ Fragment shader compilation Log :%s\n ", szInfoLog);
				free(szInfoLog);
				DestroyWindow(ghwnd);
			}
		}
	}


	//Shader PROGRAM
	//create
	ASJ_ShaderProgramObject = glCreateProgram();
	//attach vertex shader to shader program 
	glAttachShader(ASJ_ShaderProgramObject, ASJ_VertexShaderObject);
	//attach fragment shader to shader program
	glAttachShader(ASJ_ShaderProgramObject, ASJ_FragmentShaderObject);

	//pre-link binding of shader program object with vertex shader position attribute
	glBindAttribLocation(ASJ_ShaderProgramObject, ASJ_ATTRIBUTE_POSITION, "vPosition");//***IMPORTANT***
	glBindAttribLocation(ASJ_ShaderProgramObject, ASJ_ATTRIBUTE_NORMAL, "MCNormal");

	//Link Shader
	glLinkProgram(ASJ_ShaderProgramObject);

	GLint iShaderProgramLinkStatus = 0;
	glGetProgramiv(ASJ_ShaderProgramObject, GL_LINK_STATUS, &iShaderCompiledStatus);

	if (iShaderCompiledStatus == GL_FALSE)
	{
		glGetProgramiv(ASJ_ShaderProgramObject, GL_INFO_LOG_LENGTH, &iInfoLogLength);

		if (iInfoLogLength > 0)
		{
			szInfoLog = (GLchar*)malloc(iInfoLogLength);

			if (szInfoLog != NULL)
			{
				GLsizei written;
				glGetProgramInfoLog(ASJ_ShaderProgramObject, iInfoLogLength, &written, szInfoLog);
				fprintf(gpFile, " ASJ Shader Program Link Log :%s\n ", szInfoLog);
				free(szInfoLog);
				DestroyWindow(ghwnd);
			}
		}

	}
	//get MVP uniform
	ASJ_gMVPUniform = glGetUniformLocation(ASJ_ShaderProgramObject, "u_mvp_matrix");
	ASJ_skyColorUniform = glGetUniformLocation(ASJ_ShaderProgramObject, "SkyColor");
	ASJ_groundColorUniform = glGetUniformLocation(ASJ_ShaderProgramObject, "GroundColor");
	ASJ_lightPositionUniform = glGetUniformLocation(ASJ_ShaderProgramObject, "LightPosition");
	ASJ_viewMatrixUniform = glGetUniformLocation(ASJ_ShaderProgramObject, "u_view_matrix");


	//vertices,color,shader attribute,vbo_position,vao initialization
	glGenVertexArrays(1, &ASJ_VaoSphere);
	glBindVertexArray(ASJ_VaoSphere);

	getSphereVertexData(sphereVertices, sphereNormals, sphereTexCord, sphereElements);
	numSphereVetices = getNumberOfSphereVertices();
	numSphereElements = getNumberOfSphereElements();

	//vbo position
	glGenBuffers(1, &ASJ_Vbo_Sphere_position);
	glBindBuffer(GL_ARRAY_BUFFER, ASJ_Vbo_Sphere_position);
	glBufferData(GL_ARRAY_BUFFER, sizeof(sphereVertices), sphereVertices, GL_STATIC_DRAW);
	glVertexAttribPointer(ASJ_ATTRIBUTE_POSITION, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(ASJ_ATTRIBUTE_POSITION);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	//vbo normal
	glGenBuffers(1, &ASJ_Vbo_Sphere_normals);
	glBindBuffer(GL_ARRAY_BUFFER, ASJ_Vbo_Sphere_normals);
	glBufferData(GL_ARRAY_BUFFER, sizeof(sphereNormals), sphereNormals, GL_STATIC_DRAW);
	glVertexAttribPointer(ASJ_ATTRIBUTE_NORMAL, 3, GL_FLOAT, GL_FALSE, 0, NULL);
	glEnableVertexAttribArray(ASJ_ATTRIBUTE_NORMAL);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	//vbo sphere elements
	glGenBuffers(1, &ASJ_Vbo_Sphere_elements);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ASJ_Vbo_Sphere_elements);
	glBufferData(GL_ELEMENT_ARRAY_BUFFER, sizeof(sphereElements), sphereElements, GL_STATIC_DRAW);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);

	glBindVertexArray(0);


	
}



void DisplayHemispherLighting(void)
{
	
	//code
	glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);

	glUseProgram(ASJ_ShaderProgramObject);
	vmath::vec3 LightSkyColor(0.980, 0.117, 0.231);
	vmath::vec3 LightGroundColor(0.3, 0.3, 0.3);
	vmath::vec3 LightPosition(0.0, 1.20, -2.0);

	mat4 modelViewMatrix = mat4::identity();
	mat4 modelViewProjectionMatrix = mat4::identity();
	mat4 translateMatrix = vmath::translate(0.0f, 0.0f, -2.0f);
	modelViewMatrix = translateMatrix;
	mat4 viewMatrix = mat4::identity();
	modelViewProjectionMatrix = ASJ_PerspectiveProjectionMatrix * modelViewMatrix ;//right to left associativity

	glUniformMatrix4fv(ASJ_gMVPUniform, 1, GL_FALSE, modelViewProjectionMatrix);//column major no need to transpose 
	glUniformMatrix4fv(ASJ_viewMatrixUniform, 1, GL_FALSE, modelViewMatrix);//viewMatrix

	glUniform3fv(ASJ_lightPositionUniform, 1, LightPosition);
	glUniform3fv(ASJ_skyColorUniform, 1, LightSkyColor);
	glUniform3fv(ASJ_groundColorUniform, 1, LightGroundColor);


	glBindVertexArray(ASJ_VaoSphere);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ASJ_Vbo_Sphere_elements);
	glDrawElements(GL_TRIANGLES, numSphereElements, GL_UNSIGNED_SHORT, 0);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
	glBindVertexArray(0);

	glUseProgram(0);





}

void ASJ_uninitialize(void)
{
	//code
	

	if (ASJ_VaoSphere)
	{
		glDeleteVertexArrays(1, &ASJ_VaoSphere);
		ASJ_VaoSphere = 0;
	}

	if (ASJ_Vbo_Sphere_position)
	{
		glDeleteVertexArrays(1, &ASJ_Vbo_Sphere_position);
		ASJ_Vbo_Sphere_position = 0;
	}




	//detach shader object from shader program object
	if (ASJ_ShaderProgramObject)
	{
		glUseProgram(ASJ_ShaderProgramObject);
		GLsizei shaderCount;
		glGetProgramiv(ASJ_ShaderProgramObject, GL_ATTACHED_SHADERS, &shaderCount);

		GLuint* pshader = NULL;
		pshader = (GLuint*)malloc(shaderCount * sizeof(GLuint));

		glGetAttachedShaders(ASJ_ShaderProgramObject, shaderCount, &shaderCount, pshader);

		for (GLsizei i = 0; i < shaderCount; i++)
		{
			glDetachShader(ASJ_ShaderProgramObject, pshader[i]);

			glDeleteShader(pshader[i]);
			pshader[i] = 0;
		}

		free(pshader);
		glDeleteProgram(ASJ_ShaderProgramObject);
		ASJ_ShaderProgramObject = 0;
		glUseProgram(0);
	}






	


}

