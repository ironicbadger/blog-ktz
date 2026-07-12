---
title: "Factorio: Controlling Space Ship collector filters via circuit logic"
slug: factorio-controlling-space-ship-collectors-filters-via-circuit-logic
description: Set Asteroid collector filters by reading the contents of a belt
customExcerpt: Set Asteroid collector filters by reading the contents of a belt
publishedAt: 2026-04-09T09:22:56.000-04:00
updatedAt: 2026-05-07T07:21:17.000-04:00
featureImage: /content/images/2026/04/Screenshot-2026-04-09-at-09.13.44.png
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
ghostId: 69d79f2132a26c0001d5d596
tags:
  - factorio
internalTags: []
primaryTag: factorio
featured: false
readingTime: 3
---

In Factorio Space Age building Space Ships is a core part of the game. Gathering space rocks to process into raw materials is the most fundamental part of ship building. But how do you stop your ship filling up with just one type of space rock chunk?

The solution involves a Space Age feature of reading belt contents.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-11.png" class="kg-image" alt="" loading="lazy" width="1246" height="758" srcset="/content/images/size/w600/2026/04/image-11.png 600w, /content/images/size/w1000/2026/04/image-11.png 1000w, /content/images/2026/04/image-11.png 1246w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Hook ups</span></figcaption></figure>

I design my ships typically with one big belt for all collectors to deposit their Asteroid chunks onto with no splits or other joins. This is because reading the belt contents only works for a single continuous belt sector. I could use circuits to sum up multiple sections but after a while this design constraint just becomes habit and you remove items with filtered inserters rather than splitters.

<div class="kg-card kg-callout-card kg-callout-card-blue"><div class="kg-callout-emoji">💡</div><div class="kg-callout-text">I use the mod <a href="https://mods.factorio.com/mod/circuit_visualizer?ref=blog.ktz.me" rel="noreferrer">Circuit Visualizer</a> to make it easier to see which circuit nodes hook up to what.</div></div>

The first step on our journey, assuming we've placed collectors and have them outputting onto a belt, is to connect a single segment of belt to the input of a Decider combinator. Red or green doesn't matter, just be consistent (I used red here). Set the belt to `Read belt contents - Hold (all belts)` and this will provide the contents of that belt as an output to the circuit network to be used for conditional logic.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/Screenshot-2026-04-09-at-09.18.02.png" class="kg-image" alt="" loading="lazy" width="434" height="348" decoding="async"><figcaption><span style="white-space: pre-wrap;">Constant combinators hooked up to green input of Decider</span></figcaption></figure>

In order to tell the Decider how many chunks of each type we want I used a Constant combinator. This Constant was hooked up to the Deciders green input.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/Screenshot-2026-04-09-at-09.18.10.png" class="kg-image" alt="" loading="lazy" width="790" height="932" srcset="/content/images/size/w600/2026/04/Screenshot-2026-04-09-at-09.18.10.png 600w, /content/images/2026/04/Screenshot-2026-04-09-at-09.18.10.png 790w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Constant combinator. How many? Of what chunk type?</span></figcaption></figure>

Next we want to configure the Decider combinator to `compare the number of chunks on the belt` vs `the number of chunks we'd like on the belt`.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-10.png" class="kg-image" alt="" loading="lazy" width="1552" height="998" srcset="/content/images/size/w600/2026/04/image-10.png 600w, /content/images/size/w1000/2026/04/image-10.png 1000w, /content/images/2026/04/image-10.png 1552w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">The decider decides which output signals are sent to the Asteroid collectors</span></figcaption></figure>

Now we can evaluate RED vs GREEN like so: `IF RED INPUT (chunks on belt) IS < GREEN INPUT (chunks we want) THEN OUTPUT CHUNK TYPE`. We can do this using the `EACH` operator represented by the yellow icon with 3 lines.

The Decider will only output a chunk signal if the conditional is TRUE for EACH chunk type.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-12.png" class="kg-image" alt="" loading="lazy" width="1598" height="874" srcset="/content/images/size/w600/2026/04/image-12.png 600w, /content/images/size/w1000/2026/04/image-12.png 1000w, /content/images/2026/04/image-12.png 1598w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">The green wire connects all Asteroid collectors together.</span></figcaption></figure>

Next, hook up the output of the Decider to all Asteroid collectors at once. The configure each collector with `SET FILTERS` to allow the circuit network to control them.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-13.png" class="kg-image" alt="" loading="lazy" width="1154" height="590" srcset="/content/images/size/w600/2026/04/image-13.png 600w, /content/images/size/w1000/2026/04/image-13.png 1000w, /content/images/2026/04/image-13.png 1154w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Notice that the collector is disabled because all requested chunks are present on the belts</span></figcaption></figure>

And there we have it. Each Asteroid collector will now only collect the chunk types required to fulfil the conditional logic
