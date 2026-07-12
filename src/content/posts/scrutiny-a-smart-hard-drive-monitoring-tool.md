---
title: Scrutiny - A SMART Hard Drive Monitoring tool
slug: scrutiny-a-smart-hard-drive-monitoring-tool
description: Scrutiny is a (currently) closed source SMART hard drive monitoring tool with a pretty web interface and integration with Backblazes' excellent quarterly stats.
customExcerpt: Scrutiny is a (currently) closed source SMART hard drive monitoring tool with a pretty web interface and integration with Backblazes' excellent quarterly stats.
publishedAt: 2020-08-22T01:28:54.000-04:00
updatedAt: 2026-05-07T07:22:02.000-04:00
featureImage: https://images.unsplash.com/photo-1597852074816-d933c7d2b988?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc14
tags:
  - technical
  - hardware
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

Scrutiny is a (currently) closed source [SMART](https://en.wikipedia.org/wiki/S.M.A.R.T.?ref=blog.ktz.me) hard drive monitoring tool with a pretty web interface and integration with Backblazes' excellent [quarterly stats](https://www.backblaze.com/blog/backblaze-hard-drive-stats-q2-2020/?ref=blog.ktz.me).

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2020/08/image-1.png" class="kg-image" alt="" loading="lazy" width="2000" height="1377" srcset="/content/images/size/w600/2020/08/image-1.png 600w, /content/images/size/w1000/2020/08/image-1.png 1000w, /content/images/size/w1600/2020/08/image-1.png 1600w, /content/images/size/w2400/2020/08/image-1.png 2400w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>Ain't that the prettiest SMART monitoring tool you ever saw?</figcaption></figure>

<h2 id="where-to-find-it">Where to find it</h2>

The author of this tool, `analogj` is currently trying to solicit sponsors on Github. If he makes it to 25 backers, then he will open source the project. This is a unique approach to monetization I guess, and I hope it works because the app itself has the potential to really improve disk management for DIY NAS builders like me.

There is a long thread on [reddit](https://www.reddit.com/r/selfhosted/comments/icreui/scrutiny_hard_drive_smart_monitoring_historical/?ref=blog.ktz.me) where you can find more information about sponsoring the project.

> In exchange for publicising the app `analogj` gave me access without sponsorship. In other words, my contribution was raising awareness through this article and the [Self-Hosted](https://selfhosted.show/?ref=blog.ktz.me) podcast.

<h2 id="the-app-itself">The App Itself</h2>

At first I was greeted with an error message telling me I had no stats and should run `scrutiny-collector-metrics run`. So, I ran `docker exec -it scrutiny scrutiny-collector-metrics run` and I was off to the races.

After this, the app just works. It does exactly what you'd expect and nothing more. But what is particularly exciting is that the app has been written with a hub and spoke model in mind. For example you can run one collector on each device you have with hard drives in it and then one central API server to collect those metrics. Kind of like Prometheus and node\_exporter.

I particularly like the detailed stats page for each drive when you click on `view details` for a specific drive. For example:

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/08/image-2.png" class="kg-image" alt="" loading="lazy" width="2000" height="1294" srcset="/content/images/size/w600/2020/08/image-2.png 600w, /content/images/size/w1000/2020/08/image-2.png 1000w, /content/images/size/w1600/2020/08/image-2.png 1600w, /content/images/size/w2400/2020/08/image-2.png 2400w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

Clicking on `Show all attributes` shows more information than you probably need. This page is generated using the same SMART stats you can view with `smartctl -a /dev/sdX` but obviously presents them nicely.

<h2 id="feature-requests">Feature requests</h2>

I have a few:

-   A disk stress feature for [burning in new drives](/new-hard-drive-rituals/)
-   The ability to import my years worth of influxdb / telegraf hdd temp data into the app
-   The ability to schedule regular smart checks via smartd from the UI
-   Alerting via something like [apprise](https://github.com/caronc/apprise?ref=blog.ktz.me)

<h2 id="conclusion">Conclusion</h2>

This app has so much potential and I really hope that we can as a community come together and help make it happen.

Overall, we're off to an excellent start. Please consider [contributing](https://github.com/analogj?ref=blog.ktz.me) if you're curious and want to see it succeed using the Github sponsors initiative. It would be great to keep analogj motivated.
