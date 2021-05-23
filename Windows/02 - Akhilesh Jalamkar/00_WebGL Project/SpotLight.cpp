

enum
{
	ASJ_ATTRIBUTE_POSITION = 0,
	ASJ_ATTRIBUTE_COLOR,
	ASJ_ATTRIBUTE_NORMAL,
	ASJ_ATTRIBUTE_TEXTURE,
};
//global function



GLuint ASJ_ShaderProgramObject_spotLight;
GLuint ASJ_FragmentShaderObject_spotLight;
GLuint ASJ_VertexShaderObject_spotLight;

GLuint ASJ_VaoSphere;;//Vertex array object
GLuint ASJ_Vbo_Sphere_position;//vertex buffer object
GLuint ASJ_Vbo_Sphere_normals;
GLuint ASJ_Vbo_Sphere_elements;
GLuint ASJ_skyColorUniform;
GLuint ASJ_groundColorUniform;

GLuint ASJ_lightPositionUniform;
GLuint ASJ_viewMatrixUniform;
GLuint ASJ_ambientUniform;
GLuint ASJ_lightColorUniform;
GLuint ASJ_shininessUniform;
GLuint ASJ_strengthUniform;
GLuint ASJ_eyeDirectionUniform;
GLuint ASJ_attenuationUniform;
GLuint ASJ_coneDirUniform;
GLuint ASJ_spotCosCutoffUniform;
GLuint ASJ_spotExponentUniform;

//GLuint normalMatrixUniform;

GLuint ASJ_MVPUniform;
vmath::mat4 PerspectiveProjectionMatrix;


GLfloat sphereVertices[1146];
GLfloat sphereNormals[1146];
GLfloat sphereTexCord[764];
unsigned short sphereElements[2280];

GLuint numSphereVetices;

GLuint numSphereElements;

//WinMain




void initializeSpotLight(void)
{
	

	//VERTEX SHADER
	//create shader
	ASJ_VertexShaderObject_spotLight = glCreateShader(GL_VERTEX_SHADER);

	//provide source code to shader
	const GLchar* vertexShaderSourceCode =
		"#version 450 core" \
		"\n" \

		"uniform mat4 u_modelView_matrix;" \
		"uniform mat4 u_mvp_matrix;" \
		"mat3 u_normal_matrix;" \
		"\n" \
		"in vec4 vPosition;"\
		"in vec3 vNormal;"\
		"in vec4 vColor;"\
		"\n" \
		"out vec4 Color;"\
		"out vec3 Normal;"\
		"out vec4 Position;"\
		"\n" \
		"void main(void)" \
		"{"\
		"Color=vec4(1.0,0.0,0.0,1.0);"\
		"u_normal_matrix=mat3(transpose(inverse(u_modelView_matrix)));"\
		"Normal=normalize(u_normal_matrix*vNormal);"\

		"Position=u_modelView_matrix*vPosition;"\

		"gl_Position=u_mvp_matrix * vPosition;" \
		"}";

	glShaderSource(ASJ_VertexShaderObject_spotLight, 1, (const GLchar**)&vertexShaderSourceCode, NULL); //NULL means FullLenght no multiple shader

	//compile shader
	glCompileShader(ASJ_VertexShaderObject_spotLight);
	//error checking during shader compilation

	GLint iInfoLogLength = 0;
	GLint iShaderCompiledStatus = 0;
	GLchar* szInfoLog = NULL;

	glGetShaderiv(ASJ_VertexShaderObject_spotLight, GL_COMPILE_STATUS, &iShaderCompiledStatus);

	if (iShaderCompiledStatus == GL_FALSE)
	{
		glGetShaderiv(ASJ_VertexShaderObject_spotLight, GL_INFO_LOG_LENGTH, &iInfoLogLength);
		if (iInfoLogLength > 0)
		{
			szInfoLog = (GLchar*)malloc(iInfoLogLength);

			if (szInfoLog != NULL)
			{
				GLsizei written;
				glGetShaderInfoLog(ASJ_VertexShaderObject_spotLight, iInfoLogLength, &written, szInfoLog);
				fprintf(gpFile, "ASJ spotLight Vertex shader compilation Log :%s\n ", szInfoLog);
				free(szInfoLog);
				DestroyWindow(ghwnd);
			}
		}
	}




	//**FRAGMENT SHADER**
	ASJ_FragmentShaderObject_spotLight = glCreateShader(GL_FRAGMENT_SHADER);
	//provide source code to shader
	const GLchar* fragmentShaderSourceCode = "#version 450 core"\
		"\n"\
		"uniform vec4 Ambient;"\
		"uniform vec3 LightColor;"\
		"uniform vec3 LightPosition;"\
		"uniform float Shininess;"\
		"uniform float Strength;"\

		"uniform vec3 EyeDirection;"\
		"uniform float ConstantAttenuation;"\
		"float linearA=1.0f;"\
		"float quadraticA=0.5f;"\

		"uniform vec3 ConeDirection;"\
		"uniform float SpotCosCutoff;"\
		"uniform float SpotExponent;"\



		"in vec4 Color;"\
		"in vec3 Normal;"\
		"in vec4 Position;"\

		"out  vec4 FragColor;"\

		"void main(void)" \
		"{" \
		"vec3 lightDirection=LightPosition-vec3(Position);"\
		"float lightDistance=length(lightDirection);"\

		"lightDirection=normalize(lightDirection);"\

		"float AttenuaFactor=1 / (ConstantAttenuation + linearA*lightDistance + quadraticA * lightDistance * lightDistance);"\

		"float spotCos=dot(lightDirection,-ConeDirection);"\

		"vec3 HalfVector=normalize(lightDirection+EyeDirection);"\


		"float diffuse=max(0.0f,dot(Normal,lightDirection));"\
		"float specular=max(0.0f,dot(Normal,HalfVector));"\


		"if(spotCos<SpotCosCutoff)"\
		"{"\
		"AttenuaFactor=0.0;"\
		"}"\
		"else"
		"{"\
		"AttenuaFactor=AttenuaFactor*pow(spotCos,SpotExponent);"\
		"}"\

		"if(diffuse==0.0)"\
		"{"\
		"specular=0.0f;"\
		"}"\
		"else"\
		"{"\
		"specular=pow(specular,Shininess)*Strength;"\
		"}"\

		"vec4 scatteredLight=Ambient + vec4(LightColor*diffuse*AttenuaFactor,0.0);"\
		"vec4 ReflectedLight=vec4(LightColor * specular *AttenuaFactor,0.0);"\

		"FragColor=min(Color * scatteredLight + ReflectedLight,vec4(1.0));"\

		"}";

	glShaderSource(ASJ_FragmentShaderObject_spotLight, 1, (const GLchar**)&fragmentShaderSourceCode, NULL);

	//compile shader
	glCompileShader(ASJ_FragmentShaderObject_spotLight);
	//error checking
	if (iShaderCompiledStatus == GL_FALSE)
	{
		glGetShaderiv(ASJ_FragmentShaderObject_spotLight, GL_INFO_LOG_LENGTH, &iInfoLogLength);
		if (iInfoLogLength > 0)
		{
			szInfoLog = (GLchar*)malloc(iInfoLogLength);

			if (szInfoLog != NULL)
			{
				GLsizei written;
				glGetShaderInfoLog(ASJ_FragmentShaderObject_spotLight, iInfoLogLength, &written, szInfoLog);
				fprintf(gpFile, "ASJ spotLight Fragment shader compilation Log :%s\n ", szInfoLog);
				free(szInfoLog);
				DestroyWindow(ghwnd);
			}
		}
	}


	//Shader PROGRAM
	//create
	ASJ_ShaderProgramObject_spotLight = glCreateProgram();
	//attach vertex shader to shader program 
	glAttachShader(ASJ_ShaderProgramObject_spotLight, ASJ_VertexShaderObject_spotLight);
	//attach fragment shader to shader program
	glAttachShader(ASJ_ShaderProgramObject_spotLight, ASJ_FragmentShaderObject_spotLight);

	//pre-link binding of shader program object with vertex shader position attribute
	glBindAttribLocation(ASJ_ShaderProgramObject_spotLight, ASJ_ATTRIBUTE_POSITION, "vPosition");//***IMPORTANT***
	glBindAttribLocation(ASJ_ShaderProgramObject_spotLight, ASJ_ATTRIBUTE_NORMAL, "vNormal");

	//Link Shader
	glLinkProgram(ASJ_ShaderProgramObject_spotLight);

	GLint iShaderProgramLinkStatus = 0;
	glGetProgramiv(ASJ_ShaderProgramObject_spotLight, GL_LINK_STATUS, &iShaderCompiledStatus);

	if (iShaderCompiledStatus == GL_FALSE)
	{
		glGetProgramiv(ASJ_ShaderProgramObject_spotLight, GL_INFO_LOG_LENGTH, &iInfoLogLength);

		if (iInfoLogLength > 0)
		{
			szInfoLog = (GLchar*)malloc(iInfoLogLength);

			if (szInfoLog != NULL)
			{
				GLsizei written;
				glGetProgramInfoLog(ASJ_ShaderProgramObject_spotLight, iInfoLogLength, &written, szInfoLog);
				fprintf(gpFile, "ASJ spotLight Shader Program Link Log :%s\n ", szInfoLog);
				free(szInfoLog);
				DestroyWindow(ghwnd);
			}
		}

	}
	//get MVP uniform
	ASJ_MVPUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "u_mvp_matrix");
	ASJ_viewMatrixUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "u_modelView_matrix");
	ASJ_ambientUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "Ambient");
	ASJ_lightColorUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "LightColor");
	ASJ_lightPositionUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "LightPosition");
	ASJ_shininessUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "Shininess");
	ASJ_strengthUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "Strength");
	ASJ_eyeDirectionUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "EyeDirection");
	ASJ_attenuationUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "Attenuation");
	ASJ_coneDirUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "ConeDirection");
	ASJ_spotCosCutoffUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "SpotCosCutoff");
	ASJ_spotExponentUniform = glGetUniformLocation(ASJ_ShaderProgramObject_spotLight, "SpotExponent");

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



void Display_SpotLight(void)
{
	
	//code
	glClear(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);

	glUseProgram(ASJ_ShaderProgramObject_spotLight);


	mat4 modelViewMatrix = mat4::identity();
	mat4 modelViewProjectionMatrix = mat4::identity();
	mat4 translateMatrix = vmath::translate(0.0f, 0.0f, -2.0f);
	modelViewMatrix = translateMatrix;
	mat4 viewMatrix = mat4::identity();
	modelViewProjectionMatrix = PerspectiveProjectionMatrix * modelViewMatrix * rotate(spin, 1.0f, 0.0f, 0.0f);//right to left associativity

	glUniformMatrix4fv(ASJ_MVPUniform, 1, GL_FALSE, modelViewProjectionMatrix);//column major no need to transpose 
	glUniformMatrix4fv(ASJ_viewMatrixUniform, 1, GL_FALSE, modelViewMatrix);

	vmath::vec4 Ambient = vmath::vec4(0.30f, 0.30f, 0.30f, 1.0f);
	vmath::vec3 LightColor(0.0, 1.0, 1.0);
	vmath::vec3 lightPosition(0.0, 0.0, 2.0);

	vmath::vec3 Eye(0.0f, 0.0f, 2.0f);
	vmath::vec3 SpotDirection(0.0f, 0.0f, -15);

	float shininess = 2.0f;
	float strength = 8.9f;
	float attenuation = 2.0f;
	float spotExponent = 142.0f;
	float spotCosCutOff = cos(3.14159 / 32);
	glUniform4fv(ASJ_ambientUniform, 1, Ambient);

	glUniform3fv(ASJ_lightColorUniform, 1, LightColor);
	glUniform3fv(ASJ_lightPositionUniform, 1, lightPosition);
	glUniform1f(ASJ_shininessUniform, shininess);
	glUniform1f(ASJ_strengthUniform, strength);

	glUniform3fv(ASJ_eyeDirectionUniform, 1, Eye);
	glUniform1f(ASJ_attenuationUniform, attenuation);
	SpotDirection = vmath::normalize(SpotDirection);
	glUniform3fv(ASJ_coneDirUniform, 1, SpotDirection);
	glUniform1f(ASJ_spotExponentUniform, spotExponent);
	glUniform1f(ASJ_spotCosCutoffUniform, spotCosCutOff);


	glBindVertexArray(ASJ_VaoSphere);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, ASJ_Vbo_Sphere_elements);
	glDrawElements(GL_TRIANGLES, numSphereElements, GL_UNSIGNED_SHORT, 0);
	glBindBuffer(GL_ELEMENT_ARRAY_BUFFER, 0);
	glBindVertexArray(0);

	glUseProgram(0);
	

	


}

void ASJ_uninitialize_SpotLight(void)
{
	

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
	if (ASJ_ShaderProgramObject_spotLight)
	{
		glUseProgram(ASJ_ShaderProgramObject_spotLight);
		GLsizei shaderCount;
		glGetProgramiv(ASJ_ShaderProgramObject_spotLight, GL_ATTACHED_SHADERS, &shaderCount);

		GLuint* pshader = NULL;
		pshader = (GLuint*)malloc(shaderCount * sizeof(GLuint));

		glGetAttachedShaders(ASJ_ShaderProgramObject_spotLight, shaderCount, &shaderCount, pshader);

		for (GLsizei i = 0; i < shaderCount; i++)
		{
			glDetachShader(ASJ_ShaderProgramObject_spotLight, pshader[i]);

			glDeleteShader(pshader[i]);
			pshader[i] = 0;
		}

		free(pshader);
		glDeleteProgram(ASJ_ShaderProgramObject_spotLight);
		ASJ_ShaderProgramObject_spotLight = 0;
		glUseProgram(0);
	}






	


}

