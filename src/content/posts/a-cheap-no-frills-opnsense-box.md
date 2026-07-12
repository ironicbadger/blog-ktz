---
title: A Cheap No-Frills OPNsense box
slug: a-cheap-no-frills-opnsense-box
description: |-
  If you're looking to build a small, quiet and cheap box to run OPNsense on then I have a build you might be interested in.

  This box has been happily running as my firewall since July 2019. I originally documented the build in this forum post over at serverbuilds.net but for posterity I wanted to record this information here too. Here's the build:




  Item
  Model
  Price in 2019
  Approx 2023 price
  Notes




  Motherboard
  Intel DQ77KB
  $37
  $50-60
  Dual on-board Gigabit ethernet


  CPU
  Intel i3 3225
  $29
  $6
customExcerpt: null
publishedAt: 2023-11-15T11:06:40.000-05:00
updatedAt: 2026-05-07T07:21:40.000-04:00
featureImage: /content/images/2023/11/3d0a9134232ac2a8a6e357cf7d3b6c8d35f75714.jpeg
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
ghostId: 6775c6279e78ea00017cbc39
tags:
  - technical
  - networking
  - opnsense
  - hardware
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

If you're looking to build a small, quiet and cheap box to run OPNsense on then I have a build you might be interested in.

This box has been happily running as my firewall since July 2019. I originally documented the build in [this forum post](https://forums.serverbuilds.net/t/guide-jdms-mini-itx-pfsense-builds/187/39?ref=blog.ktz.me) over at serverbuilds.net but for posterity I wanted to record this information here too. Here's the build:

| Item | Model | Price in 2019 | Approx 2023 price | Notes |
| --- | --- | --- | --- | --- |
| Motherboard | Intel DQ77KB | $37 | $50-60 | Dual on-board Gigabit ethernet |
| CPU | Intel i3 3225 | $29 | $6 |  |
| RAM | 16GB SODIMM | $6\* | $25 | Upgraded build from 4gb to 16gb |
| PSU | [19v Laptop Brick](https://amzn.to/3QZir8B?ref=blog.ktz.me) | $23 | $25 |  |
| SSD | [60GB mSATA](https://amzn.to/3G5hIMQ?ref=blog.ktz.me) | $19 | $15 |  |
| Case | [Goodisory Tempered Glass Mini-ITX](https://amzn.to/40Mbyef?ref=blog.ktz.me) | $49 | $49 |  |
|  |  | **2019 - $163** | **2023 - ~$170** |  |

Since 2019 the only upgrade I have made is from 4gb to 16gb of RAM. When running a few plugins I started to receive a few OOM errors and DDR3 SODIMMs are old and cheap so 16gb was an oppulent upgrade to resolve this issue.

When ordering the Intel DQ77KB from ebay take care to see if the seller includes the right sized IO plate for your needs. Most only ship with low profile which the linked case here doesn't fit. You'll want a full height one most likely.

I also placed a 40mm Noctua fan inside the case just to give things a tiny bit of airflow but I have no real data on how much this helped anything, really.

I liked the build so much I replicated it spec for spec to place at my parents house in the UK to act as a remote WireGuard and Tailscale endpoint in front of my primary off-site backup server which lives there.

<h2 id="the-future">The Future</h2>

This box is comfortably specced to handle a symmetric Gigabit fiber link up and down. However, when using OPNsense as a software VLAN co-ordinator it could become a bottleneck now that I've made the upgrade elsewhere to 10gig.

Therefore if I were to upgrade I might consider building something with an SFP+ card in it to make inter-VLAN traffic be able to traverse at higher speeds. This is not a bottleneck I currently face due to my network design but it could be in the foreseeable future.

Something like this [m720q firewall build](https://www.reddit.com/r/OPNsenseFirewall/comments/11g66wr/newish_m720q_opnsense_firewall_in_the_making/?ref=blog.ktz.me) might be just the ticket.

If all you're doing is the basics though, this build will serve you well for many years as it has me.
