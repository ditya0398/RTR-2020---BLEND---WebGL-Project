#include"DLnormalmappedroad.h"

//////////////////////////////////////////////////Global Variable///////////////////////////////////////////
extern HWND ghwnd;
extern vmath::mat4 perspectiveProjectionMatrix;

GLuint programNormalMap;
enum vaobo_dl{
	Road_dl = 0,
	LenVaobo_dl
};
GLuint vaos_dl[vaobo_dl::LenVaobo_dl];
GLuint vbos_dl[vaobo_dl::LenVaobo_dl];
enum ubo_dl {
	Light_dl = 0,
	Material_dl,
	LenUbo_dl
};
GLuint ubos_dl[ubo_dl::LenUbo_dl];

enum tex2D_dl {
	Road1Tex_dl = 0,
	Road1Nor_dl,
	LenTex_dl
};
GLuint texs2D_dl[tex2D_dl::LenTex_dl];

//////////////////////////////////////////////////Global Structures///////////////////////////////////////////
struct light_t_dl {
	vmath::vec4 position;
	vmath::vec4 ambient;
	vmath::vec4 diffuse;
	vmath::vec4 specular;
};

struct material_t_dl {
	vmath::vec4 ambient;
	vmath::vec4 diffuse;
	vmath::vec4 specular;
	vmath::vec1 shininess;
};

enum {
	VertexPosition_dl = 0,
	VertexNormal_dl = 1,
	VertexTexCoord_dl = 2,
	VertexTangent_dl = 3,
	VertexBiTangent_dl = 4,
	UniformBlockLight_dl = 0,
	UniformBlockMaterial = 1,
	UniformModel_dl = 0,
	UniformView_dl = 1,
	UniformProjection_dl = 2,
	UniformSamplerTex_dl = 3,
	UniformSamplerNor_dl = 4,
	UniformIsNormalMapping_dl = 5
};

typedef struct vertex_t_dl {
	vmath::vec3 position;
	vmath::vec3 normal;
	vmath::vec3 tangent;
	vmath::vec3 bitangent;
	vmath::vec2 texCoord;
} vertex_t_dl;

void* loadImageDL(int resid, int *widht, int *height) {
	//OS
	HBITMAP hBitmap = NULL;
	BITMAP bmp;
	hBitmap = (HBITMAP)LoadImage(GetModuleHandle(NULL), MAKEINTRESOURCE(resid), IMAGE_BITMAP, 0, 0, LR_CREATEDIBSECTION);
	if(hBitmap) {
		GetObject(hBitmap, sizeof(BITMAP), &bmp);
	}
	*widht = bmp.bmWidth;
	*height = bmp.bmHeight;
	return bmp.bmBits;
}

void initNormalMappedRoadDL() {
//////////////////////////////////////////////////Shader Code///////////////////////////////////////////
	//Vertex Shader Source Code
	GLchar const* vertSrc_dl = 
	"#version 460 core\n"\
	//In Variables
	"layout(location = 0)in vec4 position;\n"\
	"layout(location = 1)in vec3 normal;\n"\
	"layout(location = 2)in vec2 texCoord;\n"\
	"layout(location = 3)in vec3 tangent;\n"\
	"layout(location = 4)in vec3 bitangent;\n"\
	//Out Block
	"out VS_OUT {\n"\
	"vec3 L;\n"\
	"vec3 V;\n"\
	"vec3 normal;\n"\
	"vec2 texCoord;\n"\
	"} vs_out;\n"\
	//Light Uniform Block
	"layout(binding = 0, std140)uniform LightBlock {\n"\
	"vec4 position;\n"\
	"vec4 ambient;\n"\
	"vec4 diffuse;\n"\
	"vec4 specular;\n"\
	"} light;\n"\
	//Trandform Matrices
	"layout(location = 0)uniform mat4 modelMatrix;\n"\
	"layout(location = 1)uniform mat4 viewMatrix;\n"\
	"layout(location = 2)uniform mat4 projectionMatrix;\n"\
	//Main Function
	"void main(void) {\n"\
	//Vertex Calculation
	"gl_Position = projectionMatrix * viewMatrix * modelMatrix * position;\n"\
	//Lighting Calculation
	"mat3 norMat = mat3(modelMatrix);\n"\
	"vec3 T = normalize(norMat * tangent);\n"\
	"vec3 N = normalize(norMat * normal);\n"\
	"T = normalize(T - dot(T, N) * N);\n"\
	"vec3 B = cross(N, T);\n"\
	"mat3 TBN = transpose(mat3(T, B, N));\n"\
	"vec3 lightPos = TBN * light.position.xyz;\n"\
	"vec3 P = TBN  * mat3(modelMatrix) * position.xyz;\n"\
	"vs_out.L = lightPos - P;\n"\
	"vs_out.V = -P;\n"\
	//Passing Normals and TexCoords
	"vs_out.normal = normal;\n"\
	"vs_out.texCoord = texCoord;\n"\
	"}\n";

	//Fragment Shader Source Code
	GLchar const* fragSrc_dl = 
	"#version 460 core\n"\
	//Light Uniform Block
	"layout(binding = 0, std140)uniform LightBlock {\n"\
	"vec4 position;\n"\
	"vec4 ambient;\n"\
	"vec4 diffuse;\n"\
	"vec4 specular;\n"\
	"} light;\n"\
	//Material Uniform Block
	"layout(binding = 1, std140)uniform MaterialBlock {\n"\
	"vec4 ambient;\n"\
	"vec4 diffuse;\n"\
	"vec4 specular;\n"\
	"float shininess;\n"\
	"} material;\n"\
	//Model View Matrix
	"layout(location = 0)uniform mat4 modelMatrix;\n"\
	"layout(location = 1)uniform mat4 viewMatrix;\n"\
	//Texture Samplers
	"layout(location = 3)uniform sampler2D texSam;\n"\
	"layout(location = 4)uniform sampler2D norSam;\n"\
	//In Block
	"in VS_OUT {\n"\
	"vec3 L;\n"\
	"vec3 V;\n"\
	"vec3 normal;\n"\
	"vec2 texCoord;\n"\
	"} fs_in;\n"\
	//Out Variable
	"out vec4 FragColor;\n"\
	//Main Function
	"void main(void) {\n"\
	//Scaling TexCoord
	"vec2 texCoord = fs_in.texCoord;\n"\
	//Sampling Texture
	"vec4 color = vec4(texture(texSam, texCoord).rgb, 1.0);\n"\
	"vec3 normal = texture(norSam, texCoord).rgb * 2.0 - 1.0;\n"\
	//Lighting Calculation
	"vec3 L = normalize(fs_in.L);\n"\
	"vec3 N = normalize(mat3(modelMatrix)  * normal);\n"\
	"vec3 V = normalize(fs_in.V);\n"\
	"vec3 R = reflect(-L, N);\n"\
	"vec4 ambient = light.ambient * material.ambient * color;\n"\
	"vec4 diffuse = max(dot(N, L), 0.0) * light.diffuse * material.diffuse * color;\n"\
	"vec4 specular = pow(max(dot(R, V), 0.0), material.shininess) * light.specular * material.specular;\n"\
	"FragColor = ambient + diffuse + specular;\n"\
	"}\n";
	GLuint vertShader_dl, fragShader_dl;
	int status;
	
	//Compiling Vertex Shader
	vertShader_dl = glCreateShader(GL_VERTEX_SHADER);
	glShaderSource(vertShader_dl, 1, &vertSrc_dl, NULL);
	glCompileShader(vertShader_dl);
	glGetShaderiv(vertShader_dl, GL_COMPILE_STATUS, &status);
	if(status == GL_FALSE) {
		char buffer[1024];
		glGetShaderInfoLog(vertShader_dl, 1024, NULL, buffer);
		MessageBoxA(ghwnd, buffer, NULL, NULL);
	}	

	//Compiling Fragment Shader
	fragShader_dl = glCreateShader(GL_FRAGMENT_SHADER);
	glShaderSource(fragShader_dl, 1, &fragSrc_dl, NULL);
	glCompileShader(fragShader_dl);
	glGetShaderiv(fragShader_dl, GL_COMPILE_STATUS, &status);
	if(status == GL_FALSE) {
		MessageBoxA(ghwnd, "Fragment Shader Error", NULL, NULL);
	}	

	//Linking Program
	programNormalMap = glCreateProgram();
	glAttachShader(programNormalMap, vertShader_dl);
	glAttachShader(programNormalMap, fragShader_dl);
	glLinkProgram(programNormalMap);
	glGetProgramiv(programNormalMap, GL_LINK_STATUS, &status);
	if(status == GL_FALSE) {
		MessageBoxA(ghwnd, "Linking Error", NULL, NULL);
	}	
	glDetachShader(programNormalMap, vertShader_dl);
	glDetachShader(programNormalMap, fragShader_dl);
	glDeleteShader(vertShader_dl);
	glDeleteShader(fragShader_dl);

	//Tangent Calculation

	vmath::vec3 edge1, edge2;
	vmath::vec2 deltaTex1, deltaTex2;
	float f;

	vmath::vec3 pos1 = vmath::vec3(3.0f, 0.0, 7.0f);
	vmath::vec3 pos2 = vmath::vec3(-3.0f, 0.0f, 7.0f);
	vmath::vec3 pos3 = vmath::vec3(-3.0f, 0.0f, -7.0f);
	vmath::vec3 pos4 = vmath::vec3(3.0f, 0.0f, -7.0f);

	vmath::vec3 normals = vmath::vec3(0.0f, 0.0f, 1.0f);

	vmath::vec2 tex1 = vmath::vec2(0.0f, 0.0f);
	vmath::vec2 tex2 = vmath::vec2(3.0f, 0.0f);
	vmath::vec2 tex3 = vmath::vec2(3.0f, 7.0f);
	vmath::vec2 tex4 = vmath::vec2(0.0f, 7.0f);

	edge1 = pos2 - pos1;
	edge2 = pos3 - pos1;
	deltaTex1 = tex2 - tex1;
	deltaTex2 = tex3 - tex1;	
	f = 1.0f / (deltaTex1[0] * deltaTex2[1] - deltaTex2[0] * deltaTex1[1]);
	
	vmath::vec3 tan1;
	vmath::vec3 bit1;

	tan1[0] = f * (deltaTex2[1] * edge1[0] - deltaTex1[1] * edge2[0]);
	tan1[1] = f * (deltaTex2[1] * edge1[1] - deltaTex1[1] * edge2[1]);
	tan1[2] = f * (deltaTex2[1] * edge1[2] - deltaTex1[1] * edge2[2]);

	bit1[0] = f * (deltaTex1[0] * edge2[0] - deltaTex2[0] * edge1[0]);
	bit1[1] = f * (deltaTex1[0] * edge2[1] - deltaTex2[0] * edge1[1]);
	bit1[2] = f * (deltaTex1[0] * edge2[2] - deltaTex2[0] * edge1[2]);

	edge1 = pos3 - pos1;
	edge2 = pos4 - pos1;
	deltaTex1 = tex3 - tex1;
	deltaTex2 = tex4 - tex1;
	f = 1.0f / (deltaTex1[0] * deltaTex2[1] - deltaTex2[0] * deltaTex1[1]);

	vmath::vec3 tan2;
	vmath::vec3 bit2;

	tan2[0] = f * (deltaTex2[1] * edge1[0] - deltaTex1[1] * edge2[0]);
	tan2[1] = f * (deltaTex2[1] * edge1[1] - deltaTex1[1] * edge2[1]);
	tan2[2] = f * (deltaTex2[1] * edge1[2] - deltaTex1[1] * edge2[2]);

	bit2[0] = f * (deltaTex1[0] * edge2[0] - deltaTex2[0] * edge1[0]);
	bit2[1] = f * (deltaTex1[0] * edge2[1] - deltaTex2[0] * edge1[1]);
	bit2[2] = f * (deltaTex1[0] * edge2[2] - deltaTex2[0] * edge1[2]);

	//Vertex Initialization
	static const vertex_t_dl vertices[] = {
		{ pos1, normals, tan1, bit1, tex1 },
		{ pos2, normals, tan1, bit1, tex2 },
		{ pos3, normals, tan1, bit1, tex3 },

		{ pos1, normals, tan2, bit1, tex1 },
		{ pos3, normals, tan2, bit1, tex3 },
		{ pos4, normals, tan2, bit1, tex4 }
	};

	//Creating Objects
	glCreateVertexArrays(vaobo_dl::LenVaobo_dl, vaos_dl);
	glCreateBuffers(vaobo_dl::LenVaobo_dl, vbos_dl);
	glCreateBuffers(ubo_dl::LenUbo_dl, ubos_dl);
	glCreateTextures(GL_TEXTURE_2D, tex2D_dl::LenTex_dl, texs2D_dl);
	
	//Set Lighting Parameters
	glNamedBufferData(ubos_dl[ubo_dl::Light_dl], sizeof(light_t_dl), NULL,  GL_STATIC_DRAW);
	glNamedBufferData(ubos_dl[ubo_dl::Material_dl], sizeof(material_t_dl), NULL, GL_STATIC_DRAW);
	glBindBufferBase(GL_UNIFORM_BUFFER, UniformBlockLight_dl, ubos_dl[ubo_dl::Light_dl]);
	light_t_dl *light = (light_t_dl*)glMapBufferRange(GL_UNIFORM_BUFFER, 0, sizeof(light_t_dl), GL_MAP_WRITE_BIT | GL_MAP_INVALIDATE_BUFFER_BIT);
	light->position = vmath::vec4(0.0f, 1.0f, 10.0f, 1.0f);
	light->ambient = vmath::vec4(0.1f, 0.1f, 0.1f, 1.0f);
	light->diffuse = vmath::vec4(1.0f, 1.0f, 1.0f, 1.0f);
	light->specular = vmath::vec4(1.0f, 1.0f, 1.0f, 1.0f);
	glUnmapBuffer(GL_UNIFORM_BUFFER);
	glBindBufferBase(GL_UNIFORM_BUFFER, UniformBlockMaterial, ubos_dl[ubo_dl::Material_dl]);
	material_t_dl *mat = (material_t_dl*)glMapBufferRange(GL_UNIFORM_BUFFER, 0, sizeof(material_t_dl), GL_MAP_WRITE_BIT | GL_MAP_INVALIDATE_BUFFER_BIT);
	mat->ambient = vmath::vec4(0.1f, 0.1f, 0.1f, 1.0f);
	mat->diffuse = vmath::vec4(1.0f, 1.0f, 1.0f, 1.0f);
	mat->specular = vmath::vec4(0.1f, 0.1f, 0.1f, 1.0f);
	mat->shininess = vmath::vec1(128.0f);
	glUnmapBuffer(GL_UNIFORM_BUFFER);
	
	//Set Vertex Data
	glNamedBufferData(vbos_dl[vaobo_dl::Road_dl], sizeof(vertices), vertices, GL_STATIC_DRAW);
	glVertexArrayVertexBuffer(vaos_dl[vaobo_dl::Road_dl], 0, vbos_dl[vaobo_dl::Road_dl], 0, sizeof(vertex_t_dl));

	glVertexArrayAttribBinding(vaos_dl[vaobo_dl::Road_dl], VertexPosition_dl, 0);
	glVertexArrayAttribFormat(vaos_dl[vaobo_dl::Road_dl], VertexPosition_dl, 3, GL_FLOAT, GL_FALSE, 0);
	glEnableVertexArrayAttrib(vaos_dl[vaobo_dl::Road_dl], VertexPosition_dl);

	glVertexArrayAttribBinding(vaos_dl[vaobo_dl::Road_dl], VertexNormal_dl, 0);
	glVertexArrayAttribFormat(vaos_dl[vaobo_dl::Road_dl], VertexNormal_dl, 3, GL_FLOAT, GL_FALSE, sizeof(vmath::vec3));
	glEnableVertexArrayAttrib(vaos_dl[vaobo_dl::Road_dl], VertexNormal_dl);

	glVertexArrayAttribBinding(vaos_dl[vaobo_dl::Road_dl], VertexTangent_dl, 0);
	glVertexArrayAttribFormat(vaos_dl[vaobo_dl::Road_dl], VertexTangent_dl, 3, GL_FLOAT, GL_FALSE, sizeof(vmath::vec3) * 2);
	glEnableVertexArrayAttrib(vaos_dl[vaobo_dl::Road_dl], VertexTangent_dl);

	glVertexArrayAttribBinding(vaos_dl[vaobo_dl::Road_dl], VertexBiTangent_dl, 0);
	glVertexArrayAttribFormat(vaos_dl[vaobo_dl::Road_dl], VertexBiTangent_dl, 3, GL_FLOAT, GL_FALSE, sizeof(vmath::vec3) * 3);
	glEnableVertexArrayAttrib(vaos_dl[vaobo_dl::Road_dl], VertexBiTangent_dl);

	glVertexArrayAttribBinding(vaos_dl[vaobo_dl::Road_dl], VertexTexCoord_dl, 0);
	glVertexArrayAttribFormat(vaos_dl[vaobo_dl::Road_dl], VertexTexCoord_dl, 2, GL_FLOAT, GL_FALSE, sizeof(vmath::vec3) * 4);
	glEnableVertexArrayAttrib(vaos_dl[vaobo_dl::Road_dl], VertexTexCoord_dl);

	//Load Textures
	for(int i = 0; i < tex2D_dl::LenTex_dl; i++) {
		glTextureParameterf(texs2D_dl[i], GL_TEXTURE_MAX_ANISOTROPY, 3.0f);
		glTextureParameteri(texs2D_dl[i], GL_TEXTURE_MIN_FILTER, GL_NEAREST);
		glTextureParameteri(texs2D_dl[i], GL_TEXTURE_MAG_FILTER, GL_NEAREST);
		glTextureParameteri(texs2D_dl[i], GL_TEXTURE_WRAP_S, GL_REPEAT);
	}
	int widht, height;
	void *data;
	data = loadImageDL(ROAD_TEX, &widht, &height);
	glBindTexture(GL_TEXTURE_2D, texs2D_dl[tex2D_dl::Road1Tex_dl]);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, widht, height, 0, GL_BGR, GL_UNSIGNED_BYTE, data);
	
	data = loadImageDL(ROAD_NOR, &widht, &height);
	glBindTexture(GL_TEXTURE_2D, texs2D_dl[tex2D_dl::Road1Nor_dl]);
	glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, widht, height, 0, GL_BGR, GL_UNSIGNED_BYTE, data);
	
	//Enable Depth
	glEnable(GL_DEPTH_TEST);
	glDepthFunc(GL_LEQUAL);
}

void renderNormalMappedRoadDL() {
	//Clear Buffer
	GLfloat black[] = { 0.0f, 0.0f, 0.0f, 1.0f };
	GLfloat one[] = { 1.0f };
	glClearBufferfv(GL_COLOR, 0, black);
	glClearBufferfv(GL_DEPTH, 0, one);

	//Set Viewport and Transform Matrices
	glUseProgram(programNormalMap);
	glUniformMatrix4fv(UniformModel_dl, 1, GL_FALSE, vmath::translate(0.0f, -2.0f, -10.0f));
	glUniformMatrix4fv(UniformView_dl, 1, GL_FALSE, vmath::mat4::identity());
	glUniformMatrix4fv(UniformProjection_dl, 1, GL_FALSE, perspectiveProjectionMatrix);
	//Set Sampler
	glUniform1i(UniformSamplerTex_dl, 0);
	glUniform1i(UniformSamplerNor_dl, 1);
	
	//Draw Textured Quad
	glBindVertexArray(vaos_dl[vaobo_dl::Road_dl]);
	
	glActiveTexture(GL_TEXTURE0);
	glBindTexture(GL_TEXTURE_2D, texs2D_dl[Road1Tex_dl]);
	glActiveTexture(GL_TEXTURE1);
	glBindTexture(GL_TEXTURE_2D, texs2D_dl[Road1Nor_dl]);
	
	glDrawArrays(GL_TRIANGLES, 0, 6);
}

void uninitNormalMappedRoadDL() {
	glUseProgram(0);
	glDeleteProgram(programNormalMap);
	glDeleteVertexArrays(vaobo_dl::LenVaobo_dl, vaos_dl);
	glDeleteBuffers(vaobo_dl::LenVaobo_dl, vbos_dl);
	glDeleteBuffers(ubo_dl::LenUbo_dl, ubos_dl);
	glDeleteTextures(tex2D_dl::LenTex_dl, texs2D_dl);
}