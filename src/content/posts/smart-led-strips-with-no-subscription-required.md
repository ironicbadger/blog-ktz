---
title: Smart RGB LED strips with Home Assistant
slug: smart-led-strips-with-no-subscription-required
description: |-
  The trouble with any 'smart' device such as a Nest thermostat or Hue light bulb is that they require an internet connection and a company to be in business running a server that they connect to.
  If the product you just bought requires a cloud service to be available to function, you don't own it.
customExcerpt: |-
  The trouble with any 'smart' device such as a Nest thermostat or Hue light bulb is that they require an internet connection and a company to be in business running a server that they connect to.
  If the product you just bought requires a cloud service to be available to function, you don't own it.
publishedAt: 2019-01-31T00:10:00.000-05:00
updatedAt: 2026-05-07T07:22:35.000-04:00
featureImage: https://images.unsplash.com/photo-1507150397127-279c2d8249fb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbbd5
tags:
  - 3d-printing
  - electronics
  - home-assistant
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: 3d-printing
featured: false
readingTime: 9
---

The trouble with any 'smart' device such as a Nest thermostat or many other smart devices is that they *require* an internet connection and a company to be in business running a server that they connect to. As we have seen with [Logitech](https://community.logitech.com/s/question/0D55A00008D1oIoSAJ/firmware-update-blocked-api-access?ref=blog.ktz.me) a company can change its focus at anytime.

> If the product you just bought *requires* a cloud service to be available to function, you don't own it.

2019 is the year I am taking back control of my smart devices by bringing as much 'smarts' back inside my LAN as possible. To do this I've recently been experimenting with [Home Assistant](https://www.home-assistant.io/?ref=blog.ktz.me) which I have running in a docker container on my [media server](https://blog.linuxserver.io/2017/06/24/the-perfect-media-server-2017/?ref=blog.ktz.me).

<h3 id="edit-on-dec-1st-2019">Edit on: Dec 1st 2019</h3>

*WLED was just added to Home Assistant 0.120 and is in my opinion a much easier to use solution than this one. I've written about it in [this post](/home-assistant-smart-leds-using-wled-and-esp8266/) so go ahead and check that out! I also covered WLED for my new podcast, [Self Hosted](https://selfhosted.show/?ref=blog.ktz.me) during a live hack session a recording of which will be available on Youtube under the [JB extras](https://www.youtube.com/channel/UCkZKIGkCwEVupUDmVs3cRXA?ref=blog.ktz.me) feed. Happy hacking! </edit>*

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2019/01/ledbox.jpg" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>100% DIY Smart LED strip controller</figcaption></figure>

This article will detail how to build a fully open source, 3D printable smart LED strip for $16.38. Please note that the links below are Amazon affiliate links.

Full credit for many of the resources here must go to [Bruh automation](https://www.youtube.com/watch?v=9KI36GTgwuQ&ref=blog.ktz.me).

Here is a link to the case I designed on [Thingiverse](https://www.thingiverse.com/thing:3721033?ref=blog.ktz.me). It's not perfect, some of the tolerances are a little tight depending on your particular batch but it works well for me! I have the f3d file somewhere so if that's of interest find me on Twitter @ironicbadger.

<h2 id="components">Components</h2>

Here are the required components:

| Item | Price | Purpose |
| --- | --- | --- |
| [NodeMCU](https://amzn.to/2TmsmoJ?ref=blog.ktz.me) | $6.50 | Sends and receives commands to and from components |
| [Voltage regulator](https://amzn.to/2MN6jFn?ref=blog.ktz.me) | $1.33 | Converts 12v to 5v required by NodeMCU |
| [Logic converter](https://amzn.to/2DIlf4l?ref=blog.ktz.me) | $1.60 | Converts 3.3v signal to 5v required by LEDs |
| [12v DC PSU](https://www.ebay.com/itm/AC100-240V-To-DC-12V-1-2-3-5-6-8A-US-Power-Supply-Adapter-Transformer-LED-Strip/202127822979?ssPageName=STRK%3AMEBIDX%3AIT&var=502506629852&_trksid=p2057872.m2749.l2649&ref=blog.ktz.me) | $6.95 | Powaaaaah! |
|  |  |  |
| **Total** | $16.38 |  |

Now obviously, this does not include the price of the LED strip itself, there are many options available using the ubiquitous WS2811 controller. These typically range from $15-30 depending on LED density, waterproofing rating, etc. That said, I bought both a $15 strip and a $30 strip and found the $15 strip to be a bit dim and rubbish, go for the better one if you can.

We make use of the FastLED Arduino library. So whilst a WD2811 controller is not a requirement a FastLED library compatible one is. There's a section in the code we upload later where you can swap the controller out.

| Item | Price | Purpose |
| --- | --- | --- |
| [Better LED strip](https://amzn.to/2WwtdF7?ref=blog.ktz.me) | $26.88 | 12v 60 LEDs/m IP65 Silicone Coating |
| [Worse LED strip](https://amzn.to/2UylFA4?ref=blog.ktz.me) | $15.88 | 12 30 LEDs/m not waterproof |

So for $16.38 + $26.88 = $43.26 you have a 5 meter, smart, controllable LED strip with full RGB colors, dimming and it doesn't require a subscription or cloud service to operate.

<h2 id="3d-printing-a-case">3D printing a case</h2>

It's fair to say that my experience and skills with 3D modelling are next to zero. I've been using this project as a good excuse to learn Fusion 360. I recently purchased a Prusa i3 mk3 and wanted to put it use!

<figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/01/IMG_20190129_220739.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/01/IMG_20190129_220739.jpg 600w, /content/images/size/w1000/2019/01/IMG_20190129_220739.jpg 1000w, /content/images/size/w1600/2019/01/IMG_20190129_220739.jpg 1600w, /content/images/size/w2400/2019/01/IMG_20190129_220739.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/01/IMG_20190129_220732.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/01/IMG_20190129_220732.jpg 600w, /content/images/size/w1000/2019/01/IMG_20190129_220732.jpg 1000w, /content/images/size/w1600/2019/01/IMG_20190129_220732.jpg 1600w, /content/images/size/w2400/2019/01/IMG_20190129_220732.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/01/IMG_20190129_220715.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/01/IMG_20190129_220715.jpg 600w, /content/images/size/w1000/2019/01/IMG_20190129_220715.jpg 1000w, /content/images/size/w1600/2019/01/IMG_20190129_220715.jpg 1600w, /content/images/size/w2400/2019/01/IMG_20190129_220715.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.333333 1 0%"><img src="/content/images/2019/01/IMG_20190129_193929.jpg" width="2000" height="1500" loading="lazy" alt="" srcset="/content/images/size/w600/2019/01/IMG_20190129_193929.jpg 600w, /content/images/size/w1000/2019/01/IMG_20190129_193929.jpg 1000w, /content/images/size/w1600/2019/01/IMG_20190129_193929.jpg 1600w, /content/images/size/w2400/2019/01/IMG_20190129_193929.jpg 2400w" sizes="(min-width: 720px) 720px" decoding="async"></div></div></div><figcaption>My first proper Fusion 360 modelling project</figcaption></figure>

I'm working on making the case even smaller and on how to model snap catches to click the case together instead of using a bolt. It's a tight fit wiring everything up but it works great and temperatures of each component after 24 hours of running all the LEDs at full brightness never exceed 36c.

I'll upload the STL files to Thingiverse shortly. For those of you who don't have a 3D printer or are worried about soldering something so small, I'll happily print and ship a case anywhere in the USA for $5 plus shipping. A pre assembled project will be shipped out for $45 plus shipping (add your own PSU and LEDs). Contact me on Twitter @IronicBadger for more info or find me in the Linuxserver.io Discord.

<h2 id="home-assistant-intro">Home Assistant Intro</h2>

I've only recently started dabbling in Home Assistant (HASS) but it is absolutely fantastic. HASS says this about itself *"Open source home automation that puts local control and privacy first. Powered by a worldwide community of tinkerers and DIY enthusiasts. Perfect to run on a Raspberry Pi or a local server."*

I already run an always on Linux media server and HASS is available as a docker container. Naturally, given my side project [Linuxserver.io](https://linuxserver.io/?ref=blog.ktz.me) is heavily involved in the containerization scene it was a good fit.

All the files I use to configure Home Assistant can be found in this [github repo](https://github.com/IronicBadger/home-assistant?ref=blog.ktz.me). We'll take a look at how to actually configure Home Assistant towards the end of this article.

<h2 id="how-does-this-work-mqtt-that-s-how-">How does this work? MQTT. That's how.</h2>

MQTT is a very interesting area to understand as it allows us to react to events and do all sorts of cool stuff. Want to change your LEDs to a certain colour based on the status of your 3D printer? Or a timer? Or whether your mailbox has been opened? Or based on who's home?

This whole project makes use of [MQTT](http://mqtt.org/?ref=blog.ktz.me). The MQTT protocol works on the concept of messages and topics. In our case, HASS is acting as the MQTT server.

When we click the button in HASS to 'turn on' the LED strip what actually happens is this. HASS sends a message to the specified MQTT topic. Your NodeMCU 'subscribes' to this topic and notices that an `on_cmd` message has been posted. The firmware we uploaded governs how the NodeMCU reacts to this. There are a number of messages supported including `on_cmd`, `off_cmd`, various `RGB` values or `effectString`.

This is super cool because this system allows the NodeMCU to provide feedback via a `state` topic. This means that HASS is actually aware of the current state of the LEDs. Think about that for a second. Traditional old automations (like Infrared based ones) are dumb. They just fire off commands and hope for the best. With MQTT that problem is solved!

Take the 3D printer example. Our LEDs might *subscribe* to a `printer_status` topic and our printer will *publish* to it. A 3D print might have 3 states `inprogress`, `failed` or `completed`. We want our LEDs to change colour to react to each of those events. When a print is `inprogress` the printer sends a message to the `printer_status` topic. Our LEDs are subscribed to this topic and see the `inprogress` message arrive and react accordingly. They could, but don't in this case, send a message back to the topic confirming receipt of that message and the printer could react to that and so on. Once our print has either entered a `failed` or `completed` state another message is published to the `printer_status` topic. The LEDs (which are subscribed to that topic) receive the message and act as programmed.

Your imagination really is the limit here.

<h2 id="the-electronics">The Electronics</h2>

At the heart of this project is the NodeMCU which is based around the ESP8266 chip. It's inexpensive at $6.50, has wifi built-in and can be flashed using the ArduinoIDE via a built-in microUSB port.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2019/01/IMG_20190130_182752.jpg" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>NodeMCU based around the ESP8266 chip</figcaption></figure>

<h2 id="wiring-things-up">Wiring things up</h2>

Here's a diagram on how to connect everything up. The process of tuning the voltage regulator is a little fiddly and will require you to measure the output voltage with a multi-meter.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2019/01/Screenshot-2019-01-30-at-19.34.29.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

A few important notes here...

<h3 id="voltages">Voltages</h3>

We are working with 3 different voltages here. 12v, 5v and 3.3v.

> Always triple check your voltages using a Multimeter.

We are using a 12v power supply as the LEDs require a 12v input. There's no sense in having a separate power supply for the electronics and the LEDs in my opinion so let's regulate the 12v input to the 5v our logic level converter and NodeMCU require. We do this using a voltage regulator.

The one I have selected is rated at up to 3 amps and supports a wide range of voltages which are adjustable using the voltage tuning screw (circled in orange). The NodeMCU and logic level converter is not going to use anywhere near 3 amps (I have noted a draw of 0.3a in my testing).

Tuning the regulator is actually quite simple but takes a bit of patience and practice. Connect the input +/- side of the regulator to the 12v inputs from the power supply **triple check your polarity before plugging things in!!** Next, grab a multimeter and connect it to the +/- output pins of the regulator. You'll see a random voltage at this point. We now need to tune it using the screw on the board. Slowly and carefully turn the screw left and right and watch the multimeter change accordingly. We are looking for a voltage as close to 5v as possible. In my testing anywhere between 5v and 5.5v was acceptable, closer to 5v is better.

Once you have a steady 5v output move ahead to wiring up the NodeMCU and logic converter as shown in the diagram.

> Never connect the NodeMCU to USB power via the MicroUSB and the 12v DC input simultaneously!!! It WILL fry your components.

The logic level converter component is required because the NodeMCU outputs the control signal at 3.3v and the LEDs require this at 5v. The LEDs use this digital signal to drive the WS2811 controllers which then control the LEDs themselves.

Take your time. The pads are small and it takes practice soldering things this small. Double check for continuity using your multimeter before powering things up (this means you haven't accidentally globbed solder and bridged connections). I find tweezers to be very useful. If you have experience building racing drones like I do, you'll find this build tight but easy enough.

<h2 id="flashing-the-nodemcu">Flashing the NodeMCU</h2>

Now it's time to flash the NodeMCU with the firmware we're going to use to control the LEDs. To do this we're going to use the [Arduino IDE](https://www.arduino.cc/en/Main/Software?ref=blog.ktz.me). It runs on Linux (yay!), Mac and Windows. This step is a little hard to explain so I made a short video.

<figure class="kg-card kg-embed-card"><iframe width="480" height="270" src="https://www.youtube.com/embed/mQjmZtowx7w?feature=oembed" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" loading="lazy" title="YouTube video player"></iframe></figure>

You must make sure the values of the MQTT topics are correct. Also change your wifi details, the OTA updated password, your HASS IP and a couple of other lines. If you'd like multiple LED strips to be controlled at once you could subscribe multiple NodeMCU's to the same topics but you can also use groups in HASS to achieve the same result.

You can find the code I used in [on Github](https://github.com/IronicBadger/ESP-MQTT-JSON-Digital-LEDs?ref=blog.ktz.me).

This repo is a fork of Bruh automation's repo, his code didn't compile for me but this one did.

As I showed in the video after the initial flash you can use the network port flash function (OTA update) to update your NodeMCU remotely in future. No need to plug it in via USB every time! Nifty!!

<h2 id="home-assistant-configuration">Home Assistant configuration</h2>

My full HASS configuration is available in [this](https://github.com/IronicBadger/home-assistant?ref=blog.ktz.me) Github repo.

The configuration you actually need to drive the LEDs from HASS is surprisingly simple.

```yaml
light:
  platform: mqtt
  schema: json
  effect: true
  effect_list:
    - bpm
    - confetti
    - cyclon rainbow
    - dots
    - fire
    - glitter
    - juggle
    - lightning
    - noise
    - police all
    - police one
    - rainbow
    - sinelon
    - solid
  brightness: true
  flash: true
  rgb: true
  optimistic: false
  qos: 0
  name: "Chimney LED Strip"
  state_topic: "leds/chimney"
  command_topic: "leds/chimney/set"
```

Modify this to suit your needs and double check the `state_topic` and `command_topic` match the values you entered into the NodeMCU firmware.

Restart HASS and we're good to go!

<h2 id="ok-google-">Ok, Google.</h2>

If you look closely in the [Github repo](https://github.com/IronicBadger/home-assistant?ref=blog.ktz.me) containing my HASS configuration you'll see that I have hooked up Google Assistant. Ok, I know the cloud is evil. But this is just a nice option to have and if Google Assistant went away tomorrow everything would continue to function within my LAN without any issues.
