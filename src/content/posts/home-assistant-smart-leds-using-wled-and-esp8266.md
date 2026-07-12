---
title: Home Assistant Smart LEDs using WLED and ESP8266
slug: home-assistant-smart-leds-using-wled-and-esp8266
description: WLED library gets native Home Assistant API integration. This post walks you through everything you need to get up and running.
customExcerpt: WLED library gets native Home Assistant API integration. This post walks you through everything you need to get up and running.
publishedAt: 2019-11-26T15:17:23.000-05:00
updatedAt: 2026-05-07T07:22:36.000-04:00
featureImage: /content/images/2019/11/led-strip-5050-60-led-m-uv-400nm-per-50cm.jpg
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
ghostId: 6775c6279e78ea00017cbbfa
tags:
  - home-assistant
  - electronics
  - esp8266
  - smart-home
  - home-automation
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: home-assistant
featured: false
readingTime: 3
---

To date there have been two primary methods for integrating cheap ESP8266 boards like the NodeMCU or D1 Mini with Home Assistant. The first [I wrote about](/smart-led-strips-with-no-subscription-required/) in January using custom Arduino code written by Bruh Automation and the second used ESPHome. Both of these methods were fine but each had their pros and cons.

Flashing custom Arduino code can be error prone and confusing sometimes. Not to mention a minefield of driver management and that the Arduino IDE requires *Java*. [ESPHome](https://esphome.io/?ref=blog.ktz.me) is very simple to set up but lacks the intricate configurability of custom code. In short, there's always a trade off. But what if I told you that there's now a third way that mashes the best bits of these two options together?

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2019/11/wled_logo.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

A [platinum](https://www.home-assistant.io/docs/quality_scale/?ref=blog.ktz.me) level [Home Assistant](https://www.home-assistant.io/?ref=blog.ktz.me) [integration](https://www.home-assistant.io/integrations/wled/?ref=blog.ktz.me) for the [WLED project](https://github.com/Aircoookie/WLED?ref=blog.ktz.me) was released with version 0.120 on Nov 20th 2019. I'm going to walk you through flashing a D1 Mini (though the same steps apply for a NodeMCU too) using Linux. You can probably expect this process to take about 5-10 minutes.

<h2 id="hardware-required">Hardware required</h2>

Please note that the links below are Amazon affiliate links that support my bringing this content to you.

| Item | Price | Purpose |
| --- | --- | --- |
| [D1 Mini](https://amzn.to/2KT0GFG?ref=blog.ktz.me) | $5.50 | A mini wifi board with 4MB flash based on ESP-8266EX |
| [5v LEDs](https://amzn.to/2OlKxL2?ref=blog.ktz.me) | $28 | 300 5v LEDs with WS2812b controller (1 LED = 1 pixel) |
| [Micro USB Breakout Board](https://amzn.to/2DkhiSx?ref=blog.ktz.me) | 69c each | MicroUSB power input board |
|  |  |  |
| **Total** | $16.07 |  |

You'll also need a power supply. The Amazon listing suggest 18A at 5v to power all 300 LEDs so I would suggest only using these 5v strips in smaller projects. For longer runs, use the 12v strips from my original article. For these 5v strips you need to budget approx 60mA for each LED at full brightness.

I also designed a 3d printable case for the components from my previous post, so if you're using a nodemcu instead of a d1 mini then you can use this from [thingiverse](https://www.thingiverse.com/thing:3721033?ref=blog.ktz.me).

<h2 id="wiring-diagram">Wiring diagram</h2>

Pay attention to the power supply comment above but here's an example wiring diagram to help you get started.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2019/11/image-1.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

<h2 id="flashing-the-firmware">Flashing the firmware</h2>

Flashing WLED is *unbeliveably* easy on Linux. I grab `esptool` from the AUR on Arch and then executed the following one line command to flash firmware.

```bash
sudo esptool.py --port /dev/ttyUSB0 write_flash 0x00000 Downloads/WLED_0.8.6_ESP8266.bin
```

1.  Download the version of the latest WLED firmware from Github on the [releases](https://github.com/Aircoookie/WLED/releases?ref=blog.ktz.me) page
2.  Install `esptool` (Arch users `yay -S esptool`) - [esptool project link](https://github.com/espressif/esptool?ref=blog.ktz.me)
3.  Connect the D1 mini via usb to your system and then...
4.  Flash the firmware

Yes, that is it. You will now be able to perform all future updates over the air, wirelessly.

<h2 id="configuring-the-d1-mini">Configuring the D1 mini</h2>

1.  Using your smartphone or laptop look for a new wifi network called `WLED-AP` and connect to it using the default password `wled1234`
2.  Navigate to the IP address `4.3.2.1` in a browser
3.  Fill-in the relevant wifi information for your network
4.  Hit save

<h2 id="configuring-a-custom-name-and-add-to-home-assistant">Configuring a custom name and add to Home Assistant</h2>

This video shows how to set a custom name in the WLED web server and how to integrate with Home Assistant.

<figure class="kg-card kg-embed-card kg-card-hascaption"><iframe width="480" height="270" src="https://www.youtube.com/embed/VTJBR9tPj_E?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" loading="lazy" title="YouTube video player"></iframe><figcaption>How to integrate (there is no sound)</figcaption></figure>

<h2 id="configuring-home-assistant">Configuring Home Assistant</h2>

This is covered in the short video above labelled 'how to integrate'.

1.  Enter the configuration menu
2.  Enter the integrations menu
3.  Use the orange plus in the bottom right to add a new integration
4.  Search for WLED from the drop down list
5.  Enter the IP address of your D1 mini
6.  Save

<h2 id="configure-home-assistant-interface">Configure Home Assistant interface</h2>

This is covered in the short video above labelled 'how to integrate'.

1.  Load Home Assistant Overview page and 'configure UI' from 3 dot menu in the top right
2.  Add a new light card
3.  Select the light and customise the icon as you see fit
4.  For bonus points you could add this new light to a group

<h1 id="summary">Summary</h1>

That's it folks. What took me several days to understand in January previously now takes a matter of minutes...

-   No MQTT servers (though this firmware does support it)
-   No custom code compiliation (though you can if you want to customise the data pin for some reason)
-   Full effect selection available
-   Native Home Assistant API integration

There is a native Android and iOS app if you didn't want to use Home Assistant, for some reason.
