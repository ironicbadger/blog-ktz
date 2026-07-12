---
title: "Awesomo Server - Build Log Entry #2"
slug: awesomo-server-build-log-entry-2
description: Things were getting a bit toasty in there. The watercooled Xeon E5 2690 v2 CPUs themselves were fine sitting at around 40c but the PCH (kind of like the Southbridge) and RAM were hitting 70c+ constantly.
customExcerpt: Things were getting a bit toasty in there. The watercooled Xeon E5 2690 v2 CPUs themselves were fine sitting at around 40c but the PCH (kind of like the Southbridge) and RAM were hitting 70c+ constantly.
publishedAt: 2019-08-07T22:21:38.000-04:00
updatedAt: 2026-05-07T07:22:23.000-04:00
featureImage: /content/images/2019/08/IMG_20190807_204809-2.jpg
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
ghostId: 6775c6279e78ea00017cbbef
tags:
  - hardware
  - linux
  - server
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: hardware
featured: false
readingTime: 4
---

In October of last year I built a new server. It was a bit of a rushed job to be quite honest as I'd just emigrated and was doing important stuff like buying furniture, cars and finding out just how expensive Whole Foods is. This entry details some much needed love and attention over the last few days that I've been able to bestow upon my workhorse.

I name my primary systems after South Park characters. Befittingly my primary Plex VM is named Cartman (as the VM is 'inside' awesomo). Get it? Good.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2019/08/image-18.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Things were getting a bit toasty</figcaption></figure>

As I said above I built the server in kind of a hurry and good enough had to do. However, things were getting a bit toasty in there. The watercooled Xeon E5 2690 v2 CPUs themselves were fine sitting at around 40c but the PCH (kind of like the Southbridge) and RAM were hitting 70c+ constantly. I only found this out this week when I decided to see if I could get IPMI working.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2019/08/image-21.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Hot enough to fry an egg? Let's not find out.</figcaption></figure>

After some back and forth on the serverbuilds.net discord server it looked like the culprit was a few things.

Firstly, my cable management job was really pretty terrible. Second, the fans I'd ordered for the middle fan wall weren't static pressure optimised. Third, turned out I'd ordered two ULN (Ultra Low Noise) Noctua fans for the two rear 80mm fans. Those things combined made for a serious heat build up.

This probably contributed to an SSD failure that also happened this week.

<figure class="kg-card kg-image-card kg-width-full kg-card-hascaption"><img src="/content/images/2019/08/image-22.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>This was the inside of awesomo before starting work</figcaption></figure>

As you can see above it was genuinely pretty terrible. Airflow blocked and disturbed everywhere you looked. I ordered some new fans and set to work cleaning up my mess.

<figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/08/IMG_20190806_133949.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/08/IMG_20190806_133949.jpg 600w, /content/images/size/w1000/2019/08/IMG_20190806_133949.jpg 1000w, /content/images/size/w1600/2019/08/IMG_20190806_133949.jpg 1600w, /content/images/size/w2400/2019/08/IMG_20190806_133949.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/08/IMG_20190806_135546.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/08/IMG_20190806_135546.jpg 600w, /content/images/size/w1000/2019/08/IMG_20190806_135546.jpg 1000w, /content/images/size/w1600/2019/08/IMG_20190806_135546.jpg 1600w, /content/images/size/w2400/2019/08/IMG_20190806_135546.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div></div><figcaption>Open heart surgery and custom sata power cables</figcaption></figure>

I did make some custom power cables for the sata drives at the front but the female connector tail terminated at the top of the case. I set about swapping it over to the bottom for a cleaner end result. I bought 2 packs (for 4 total) of [these](https://www.amazon.com/Cable-Matters-Pack-Power-Splitter/dp/B012BPLW08/ref=sr_1_8?keywords=startech+sata+power&qid=1565230185&s=gateway&sr=8-8&ref=blog.ktz.me) power cables to make them.

After about 10 hours worth of cable tying and tidying the end result looked *much* better, I think you'll agree.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2019/08/IMG_20190807_204809.jpg" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>I can sleep better tonight...</figcaption></figure>

I found space that I never knew existed. There are two SSDs (and a bunch of PSU cables) between the PSU and the right wall of the case plus a further 2.5" SSD on top of the PSU. The SATA power cable had 3 connectors, in case you were wondering. There's also a lot of space behind the USB / Power button area on the front right of the case but my SATA cables weren't long enough to reach there (top right of the pic above).

<figure class="kg-card kg-gallery-card kg-width-wide"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/08/IMG_20190807_204818-1.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/08/IMG_20190807_204818-1.jpg 600w, /content/images/size/w1000/2019/08/IMG_20190807_204818-1.jpg 1000w, /content/images/size/w1600/2019/08/IMG_20190807_204818-1.jpg 1600w, /content/images/size/w2400/2019/08/IMG_20190807_204818-1.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/08/IMG_20190807_204814.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/08/IMG_20190807_204814.jpg 600w, /content/images/size/w1000/2019/08/IMG_20190807_204814.jpg 1000w, /content/images/size/w1600/2019/08/IMG_20190807_204814.jpg 1600w, /content/images/size/w2400/2019/08/IMG_20190807_204814.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/08/IMG_20190807_204809-1.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/08/IMG_20190807_204809-1.jpg 600w, /content/images/size/w1000/2019/08/IMG_20190807_204809-1.jpg 1000w, /content/images/size/w1600/2019/08/IMG_20190807_204809-1.jpg 1600w, /content/images/size/w2400/2019/08/IMG_20190807_204809-1.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/08/IMG_20190807_204803.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/08/IMG_20190807_204803.jpg 600w, /content/images/size/w1000/2019/08/IMG_20190807_204803.jpg 1000w, /content/images/size/w1600/2019/08/IMG_20190807_204803.jpg 1600w, /content/images/size/w2400/2019/08/IMG_20190807_204803.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div></div></figure>

I also broke out a device I bought on Prime Day, the Corsair Commander Pro LED and Fan controller (visible in the first pic in the above gallery). It plugs into a USB header and give you direct control over up to 6 fans in software. Downside? It's Windows only. Upside? This is a virtualisation server so I just passed the USB device through and it worked fine. If the Windows VM isn't up the unit just runs off the last fan curve you configured until told otherwise. Nice!

<figure class="kg-card kg-image-card kg-width-full kg-card-hascaption"><img src="/content/images/2019/08/image-23.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Corsair Commander Pro for USB controllable fans! Windows only though :(</figcaption></figure>

Eagle eyed readers will notice I also disabled the 3 fans in the front of the hard drives. I found they actually *increase* temps inside the chassis. Madness, but truth.

Time for the acid test. What are the temps like after 6 hours of running and deliberately stressing the system?

<figure class="kg-card kg-image-card"><img src="/content/images/2019/08/image-24.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

So. Much. Better.

I'm extremely pleased with the outcome of all this work. I nearly gave up on the Rosewill case but am glad I listened to JDM\_WAAAT and bought the right fans for the case. Awesomo is now a happy chappy.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2019/08/image-19.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>We have a nice happy Awesomo now!</figcaption></figure>
