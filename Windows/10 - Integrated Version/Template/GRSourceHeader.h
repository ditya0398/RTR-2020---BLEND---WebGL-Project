#pragma once
#include<windows.h>
#include<stdio.h>
#include<gl\glew.h> // glew.h must be included BEFORE gl.h
#include<gl\GL.h>
#include"vmath.h"
#include"GRWindow.h"



extern "C" void GROpenLogFile();
extern "C" void GRIncrementX();
extern "C" void GRIncrementY();
extern "C" void GRInitShaders();
extern "C" void GRDisplayGeometry();
extern "C" void GRUninitialize();
extern "C" void GRInitPerspMatrixInResize(int, int);
extern "C" bool LoadGLTexture(GLuint*, TCHAR resourceID[]);

