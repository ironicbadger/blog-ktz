---
title: ASRock Rack E3C246D4U - The Perfect Media Server Motherboard?
slug: asrock-rack-e3c246d4u-the-perfect-media-server-motherboard
description: The board only arrived today but I've gotten it working in a couple of hours exactly the way I wanted. It really is about as close to perfect as we're going to get in this space. Should you buy one? Yes, if you need it - you should!
customExcerpt: The board only arrived today but I've gotten it working in a couple of hours exactly the way I wanted. It really is about as close to perfect as we're going to get in this space. Should you buy one? Yes, if you need it - you should!
publishedAt: 2021-08-28T01:05:21.000-04:00
updatedAt: 2026-05-07T07:21:53.000-04:00
featureImage: /content/images/2021/08/7F8A2179-1.jpg
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
ghostId: 6775c6279e78ea00017cbc24
tags:
  - technical
  - perfect-media-server
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 6
---

For many years I've been searching for a spiritual successor to the ultimately doomed [Intel C2000](https://www.servethehome.com/intel-atom-c2000-series-bug-quiet/?ref=blog.ktz.me) line of low power media server motherboards.  The board in question is the [ASRock Rack E3C246D4U](https://www.asrockrack.com/general/productdetail.asp?Model=E3C246D4U&ref=blog.ktz.me). What makes it so perfect? That's what I'll attempt to discuss in this post.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/08/image-1.png" class="kg-image" alt="" loading="lazy" width="1200" height="1000" srcset="/content/images/size/w600/2021/08/image-1.png 600w, /content/images/size/w1000/2021/08/image-1.png 1000w, /content/images/2021/08/image-1.png 1200w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>ASRock Rack E3C246D4U - A mATX media server powerhouse</figcaption></figure>

<h2 id="memory-support">Memory Support</h2>

First, the board will take up to 128GB of DDR4 RAM - both ECC and and non-ECC memory is supported depending on your CPU choice. 4x32GB DDR4 RAM sticks will cost you a mere ~$600, but the point is you can do it. Supporting this much memory gives me a huge amount of confidence that this board will last as long as I need it to and run as many containers or VMs as I can dream up.

Note that not all CPUs that this board is compatible with will support that much RAM so make sure to check on [Intel's ARK](https://ark.intel.com/content/www/us/en/ark.html?ref=blog.ktz.me) what your CPU will support. A tasty little number might be the i3 8100 CPU which supports ECC and has Quick Sync video encoding built-in.

<h2 id="board-layout">Board Layout</h2>

Next let's take a look at the layout of the board itself. It's got a single M.2 NVME/SATA (beware SATA mode is shared with the SATA\_0 port) slot and 3 PCI-E expansion slots - one of which is suitable for a GPU and that could be useful if you intend to use this board for PCI passthrough purposes.

<figure class="kg-card kg-image-card"><img src="/content/images/2021/08/image.png" class="kg-image" alt="" loading="lazy" width="982" height="434" srcset="/content/images/size/w600/2021/08/image.png 600w, /content/images/2021/08/image.png 982w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

The board has *8* - count 'em - on-board SATA ports. Media servers often have a lot of hard drives so more SATA ports = more better in my opinion.

Commonly, boards that ship with 8 ports have 6 on one SATA controller and 2 on another. This can be useful for passthrough purposes as they'll often be in different IOMMU groups but as we can see from the schematic in the motherboard's manual the 8 ports are all hanging directly off the Intel C246 chipset. If this matters to you it's easily remedied with an inexpensive PCI-E SATA card but this uses up a precious expansion slot so factor this in when designing your system.

<h2 id="pcie-bifurcation">PCIe Bifurcation</h2>

The board only has 1 M.2 NVME slot, but to work around that I use the [Asus Hyper M.2 X16 card](https://amzn.to/3gG5e28?ref=blog.ktz.me). This PCIe card supports 4 NVME M.2 drives and costs in the $50-75 range on a good day.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-9.png" class="kg-image" alt="" loading="lazy" width="559" height="538" decoding="async"><figcaption><a href="https://amzn.to/3gG5e28?ref=blog.ktz.me">Asus Hyper M.2 X16 card</a></figcaption></figure>

In order for this card to work properly we need the ability to split, or *bifurcate*, a single PCIe slot into multiple. Unfortunately, the board only support `x8x4x4` which is effectively the same as splitting the single slot in 3, not 4. This means that that we can only use 3 of the 4 M.2 slots on the Asus card - the `M.2(Socket3)_2` slot is the one that doesn't work. Combined with the M.2 slot on the board itself, this gives a total capability of 4 NVME drives.

To enable the feature load up the BIOS and change `Advanced -> Chipset Configuration -> PCIe6/PCIe4 Link Width` to `X8X4X4`.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-8.png" class="kg-image" alt="" loading="lazy" width="800" height="600" srcset="/content/images/size/w600/2021/08/image-8.png 600w, /content/images/2021/08/image-8.png 800w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption>Enabled bifurcation in the BIOS</figcaption></figure>

Note that this will *only work* on the top PCIe slot. This is due to physical architecture limitations of the C246 platform.

<h2 id="ipmi-igpu-working-concurrently">IPMI + iGPU working concurrently</h2>

This particular motherboard will spend its life on the other side of the Atlantic ocean from me as a remote backup server at a parents house. Therefore it's absolutely critical that it has [IPMI](https://en.wikipedia.org/wiki/Intelligent_Platform_Management_Interface?ref=blog.ktz.me). This allows remote power control, remote console viewing and if it comes to it operating system reinstallation over a network.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/08/image-7.png" class="kg-image" alt="" loading="lazy" width="2000" height="1248" srcset="/content/images/size/w600/2021/08/image-7.png 600w, /content/images/size/w1000/2021/08/image-7.png 1000w, /content/images/size/w1600/2021/08/image-7.png 1600w, /content/images/size/w2400/2021/08/image-7.png 2400w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>An HTML5 based IPMI interface, NO MORE JAVA!!</figcaption></figure>

However, it can be tricky to find a motherboard which supports IPMI and allows the iGPU to be active at the same time. The iGPU is important because this is where Intels Quick Sync lives - a highly performant hardware encoding platform that uses almost no energy whilst transcoding video.

Indeed, it was tricky to get it working on this motherboard. To start with I installed Proxmox and attempted to verify the iGPU was working using `intel_gpu_top`. However I was going round in circles with the following error `intel_gpu_top Failed to detect engines! (No such file or directory) (Kernel 4.16 or newer is required for i915 PMU support.)`.

That is until I found the following post buried *deep* within a thread on the Unraid forums. Here is the text for posterity:

> I purchased the ASRock Rack E3C246D4U and there is a way to enable the iGPU without installing the beta BIOS. I'm currently running P2.30 with iGPU enabled.  
> There is a key combination you need to press when booting your system. After powering on the boot splash screen will display the ASRock Rack image and the message “Updating FRU system devices”. When you see "Updating FRU system devices" press ctrl+alt+F3 and it will load the BIOS menu. In BIOS menu, you will see an additional page labeled IntelRC Chipset. Select System Agent (SA) Configuration, then Graphics Configuration, and then Enable IGPU Multi-Monitor.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://forums.unraid.net/topic/88024-intel-socket-1151-motherboards-with-ipmi-and-support-for-igpu/?do=findComment&amp;comment=941544&amp;ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Intel Socket 1151 Motherboards with IPMI AND Support for iGPU</div><div class="kg-bookmark-description"></div><div class="kg-bookmark-metadata"><span class="kg-bookmark-author">Unraid</span><span class="kg-bookmark-publisher">Hoopster</span></div></div><div class="kg-bookmark-thumbnail"></div></a></figure>

The key combo unlocks a whole second, secret menu and unearths *dozens and dozens* of options that aren't normally exposed.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-2.png" class="kg-image" alt="" loading="lazy" width="420" height="356" decoding="async"><figcaption>Use IPMI to get into the secret BIOS menu</figcaption></figure>

Once you're in the secret menu look for `IntelRC Chipset -> Graphics Configuration` and set it up as below.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-3.png" class="kg-image" alt="" loading="lazy" width="800" height="600" srcset="/content/images/size/w600/2021/08/image-3.png 600w, /content/images/2021/08/image-3.png 800w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption>iGPU Multi-Monitor = Enabled</figcaption></figure>

Once this is done you should be able to connect to the IPMI interface and view the console *as well as* use the iGPU Quick Sync features for something like Plex! This is the holy grail!!

Note that all my testing was performed using Proxmox v7 - as the Unraid thread linked above should alert you, your mileage may vary on other OS's.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-6.png" class="kg-image" alt="" loading="lazy" width="1560" height="416" srcset="/content/images/size/w600/2021/08/image-6.png 600w, /content/images/size/w1000/2021/08/image-6.png 1000w, /content/images/2021/08/image-6.png 1560w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption>Hardware acceleration as monitored with <code>intel_gpu_top</code></figcaption></figure>

<h2 id="pricing-availability">Pricing + Availability</h2>

At the time of writing this board costs $260 from Newegg. A year ago I would have considered this too expensive but a year+ of hardware shortages has me re-evaluating what I will pay for a board that is in stock.

I've put an i5 8500 CPU into my board but the [supported CPU list](https://www.asrockrack.com/general/productdetail.asp?Model=E3C246D4U&ref=blog.ktz.me#CPU) is long. The C246's sister, the older C236 based board has a similar feature set but supports fewer CPUs.

<h2 id="conclusion">Conclusion</h2>

This board ticks every single box except one. If it had HDMI out it would be the perfect board for this use case. ASRock Rack make the `C246 WS` workstation board which has more SATA ports, an HDMI out and for some reason a 20+ year old PCI port. It's an ATX size which might not suit as many chassis's as this mATX board.

The board only arrived today but I've gotten it working in a couple of hours exactly the way I wanted. It really is about as close to perfect as we're going to get in this space. Should you buy one? Yes, if you need it - you should!

The lack of the HDMI port is about the only downside to an otherwise truly excellent offering from ASRock Rack. Unfortunately, it's out of stock on Amazon at the moment but here's an [affiliate link](https://amzn.to/3jlGuxV?ref=blog.ktz.me) anyway.

For the software side of things check out my other site at [https://perfectmediaserver.com](https://perfectmediaserver.com/?ref=blog.ktz.me) for ways to get started building your own Perfect Media Server. And if you like this kind of thing, I have a podcast - https://selfhosted.show - as well. See you there!
