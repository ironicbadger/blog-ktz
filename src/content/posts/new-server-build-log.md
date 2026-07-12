---
title: New server build log
slug: new-server-build-log
description: That means I need a lot of threads and a lot of memory and a lot of storage.
customExcerpt: That means I need a lot of threads and a lot of memory and a lot of storage.
publishedAt: 2018-12-10T00:10:00.000-05:00
updatedAt: 2026-05-07T07:22:49.000-04:00
featureImage: /content/images/2019/02/qTwVpyU_d.jpg
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
ghostId: 6775c6279e78ea00017cbbd6
tags:
  - linux
  - hardware
  - docker
  - storage
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: linux
featured: false
readingTime: 4
---

I had a budget of around $3000 to build a new setup. I've just emigrated from the UK to the USA and as such needed to do *everything*. I ended up spending nearer $4k in the end, most of it on Black Friday on drives, but I won't need to spend any more on this server for at least 3-5 years and considering what it's capable of that's worth it to me.

Here are some [pictures](https://imgur.com/a/0tTdNOZ?ref=blog.ktz.me) of the build.

I ended up finding serverbuilds.net and went all out on the components as this box is going to be pulling double duty as my main media server and a homelab. I wrote the [Perfect Media Server](https://blog.linuxserver.io/2017/06/24/the-perfect-media-server-2017/?ref=blog.ktz.me) guide last year and provide Plex to several family and friends. I also work for Red Hat and specialise in Openshift so building clusters is something I do for fun!

<figure class="kg-card kg-gallery-card kg-width-wide"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/10.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/10.jpg 600w, /content/images/size/w1000/2019/07/10.jpg 1000w, /content/images/size/w1600/2019/07/10.jpg 1600w, /content/images/size/w2400/2019/07/10.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 0.749906 1 0%"><img src="/content/images/2019/07/9.jpg" width="2000" height="2667" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/9.jpg 600w, /content/images/size/w1000/2019/07/9.jpg 1000w, /content/images/size/w1600/2019/07/9.jpg 1600w, /content/images/size/w2400/2019/07/9.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/8.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/8.jpg 600w, /content/images/size/w1000/2019/07/8.jpg 1000w, /content/images/size/w1600/2019/07/8.jpg 1600w, /content/images/size/w2400/2019/07/8.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/7.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/7.jpg 600w, /content/images/size/w1000/2019/07/7.jpg 1000w, /content/images/size/w1600/2019/07/7.jpg 1600w, /content/images/size/w2400/2019/07/7.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/6.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/6.jpg 600w, /content/images/size/w1000/2019/07/6.jpg 1000w, /content/images/size/w1600/2019/07/6.jpg 1600w, /content/images/size/w2400/2019/07/6.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 0.749906 1 0%"><img src="/content/images/2019/07/5.jpg" width="2000" height="2667" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/5.jpg 600w, /content/images/size/w1000/2019/07/5.jpg 1000w, /content/images/size/w1600/2019/07/5.jpg 1600w, /content/images/size/w2400/2019/07/5.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/4.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/4.jpg 600w, /content/images/size/w1000/2019/07/4.jpg 1000w, /content/images/size/w1600/2019/07/4.jpg 1600w, /content/images/size/w2400/2019/07/4.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 0.749906 1 0%"><img src="/content/images/2019/07/3.jpg" width="2000" height="2667" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/3.jpg 600w, /content/images/size/w1000/2019/07/3.jpg 1000w, /content/images/size/w1600/2019/07/3.jpg 1600w, /content/images/size/w2400/2019/07/3.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/2.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/2.jpg 600w, /content/images/size/w1000/2019/07/2.jpg 1000w, /content/images/size/w1600/2019/07/2.jpg 1600w, /content/images/size/w2400/2019/07/2.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div></div></figure>

That means I need a lot of threads and a lot of memory and a lot of storage. I found the following [spreadsheet](https://www.serverbuilds.net/cpu-comparison?ref=blog.ktz.me) extremely helpful when comparing CPUs.

Thanks to jdm\_waaat and the serverbuilds.net site I was floored when I read about the Gigabyte motherboard he found. Dual LGA2011, supporting boatloads of RAM, built-in SAS, 10GBe?! For $180. Astonishing.

My final hardware ended up being:

-   CPU: x2 E5-2690v2
-   Memory: 128gb DDR3 ECC
-   Motherboard: Gigabyte GA-7PESH2
-   PSU: EVGA 850w
-   Case: Rosewill RSV-L4500
-   Fans: Replaced all stock fans with Noctua's
-   Drives: Total raw space 120tb

Here are some [pictures](https://imgur.com/a/0tTdNOZ?ref=blog.ktz.me) of the build.

<figure class="kg-card kg-gallery-card kg-width-wide"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/15.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/15.jpg 600w, /content/images/size/w1000/2019/07/15.jpg 1000w, /content/images/size/w1600/2019/07/15.jpg 1600w, /content/images/size/w2400/2019/07/15.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/14.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/14.jpg 600w, /content/images/size/w1000/2019/07/14.jpg 1000w, /content/images/size/w1600/2019/07/14.jpg 1600w, /content/images/size/w2400/2019/07/14.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 0.749906 1 0%"><img src="/content/images/2019/07/13.jpg" width="2000" height="2667" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/13.jpg 600w, /content/images/size/w1000/2019/07/13.jpg 1000w, /content/images/size/w1600/2019/07/13.jpg 1600w, /content/images/size/w2400/2019/07/13.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/12.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/12.jpg 600w, /content/images/size/w1000/2019/07/12.jpg 1000w, /content/images/size/w1600/2019/07/12.jpg 1600w, /content/images/size/w2400/2019/07/12.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/07/11.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/07/11.jpg 600w, /content/images/size/w1000/2019/07/11.jpg 1000w, /content/images/size/w1600/2019/07/11.jpg 1600w, /content/images/size/w2400/2019/07/11.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div></div></figure>

Gotchas:

-   When my board came out of the box IPMI was disabled
-   The CMOS battery was flat, once I replaced it the *5 beeps* on boot went away
-   At first I thought it was a CPU error but 5 beeps on a Gigabyte board means CMOS error
-   Just incase, buy a v1 Xeon CPU incase the motherboard needs a BIOS flash (I got one for $8 off ebay)

I'd intended to buy several hard drives on Black Friday (Best Buy easystores). Lo and behold Best Buy went and started stocking a 10tb variant. I snagged 8 on the day (luckily I live near several Best Buys) on top of the 5 other drives I'd already purchased. This gives me a total of 120tb raw which with dual parity gives me just a hair under 100TB of usable space.

The power cables for so many drives needed a bit of love. I bought [these cables](https://www.amazon.com/Cable-Matters-Pack-Power-Splitter/dp/B012BPLW08/ref=sr_1_9?ie=UTF8&qid=1544401341&sr=8-9&keywords=sata+power+cable&ref=blog.ktz.me) from Amazon and modified the plugs which are just push to fit so that they lined up properly and took care of the 3.3v rail (i.e. I didn't include it) at the same time which the WD easystores require.

To top it all off I finally made it IKEA this week and bought a IKEA lack coffee table to build the "IKEA lack rack enterprise edition". As you can see, it takes the rosewill case pretty much perfectly. Now, loaded with hard drives the Rosewill case weighs quite a bit so I think I might add a small support in the middle of the shelf but otherwise, it's a great solution for $30.

I'm currently evaluating hypervisors. I've run proxmox for a little while and have just switched to ESXI with vSphere and am trying to decide whether it's worth the VMUG annual price of $200 or not. I guess I could go with a fresh install every 2 months but that's a PITA. vSphere has great terraform support so I guess that'll probably win *sigh*.
