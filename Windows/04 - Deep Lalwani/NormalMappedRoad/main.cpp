#include<Windows.h>
#include<stdio.h>
#include<gl/glew.h>
#include<gl/GL.h>
#include"vmath.h"
#include"res.h"
using namespace vmath;

#pragma comment(lib, "user32.lib")
#pragma comment(lib, "gdi32.lib")
#pragma comment(lib, "glew32.lib")
#pragma comment(lib, "opengl32.lib")

#define WND_WIDTH_DL 800
#define WND_HEIGHT_DL 600

LRESULT CALLBACK WndProc(HWND, UINT, WPARAM, LPARAM);

HWND ghwnd_dl;
HDC ghdc_dl;
HGLRC ghrc_dl;
bool gbActive_dl;
bool gbFullscreen_dl;

#include"normalmap.cpp"

int WINAPI WinMain(HINSTANCE hInst_dl, HINSTANCE hPrev_dl, LPSTR szCmdLine_dl, int iCmdShow_dl) {
	void loadShader(void);
	void Init(void);
	void Display(void);
	void Update(void);
	void Uninit(void);

	WNDCLASSEX wnd_dl;
	MSG msg_dl;
	TCHAR szAppName[] = TEXT("Deep's App");
	
	wnd_dl.cbClsExtra = 0;
	wnd_dl.cbWndExtra = 0;
	wnd_dl.cbSize = sizeof(WNDCLASSEX);
	wnd_dl.hbrBackground = (HBRUSH)GetStockObject(BLACK_BRUSH);
	wnd_dl.hCursor = LoadCursor(NULL, IDC_ARROW);
	wnd_dl.hIcon = LoadIcon(NULL, IDI_APPLICATION);
	wnd_dl.hIconSm = LoadIcon(NULL, IDI_APPLICATION);
	wnd_dl.hInstance = hInst_dl;
	wnd_dl.lpfnWndProc = WndProc;
	wnd_dl.lpszClassName = szAppName;
	wnd_dl.lpszMenuName = NULL;
	wnd_dl.style = CS_HREDRAW | CS_VREDRAW | CS_OWNDC;
	RegisterClassEx(&wnd_dl);
	ghwnd_dl = CreateWindowEx(WS_EX_APPWINDOW, szAppName, TEXT("Programmable Pipeline Tweaked Smile"), WS_OVERLAPPEDWINDOW | WS_CLIPCHILDREN | WS_CLIPSIBLINGS | WS_VISIBLE, 100, 100, WND_WIDTH_DL, WND_HEIGHT_DL, NULL, NULL, hInst_dl, NULL);
	ShowWindow(ghwnd_dl, iCmdShow_dl);
	SetFocus(ghwnd_dl);
	SetForegroundWindow(ghwnd_dl);
	
	PIXELFORMATDESCRIPTOR pfd_dl;
	int iPixelFormatIndex_dl;

	ghdc_dl = GetDC(ghwnd_dl);

	ZeroMemory(&pfd_dl, sizeof(pfd_dl));
	pfd_dl.nSize = sizeof(pfd_dl);
	pfd_dl.nVersion = 1;
	pfd_dl.dwFlags = PFD_DRAW_TO_WINDOW | PFD_SUPPORT_OPENGL | PFD_DOUBLEBUFFER;
	pfd_dl.iPixelType = PFD_TYPE_RGBA;
	pfd_dl.cColorBits = 32;
	pfd_dl.cRedBits = 8;
	pfd_dl.cGreenBits = 8;
	pfd_dl.cBlueBits = 8;
	pfd_dl.cAlphaBits = 8;
	pfd_dl.cDepthBits = 32;

	if ((iPixelFormatIndex_dl = ChoosePixelFormat(ghdc_dl, &pfd_dl)) == NULL) {
		DestroyWindow(ghwnd_dl);
	}

	if (SetPixelFormat(ghdc_dl, iPixelFormatIndex_dl, &pfd_dl) == FALSE) {
		DestroyWindow(ghwnd_dl);
	}

	if ((ghrc_dl = wglCreateContext(ghdc_dl)) == NULL) {
		DestroyWindow(ghwnd_dl);
	}

	if (wglMakeCurrent(ghdc_dl, ghrc_dl) == FALSE) {
		DestroyWindow(ghwnd_dl);
	}

	GLenum glew_error_dl = glewInit();
	if(glew_error_dl != GLEW_OK) {
		DestroyWindow(ghwnd_dl);
	}
	
	Init();
	
	while(true) {
		if(PeekMessage(&msg_dl, NULL, 0, 0, PM_REMOVE)) {
			if(msg_dl.message == WM_QUIT) {
				break;
			} else {
				TranslateMessage(&msg_dl);
				DispatchMessage(&msg_dl);
			}
		} else {
			Display();
			if(gbActive_dl) {
				Update();
			}
			SwapBuffers(ghdc_dl);
		}
	}
	Uninit();
	return msg_dl.wParam;
}

LRESULT CALLBACK WndProc(HWND hwnd, UINT iMsg, WPARAM wParam, LPARAM lParam) {
	void Resize(int, int);
	void ToggleFullscreen(void);

	switch(iMsg) {
	case WM_ACTIVATE:
		gbActive_dl = !HIWORD(wParam);
		break;
	case WM_ERASEBKGND:
		return 0;
	case WM_SIZE:
		Resize(LOWORD(lParam), HIWORD(lParam));
		break;
	case WM_KEYDOWN:
		switch(wParam) {
		case VK_ESCAPE:
			DestroyWindow(hwnd);
			break;
		case VK_LEFT:
			angRotx_dl += 3;
			break;
		case VK_RIGHT:
			angRotx_dl -= 3;
			break;
		case VK_UP:
			angRoty_dl += 3;
			break;
		case VK_DOWN:
			angRoty_dl -= 3;
			break;
		case VK_SPACE:
			current_dl = (current_dl + 1) % MaxLen_dl;
			break;
		}
		break;
	case WM_CHAR:
		switch(wParam) {
		case 'F': case 'f':
			ToggleFullscreen();
			break;
		}
		break;
	case WM_DESTROY:
		PostQuitMessage(0);
		break;
	}
	return DefWindowProc(hwnd, iMsg, wParam, lParam);
}

void ToggleFullscreen() {
	static DWORD dwStyle_dl;
	static WINDOWPLACEMENT wpPrev_dl = { sizeof(WINDOWPLACEMENT) };
	MONITORINFO mi_dl = { sizeof(MONITORINFO) };
	if (gbFullscreen_dl) {
		SetWindowLong(ghwnd_dl, GWL_STYLE, dwStyle_dl | WS_OVERLAPPEDWINDOW);
		SetWindowPlacement(ghwnd_dl, &wpPrev_dl);
		SetWindowPos(ghwnd_dl, HWND_TOP, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE | SWP_NOOWNERZORDER | SWP_NOZORDER | SWP_FRAMECHANGED);
		ShowCursor(true);
		gbFullscreen_dl = false;
	}
	else {
		dwStyle_dl = GetWindowLong(ghwnd_dl, GWL_STYLE);
		if (dwStyle_dl & WS_OVERLAPPEDWINDOW) {
			if (GetWindowPlacement(ghwnd_dl, &wpPrev_dl) && GetMonitorInfo(MonitorFromWindow(ghwnd_dl, MONITORINFOF_PRIMARY), &mi_dl)) {
				SetWindowLong(ghwnd_dl, GWL_STYLE, dwStyle_dl & ~WS_OVERLAPPEDWINDOW);
				SetWindowPos(ghwnd_dl, HWND_TOP, mi_dl.rcMonitor.left, mi_dl.rcMonitor.top, mi_dl.rcMonitor.right - mi_dl.rcMonitor.left, mi_dl.rcMonitor.bottom - mi_dl.rcMonitor.top, SWP_NOZORDER | SWP_FRAMECHANGED);
			}
		}
		ShowCursor(false);
		gbFullscreen_dl = true;
	}
}

void Init(void) {
	initNormalMappedRoadDL();
}

void Resize(int w, int h) {
	size_dl.w = w;
	size_dl.h = h;
}

void Update(void) {
}

void Display(void) {
	renderNormalMappedRoadDL();
}

void Uninit(void) {
	uninitNormalMappedRoadDL();

	if (gbFullscreen_dl) {
		ToggleFullscreen();
	}

	if (wglGetCurrentContext() == ghrc_dl) {
		wglMakeCurrent(NULL, NULL);
	}

	if (ghdc_dl) {
		wglDeleteContext(ghrc_dl);
		ghrc_dl = NULL;
	}

	if (ghdc_dl) {
		ReleaseDC(ghwnd_dl, ghdc_dl);
		ghdc_dl = NULL;
	}
}