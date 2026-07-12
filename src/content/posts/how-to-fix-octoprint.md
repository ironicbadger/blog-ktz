---
title: How to fix OctoPrint keeps running into communication errors and timeouts
slug: how-to-fix-octoprint
description: I run OctoPrint on a Raspberry Pi connected with a USB cable. If you are doing this you must ensure that Settings -> RPi [off] is set.
customExcerpt: I run OctoPrint on a Raspberry Pi connected with a USB cable. If you are doing this you must ensure that Settings -> RPi [off] is set.
publishedAt: 2019-07-21T00:05:47.000-04:00
updatedAt: 2026-05-07T07:22:48.000-04:00
featureImage: /content/images/2019/07/IMG_20190719_135342.jpg
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
ghostId: 6775c6279e78ea00017cbbed
tags:
  - 3d-printing
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: 3d-printing
featured: false
readingTime: 1
---

I ran into an annoying issue today that perplexed me for longer than I care to admit. The fix was also annoyingly simple and I'm documenting it here so that someone else hopefully doesn't fall foul of a lost afternoon to this as well.

I run OctoPrint on a Raspberry Pi connected with a USB cable. If you are doing this you must ensure that `Settings -> RPi [off]` is set. I guess I must have knocked this to `[on]` whilst tweaking my LiveZ value (which is the next menu item down).

<figure class="kg-card kg-image-card kg-width-full"><img src="/content/images/2019/07/IMG_20190721_000333.jpg" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

That's it, happy printing.
