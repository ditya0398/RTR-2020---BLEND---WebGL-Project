#pragma once
#include<Windows.h>
#include<stdio.h>
#include<gl/glew.h>
#include<gl/GL.h>
#include"vmath.h"
#include"res.h"

void* loadImageDL(int resid, int *widht, int *height);
void initNormalMappedRoadDL();
void renderNormalMappedRoadDL();
void uninitNormalMappedRoadDL();