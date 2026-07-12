---
title: "Factorio: Recycler Belt Stacking"
slug: factorio-recycler-belt-stacking
description: Maximised Recycler efficiency by using Stack Inserters and the Circuit Network
customExcerpt: Maximised Recycler efficiency by using Stack Inserters and the Circuit Network
publishedAt: 2026-04-08T19:56:20.000-04:00
updatedAt: 2026-05-07T07:21:18.000-04:00
featureImage: /content/images/2026/04/Screenshot-2026-04-08-at-18.28.28.png
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
ghostId: 69d6d84032a26c0001d5d517
tags:
  - factorio
internalTags: []
primaryTag: factorio
featured: false
readingTime: 4
---

Circuit logic in Factorio is pretty annoying to deal with, tbh. I really wish there was a way to deterministically configure circuits with expressions. Alas, here we are.

In this post, I’ll walk through a solution to using a recycler in [Factorio](https://www.factorio.com/?ref=blog.ktz.me) with a stack inserter without it jamming. There are definitely other approaches, but this is the one that worked for me.

There's a blueprint string at the end if you'd like it.

<h2 id="recycling-junk">Recycling Junk</h2>

Recyclers are unlocked on Fulgora and although their primary use is for recycling Scrap into the 12 output products, this is not their only use. We can also use Recyclers to upcycle items [quality](https://wiki.factorio.com/Quality?ref=blog.ktz.me).

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image.png" class="kg-image" alt="" loading="lazy" width="2000" height="1580" srcset="/content/images/size/w600/2026/04/image.png 600w, /content/images/size/w1000/2026/04/image.png 1000w, /content/images/size/w1600/2026/04/image.png 1600w, /content/images/size/w2400/2026/04/image.png 2400w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">The standard scrap recycling recipe in Factorio</span></figcaption></figure>

Quality brings 5 tiers of items to the game, each with increasingly powerful stats. Thus, even a simple Scrap recycling recipe can potentially have 60 product possibilities. Upcycling only excerbates the number of possible output products.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/Screenshot-2026-04-08-at-18.28.42.png" class="kg-image" alt="" loading="lazy" width="1204" height="944" srcset="/content/images/size/w600/2026/04/Screenshot-2026-04-08-at-18.28.42.png 600w, /content/images/size/w1000/2026/04/Screenshot-2026-04-08-at-18.28.42.png 1000w, /content/images/2026/04/Screenshot-2026-04-08-at-18.28.42.png 1204w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">A simple quality upcycling example</span></figcaption></figure>

This is a problem for stack inserters, which only swing when they have a full stack of 16 items. If a machine is outputting just 1 or 2 of something, the inserter won’t clear its output until it reaches 16 - or as we sometimes refer to it, it will *jam*. If you’re dealing with mixed outputs or qualities and not using filters, you’re going to have a bad time.

So we need a way to buffer items until there are 16 of a kind, and dynamically set the inserter’s filters so it only picks up items that have reached that threshold.

<h2 id="circuit-city">Circuit City</h2>

To make this next section easier to visualise I'm using the mod \[Circuit Visualizer\]([https://mods.factorio.com/mod/circuit\_visualizer](https://mods.factorio.com/mod/circuit_visualizer?ref=blog.ktz.me)).

First, we need a way to buffer items until we have a full stack of them. For this, we use chests. Place one at the output of your Recycler.

Next, we must count the items in the chests. For this, we use an arithmetic combinator and red wires linking every chest to the combinators input.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-1.png" class="kg-image" alt="" loading="lazy" width="1774" height="1302" srcset="/content/images/size/w600/2026/04/image-1.png 600w, /content/images/size/w1000/2026/04/image-1.png 1000w, /content/images/size/w1600/2026/04/image-1.png 1600w, /content/images/2026/04/image-1.png 1774w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Hook up a red wire to every chest and connect it to the input of the Arithmetic combinator</span></figcaption></figure>

Configure the Arithmetic combinator to output a signal of value 1 for each item present in the chests. Conditions should be `EACH > 0` and Outputs `EACH 1`.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-2.png" class="kg-image" alt="" loading="lazy" width="1776" height="1062" srcset="/content/images/size/w600/2026/04/image-2.png 600w, /content/images/size/w1000/2026/04/image-2.png 1000w, /content/images/size/w1600/2026/04/image-2.png 1600w, /content/images/2026/04/image-2.png 1776w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Arithmetic combinator configuration.</span></figcaption></figure>

We can think of the Arithmetic combinator like an *if* statement. If an item is present in any quantity greater than 0, then output a signal via the combinators output.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-3.png" class="kg-image" alt="" loading="lazy" width="662" height="628" srcset="/content/images/size/w600/2026/04/image-3.png 600w, /content/images/2026/04/image-3.png 662w" decoding="async"><figcaption><span style="white-space: pre-wrap;">Connecting the Arithmetic output to the Deciders input via a Green Wire</span></figcaption></figure>

Now hook up the output of the Arithmetic combinator using a green wire (colour is important) the input of a Decider combinator.

We must also hook up every Stack Inserter via a red wire to the output of the Decider.

Configure the Decider like so: `INPUT -> EACH - 16` / `OUTPUT EACH`.

<figure class="kg-card kg-image-card"><img src="/content/images/2026/04/image-4.png" class="kg-image" alt="" loading="lazy" width="1774" height="956" srcset="/content/images/size/w600/2026/04/image-4.png 600w, /content/images/size/w1000/2026/04/image-4.png 1000w, /content/images/size/w1600/2026/04/image-4.png 1600w, /content/images/2026/04/image-4.png 1774w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

The job of the decider combinator is to subtract 16 from every signal that comes in thus creating an index of available items to filter. By sending this signal out as -15 we can then compare the contents of the chest to this value and only once it is 16+ (a full load) does the Stack inserters filter become set.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-7.png" class="kg-image" alt="" loading="lazy" width="1178" height="622" srcset="/content/images/size/w600/2026/04/image-7.png 600w, /content/images/size/w1000/2026/04/image-7.png 1000w, /content/images/2026/04/image-7.png 1178w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">The Stack Inserter should be configured like so</span></figcaption></figure>

The final piece here is hook up a green wire from the chests to each Stack inserter, one by one. Then configure the Stack Inserter to `ENABLE/DISABLE when ANYTHING > 2` and `SET FILTERS` is checked. The Stack Inserter reads the filters from the circuit network. Do not link these down the line as you have the chests or inserters previously.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/image-5.png" class="kg-image" alt="" loading="lazy" width="2000" height="1232" srcset="/content/images/size/w600/2026/04/image-5.png 600w, /content/images/size/w1000/2026/04/image-5.png 1000w, /content/images/size/w1600/2026/04/image-5.png 1600w, /content/images/2026/04/image-5.png 2140w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><span style="white-space: pre-wrap;">Hook up a single green wire connecting the chest to the Stack Inserter</span></figcaption></figure>

<h2 id="sit-back-and-relax">Sit back, and relax</h2>

Now sit back and watch the fruits of your hard work.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2026/04/recycler-magnified.gif" class="kg-image" alt="" loading="lazy" width="640" height="360" srcset="/content/images/2026/04/recycler-magnified.gif 640w" decoding="async"><figcaption><span style="white-space: pre-wrap;">The final result</span></figcaption></figure>

When the chest contains 17 of something then it's OK to swing. The chest contains multiple tiers of quality items and scales as far as I have been able to test to infinite number of items.

The only real downside is that this won't work in space because you can't place chests there.

Here's a blueprint string for you to try it out yourself - I'm in the blueprint sandboxes mod for all of these screenshots.

```
0eNrlWNuSoyoU/ReecUrwEk3VnB/pSlmopEONogcx56S6/PfZqNF0Yroxvs08RTew1mbti5APlBYtr5WQGu0/kMgq2aD92wdqxLtkhbFJVnK0R4pnl6zgCnUYCZnz/9GedHhhom5VWjlaMdnUldJOygt9s4h2B4y41EILPlD1L5dEtmUK8HuCv0TCqK4aWFxJwwmAjkd2PwKMLmgfBj8CYMoFODvMiIyLdwR0A4FvQ+BNBI1m2S9HyIYrDSNL0OFTaH8B2p+ghTwKCUNOduLNstfBZ+jriqThWgv53piZipfVmSctjBXgIs8ToXkJQ0dWNByjwTwEamSuC9ZokTkpMzvKqtbkDnFdjMoqNxOYdgrOeqemTDl0C7sJpt0wJfSp5AY2q8pUSKarZb3cKdadIZdaVUWS8hM7C1gB02aoBIbzfnm/1aNQjU7mfNWX2lCfhdItWOag9TMczrKTyduGGxiDBdHstxpiVNVcscEx5MDSqtV1uxq8WxIlnObmPBM5V98pQr5TZMS5k+P27e1ldcC3mqnetz36B5niHrS4byPWePUl6XMqOaqqTIQErDEbTRItCLbbUM87m3qONhCENgTxSw3jAZrQBWzi4ocWvgTrj4Lc9SAo4aEfQDBFftPm/4UomvYDNd8W3PH6Fj9MhZkSAncGTyp1GZbObwDZ7xLtXePu4gh5OkKfjngmPQ5LCpA18rpfyLtcXplQWSt0wiVLCw4aadVC57yapzp7oQcxedEnaNVDZVwbEH0su5kOmnsyNW3jCYy1Db+3PapEb1TivPjiu0JuJVqC8lYXjBuvqkjib2CwKkkSbCj6yIohfKnqI7uq362q+vgPrPpofT5HT/I5fqmBRH9XA6Huhpq0qhh6fzVoakjGJ3Fw4zG1H5Cvh9qbtP58pB2THOwFf+cyZ5Byd4r9NIqNhz64PVXqOv9o7jqPntMVGeROtR5bqeLZJrobfpPodENb3RErZ4MNDK4VQ7ieIXrKsHQHo+sPnJPylgzrT5zubh3D3NLStrDsaDtqA+25a+6o5DP2ujtq34mWXCD2u5uDT62+rB7dkMHU6u8Db4WAc9xfFxDubP+BS+Zz/xZgikPsHzA8eRiOzgQeQwy/tH80FgwfxPGZGjs1z9TYo8EeGXsM9sNwOjBxmP5mwugMn5F+D0FIYz+Og8h3qetHXfcbT7ktQw==
```
