---
title: Using Beszel to monitor Windows
slug: using-beszel-to-monitor-windows
description: Beszel is a new, lightweight monitoring app that natively supports Mac and Linux. I'll cover how to set it up natively in Windows or WSL2 in today's post.
customExcerpt: Beszel is a new, lightweight monitoring app that natively supports Mac and Linux. I'll cover how to set it up natively in Windows or WSL2 in today's post.
publishedAt: 2025-01-10T10:57:37.000-05:00
updatedAt: 2026-05-07T07:21:28.000-04:00
featureImage: /content/images/2025/01/Screenshot-2025-01-10-105835.png
featureImageAlt: null
featureImageCaption: null
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 67802a50ebc590000178176b
tags:
  - technical
  - linux
  - monitoring
internalTags: []
primaryTag: technical
featured: false
readingTime: 5
---

There's a new kid on the monitoring block. Meet [Beszel](https://beszel.dev/?ref=blog.ktz.me). It purports to be a lightweight server monitoring hub with historical data, docker stats, and alerts.

The project provides native Linux and macOS binaries so I'll leave configuring those up to the [project's documentation](https://beszel.dev/guide/getting-started?ref=blog.ktz.me). In today's post I will cover how to run the agent on Windows both as a native Windows service, and using WSL2 - including a little tweak to get Nvidia GPU monitoring working under WSL2 as well.

This guide assume you have already followed the project documentation to set up a "hub". We are configuring the agent portion which talks back to the hub, presumably on a Linux system somewhere which is routable from your Windows host either on the LAN or via Tailscale somehow.

<h2 id="as-a-native-windows-service">As a native Windows service</h2>

The project itself doesn't ship a native Windows binary but this is a go based project so compiling our own is easy enough. I used an Ubuntu Linux system with go installed via `apt install golang-go`. It just so happened this was a WSL2 Ubuntu installation but I don't think that's terribly important.

<div class="kg-card kg-callout-card kg-callout-card-red"><div class="kg-callout-emoji">⚠️</div><div class="kg-callout-text">There is a <a href="https://github.com/henrygd/beszel/issues/46?ref=blog.ktz.me" rel="noreferrer">GitHub issue</a> stating that Windows Defender found malware in the compiled <code spellcheck="false" style="white-space: pre-wrap;">agent.exe</code> file. My Windows 11 system didn't pick that up so take this as a cautionary tale and proceed at your own risk.</div></div>

Compilation is simple. Clone the git repo:

```
git clone https://github.com/henrygd/beszel.git
```

Change directory:

```bash
cd beszel/beszel/cmd/agent
```

And then compile the `agent.exe` file with:

```
GOOS=windows GOARCH=amd64 CGO_ENABLED=0 go build -ldflags "-w -s" .
```

In that directory you will now find `agent.exe`. Copy that .exe file to your Windows system. Create a new directory and copy `agent.exe` on the Windows system under:

```
C:\Program Files\beszel-agent\agent.exe
```

In your Beszel hub, in the top right click on `+ Add System` and select `Binary`. Enter the `Name` and `Host / IP` of the Windows system. Copy the Public Key to your clipboard and use it in the following commands to create a backgrounded Windows service that auto runs on startup.

<h3 id="configuring-the-windows-service-with-nssm">Configuring the Windows service with NSSM</h3>

We're going to use [NSSM](https://nssm.cc/?ref=blog.ktz.me) (Non-Sucking Service Manager) to run the beszel-agent on Windows. I installed via [Chocolatey](https://chocolatey.org/?ref=blog.ktz.me) with `choco install nssm`, but you can also install it straight from the projects website too.

Assuming that is done, and the `agent.exe` file is in position as described above we should now be in a position to create the service.

Open an administrator PowerShell window and run:

```powershell
# create the service
nssm install beszelagent "C:\Program Files\beszel-agent\agent.exe"

# set your public key as an env var for the service
nssm set beszelagent AppEnvironmentExtra "KEY=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFIkr64nTWbuhU7l+VrLO7lPDRgh2LVqTtrIberNge1j"

# start the service
nssm start beszelagent

# view services logs
nssm dump beszelagent
```

And that, should be that.

Now over in Beszel, you already added this system when you got your public key. But in case you didn't now is a good time to do so. And voila, your system should be up and talking to Beszel successfully and monitoring Windows.

<figure class="kg-card kg-image-card"><img src="/content/images/2025/01/image-8.png" class="kg-image" alt="" loading="lazy" width="1903" height="919" srcset="/content/images/size/w600/2025/01/image-8.png 600w, /content/images/size/w1000/2025/01/image-8.png 1000w, /content/images/size/w1600/2025/01/image-8.png 1600w, /content/images/2025/01/image-8.png 1903w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

The agent even picked up my Nvidia RTX3080 with no further configuration required out of the both. Great!

<h2 id="wsl2">WSL2</h2>

WSL2 is not too different from any other Linux beszel-agent installation except you have to be aware of one *major* caveat. The WSL2 VM is just that, a VM. And as such, the agent will only have the world view of the VM - RAM limits, process limits and all.

That said, it is the way that the project officially recommends we run beszel-agent on Windows for now. But I did have to modify the service paths a little bit in order for `nvidia-smi` to be available to the agent and the GPU to be detected.

First, I'm assuming you have a working WSL2 instance set up - here are the [Microsoft docs on the topic](https://learn.microsoft.com/en-us/windows/wsl/install?ref=blog.ktz.me) if you don't.

Second I'm assuming you're using a recent Ubuntu image - I'm using 24.04.1. These steps will likely work on other distros but I haven't tested them.

<h3 id="configuring-the-service-inside-wsl2">Configuring the service inside WSL2</h3>

Let's start by installing the agent and configuring the systemd side of things within the WSL2 environment.

As I'm focusing here on monitoring a GPU, it's not recommended to run the agent inside a docker container - though some folks have had success with a custom image with Nvidia tools installed YMMV. I'm going to configure the binary agent here.

The project provide an install script for the binary agent on Linux. Go ahead and run that, then we'll make our tweaks. At the time of writing that command is:

```
curl -sL https://raw.githubusercontent.com/henrygd/beszel/main/supplemental/scripts/install-agent.sh -o  install-agent.sh && chmod +x install-agent.sh && ./install-agent.sh
```

Once that is done the script will have installed a systemd unit, an update timer script and the agent.

In order for the agent to pick up the `nvidia-smi` tools that it uses to parse the GPU metrics, we need to make sure that the PATH variable contains `nvidia-smi`. That is done by adding an extra line to the file at `/etc/systemd/system/beszel-agent.service` (see below):

```ini
# /etc/systemd/system/beszel-agent.service

[Unit]
Description=Beszel Agent Service
After=network.target

[Service]
Environment="PORT=45876"
Environment="KEY=ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIFIkr64nTWbuhU7l+VrLO7lPDRgh2LVqTtrIberNge1j"
Environment="PATH=/usr/lib/wsl/lib/:$PATH"
# Environment="EXTRA_FILESYSTEMS=sdb"
ExecStart=/opt/beszel-agent/beszel-agent
User=root
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Once this is done, we want to reload and then start our services:

```
systemctl daemon-reload
systemctl restart beszel-agent
```

<h2 id="allowing-access-to-wsl2-from-windows">Allowing access to WSL2 from Windows</h2>

Remember how WSL2 is a VM? Well that means it doesn't get a fully fledged IP address on the network, it creates its own network integration with Windows so your VM ends up with an IP in a totally different - non routable - subnet from the Windows host itself.

We can "forward" the ports from the Windows host to WSL2 easily though. First, grab the IP of your WSL VM by typing `ipconfig` in the VM shell - mine was `192.168.61.81` - yours will be different most likely.

Then in an administrator PowerShell window on the Windows host execute the following:

```powershell
# proxies port 45876 to the WSL2 VM
netsh interface portproxy add v4tov4 listenport=45876 listenaddress=0.0.0.0 connectport=45876 connectaddress=192.168.61.81

# creates a new Windows firewall rule to allow traffic
New-NetFirewallRule -DisplayName "WSL Port 45876" -Direction Inbound -Protocol TCP -LocalPort 45876 -Action Allow
```

And assuming you added the host already in Beszel's hub your host should show up, complete with GPU monitoring as well.
