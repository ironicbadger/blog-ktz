---
title: Eliminate 3d Printing Mesh Bed Leveling Globs on a Prusa i3 MK3
slug: eliminate-prusa-leveling-globs
description: "What am I talking about? These little dots that appear at every mesh bed leveling point where your nozzle is oozing a little filament out every time. They are annoying and can cause issues with larger prints. "
customExcerpt: "What am I talking about? These little dots that appear at every mesh bed leveling point where your nozzle is oozing a little filament out every time. They are annoying and can cause issues with larger prints. "
publishedAt: 2019-07-17T17:33:16.000-04:00
updatedAt: 2026-05-07T07:22:47.000-04:00
featureImage: /content/images/2019/07/IMG_20190717_173234.jpg
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
ghostId: 6775c6279e78ea00017cbbec
tags:
  - 3d-printing
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: 3d-printing
featured: false
readingTime: 2
---

A small tweak to your `Start G-Code` in PrusaSlicer can have a big difference on the warm up and mesh bed leveling routine on your printer.

What am I talking about? These little dots that appear at every mesh bed leveling point where your nozzle is oozing a little filament out every time. They are annoying and can cause issues with larger prints.

<figure class="kg-card kg-image-card kg-width-full"><img src="/content/images/2019/07/IMG_20190717_155011.jpg" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

This problem didn't used to be so bad when leveling only took place on a 3x3 grid but now we have 7x7. This means a potential for 49 little dots on the print surface and that just won't do.

Here's my tweaked start G-code I've been using to get around this issue.

```
M115 U3.7.1 ; tell printer latest fw version
G90 ; use absolute coordinates
M83 ; extruder relative mode
M140 S[first_layer_bed_temperature] ; set bed temp
M190 S[first_layer_bed_temperature] ; wait for bed temp
G28 W ; home all without mesh bed level
G80 ; mesh bed leveling
G28 W ; home all without mesh bed level
M104 S[first_layer_temperature] ; set extruder temp
M109 S[first_layer_temperature] ; wait for extruder temp
G1 Y-3.0 F1000.0 ; go outside print area
G92 E0.0
G1 X60.0 E9.0 F1000.0 ; intro line
G1 X100.0 E12.5 F1000.0 ; intro line
G92 E0.0
M221 S{if layer_height<0.075}100{else}95{endif}
```

The difference between this and the stock code is that we warm up the bed but not the nozzle. Warming the bed means that you're likely to get a more accurate leveling mesh than not. The nozzle temperature seems to have little impact on the accuracy to me.

In PrusaSlicer enter the `Printer Settings` tab along the top and then the `Custom G-Code` menu option to the left. You can replace the entire contents of the `Start G-code` box with my code above and try it out for your next print.

<figure class="kg-card kg-image-card kg-width-full"><img src="/content/images/2019/07/image-1.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

That's it. A nice and simple tweak that makes your life easier and doesn't cost a penny. Nice!
