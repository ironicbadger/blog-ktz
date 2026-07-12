---
title: Getting a Xiaomi API Token for a Roborock S5 to link with Home Assistant
slug: getting-a-xiaomi-api-token-for-a-roborock-s5-to-link-with-home-assistant
description: |-
  On Black Friday the Roborock S5 was discounted heavily enough that I bought one. I gave the Home Assistant Xiaomi Mi Robot Vacuum integration a look over before I did and browsed some reddit posts suggesting it was supported. Approximately 6 hours of frustration later, I finally got my API token. Here's how...

  Being no stranger to API keys, Personal Access Tokens and what have you I didn't really think that getting the token required for Home Assistant to connect with the Robot Vacuum could pos
customExcerpt: null
publishedAt: 2019-12-07T11:48:10.000-05:00
updatedAt: 2026-05-07T07:22:41.000-04:00
featureImage: https://images.unsplash.com/photo-1569698134101-f15cde5cd66c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbbfd
tags:
  - home-assistant
  - home-automation
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: home-assistant
featured: false
readingTime: 3
---

On Black Friday the Roborock S5 was discounted heavily enough that I bought one. I gave the Home Assistant [Xiaomi Mi Robot Vacuum](https://www.home-assistant.io/integrations/vacuum.xiaomi_miio/?ref=blog.ktz.me) integration a look over before I did and browsed some reddit posts suggesting it was supported. Approximately 6 hours of frustration later, I finally got my API token. Here's how...

Being no stranger to API keys, Personal Access Tokens and what have you I didn't really think that getting the token required for Home Assistant to connect with the Robot Vacuum could possibly be this involved or difficult. There are sections of the documentation on the Home Assistant integration page that walk you through various steps but they fail to tell you that the *order* you do these things is **vital**. Not only that but you also need to use specific versions of the [Mi Home](https://play.google.com/store/apps/details?id=com.xiaomi.smarthome&hl=en_US&ref=blog.ktz.me) app to be able to extract your token.

<h2 id="bill-of-materials">Bill of Materials</h2>

-   1 Android Phone running the latest version of [Mi Home](https://play.google.com/store/apps/details?id=com.xiaomi.smarthome&hl=en_US&ref=blog.ktz.me)
-   A second Android Phone (ideally rooted) to run an old version `5.4.54` of the [Mi Home](https://www.google.com/search?client=firefox-b-1-d&q=mi+home+5.4.54&ref=blog.ktz.me) app. I failed to get any of the non-rooted methods to work but luckily have an old OnePlus phone from a recent upgrade that I rooted.
-   Roborock S5 Robot Vacuum (I presume this works with any other Xiaomi subsiduary bot)
-   A PC type system with Android Debugging Tools such as `adb` enabled and working

<h2 id="setup-steps">Setup steps</h2>

Make sure you follow these steps in order because if you don't, your token will be reset midway through and you'll be sad.  
  
Note that many guides suggest version 5.0.x of the Mi Home app. This app no longer functions and I lost a good while to trying and failing with it. 5.4.54 worked fine and is my recommendation here.  

1.  Set up your Robovac with the latest version of Mi Home on your primary Android device as you normally would.
2.  Ensure successful operation using the latest Mi Home app and give the Vacuum a static IP in your router or however you do that on your LAN.
3.  Install version `5.4.54` of Mi Home on your second (rooted) Android device and login.
4.  Ensure you are using the same server on both devices (USA worked fine for me)
5.  Ensure successful operation using `5.4.54` (locate is a nice simple test)
6.  Using `adb` we will now extract the token from the rooted phone
7.  Use `adb shell` to connect to your device and become root (I used Magisck root so I have to do `adb shell -> su -> whoami` to ensure I'm root.
8.  Then run `grep -R '"token"' /data/data/com.xiaomi.smarthome` and you'll see your token

<figure class="kg-card kg-image-card"><img src="/content/images/2019/12/image-7.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

9\. Insert the token into your Home Assistant configuration YAML

```yaml
## roborock robovac
vacuum:
  - platform: xiaomi_miio
    host: 192.168.1.216
    token: thisisnotmyactualtokenbutyourswillbeexactly32characterslong
```

10\. We can then use the Home Assistant -> Developer Tools -> Call Service function to test out our integration thus

<figure class="kg-card kg-image-card"><img src="/content/images/2019/12/image-4.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

11\. Profit

<h2 id="conclusion">Conclusion</h2>

It really is that simple (lol). Xiaomi, if you're reading this, I find the whole process incredibly user hostile and frustratingly obscure. I scoured dozens of Github issues, forum posts and reddit posts for hours to get this working. Would it be so difficult to just give us an option under our account to access the API token like many other manufacturers do?
