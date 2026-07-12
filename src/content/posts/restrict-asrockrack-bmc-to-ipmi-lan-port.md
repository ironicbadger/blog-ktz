---
title: Restricting ASRock Rack BMC to dedicated IPMI_LAN port only
slug: restrict-asrockrack-bmc-to-ipmi-lan-port
description: During this process I came across a frustrating "bug" in the Asrock Rack BMC implementation. No matter the settings I gave the BMC it was getting two IP addresses. One on the IPMI_LAN port as expected in my management VLAN, and another on eth0 which is undesirable.
customExcerpt: During this process I came across a frustrating "bug" in the Asrock Rack BMC implementation. No matter the settings I gave the BMC it was getting two IP addresses. One on the IPMI_LAN port as expected in my management VLAN, and another on eth0 which is undesirable.
publishedAt: 2023-02-14T14:41:03.000-05:00
updatedAt: 2026-05-07T07:21:46.000-04:00
featureImage: https://images.unsplash.com/photo-1521106047354-5a5b85e819ee?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDh8fGV0aGVybmV0fGVufDB8fHx8MTY3NjQwMzgwMQ&ixlib=rb-4.0.3&q=80&w=2000
featureImageAlt: null
featureImageCaption: Photo by <a href="https://unsplash.com/@thomasjsn?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Thomas Jensen</a> / <a href="https://unsplash.com/?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Unsplash</a>
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 6775c6279e78ea00017cbc32
tags:
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

I've written before about my media server's motherboard, the ASRockRack [E3C246D4U](/asrock-rack-e3c246d4u-the-perfect-media-server-motherboard/). This week I've been performing some long overdue network upgrades which included implementing VLANs and [automating DHCP / DNS](/fully-automated-dns-and-dhcp-with-pihole-and-dnsmasq/).

However, during this process I came across a frustrating "bug" in the Asrock Rack BMC implementation. No matter the settings I gave the BMC it was getting two IP addresses. One on the `IPMI_LAN` port as expected in my management VLAN, and another on `eth0` which is undesirable.

<h2 id="tldrthe-solution">TL;DR - The Solution</h2>

The end result I was looking for a single IP on the `10.42.10.21` interface. This was the port on the switch tagged for the management VLAN. `IP2` should not exist.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/02/telegram-cloud-photo-size-4-6005779892895071631-x.jpg" class="kg-image" alt="" loading="lazy" width="349" height="153" decoding="async"></figure>

My answer ended up coming from a [reddit thread](https://www.reddit.com/r/homelab/comments/ph9wgx/help_with_restricting_asrock_rack_x570d4u2l2t/?ref=blog.ktz.me). I needed to run:

```
ipmitool raw 0x32 0x71 0x00 0x01 0x00
```

I then rebooted the BMC with `ipmitool -H 10.42.10.21 -U admin -P hunter2 mc reset cold` and only the `IPMI_LAN` port grabbed an IP. Perfect.

<h2 id="extra-infojust-in-case">Extra info - just in case</h2>

I've included a bit more information here just in case it helps you. I found the answer above worked immediately so perhaps try that first.

I attempted to disable BMC registration in the web interface for `eth0` which did not prevent it grabbing an IP. I made sure to disable bonding.

<figure class="kg-card kg-image-card"><img src="/content/images/2023/02/image-4.png" class="kg-image" alt="" loading="lazy" width="568" height="468" decoding="async"></figure>

I set a static IP like so.

<figure class="kg-card kg-image-card"><img src="/content/images/2023/02/image-5.png" class="kg-image" alt="" loading="lazy" width="723" height="683" srcset="/content/images/size/w600/2023/02/image-5.png 600w, /content/images/2023/02/image-5.png 723w" sizes="(min-width: 720px) 720px" decoding="async"></figure>
