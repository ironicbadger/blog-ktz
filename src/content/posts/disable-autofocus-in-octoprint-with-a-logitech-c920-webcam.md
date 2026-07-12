---
title: Disable autofocus in Octoprint with a Logitech C920 webcam
slug: disable-autofocus-in-octoprint-with-a-logitech-c920-webcam
description: "Whilst 3D printing I often check up on the print from another location and rely on being able to get a clear, high definition and sharp image. The C920 webcam from Logitech delivers great image quality but unfortunately the auto focus algorithm almost always choose the wrong focal point. "
customExcerpt: "Whilst 3D printing I often check up on the print from another location and rely on being able to get a clear, high definition and sharp image. The C920 webcam from Logitech delivers great image quality but unfortunately the auto focus algorithm almost always choose the wrong focal point. "
publishedAt: 2019-08-20T23:11:29.000-04:00
updatedAt: 2026-05-07T07:22:47.000-04:00
featureImage: /content/images/2019/08/IMG_20190803_183720.jpg
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
ghostId: 6775c6279e78ea00017cbbf0
tags:
  - 3d-printing
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: 3d-printing
featured: false
readingTime: 2
---

Whilst 3D printing I often check up on the print from another location and rely on being able to get a clear, high definition and sharp image. The C920 webcam from Logitech delivers great image quality but unfortunately the auto focus algorithm almost *always* choose the wrong focal point.

Today, I'll show you how to set a fixed auto focus point in Octoprint.

<figure class="kg-card kg-image-card kg-width-full kg-card-hascaption"><img src="/content/images/2019/08/image-25.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>A beautifully crisp and well focused image for this print</figcaption></figure>

It's actually a relatively straight forward thing to set the focus manually. We will use `v412-ctl` to do so.

Login to the Octoprint instance via SSH and execute the following commands. You can tune the final value `32` to set the focal length of the camera.

```bash
sudo v4l2-ctl --set-ctrl=focus_auto=0
sudo v4l2-ctl --set-ctrl=focus_absolute=32
```

A value of `1` focuses far away and `255` so close as to be all but useless for our purposes. I found a good range was in the 25-40 range, tweak it as you see fit.

<h2 id="making-things-permanent">Making things permanent</h2>

In order for the auto focus to be set to your preferred value above every time we must edit the `mjpg-streamer` startup file.

Again we being by SSH'ing into the Octoprint instance and then changing into the `mjpg-streamer` directory with

```bash
cd /home/pi/mjpg-streamer
vi start.sh
```

-   Note I used `vi` above which is my preferred text editor. You can replace `vi` with `nano` if you prefer.

Now we add the two lines to the top of the file, save and close. That's it.

<figure class="kg-card kg-image-card"><img src="/content/images/2019/08/image-26.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>
