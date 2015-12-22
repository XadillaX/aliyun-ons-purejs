/*
 * =====================================================================================
 *
 *       Filename:  util.cpp
 *
 *    Description:  Util for aliyun ons Node.js SDK
 *
 *        Version:  1.0
 *        Created:  2015/12/22 11时41分53秒
 *       Revision:  none
 *       Compiler:  gcc
 *
 *         Author:  XadillaX (ZKD), zhukaidi@souche.com
 *   Organization:  Design & Development Center, Souche Car Service Co., Ltd, HANGZHOU
 *
 * =====================================================================================
 */
#include <nan.h>
#include <vector>
#include "header.h"
using namespace std;

void _GetLocalAddress(vector<unsigned int>& addrs)
{
    // This function is refer to:
    // https://github.com/rocketmq/rocketmq-client4cpp/blob/v1.0.0-beta4/src/transport/SocketUtil.cpp#L107
    addrs.clear();

#ifdef WIN32
    WSADATA wsaData;
    int ret = WSAStartup(MAKEWORD(2, 2), &wsaData);
    if(ret != 0)
    {
        return;
    }

    SOCKET sfd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sfd != INVALID_SOCKET)
    {
        DWORD bytesRet = 0;
        char* buffer;
        int bufSize = 1024;
        do
        {
            buffer = (char*)malloc(bufSize);
            if(WSAIoctl(sfd, SIO_GET_INTERFACE_LIST, NULL, 0, buffer, bufSize, &bytesRet, NULL, NULL) == SOCKET_ERROR)
            {
                if(WSAGetLastError() == WSAEFAULT)
                {
                    bufSize <<= 1;
                    free(buffer);
                    continue;
                }
                else
                {
                    bytesRet = 0;
                    break;
                }
            }
            else
            {
                break;
            }
        } while(true);

        int size = bytesRet / sizeof(INTERFACE_INFO);
        INTERFACE_INFO* iinfo = (INTERFACE_INFO*)buffer;

        for(int i = 0; i < size; i++)
        {
            if(iinfo[i].iiAddress.AddressIn.sin_family == AF_INET)
            {
                addrs.push_back(ntohl(iinfo[i].iiAddress.AddressIn.sin_addr.s_addr));
            }
        }

        free(buffer);
        buffer = NULL;
        closesocket(sfd);
    }
#else
    struct ifconf ifc;
    ifc.ifc_buf = NULL;
    ifc.ifc_len = 0;

    int sfd = socket(AF_INET, SOCK_DGRAM, 0);
    if(sfd != INVALID_SOCKET)
    {
        int ret = ioctl(sfd, SIOCGIFCONF, (char*)&ifc);
        if(ret != -1)
        {
            ifc.ifc_req = (struct ifreq*)malloc(ifc.ifc_len);
            ret = ioctl(sfd, SIOCGIFCONF, (char*)&ifc);
            if(ret != -1)
            {
                for(int i = 0; i < ifc.ifc_len / sizeof(struct ifreq); i++)
                {
                    struct sockaddr* sa = (struct sockaddr*)&(ifc.ifc_req[i].ifr_addr);
                    if(AF_INET == sa->sa_family)
                    {
                        unsigned int addr = ((struct sockaddr_in*)sa)->sin_addr.s_addr;
                        addrs.push_back(htonl(addr));
                    }
                }
            }

            free(ifc.ifc_req);
            ifc.ifc_req = NULL;
        }

        close(sfd);
    }
#endif

    if(addrs.empty())
    {
        char hostname[1024];
        int ret = gethostname(hostname, sizeof(hostname));
        if(ret == 0)
        {
            struct addrinfo* result = NULL;
            struct addrinfo* ptr = NULL;
            struct addrinfo hints;

            memset(&hints, 0, sizeof(hints));
            hints.ai_family = AF_INET;
            hints.ai_socktype = SOCK_STREAM;
            hints.ai_protocol = IPPROTO_TCP;

            ret = getaddrinfo(hostname, NULL, &hints, &result);
            if(0 == ret)
            {
                for(ptr = result; ptr != NULL; ptr = ptr->ai_next)
                {
                    struct sockaddr_in* sockaddr_ipv4 = (struct sockaddr_in*)ptr->ai_addr;
                    addrs.push_back(ntohl(sockaddr_ipv4->sin_addr.s_addr));
                }
            }

            freeaddrinfo(result);
        }
    }

    vector<unsigned int>::iterator it = addrs.begin();
    for(; it != addrs.end();)
    {
        if(*it >= 0x7f000000u && *it < 0x80000000u)
        {
            it = addrs.erase(it);
        }
        else
        {
            it++;
        }
    }

    if(addrs.empty())
    {
        addrs.push_back(INADDR_LOOPBACK);
    }

#ifdef WIN32
    WSACleanup();
#endif
}

NAN_METHOD(GetLocalAddress)
{
    vector<unsigned int> addrs;
    _GetLocalAddress(addrs);
    struct in_addr addr;
    addr.s_addr = htonl(addrs[0]);

    info.GetReturnValue().Set(Nan::New<v8::String>(inet_ntoa(addr)).ToLocalChecked());
}

NAN_MODULE_INIT(Init)
{
    Nan::Set(target, Nan::New<v8::String>("getLocalAddress").ToLocalChecked(),
            Nan::GetFunction(Nan::New<v8::FunctionTemplate>(GetLocalAddress)).ToLocalChecked());
}

NODE_MODULE(cppUtil, Init);
