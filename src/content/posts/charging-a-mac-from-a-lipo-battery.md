---
title: Charging a Mac from a Lipo battery
slug: charging-a-mac-from-a-lipo-battery
description: |-
  This weekend we're going camping at Silverstone for the F1 where a considerable number of photographs are expected to be taken by yours truly. On a usual day at a motor racing event I take anywhere between 2-3000 images (spraying and praying) and that means in the evening I expect to be doing a fair amount of rejection editing. But how do you charge a laptop in a field next to a tent? Using some stuff I had lying around from my racing drone hobby, I'll show you how I am going to do it.





  Disc
customExcerpt: null
publishedAt: 2018-07-05T06:11:14.000-04:00
updatedAt: 2026-05-07T07:23:02.000-04:00
featureImage: https://images.unsplash.com/photo-1521908613973-ff2eb881fcee?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ&s=075eb950b0384b9314d1c15c0cebdf8a
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
ghostId: 6775c6279e78ea00017cbbd4
tags:
  - apple
  - drones
  - electronics
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: apple
featured: false
readingTime: 2
---

This weekend we're going camping at Silverstone for the F1 where a considerable number of photographs are expected to be taken by yours truly. On a usual day at a motor racing event I take anywhere between 2-3000 images (spraying and praying) and that means in the evening I expect to be doing a fair amount of ~rejection~ editing. But how do you charge a laptop in a field next to a tent? Using some stuff I had lying around from my racing drone hobby, I'll show you how I am going to do it.

> Disclaimer: Lipo batteries can be dangerous. The advice in this post is just that, advice. You must take the relevant safety precautions yourself. I am not responsible for any issues which arise as a consequence of attempting what's outlined here.

<h1 id="hardware">Hardware</h1>

You will need:

-   Magsafe 2 to DC barrel cable - [Amazon](https://www.amazon.co.uk/Omnicharge-Magsafe-Cable-Apple-MacBook-DC-2/dp/B076SD9G2R/ref=sr_1_2?ie=UTF8&qid=1530783971&sr=8-2&keywords=magsafe+2+dc&ref=blog.ktz.me)
-   A 4s (4 cell) lipo battery
-   *optional* Strix USB power adapter - [RMRC](https://www.readymaderc.com/products/details/strix-usb-power-adapter?ref=blog.ktz.me)
-   Barrel connector (to receive the Magsafe 2 cable)

![IMG\_20180705\_101032](/content/images/2018/07/IMG_20180705_101032.jpg)

I already had the Magsafe 2 to DC barrel cable as I purchased an [Omnicharge](http://www.omnicharge.co/?ref=blog.ktz.me) a couple of years ago. That product was rather dissapointing as it gets too hot too quickly and shuts off under the load required by a laptop. The Omnicharge is built around the ubiquitous 18650 cell which are not really design for higher current discharges. Enter, the lipo battery.

<h1 id="alittleexplanation">A little explanation</h1>

In a racing drone scenario I expect my packs to be delivering anywhere up to 100 amps at peak. Using my clamp amp meter I have verified that the current required for Macbook charging rarely exceeds 3.5A. Perfect.

The Retina MacBook Pro from 2015 I use takes Magsafe 2 as it's power connection input. The voltage regulation systems used in the laptops are quite versatile and can accept voltage in my testing from as low as 14v right the way up to around 19v. Turns out, this is the perfect voltage range for a 4S lipo battery, the exact same batteries I use for my racing drones and happen to have 30x 1300mah packs of.

A fully charged 4s lipos voltage is 16.8v (4.2v per cell x4) and is considered depleted when at anywhere from 3.5-3.7v per cell (14v overall voltage). The battery in the Macbook Pro is approximately 5800mah meaning that if energy loss isn't taken into consideration we can charge the laptop fully using 4.46 1300mah packs. Let's just round that up to 5 packs for a full charge then shall we?

I was all ready to futz around with voltage regulators and such but there is no need it seems. The laptop charges perfectly well at the voltages a 4s lipo delivers.

<h1 id="batteryprotection">Battery Protection</h1>

You might have been wondering what that little Strix board is doing. Firstly, it is preventing over discharge of the lipos as it has a configurable alarm at 3.4, 3.5, 3.6 and 3.7v per cell. Overdischarge of a lipo is bad and will damage it.

Secondly it allows me to split a single lipo safely into 3 outputs including a usb output. Important for charging phones and camera batteries.

I purchased mine from Ready Made RC [here](https://www.readymaderc.com/products/details/strix-usb-power-adapter). It is entirely optional in this setup but I like it so there you are!
