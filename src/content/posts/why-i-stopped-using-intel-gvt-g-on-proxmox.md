---
title: Why I stopped using Intel GVT-g on Proxmox with Quick Sync
slug: why-i-stopped-using-intel-gvt-g-on-proxmox
description: The promise of GVT-g technically was very high. One box to rule them all. However in practice, it just didn't live up to expectations.
customExcerpt: The promise of GVT-g technically was very high. One box to rule them all. However in practice, it just didn't live up to expectations.
publishedAt: 2021-02-23T16:40:50.000-05:00
updatedAt: 2026-05-07T07:21:45.000-04:00
featureImage: /content/images/2021/02/IMG_0187.jpg
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
ghostId: 6775c6279e78ea00017cbc1e
tags:
  - technical
  - linux
  - media-server
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 4
---

In December I thought I'd found my home server nirvana. I [wrote](https://perfectmediaserver.com/advanced/passthrough-igpu-gvtg/?ref=blog.ktz.me) about using Intel's GVT-g technology to slice up my iGPU into 2 virtual GPUs and how to use one slice for Plex in 1 VM and the other for Blue Iris in another VM.

Unfortunately, it's not reliable and I've had to completely abandon this approach.

<h2 id="tl-dr-conclusion">TL;DR - Conclusion</h2>

Performance via GVT-g is anywhere from 58-82% slower than Quick Sync being using natively on the bare metal host.

The load created by Blue Iris in a Windows VM plus Plex in a Linux VM caused hung processes, kernel panics and other weirdness on the Proxmox host making it unsuitable for a server environment where *stability* is king.

Therefore I suggest abandoning all hope all ye who enter into this idea. In theory, it is great. However in practice, GVT-g does not provide enough stability or performance to be useful even for your average media server enthusiast.

<div class="kg-card kg-callout-card kg-callout-card-yellow"><div class="kg-callout-emoji">💡</div><div class="kg-callout-text">Note March 2023 - Nothing has changed. This approach should likely be avoided. Use Quicksync. Run your media servers on the host. It won't kill you, probably.</div></div>

<h2 id="hardware-used-in-this-post">Hardware used in this post</h2>

Because I know some of you will ask, the hardware used in the post was:

-   [Intel i5 8500](https://amzn.to/3buCOot?ref=blog.ktz.me) ([6 core, 4.1ghz](https://ark.intel.com/content/www/us/en/ark/products/129939/intel-core-i5-8500-processor-9m-cache-up-to-4-10-ghz.html?ref=blog.ktz.me))
-   [AsROCK Z370 Taichi Motherboard](https://www.asrock.com/mb/intel/Z370%20Taichi/index.asp?ref=blog.ktz.me)

<h2 id="performance">Performance</h2>

Firstly, the performance over time was just not there.

As a benchmark I ran a Plex Media Server in each VM with a local copy of the same movie file on local storage (local to the VM to rule out network bottlenecks and such).

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2021/02/image.png" class="kg-image" alt="" loading="lazy" width="1119" height="509" srcset="/content/images/size/w600/2021/02/image.png 600w, /content/images/size/w1000/2021/02/image.png 1000w, /content/images/2021/02/image.png 1119w" decoding="async"></figure>

Here is the full `mediainfo` for the file used in this testing - [gist](https://gist.github.com/IronicBadger/43f00e3e2ad2111c682eed9fc9937ffd?ref=blog.ktz.me). It's a 1080p, 35GB movie file with 2hr duration and bitrate of around 38.5Mb/s. The encoding is `MPEG-4 AVC Video / 38309 kbps / 1080p / 23.976 fps` and the file has a DTS-HD Master Audio soundtrack. It is an H264 encoding, perfect for Quick Sync.

I proceeded to then use the "sync for offline playback" feature of Plex and observe the average conversion speed of each system at the `4Mbps 720p` option. And just for fun, I tried the same test with a 1080Ti as well. I recorded the values every minute for 5 minutes and took an average to get the speed values below - repeating the test 3 times for each method.

| GPU | OS | GVT-g mode | Speed |
| :-- | :-- | :-- | :-- |
| [CPU Software Only](https://ark.intel.com/content/www/us/en/ark/products/129939/intel-core-i5-8500-processor-9m-cache-up-to-4-10-ghz.html?ref=blog.ktz.me) | Ubuntu VM (via docker) | NA | 1.1x |
| [UHD 630 iGPU](https://ark.intel.com/content/www/us/en/ark/products/129939/intel-core-i5-8500-processor-9m-cache-up-to-4-10-ghz.html?ref=blog.ktz.me) | Ubuntu VM (via docker) | V5\_8 | 1.8x |
| [UHD 630 iGPU](https://ark.intel.com/content/www/us/en/ark/products/129939/intel-core-i5-8500-processor-9m-cache-up-to-4-10-ghz.html?ref=blog.ktz.me) | Windows 10 (QEMU guest) | V5\_8 | 1.9x |
| [UHD 630 iGPU](https://ark.intel.com/content/www/us/en/ark/products/129939/intel-core-i5-8500-processor-9m-cache-up-to-4-10-ghz.html?ref=blog.ktz.me) | Windows 10 (QEMU guest) | V5\_4 | 4.2x |
| [UHD 630 iGPU](https://ark.intel.com/content/www/us/en/ark/products/129939/intel-core-i5-8500-processor-9m-cache-up-to-4-10-ghz.html?ref=blog.ktz.me) | Proxmox Host via docker | NA | 10.2x |
| [NVIDIA GTX 1080Ti](https://www.evga.com/products/specs/gpu.aspx?pn=61e6d689-506e-45df-8202-b49614e9d54d&ref=blog.ktz.me) | Ubuntu Host via docker | NA | 17x |

As you can see, GVT-g really hurts performance.

When using `V5_8` mode which slices up the iGPU into two virtual GPUs, performance was approximately 82% slower than on bare metal. `V5_4` mode limits us to one virtual slice but performance there is still quite poor with a 58% reduction vs bare metal.

This also goes to show just how powerful hardware based circuitry (ASICs) can be. Quick Sync needs only around 10w to run a conversion at 10.2x versus the Nvidia GTX 1080ti at 180w for only 17x speed.

It's clear that Quick Sync is a beast in this space and is really the only logical choice for those building a system that is going to do any meaningful amount of media encoding with Media Servers like Plex or NVRs such as Blue Iris.

<h2 id="stability">Stability</h2>

Unfortunately this isn't a great story to tell either. The week or so where the system was running was filled with randomly hung systemd processes, kernel panics and general system instability.

It's hard to know what exactly the reason behind this was because often the server required a physical reset to sort itself out making reading logs or other diagnosis difficult.

What I can provide is anecdotal evidence though. If the Windows VM running Blue Iris was not running but the Linux VM with Plex was, things were stable. Once the Blue Iris load came into the equation within a few hours, the weirdness began.

I'd SSH into the Proxmox host because the WebUI had stopped responding and attempt to reboot the box. It would sit and spin its wheels for 30 minutes in a systemd service loop stating it was waiting for qemu processes to finish.

So in conclusion on the stability front, I'd rather have two physical boxes that just work than chasing shadows with `GVT-g`.

<h2 id="conclusion">Conclusion</h2>

You probably already read the TL;DR at the top so this won't surprise you too much. But the performance and stability of `GVT-g` were just too poor to rely on for an environment where stability is the name of the game.

Most often, I use the transcoding sync feature the night before going on a trip so performance isn't critically important but leaving anywhere from 58-82% performance on the table for those times feels silly.

One of the more interesting aspects of this test was how relatively poorly the 1080Ti performed per frame transcoded per watt compared with Quick Sync. At around 10W for Quick Sync (10.2x speed) under load vs 180W for the 1080Ti (17x speed) the iGPU is the clear winner here.

So what does this mean for your hardware moving forward I hear noone asking? Well, it's a fun hobby all of this stuff. Mucking about with hardware and servers etc.

However, there comes a point where you just need stuff to work. Reliably. Therefore I've gone back to a dedicated HP 290 slim for Blue Iris running Windows 10 and have moved all media apps and storage onto the Proxmox host itself for maximum performance. I keep a few things in a VM like Adguard Home and Home Assistant but I'm violating my own preferences of keeping the host clean in the name of making Quick Sync work as well as it possibly can.

The promise of GVT-g technically was very high. One box to rule them all. However in practice, it just didn't live up to expectations.
