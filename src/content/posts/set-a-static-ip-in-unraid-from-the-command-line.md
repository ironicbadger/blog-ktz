---
title: Set a static IP in Unraid from the command line
slug: set-a-static-ip-in-unraid-from-the-command-line
description: |-
  When flashing the brand new Unraid 7 to a USB stick earlier today I did something silly. I configured a static IP that conflicted with another host in the same LAN.

  This meant I couldn't access the Unraid UI to fix it. However, by modifying one file in the /boot directory by hand we can set a static IP easily and quickly. In Unraid land, the /boot directory is persisted on the USB stick the system boots from.

  To make changes to this file, open the command line interface to your Unraid system e
customExcerpt: null
publishedAt: 2025-01-16T11:07:17.000-05:00
updatedAt: 2026-05-07T07:21:29.000-04:00
featureImage: /content/images/2025/01/vPaBKSK.jpeg
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
ghostId: 67892bde08db230001a8eeda
tags:
  - technical
  - unraid
internalTags: []
primaryTag: technical
featured: false
readingTime: 1
---

When flashing the brand new Unraid 7 to a USB stick earlier today I did something silly. I configured a static IP that conflicted with another host in the same LAN.

This meant I couldn't access the Unraid UI to fix it. However, by modifying one file in the `/boot` directory by hand we can set a static IP easily and quickly. In Unraid land, the `/boot` directory is persisted on the USB stick the system boots from.

To make changes to this file, open the command line interface to your Unraid system either by being at the physical console of the machine or via some other means. If it's a brand new box, `root` won't have a password yet so simply type `root` and you'll be in. Again, if this is a brand new box you won't be able to connect via SSH so you must find a way to get to the terminal of the box itself.

Next use a text editor to modify `/boot/config/network.cfg` to your requirements. Here's an example of setting a static IP in the subnet `10.42.37.0/24` for reference:

```shellsession
root@Tower:~# cat /boot/config/network.cfg 
# Generated network settings
USE_DHCP="no"
IPADDR="10.42.37.50"
NETMASK="255.255.255.0"
GATEWAY="10.42.37.254"
BONDING="yes"
BRIDGING="yes"
DNS_SERVER1="10.42.37.254"
```

When finished, save the file and reboot your box.

Once you've restored access to the webUI you can modify network settings under `Settings -> Network Settings`.
