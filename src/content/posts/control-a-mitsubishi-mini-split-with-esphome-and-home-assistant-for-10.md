---
title: Control a Mitsubishi mini-split with ESPHome and Home Assistant for $10
slug: control-a-mitsubishi-mini-split-with-esphome-and-home-assistant-for-10
description: Fully open hardware and software to control a proprietary appliance? Yes please.
customExcerpt: Fully open hardware and software to control a proprietary appliance? Yes please.
publishedAt: 2026-05-26T21:49:50.000-04:00
updatedAt: 2026-05-26T21:49:50.000-04:00
featureImage: null
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
ghostId: 67ec066a5cf9d20001462bb1
tags: []
internalTags: []
primaryTag: null
featured: false
readingTime: 3
---

I recently had a Mitsubishi mini-split air conditioner installed as part of an attic conversion project. The device was, according to the installer, only controllable via the IR remote. And that just won't do.

So in today's post I'm going to detail how I used an ESP32 running ESPHome to achieve bi-directional control of the Mitsubishi units using the CN105 control port on the mainboard of the head unit.

<h2 id="what-to-expect">What to expect</h2>

These units are not cheap. So please only do this if you are comfortable. I am not a lawyer so please apply your own risk disclaimers for damage to property and yourself in case of screw ups. Turn off the power to the units before opening anything up, go slow and take your time. It's not a difficult install and should be an easy afternoon project for most DIY'ers.

The hardware install can be completed in under 10 minutes. The first time will likely take a bit longer as the plastic housings of the units can be a bit fiddly to free from the clips. I cover this is more detail in the video.

The software side might trip a few folks up the first time as there are a few moving parts. I assume for the purposes of this post that you have a functional Home Assistant installation, and a functional ESPHome installation atop it.

<h2 id="parts">Parts</h2>

To complete this project you will need:

| Item | Price | Purpose |
| --- | --- | --- |
| [ESP32](https://amzn.to/4jhNZ5d?ref=blog.ktz.me) | $5 | The brains of the operation |
| [Connector PAP-05V-S](https://amzn.to/42mQUDT?ref=blog.ktz.me) | $7 | Connect ESP32 to CN105 port |

> Note that I have linked to multi-packs of ESP32s and of the connectors too, you might be able to find these things cheaper elsewhere but regardless it's still a low cost project.  
>   
> Also note that these links are affiliate links to support my work.

<h2 id="unit-disassembly">Unit disassembly</h2>

The unit I have is the `MSZ-GS09NA`, though I have found that the process seems broadly the same across the units in NA I have come across, your mileage may vary.

Begin by turning off power at the breaker, and removing the vanes of the unit. There are two plastic tabs that slide and lock the vanes in position.

With the vanes removed, look for two small plastic screw covers and remove them and their associated screws.

The centre of the unit will have a small screwless retaining clip, give it a sharp tug in the middle towards you and free the housing pulling it straight off the front of the unit. It does not pivot (like the filter housings do).

Once the housing is removed look for the grey mainboard cover on the right of the unit and locate the red coloured CN105 port. We'll come back to this later.

<h2 id="esp-configuration">ESP configuration</h2>

This process is not yet fully written up as I got distracted but the code is below so reach out if you get stuck

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://gist.github.com/ironicbadger/eebd34e6392219dcff98e0d1ffdfa52a?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">esphome-mitsubishi.yaml</div><div class="kg-bookmark-description">GitHub Gist: instantly share code, notes, and snippets.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="/content/images/icon/pinned-octocat-093da3e6fa40-2.svg" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">Gist</span><span class="kg-bookmark-publisher">262588213843476</span></div></div><div class="kg-bookmark-thumbnail"><img src="/content/images/thumbnail/gist-og-image-54fd7dc0713e.png" alt="" onerror="this.style.display = 'none'" loading="lazy" decoding="async"></div></a></figure>

<figure class="kg-card kg-image-card"><img src="/content/images/2025/06/image.png" class="kg-image" alt="" loading="lazy" width="1560" height="968" srcset="/content/images/size/w600/2025/06/image.png 600w, /content/images/size/w1000/2025/06/image.png 1000w, /content/images/2025/06/image.png 1560w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

<figure class="kg-card kg-image-card"><img src="/content/images/2025/06/image-1.png" class="kg-image" alt="" loading="lazy" width="1444" height="968" srcset="/content/images/size/w600/2025/06/image-1.png 600w, /content/images/size/w1000/2025/06/image-1.png 1000w, /content/images/2025/06/image-1.png 1444w" sizes="(min-width: 720px) 720px" decoding="async"></figure>
