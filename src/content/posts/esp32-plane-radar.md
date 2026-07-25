---
title: "An ESP32 based plane radar"
slug: esp32-plane-radar
description: "Plane radar is a neat little project that pulls nearby ADS-B traffic, plots each aircraft by distance and bearing, and shows the details directly on a cute little screen."
customExcerpt: null
publishedAt: 2026-07-25T18:41:10-04:00
updatedAt: 2026-07-25T18:41:10-04:00
featureImage: /content/images/2026/07/esp32-plane-radar/img-3936.webp
featureImageAlt: "ESP32 plane radar showing nearby aircraft on its round display"
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
ghostId: local-0759fd1f-2968-4fca-bc72-a5e6ea6ed662
tags:
  - technical
  - esp32
internalTags: []
primaryTag: technical
featured: false
readingTime: 3
drafts: false
---

This [project](https://github.com/ironicbadger/ESP32-Plane-Radar) made for a perfect lazy Saturday unwind, after a busy week giving a talk at [Devrelcon in NYC](https://nyc.devrelcon.dev/sessions/113). Makerworld had this thing as one of their featured models about a week or two ago, and the parts came in while I was away.

!!!card type=github url="https://github.com/ironicbadger/ESP32-Plane-Radar"

Plane radar is a neat little project that turns an ESP32-C3 and a 1.28-inch round display into a live aircraft radar. It pulls nearby ADS-B traffic, plots each aircraft by distance and bearing, and shows the details directly on the screen.

It was an easy build, although it did require a little soldering. I always enjoy doing that as it reminds me of my days building racing drones. Thin, silicone based wires made quick work of the cabling. And after about 15 minutes, we were ready to go.

![An ESP32-C3 wired to a round display during assembly](/content/images/2026/07/esp32-plane-radar/img-3934.webp)

It is insanely easy to flash firmwares to a fresh esp32 these days using the browser-based [ESPHome web flashing tool](https://web.esphome.io/). Under 30s and you're done.

## A quick note about the 3d model

The original model was featured on Makerworld, because it looks great. Reality though was, in practice, it's not actually that great.

!!!card type=makerworld url="https://makerworld.com/en/models/2872376-esp32-plane-radar-live-ads-b-on-a-round-display"

Unfortunately the tolerances are just too tight to be usable with the batch of boards I got. So I'm likely going to model my own replacement at some point, but for now I ended up printing this model instead.

!!!card type=makerworld url="https://makerworld.com/en/models/2913572-esp32-s3-1-28-waveshare-plane-radar"

## Customising the firmware

I’ve spent today improving my fork of ESP32 Plane Radar project, with the help of pure vibes.

The biggest improvement is proper flight context. Where the data is available, aircraft now show their origin and destination instead of just their tail number, with the callsign used as a fallback. Aircraft types are also more descriptive—something like `B737-800` rather than simply `B737`. I added local weather, temperature, humidity, time and date as well.

The web interface can now modify coordinates after initial setup. Display options can now be changed without resetting the Wi-Fi configuration, and there are controls for units, runways, weather, temperature format and 12/24-hour time. Text is 10% larger by default, with a persistent 80–130% slider for adjusting it.

![ESP32 plane radar showing live aircraft, weather and flight context](/content/images/2026/07/esp32-plane-radar/img-3937.webp)

Finally, the firmware now supports authenticated OTA updates, so future builds can be installed through the browser instead of connecting the board over USB.

I’ve compiled, flashed and tested everything on the actual device, and the latest work is committed to the main branch. Next up will probably be porting it to a larger  display and designing a tidy 3D-printed enclosure for it.
