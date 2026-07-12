---
title: X32 Rack Mixer PSU Replacement
slug: x32-rack-mixer-psu-replacement
description: I bought a used unit off of Reverb and after about 75 days the unit began exhibiting these symptoms in the video. Neither Reverb nor the seller cared any so I began the hunt for a fix.
customExcerpt: I bought a used unit off of Reverb and after about 75 days the unit began exhibiting these symptoms in the video. Neither Reverb nor the seller cared any so I began the hunt for a fix.
publishedAt: 2023-08-12T19:50:16.000-04:00
updatedAt: 2026-05-07T07:21:41.000-04:00
featureImage: /content/images/2023/08/mixerrack.jpg
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
ghostId: 6775c6279e78ea00017cbc37
tags:
  - electronics
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: electronics
featured: false
readingTime: 2
---

If you have a Behringer X32 Rack mixer that won't power on correctly and kind of just sits there blinking at you then you probably have a bad power supply.

<figure class="kg-card kg-embed-card kg-card-hascaption"><iframe width="200" height="113" src="https://www.youtube.com/embed/uziRQRM_D84?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="X32 Rack Won't Power Up" loading="lazy"></iframe><figcaption>Whomp whomp</figcaption></figure>

I bought a used X32 Rack mixer unit off of Reverb and after about 75 days the unit began exhibiting these symptoms in the video. Neither Reverb nor the seller cared any so I began the hunt for a fix.

The mixer itself is a $1600 unit brand new so it's worth trying to fix it. The power supply itself is a fairly easy repair with only 4 screws and about 6 connectors to remove - it legitmately took me about 20 mins to swap it out. Connecting and reconnecting the XLR cables in the back took longer than the repair.

<h2 id="what-to-buy">What to buy</h2>

You will need to buy the part number `SMPSU40` which is the X32 Rack power supply board.

I found mine via AudioLab of Georgia. I have been keeping an eye on Reverb, eBay and other places including AudioLab for about 6 months - stock is not easy to come by. You will likely have to back order this component but I wanted to confirm for you that [this part](https://www.audiolabga.com/data_html/56883.html?ref=blog.ktz.me) from AudioLab fits and works. Their part number is `A09-AWN00-00000`.

<h2 id="how-to-do-the-repair">How to do the repair</h2>

Please be careful here. This is a very dangerous repair if you're not sure what you're doing. This is an AC switching power supply with mains voltage. Do not proceed until you are *completely sure* that there is no risk to you.

The repair is stupid easy. Take the 6 black screws out to remove the top of the mixer. Next take a photo of the mixer before you touch anything just in case you need to refer back to it later. Then disconnect the 3 ribbon cables on the left side of the power supply board (front bottom right). Next, disconnect the power supply connector next to the copper coil loop.

The next bit is a little tricky and is where you'll remove the two mains AC wires which are blue and brown. The spade connectors have a little release on them if you slide back the plastic jacket and depress the release, they will pop right off.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2023/08/40046B34-19D2-4474-AAFC-0A8996EEF9C2_1_201_a.jpeg" class="kg-image" alt="" loading="lazy" width="2000" height="1500" srcset="/content/images/size/w600/2023/08/40046B34-19D2-4474-AAFC-0A8996EEF9C2_1_201_a.jpeg 600w, /content/images/size/w1000/2023/08/40046B34-19D2-4474-AAFC-0A8996EEF9C2_1_201_a.jpeg 1000w, /content/images/size/w1600/2023/08/40046B34-19D2-4474-AAFC-0A8996EEF9C2_1_201_a.jpeg 1600w, /content/images/size/w2400/2023/08/40046B34-19D2-4474-AAFC-0A8996EEF9C2_1_201_a.jpeg 2400w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption>Green is new, Yellow is the old PSU.</figcaption></figure>

You do not need to remove the 4 silver screws screwed into the power supply board. Instead, remove the 4 screws holding the metal carrier bracket into the mixer chassis.

Swap out the PSU board.

Reassembly is the reverse of disassembly. Take a moment to double check the connections you made vs that photo you took before you did anything and then it's time to test!

<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/bifh5GbndVg?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="X32 Rack Power Supply Fix!" loading="lazy"></iframe></figure>

Thanks for reading and good luck.
