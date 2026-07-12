---
title: "Factorio: Controlling imports from Space"
slug: factorio-controlling-imports-from-space
description: Only import what you need from space by reading the contents of your logistics network from a Roboport
customExcerpt: Only import what you need from space by reading the contents of your logistics network from a Roboport
publishedAt: 2026-04-10T19:25:39.000-04:00
updatedAt: 2026-05-07T07:21:16.000-04:00
featureImage: /content/images/2026/04/Screenshot-2026-04-10-at-18.38.42.png
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
ghostId: 69d97c1b32a26c0001d5d5ea
tags:
  - factorio
internalTags: []
primaryTag: factorio
featured: false
readingTime: 4
---

Interplanetary logistics are a fundamental component of Factorio Space Age. It is puzzling to me why this particular aspect of the game feels half finished in what is otherwise a masterpiece of a game.

Anyway, the problem at hand is this. I want to import items from one planet to another planet. Not an endless supply, though. Just the right amount. We can achieve this by using combinators to read the current number of items in the logistics network on a specific surface (planet) and comparing that with values we set in a constant combinator. The delta between those two values is what we want to import.

The first step is to hook up a Roboport with a wire (red in my case)

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-14.png" class="kg-image" alt="" loading="lazy" width="1000" height="682" srcset="/content/images/size/w600/2026/04/image-14.png 600w, /content/images/2026/04/image-14.png 1000w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Read the logistics network contents from a Roboport</span></figcaption></figure>

We need to configure the Roboport to `Read logistic network contents` . This is so that all the items in the logistics network that this Roboport belongs to are made available to the circuit network.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-15.png" class="kg-image" alt="" loading="lazy" width="1050" height="652" srcset="/content/images/size/w600/2026/04/image-15.png 600w, /content/images/size/w1000/2026/04/image-15.png 1000w, /content/images/2026/04/image-15.png 1050w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Set "Read logistic network contents"</span></figcaption></figure>

Now we configure an Arithmetic combinator to multiply everything from the input by -1 so we get a negative number and output it. Configure `INPUT: EACH * -1 / OUTPUT: EACH`.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-16.png" class="kg-image" alt="" loading="lazy" width="1342" height="728" srcset="/content/images/size/w600/2026/04/image-16.png 600w, /content/images/size/w1000/2026/04/image-16.png 1000w, /content/images/2026/04/image-16.png 1342w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Take each item in the logistics network and multiply by -1 to give us a negative number</span></figcaption></figure>

Now we hook up the Arithmetic combinator output to a Decider combinator input (I used a red wire in my example). Now hook up a Constant combinator configured with the numbers of items you want to import to the Decider combinator input (I used a green wire in my example).

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-17.png" class="kg-image" alt="" loading="lazy" width="1294" height="934" srcset="/content/images/size/w600/2026/04/image-17.png 600w, /content/images/size/w1000/2026/04/image-17.png 1000w, /content/images/2026/04/image-17.png 1294w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">The decider combinator (top) essentially compares Red (logistics) to Green (I want X)</span></figcaption></figure>

The constant combinator makes liberal use of logistics groups. These are such a great feature. Particularly if you're able to utilize `5x GROUP` to make sure you have a nice buffer of certain items in one place without having to keep separate groups for different use cases.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-18.png" class="kg-image" alt="" loading="lazy" width="672" height="1400" srcset="/content/images/size/w600/2026/04/image-18.png 600w, /content/images/2026/04/image-18.png 672w" decoding="async"><figcaption><span style="white-space: pre-wrap;">Logistics groups are very useful</span></figcaption></figure>

Now, we need to configure the Decider combinator to compare the Red inputs to the Green inputs and output the delta to send to space.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-19.png" class="kg-image" alt="" loading="lazy" width="1336" height="990" srcset="/content/images/size/w600/2026/04/image-19.png 600w, /content/images/size/w1000/2026/04/image-19.png 1000w, /content/images/2026/04/image-19.png 1336w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Before: We need to import 10k green transport belts</span></figcaption></figure>

We configure the Decider combinator `Conditions: EACH ≥ 1 - Outputs: EACH Input count`. This subtracts the red signals from the green signals, so that anything with a positive number gets imported (if present on a Space ship).

For example, note above that we have a -100 Blue Circuit signal. Below I have added 50k green transport belts into my logistics network, which makes for an easy comparison to see the combinator in action.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-20.png" class="kg-image" alt="" loading="lazy" width="1338" height="988" srcset="/content/images/size/w600/2026/04/image-20.png 600w, /content/images/size/w1000/2026/04/image-20.png 1000w, /content/images/2026/04/image-20.png 1338w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">After: We have a surplus of green transport belts so they are no longer an output (request)</span></figcaption></figure>

The last step to actually send these requests to space ships is to hook up the output from the Decider to the Cargo landing pad building and set `Set requests`.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-21.png" class="kg-image" alt="" loading="lazy" width="1588" height="862" srcset="/content/images/size/w600/2026/04/image-21.png 600w, /content/images/size/w1000/2026/04/image-21.png 1000w, /content/images/2026/04/image-21.png 1588w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Note "Controlled by circuit network"</span></figcaption></figure>

With this in place you will never over import a specific product from space again. I've found this really helped keep rockets on other planets available for other purposes instead of spamming ships full of the same items over and over and over. Especially in the early stages of space where your remote bases might be less capable.

Again though, I'm left wondering, why can't we just have interplanetary logistics networks? Make it an end game tech or something idk. But anyway, until we get that this will have to do.

<h3 id="bonus-tip-what-if-you-have-multiple-logistics-networks-on-one-surface">Bonus Tip: What if you have multiple logistics networks on one surface?</h3>

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-22.png" class="kg-image" alt="" loading="lazy" width="1622" height="824" srcset="/content/images/size/w600/2026/04/image-22.png 600w, /content/images/size/w1000/2026/04/image-22.png 1000w, /content/images/size/w1600/2026/04/image-22.png 1600w, /content/images/2026/04/image-22.png 1622w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Radars can "teleport" circuit signals from one radar to another on the same surface</span></figcaption></figure>

Use Radars to hook them up! The remote side Roboport is set to the same \`Read logistics network contents\` and then the red wire is hooked up to the Radar. Then we import the radar signal (on the red wire) to the input of the Arithmetic combinator like we did before.

<figure class="kg-card kg-image-card"><img src="/content/images/2026/04/image-23.png" class="kg-image" alt="" loading="lazy" width="1186" height="906" srcset="/content/images/size/w600/2026/04/image-23.png 600w, /content/images/size/w1000/2026/04/image-23.png 1000w, /content/images/2026/04/image-23.png 1186w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Happy Factories. Go Artemis II (this post published during reentry).
