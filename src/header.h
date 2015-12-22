/*
 * =====================================================================================
 *
 *       Filename:  header.h
 *
 *    Description:  Header for Util
 *
 *        Version:  1.0
 *        Created:  2015/12/22 11时53分51秒
 *       Revision:  none
 *       Compiler:  gcc
 *
 *         Author:  XadillaX (ZKD), zhukaidi@souche.com
 *   Organization:  Design & Development Center, Souche Car Service Co., Ltd, HANGZHOU
 *
 * =====================================================================================
 */
#ifdef WIN32
#include <Winsock2.h>
#include <Windows.h>
#include <WS2tcpip.h>

#define NET_ERROR WSAGetLastError()
#define socklen_t int
#define SocketUninit() WSACleanup()

#pragma comment(lib,"ws2_32.lib")
#else
#include <unistd.h>
#include <sys/time.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/select.h>
#include <sys/ioctl.h>
#include <netdb.h>
#include <netinet/in.h>
#include <net/if.h>
#include <netinet/tcp.h>
#include <arpa/inet.h>
#include <fcntl.h>
#include <errno.h>
#include <signal.h>

#define NET_ERROR errno
#define SOCKET_ERROR -1
#define INVALID_SOCKET -1
#define WSAECONNRESET ECONNRESET
#define WSAEWOULDBLOCK EWOULDBLOCK
#define WSAEINPROGRESS EINPROGRESS
#define WSAEBADF EBADF
#define closesocket close
#define SD_SEND SHUT_WR
#define SD_RECEIVE SHUT_RD
#define SD_BOTH SHUT_RDWR
typedef int SOCKET;
#endif
