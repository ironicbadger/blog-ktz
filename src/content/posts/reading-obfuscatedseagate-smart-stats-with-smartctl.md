---
title: Reading obfuscated Seagate SMART stats with smartctl
slug: reading-obfuscatedseagate-smart-stats-with-smartctl
description: |-
  Reading a SMART report from a Seagate drive with smartctl can be bit tricky sometimes. Values that should be human readable are obfuscated. This can lead to issues in all sorts of tools, but what we really want is just a simple number.

  Thankfully, we can decode the output using the following command:

  smartctl /dev/sdX -a -v 1,raw48:54 -v 7,raw48:54 -v 241,raw48:54 -v 242,raw48:54

  The command takes the input of -v ID#,raw48:54 so if you wanted to read Raw_Read_Error_Rate as a human, you'd ente
customExcerpt: null
publishedAt: 2024-08-13T12:03:46.000-04:00
updatedAt: 2026-05-07T07:21:35.000-04:00
featureImage: /content/images/2024/08/Screenshot-2024-08-13-at-12.02.59-1.jpg
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
ghostId: 6775c6279e78ea00017cbc42
tags:
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 1
---

Reading a SMART report from a Seagate drive with `smartctl` can be bit tricky sometimes. Values that should be human readable are obfuscated. This can lead to [issues](https://github.com/AnalogJ/scrutiny/issues/255?ref=blog.ktz.me) in all sorts of tools, but what we really want is just a simple number.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2024/08/image.png" class="kg-image" alt="" loading="lazy" width="1998" height="332" srcset="/content/images/size/w600/2024/08/image.png 600w, /content/images/size/w1000/2024/08/image.png 1000w, /content/images/size/w1600/2024/08/image.png 1600w, /content/images/2024/08/image.png 1998w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>Note the high RAW_VALUE figures.</figcaption></figure>

Thankfully, we can decode the output using the following command:

```
smartctl /dev/sdX -a -v 1,raw48:54 -v 7,raw48:54 -v 241,raw48:54 -v 242,raw48:54
```

The command takes the input of `-v ID#,raw48:54` so if you wanted to read `Raw_Read_Error_Rate` as a human, you'd enter `-v 1,raw48:54` as it correlates to the `ID#` column in the `smartctl` output.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2024/08/image-1.png" class="kg-image" alt="" loading="lazy" width="2000" height="341" srcset="/content/images/size/w600/2024/08/image-1.png 600w, /content/images/size/w1000/2024/08/image-1.png 1000w, /content/images/size/w1600/2024/08/image-1.png 1600w, /content/images/2024/08/image-1.png 2016w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>Human readable smartctl output</figcaption></figure>

That's all there is to it folks.
