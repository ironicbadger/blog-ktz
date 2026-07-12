---
title: Mapping sensors output to physical drives in Linux
slug: mapping-sensors-output-to-physical-drives-in-linux
description: Whilst building out some new Grafana dashboards over the weekend I made the switch from InfluxDB to Promtheus node exporters for scraping metrics from Linux servers. But how do you marry up the drivetemp-scsi-0-10 value output from sensors to a physical disk?
customExcerpt: Whilst building out some new Grafana dashboards over the weekend I made the switch from InfluxDB to Promtheus node exporters for scraping metrics from Linux servers. But how do you marry up the drivetemp-scsi-0-10 value output from sensors to a physical disk?
publishedAt: 2023-03-13T12:14:48.000-04:00
updatedAt: 2026-05-07T07:21:44.000-04:00
featureImage: /content/images/2023/03/Screenshot-2023-03-13-at-12.14.10.png
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
ghostId: 6775c6279e78ea00017cbc34
tags:
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

Whilst building out some new Grafana dashboards over the weekend I made the switch from InfluxDB to Promtheus node exporters for scraping metrics from Linux servers.

But how does one marry up the `drivetemp-scsi-0-10` value output from `sensors` to a physical disk?

```
coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +43.0°C  (high = +82.0°C, crit = +100.0°C)
Core 0:        +33.0°C  (high = +82.0°C, crit = +100.0°C)
Core 1:        +33.0°C  (high = +82.0°C, crit = +100.0°C)
Core 2:        +38.0°C  (high = +82.0°C, crit = +100.0°C)
Core 3:        +43.0°C  (high = +82.0°C, crit = +100.0°C)
Core 4:        +33.0°C  (high = +82.0°C, crit = +100.0°C)
Core 5:        +34.0°C  (high = +82.0°C, crit = +100.0°C)

drivetemp-scsi-0-50
Adapter: SCSI adapter
temp1:        +31.0°C  (low  =  +0.0°C, high = +65.0°C)
                       (crit low = -40.0°C, crit = +70.0°C)
                       (lowest = +30.0°C, highest = +34.0°C)

drivetemp-scsi-5-0
Adapter: SCSI adapter
temp1:        +26.0°C  (low  =  +0.0°C, high = +65.0°C)
                       (crit low = -40.0°C, crit = +70.0°C)
                       (lowest = +25.0°C, highest = +30.0°C)

drivetemp-scsi-0-30
Adapter: SCSI adapter
temp1:        +29.0°C  (low  =  +0.0°C, high = +65.0°C)
                       (crit low = -40.0°C, crit = +70.0°C)
                       (lowest = +28.0°C, highest = +33.0°C)
```

By using `lsblk`, we can strip the drive serial number and scsi (HCTL) value like so:

```shellsession
root@morpheus:~# lsblk --noheadings --output=SERIAL,HCTL --scsi
3HG7TJ8N        0:0:0:0
Y6GX1KWC        0:0:1:0
5PK9EAHE        0:0:2:0
5PGENVSD        0:0:3:0
Y6GE3JJC        0:0:4:0
5PJJ0K4F        0:0:5:0
Z2GJ4V4T        0:0:6:0
ZJV5CF96        0:0:7:0
S6PTNZ0T331139A 1:0:0:0
S6PTNM0TA60489X 2:0:0:0
9LJSSYVG        5:0:0:0
9LJ8JJ8G        6:0:0:0
```

Using this output we can see that `0:0:3:0` maps to `drivetemp-scsi-0-30` and so on.

Then, on the grafana side of things we can use overrides to map the specific value from `node_hwmon_temp_celcius` to the physical drive name we're looking for.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/03/image-1.png" class="kg-image" alt="" loading="lazy" width="1252" height="233" srcset="/content/images/size/w600/2023/03/image-1.png 600w, /content/images/size/w1000/2023/03/image-1.png 1000w, /content/images/2023/03/image-1.png 1252w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

The final product ended up looking like this for my dashboard.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/03/image.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

  
There we are, a quick and easy way of mapping scsi drive temps using Prometheus' node\_exporter into a more user friendly output.
