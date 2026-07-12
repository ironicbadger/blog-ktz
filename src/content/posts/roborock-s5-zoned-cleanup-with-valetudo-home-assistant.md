---
title: Roborock S5 zoned cleanup with Valetudo + Home Assistant
slug: roborock-s5-zoned-cleanup-with-valetudo-home-assistant
description: |-
  And with that you should be able to hit the button on the Lovelace card and dispatch the Robovac to wherever you please!
  Clean-up on Aisle 5.
customExcerpt: |-
  And with that you should be able to hit the button on the Lovelace card and dispatch the Robovac to wherever you please!
  Clean-up on Aisle 5.
publishedAt: 2020-06-16T18:56:48.000-04:00
updatedAt: 2026-05-07T07:21:55.000-04:00
featureImage: /content/images/2020/06/spill.png
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
ghostId: 6775c6279e78ea00017cbc0b
tags:
  - home-assistant
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: home-assistant
featured: false
readingTime: 3
---

As is so often the case with anything relating to Home Assistant what I'm writing about today is nothing new. But this post will collate all the materials required to get a `vacuum card` in your Home Assistant dashboard working with a Roborock vacuum (an S5 in my case) flashed with [Valetudo firmware](https://valetudo.cloud/?ref=blog.ktz.me).

<div class="postit postit-alert">Note that as of 2021.04 this method no longer works. I have written an <a href="/roborock-s5-zoned-cleanup-for-valetudo-2021-06/">updated post</a> describing how to do segment based cleanup in 2021.06.</div>

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://valetudo.cloud/?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">Valetudo</div><div class="kg-bookmark-description">Cloud-free control webinterface for vacuum robots</div><div class="kg-bookmark-metadata"><span class="kg-bookmark-author">Valetudo</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://raw.githubusercontent.com/Hypfer/Valetudo/master/assets/logo/valetudo_logo_with_name.svg" alt="" loading="lazy" decoding="async"></div></a></figure>

<h1 id="ui-configuration">UI configuration</h1>

I am using three Lovelace cards to create the interface you see below. They are:

-   [Vertical Stack](https://www.home-assistant.io/lovelace/vertical-stack/?ref=blog.ktz.me)
-   Custom - [Valetudo Map Card](https://github.com/TheLastProject/lovelace-valetudo-map-card?ref=blog.ktz.me)
-   Custom - [Vacuum Card](https://github.com/denysdovhan/vacuum-card?ref=blog.ktz.me)

Both of these custom cards are available for installation using [HACS](https://hacs.xyz/?ref=blog.ktz.me).

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2020/06/roborock.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Lovelace configuration</figcaption></figure>

One the cards are installed you will need the following YAML.

```yaml
cards:
  - crop:
      bottom: 50
      left: 60
      right: 0
      top: 50
    entity: sensor.valetudo_map_upstairs_rest
    map_scale: 1
    min_height: 0
    name: Downstairs
    rotate: 0
    title: Upstairs Robovac - Cuthbert
    type: 'custom:valetudo-map-card'
  - actions:
      - icon: 'mdi:bed-king'
        name: Clean living room
        service: script.clean_master_bedroom
      - icon: 'mdi:desk-lamp'
        name: Clean kitchen
        service: script.clean_study
    compact_view: false
    entity: vacuum.upstairs
    image: default
    stats:
      cleaning:
        - attribute: cleanArea
          subtitle: Cleaning area
          unit: m2
        - attribute: cleanTime
          subtitle: Cleaning time
          unit: minutes
      default:
        - attribute: filter
          subtitle: Filter
          unit: hours
        - attribute: sideBrush
          subtitle: Side brush
          unit: hours
        - attribute: mainBrush
          subtitle: Main brush
          unit: hours
        - attribute: sensor
          subtitle: Sensors
          unit: hours
        - attribute: cleanCount
          subtitle: No of Cleans
          unit: null
    type: 'custom:vacuum-card'
type: vertical-stack
```

Load up Home Assistant and click the 3 dots in the top right followed by 'Configure UI'.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/06/image-1.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

Once there click the + in the bottom right hand corner and find the 'Manual' card. Paste the above YAML into the card, change the bits you need and click save.

The map and other valetudo information is published by the vacuum to MQTT and Home Assistant picks this information up from there to populate things like sensor clean times, etc.

<h1 id="scripts">Scripts</h1>

One of the nice things about this vacuum card is that it supports actionable icons which allows us to execute scripts when clicked. In my case I have Master Bedroom and Study cleanup buttons.

This is the relevant snippet from my `scripts.yaml` file.

```yaml
clean_master_bedroom:
  alias: "Roborock Upstairs Clean Master Bedroom"
  sequence:
    - service: vacuum.send_command
      data:
        entity_id: vacuum.upstairs
        command: zoned_cleanup
        params:
          'zone_ids': ['MasterBed']
clean_study:
  alias: "Roborock Upstairs Clean Stufy"
  sequence:
    - service: vacuum.send_command
      data:
        entity_id: vacuum.upstairs
        command: zoned_cleanup
        params:
          'zone_ids': ['Study']
```

Note the name of the script. `clean_study` for example and note how this is called in the Lovelace card under the actions section. Change these to whatever you like!

<h1 id="valetudo-zone-configuration">Valetudo zone configuration</h1>

Zones are the final piece of the puzzle and are quite easy. Log in to your valetudo web interface using the IP of the vacuum. Click on zones at the bottom and add a rectangle over the area you want to be covered by this zone.

We reference the name you give the zone in the script. I usually try to avoid spaces in this type of thing just avoid confusion.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2020/06/Screen-Shot-2020-06-16-at-6.20.38-PM.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Set a zone in the Valetudo web UI</figcaption></figure>

And with that you should be able to hit the button on the Lovelace card and dispatch the Robovac to wherever you please! Very useful if a door was shut and a specific room got missed or something like that.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/06/image-2.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>
