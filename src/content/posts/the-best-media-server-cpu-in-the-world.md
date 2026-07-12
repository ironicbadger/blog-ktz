---
title: The Best Media Server CPU... in the world.
slug: the-best-media-server-cpu-in-the-world
description: After a solid 8 months of testing, I think we have a big enough sample size to draw some conclusions. The best media server CPU is...
customExcerpt: After a solid 8 months of testing, I think we have a big enough sample size to draw some conclusions. The best media server CPU is...
publishedAt: 2024-05-11T14:24:23.000-04:00
updatedAt: 2026-05-07T07:21:19.000-04:00
featureImage: /content/images/2024/05/Screenshot-2024-05-11-at-14.07.18.jpg
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
ghostId: 6775c6279e78ea00017cbc41
tags:
  - perfect-media-server
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: perfect-media-server
featured: false
readingTime: 11
---

After a solid [8 months of testing](https://github.com/ironicbadger/quicksync_calc?ref=blog.ktz.me), I think we have a big enough sample size to draw some conclusions. In this post I'll attempt to examine the state of the CPU market today, analyzing some prices on new and used gear, take a temperature of motherboard availability and really, actually try to ascertain which CPU is the current sweet spot for media servers in mid 2024.

Thank you to everyone who ran a test and submitted their results from the community. The full unadulterated results are available in this [Gist](https://gist.github.com/ironicbadger/5da9b321acbe6b6b53070437023b844d?ref=blog.ktz.me).

> Edit Dec 2025: A brand new interactive site for this information is now available at [https://quicksync.ktz.me](https://quicksync.ktz.me/?ref=blog.ktz.me).

I also need to thank my good friend [cptmorgan](https://github.com/cptmorgan-rh?ref=blog.ktz.me) on Github who helped write a significant chunk of the testing script. Also user [alicimo](https://github.com/Alicimo?ref=blog.ktz.me), who shared a wonderful visualization script which takes the input from the results gist of the original [benchmarking blog post](/i-need-your-help-with-intel-quick-sync-benchmarking/). Whilst not perfect, it gives us a nice idea of the spread across generations.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2024/05/image.png" class="kg-image" alt="" loading="lazy" width="2000" height="700" srcset="/content/images/size/w600/2024/05/image.png 600w, /content/images/size/w1000/2024/05/image.png 1000w, /content/images/size/w1600/2024/05/image.png 1600w, /content/images/size/w2400/2024/05/image.png 2400w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

As we can see, 7th gen or newer is where we see the frame rates and energy consumption start to really make sense especially when frames per watt is taken into consideration.

<h2 id="what-is-quicksync-and-why-does-it-matter">What is Quicksync? And why does it matter?</h2>

[Quick Sync](https://en.wikipedia.org/wiki/Intel_Quick_Sync_Video?ref=blog.ktz.me) (QSV) is Intel's hardware video encoder / decoder circuitry built-in to most CPUs from the last 5 years or so. In the Wikipedia article linked at the start of this paragraph (and in the image below), you can get a good idea of the various codecs each generation supports. Note that because this support is provided by physical hardware circuitry on the chip it is locked in and you get what you get - you cannot add the more modern and efficient AV1 codec to an 8th gen chip for example.

<figure class="kg-card kg-image-card"><img src="/content/images/2024/05/Pasted-image-20240502220122.png" class="kg-image" alt="" loading="lazy" width="2000" height="1761" srcset="/content/images/size/w600/2024/05/Pasted-image-20240502220122.png 600w, /content/images/size/w1000/2024/05/Pasted-image-20240502220122.png 1000w, /content/images/size/w1600/2024/05/Pasted-image-20240502220122.png 1600w, /content/images/2024/05/Pasted-image-20240502220122.png 2158w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

In short, Quick Sync matters because of it's incredible power efficiency per frame rendered. Take the results above and note in the "fps\_per\_watt" graph on the right how much energy a software encode uses for a 1080p h264 file. It's at least 2-3x that of the files encoded with hardware. 12th gen appears to be a particularly bad offender in this case with power draw of 60-80w during a software encode, vs a 10-20w load in hardware.

Couple this energy efficiency with the fact that QSV can often handle half a dozen or more encodes before clients notice buffering when hosting a media server like Jellyfin, and it's plain to see that if you can handle the minor loss in quality / artifacting you're probably going to want to have a system capable of a hardware encode if you can.

<h2 id="which-cpu">Which CPU?</h2>

Why did I back myself into this corner? Why did I pose a question to which the answer is a square and rigid "it depends"?

Let's start with the newest stuff. The latest and greatest. An Intel 13th gen i5 13600k. As I detail on [perfectmediaserver.com](https://perfectmediaserver.com/01-overview/alexs-example-builds/?ref=blog.ktz.me#__tabbed_1_1), this CPU is now sat at the heart of my media server.

This 13th gen chip is seriously powerful. It chomps through the CPU encode in 22 seconds, but uses 60w of power to do it. Meanwhile, the same file encoded with the QSV engine in hardware is completed in 14 seconds and uses barely 10w to do so. Things get a little more gnarly at the thick end with an HEVC 4k 10 bit encode, with this encode along taking over 2 minutes. You can see the progression between iGPU generations most clearly in this test.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2024/05/image-1.png" class="kg-image" alt="" loading="lazy" width="1612" height="980" srcset="/content/images/size/w600/2024/05/image-1.png 600w, /content/images/size/w1000/2024/05/image-1.png 1000w, /content/images/size/w1600/2024/05/image-1.png 1600w, /content/images/2024/05/image-1.png 1612w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

Notice the Arc Pro A40 GPU that snuck in there? This is an OEM Arc Pro GPU from Intel which a kind [podcast](https://selfhosted.show/?ref=blog.ktz.me) listener (IAmSpartacus) sold me. It's a monster! It makes short work of every single encode - with one major caveat. It uses a bunch of power (65w+ in my testing - plus a constant 10w additional base load to the system) to do it. The conclusion we can draw here is that if you want the utmost in performance and don't care about power bill, an Arc card is supreme.

What I found most fascinating during these tests was how little difference there is overall. You'd expect a CPU released in Q2 2018, the 6 core / 6 thread *i5-8500 @4.1ghz* to get completely annihilated by the *i5-13600k @5.1ghz* with 20 cores released in Q4 2022. Indeed in the CPU encode test, the 13th gen does win handsomely - it's more than twice as fast. However, hardware encodes are a different story though, so let's look at the iGPU circuit a little and compare.

The i5-8500 has HD630 graphics with a base clock of 350MHz, maxing out at 1.10GHz. The i5-13600k has UHD 770 graphics with a base clock of 300MHz, maxing to 1.50GHz. And remember, we already touched on the physical codec support differences in the chart above.

The HD630 starts to show its age in the `hevc_4k_10bit` test, being some 24% slower. This file type brings almost any of our iGPU graphics to their knees though, meanwhile the Arc GPU is just in a different league - but remember that comes at 6-10x the energy cost.

There's always an argument to be made that if a task is done more quickly that cumulatively it will save energy because the chip isn't spun up as long. Given the bursty nature of most of our media server workloads though, I'm not sure that this argument would be of great concern.

For most tasks an 8th gen or newer will be more than adequate. But there's no denying the overall thumping power of a 5 year newer chip in the 13th gen for generalised compute tasks and software encodes. And if you, like me, use this box as generalised container / VM box, you'll almost certainly be glad of the extra grunt.

Anecdotally, since performing the 8th -> 13th gen upgrade on my system (which includes a switch from ddr4 to ddr5 by the way) I've noticed significantly more "pep" to the system and almost everything I load via Jellyfin is instant, or certainly much faster than I'd come to expect. To the point where my lady wife even remarked "this upgrade you did, Jellyfin feels much faster now" - I'll take that all day long!

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2024/05/telegram-cloud-photo-size-4-5895652503314351707-y.jpg" class="kg-image" alt="" loading="lazy" width="1040" height="878" srcset="/content/images/size/w600/2024/05/telegram-cloud-photo-size-4-5895652503314351707-y.jpg 600w, /content/images/size/w1000/2024/05/telegram-cloud-photo-size-4-5895652503314351707-y.jpg 1000w, /content/images/2024/05/telegram-cloud-photo-size-4-5895652503314351707-y.jpg 1040w" decoding="async"><figcaption><span style="white-space: pre-wrap;">Pre and post 8th -&gt; 13th gen system upgrade</span></figcaption></figure>

You might be thinking that the 13th gen chip is faster, so it might use more power. Certainly I had hoped for some energy gains given the new performance/efficiency core layouts on the modern chips. But as you can see above, the 13th uses a hair more in the exact same system. Of course, the motherboard and RAM plays a part here too but the hardware in the box was otherwise identical.

<h2 id="modern-motherboards">Modern Motherboards</h2>

If we are OK accepting that anything newer than Coffee Lake (8th gen) is good enough for most media serving tasks, then we need to look at the rest of the ecosystem around these chips - motherboards, and RAM.

<h3 id="memory">Memory</h3>

DDR4 was with us for a long time and it's performance characteristics are well understood. 6th - 13th gen Intel chips used it and because of this long lifespan, the used market is very healthy for this stuff. For example, a pair of 32gb DDR4 (non-ECC) DIMMs on [Amazon today](https://amzn.to/3WBB59Q?ref=blog.ktz.me) are $128.

13th Gen Intel chips are also when DDR5 started to come of age and the memory I put into my latest motherboard upgrade was DDR5 ECC memory. There's no beating around the bush here - it's twice the price of DDR4. But certain 13th gen chips do support ECC memory at last, which is a nice thing to have in a server with ZFS.

<h3 id="motherboards">Motherboards</h3>

This is where things start to get much more murky. Used motherboard availability is very difficult to predict reliably for a long lived article such as this. But let's pull a couple of examples for posterity based on the market today, in May 2024.

An example motherboard for LGA1151 (8th gen) is the AsRock Rack [E3C246D4U](/asrock-rack-e3c246d4u-the-perfect-media-server-motherboard/) which can be found on ebay for around $200-300. That specific model is quite scarce, so even though you can pick up an i5 9500 for $65, you will have to do a lot of legwork to find a *used* board that will support it. Boards for Intel desktop class chips with IPMI are difficult enough to come by as it is when they are new, let alone 4-5 years old.

An example motherboard for LGA1700 (12/13th gen) is the [Supermicro X13SAE-F](https://amzn.to/4ag6bab?ref=blog.ktz.me). At nearly $500 this thing should poop unicorns and rainbows, alas it is merely a whelming motherboard. It has IPMI onboard, support for 192GB RAM and 3 m.2 slots, plus a frankly baffling single PCI (not PCIe) slot.

However, this motherboard does not support bifurcation of any of the PCIe slots. It only supports VGA out mirroring via the BMC video feed - so if you have this hooked up via HDMI you will sometimes only see a black screen via IPMI. And has the usual Supermicro fan control quirks if you use slow spinning Noctua fans as I do. There are plenty of SATA ports, 8 to be precise. You do get some nicities on a newer board like 2.5GBe ethernet, USB-C with a modern spec, and modern front panel connectors.

But otherwise it's a fairly unremarkable board for an eye watering price. Coupled with the DDR5 RAM prices on paper this is a tough build to recommend - despite the fact I literally just built one myself (I don't have to take my own advice OK?).

<h2 id="what-about-the-n100">What about the N100?</h2>

If all you're looking for is a very power efficient, small, and single-ish task system then this chip is quite interesting indeed.

We only have one sample in the results though, so bear that in mind. But, by all accounts this chip absolutely sips power (less than 6W total package power). As best I can tell from my research this chip is comprised solely of the efficiency cores from a 12th gen full-fat desktop CPU. However it is interesting because it has a modern implementation of QSV with the HD730 graphics built-in.

| Test | N100 | i5 9500 |
| --- | --- | --- |
| h264\_1080p\_cpu | 25 fps | 57 fps |
| QSV - h264\_1080p | 139 fps | 220 fps |
| QSV - h264\_4k | 41 fps | 58 fps |
| QSV - hevc\_8bit | 54 fps | 75 fps |
| QSV - hevc\_10bit | 15 fps | 19 fps |

When looking at these results you can clearly see that firstly, the N100 is pretty darned amazing for its power budget, but the extra grunt afforded by the more powerful i5 chip is undeniable. You might be saying to yourself "yes, but at what (energy) cost?". The i5 uses about double the energy here but when we are talking about 6w vs 12w I don't know that it matters terribly. Sure, if the difference was 100w that might be add up. But the savings you'll make over a CPUs life whilst its encoding are basically wiped out if you go out all afternoon, one time, and leave the air conditioning on. In my opinion, it doesn't make sense to split hairs over numbers this small really.

Let's also consider the downsides though. Media servers often do a lot more than just a single task running a number of "media containers" and sometimes other stuff too - and forget about serious virtualization on this chip. Yes, technically it supports PCI passthrough and has the necessary extensions to actually support running a VM properly but it's going to lack any serious grunt to do any serious work.

It's a chip designed with mini PCs and small, low-energy form factors in mind. Most typical media servers have at least a handful of hard drives attached. Motherboards with half a dozen SATA slots, a PCIe slot or two, and any meaningful amount of I/O are hard - if not impossible - to come by. See this video by Wolfgang to see what I'm talking about.

<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/-DSTOUOhlc0?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" title="Asrock N100DC-ITX –&nbsp;Almost Perfect! But..." loading="lazy"></iframe></figure>

Can a N100 chip function as your primary media server? Technically, yes. What if it's your ONLY server in the house though? I'd probably still suggest a bigger, fuller, fatter desktop class chip. Which, at base idle load, will consume only a fraction more power and yet give you immeasurably more headroom for other tasks you might want to do in future.

Say, for example, you suddenly decide you want to self-host [Immich](https://immich.app/?ref=blog.ktz.me) (a self-hosted Google photos alternative) and want to chew through your 20 years of photos with 100k thumbnails to generate? That took me 4 days on a 48 thread EPYC CPU, I can only imagine how long it would have taken an N100. Spend the extra power and monetary budget, you'll probably be glad you did.

<h1 id="hey-what-about-sff-pcs">Hey, what about SFF PCs?</h1>

It's true, that these small computers are well worth a look. They can often be found on the second hand market for well under $200 with 8th gen or newer CPUs under the hood.

<figure class="kg-card kg-image-card"><img src="/content/images/2024/05/Screenshot-2024-05-11-at-20.27.54.png" class="kg-image" alt="" loading="lazy" width="1410" height="790" srcset="/content/images/size/w600/2024/05/Screenshot-2024-05-11-at-20.27.54.png 600w, /content/images/size/w1000/2024/05/Screenshot-2024-05-11-at-20.27.54.png 1000w, /content/images/2024/05/Screenshot-2024-05-11-at-20.27.54.png 1410w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

These systems come off lease in huge volumes, and you'll often see large discounts as spikes in supply exceed demand. But their performance is what makes them worth your time to investigate.

During the last few years they have been the node of choice for those looking for a general purpose compute box. Many of us tired of the Raspberry Pi scalping and for about the same price you were able to acquire a full x86 system, with upgradable RAM and SATA ports and often an m.2 slot as well.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2024/05/Screenshot-2024-05-11-at-20.30.59.png" class="kg-image" alt="" loading="lazy" width="1200" height="1136" srcset="/content/images/size/w600/2024/05/Screenshot-2024-05-11-at-20.30.59.png 600w, /content/images/size/w1000/2024/05/Screenshot-2024-05-11-at-20.30.59.png 1000w, /content/images/2024/05/Screenshot-2024-05-11-at-20.30.59.png 1200w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">From 2022, an i5-6600T system that has been a very capable Proxmox node in my homelab direct from dellrefurbished.com</span></figcaption></figure>

A typical spec sheet for these systems often includes the `T` variant of a chip. These chips which share characteristics with the full fat chip with which they share a model number however they are capped at a much lower TDP. There are quite a few `T` variant chips in the [results gist](https://gist.github.com/ironicbadger/5da9b321acbe6b6b53070437023b844d?ref=blog.ktz.me) for you to take a look at. They are very capable if you know their limitations going in.

This means you can easily throw one of these in a [3d printed](https://www.youtube.com/watch?v=qWG9V1ve-YU&ref=blog.ktz.me) rack mount and have a dedicated QSV capable box which absolutely sips power. Indeed, the i5-6600T based system above pulls about 7w at base idle running half a dozen networking services containers and a Home Assistant VM. Seven watts!

We're digressing a little here but if you're looking to build out a homelab, grab 3 and put them in a Proxmox cluster or learn Kubernetes. For the price of just a modern CPU, you can have 3 entire systems and embrace QSV into your life.

<h1 id="conclusion">Conclusion</h1>

So where does this leave us? You might find this month that 11th gen is where the sweet spot of price / performance is given a specific auction on ebay or a newegg sale. Next month it might be 8th gen again. If you want DDR5, 13th gen is your best bet. It really is difficult to recommend just one generation to aim at because as we discussed earlier, there's not a huge amount in it performance wise either. So your primary decision factors will most likely be availability, followed by cost, followed by features.

Note that newer chips will have support for newer codecs (like the up and coming AV1). These codecs cannot be retrofitted to existing chips, unless you decide to keep your old CPU and throw in an Arc GPU instead. A totally valid option if you have the PCIe lanes to do so on an older system.

You don't have to buy "server grade" or "workstation grade" motherboards or parts. You could very well get a nice consumer grade motherboard, a PiKVM and replicate a lot of the onboard IPMI BMC functionalities for a fraction of the cost.

So there we are. It's up to you to enjoy the hunt. The thrill of the chase. Find some good used deals or sales and enjoy building yourself a special snowflake of a system!
