---
title: Roborock S5 Zoned Cleanup for Valetudo 2021.06
slug: roborock-s5-zoned-cleanup-for-valetudo-2021-06
description: Here's how to configure segment based cleanup for Valetudo based Robovacs.
customExcerpt: Here's how to configure segment based cleanup for Valetudo based Robovacs.
publishedAt: 2021-07-14T13:29:36.000-04:00
updatedAt: 2026-05-07T07:21:55.000-04:00
featureImage: /content/images/2021/07/712VjnEIHWS._AC_SL1500_.jpg
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
ghostId: 6775c6279e78ea00017cbc22
tags:
  - technical
  - home-automation
  - home-assistant
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 1
---

The previously used `vacuum.send_command` has been retired as of [Valetudo](https://github.com/Hypfer/Valetudo?ref=blog.ktz.me) v2021.04 and zoned cleanup must be performed via `mqtt.publish` now.

This post was written for the [Roborock S5](https://amzn.to/3B2zBrY?ref=blog.ktz.me) line of robovacs.

<h2 id="valetudo-configuration">Valetudo configuration</h2>

Requires MQTT to be configured correctly in the first place with Valetudo and discovery enabled in Home Assistant. You can verify this using MQTT explorer.

Ensure that the segments are named by clicking on the triangle in "Zones -> Edit Segments" and then clicking the cursor icon to rename a segment.

Full documentation can be found on the Valetudo site at [https://valetudo.cloud/pages/integrations/home-assistant-integration.html](https://valetudo.cloud/pages/integrations/home-assistant-integration.html?ref=blog.ktz.me).

<h2 id="calling-segment-cleanup-from-home-assistant">Calling segment cleanup from Home Assistant</h2>

A single segment can be called like this:

```yaml
service: mqtt.publish
data:
    topic: valetudo/robovacDown/MapSegmentationCapability/clean/set
    payload: '20'
```

Multiple segment cleaning requires a JSON array to be passed like this:

```yaml
service: mqtt.publish
data:
  topic: valetudo/robovacDown/MapSegmentationCapability/clean/set
  payload: '["17", "20"]'
```

Segment IDs can be obtained from the MQTT topic `valetudo/robot/MapData/segments` and should look like this:

```json
{
  "16": "DownFrontDining",
  "17": "DownFrontOffice",
  "18": "DownRearHallway",
  "19": "DownKitchen",
  "20": "DownFrontHall",
  "21": "DownLounge",
  "22": "DownLoungeHall"
}
```
