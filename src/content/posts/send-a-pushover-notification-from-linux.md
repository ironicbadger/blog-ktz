---
title: Send a Pushover notification from Linux
slug: send-a-pushover-notification-from-linux
description: How can you make a Linux system notify your phone when it reboots?
customExcerpt: How can you make a Linux system notify your phone when it reboots?
publishedAt: 2020-07-27T10:39:24.000-04:00
updatedAt: 2026-05-07T07:22:33.000-04:00
featureImage: https://images.unsplash.com/photo-1520521179602-a47780b493dd?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc0e
tags:
  - linux
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: linux
featured: false
readingTime: 3
---

Push notifications are nothing new but they are an essential component of the modern technology landscape. They allow apps and services to send notifications to your mobile devices.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-5.png" class="kg-image" alt="" loading="lazy" width="1080" height="394" srcset="/content/images/size/w600/2020/07/image-5.png 600w, /content/images/size/w1000/2020/07/image-5.png 1000w, /content/images/2020/07/image-5.png 1080w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

A few years I was looking for a way to improve my Python development skills but also for a way to 'announce' when a Linux system had booted. I wrote [bootlace](https://github.com/IronicBadger/bootlace?ref=blog.ktz.me) to solve this problem using [Pushover.net](https://pushover.net/?ref=blog.ktz.me).

<h2 id="usage">Usage</h2>

  
To use bootlace you'll need Python installed as well as the contents of `requirements.yaml`.

```bash
git clone https://github.com/IronicBadger/bootlace.git
cd bootlace
pip install -r requirements.txt
```

Once installed, send a message using your Pushover API user and application tokens. For example:

```
python bootlace.py -m "Message content" -t "Application token" -u "Pushover user token" -d "Override device name" -T "Override notification title"
```

<h2 id="pushover-tokens">Pushover Tokens</h2>

  
Two tokens are required to use the Pushover API. The first is an application specific token. Begin by clicking `Create an Application/API token`.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image.png" class="kg-image" alt="" loading="lazy" width="1087" height="361" srcset="/content/images/size/w600/2020/07/image.png 600w, /content/images/size/w1000/2020/07/image.png 1000w, /content/images/2020/07/image.png 1087w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Next, fill out the information you want to provide for the application and find yourself a nice icon.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-1.png" class="kg-image" alt="" loading="lazy" width="1108" height="640" srcset="/content/images/size/w600/2020/07/image-1.png 600w, /content/images/size/w1000/2020/07/image-1.png 1000w, /content/images/2020/07/image-1.png 1108w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Then copy your application API Token/Key for use by bootlace.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-2.png" class="kg-image" alt="" loading="lazy" width="1089" height="992" srcset="/content/images/size/w600/2020/07/image-2.png 600w, /content/images/size/w1000/2020/07/image-2.png 1000w, /content/images/2020/07/image-2.png 1089w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Finally, on the main page take note of your User Key.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-3.png" class="kg-image" alt="" loading="lazy" width="1108" height="621" srcset="/content/images/size/w600/2020/07/image-3.png 600w, /content/images/size/w1000/2020/07/image-3.png 1000w, /content/images/2020/07/image-3.png 1108w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

<h2 id="configure-bootlace-to-run-at-reboot">Configure bootlace to run at reboot</h2>

  
Using cron we can run bootlace when the server reboots. First create a simple shell script to execute bootlace and save it as `bootlace.sh` somewhere. This example uses `/home/alex/bootlace.sh`.

```
#!/bin/bash

/usr/bin/python3 /home/alex/scripts/bootlace/bootlace.py -m "server booted" -t apptoken -u usertoken
```

Then add the task to cron.

```
@reboot /bin/bash /home/alex/bootlace.sh > /dev/null 2>&1
```

Then, reboot the server and...

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/IMAGE-2020-07-27-10-33-59.jpg" class="kg-image" alt="" loading="lazy" width="1080" height="394" srcset="/content/images/size/w600/2020/07/IMAGE-2020-07-27-10-33-59.jpg 600w, /content/images/size/w1000/2020/07/IMAGE-2020-07-27-10-33-59.jpg 1000w, /content/images/2020/07/IMAGE-2020-07-27-10-33-59.jpg 1080w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

<h2 id="wrap-up">Wrap-up</h2>

  
I've used bootlace for 6 years at this point for my own needs. However when writing this article I noticed that Pushover now provide examples for calling their API via curl and numerous other means. If you'd prefer not to have Python, you have another option!

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-4.png" class="kg-image" alt="" loading="lazy" width="1064" height="684" srcset="/content/images/size/w600/2020/07/image-4.png 600w, /content/images/size/w1000/2020/07/image-4.png 1000w, /content/images/2020/07/image-4.png 1064w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Good luck and please feel free to ask any questions over on Discord at [https://selfhosted.show/discord](https://selfhosted.show/discord?ref=blog.ktz.me). I'm there as @alexktz and on Twitter @IronicBadger.

Another interesting option that @Roxedus just made me aware of over on Discord is [Apprise](https://github.com/caronc/apprise?ref=blog.ktz.me). A single interface for multiple notification services.

Consider giving my podcast a listen over at [selfhosted.show](https://selfhosted.show/?ref=blog.ktz.me) if you found this interesting. Thanks!
