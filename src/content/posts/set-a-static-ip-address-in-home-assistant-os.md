---
title: Set a static IP address in Home Assistant OS
slug: set-a-static-ip-address-in-home-assistant-os
description: |-
  Full credit goes to this forum post.

  I found myself in need of dropping to the CLI for a fresh Home Assistant OS install on top of Proxmox after using the tteck helper scripts to set a static IP.

  To do this without access to the Home Assistant UI we must drop to the command line of HAOS itself. Simply typing login will drop you out of the HAOS CLI and you will be able to use nmcli to set these parameters on the underlying OS.


  nmcli

  nmcli is a command line tool to modify network configuratio
customExcerpt: null
publishedAt: 2024-03-28T10:21:19.000-04:00
updatedAt: 2026-05-07T07:21:35.000-04:00
featureImage: /content/images/2024/03/alexktz_a_close_up_of_a_network_rack_switch_with_ethernet_cable_137a95e3-0286-4751-8a7d-3acb8b917566.png
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
ghostId: 6775c6279e78ea00017cbc40
tags:
  - technical
  - home-assistant
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 1
---

Full credit goes to this [forum post](https://community.home-assistant.io/t/how-to-change-ip-adresse-in-cli/332205/4?ref=blog.ktz.me).

I found myself in need of dropping to the CLI for a fresh Home Assistant OS install on top of Proxmox after using the [tteck helper scripts](https://tteck.github.io/Proxmox/?ref=blog.ktz.me) to set a static IP.

To do this without access to the Home Assistant UI we must drop to the command line of HAOS itself. Simply typing `login` will drop you out of the HAOS CLI and you will be able to use `nmcli` to set these parameters on the underlying OS.

<h2 id="nmcli">nmcli</h2>

[nmcli](https://developer-old.gnome.org/NetworkManager/stable/nmcli.html?ref=blog.ktz.me) is a command line tool to modify network configurations.

-   Use `nmcli connection show` to list your connections
-   `nmcli con edit "Your Connection Name"` to enter edit mode for that connection - in my case this was `"Supervisor enp0s18"`
-   `nmcli> set ipv4.addresses 192.168.1.10/24 Do you also want to set 'ipv4.method' to 'manual'? [yes]:`
-   Set the dns server and local gateway while you’re here

```bash
# nmcli> set ipv4.dns 192.168.1.254
# nmcli> set ipv4.gateway 192.168.1.254
# nmcli> save
# nmcli> quit
```

The next thing to do is reboot the HAOS VM and enjoy.
