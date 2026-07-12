---
title: PiKVM - Control up to 4 servers simultaneously [archived]
slug: pikvm-controlling-up-to-4-servers-simultaneously
description: This is every homelabbers dream isn't it? Controlling multiple systems that don't have IPMI natively, remotely. Thanks to PiKVM, now we can.
customExcerpt: This is every homelabbers dream isn't it? Controlling multiple systems that don't have IPMI natively, remotely. Thanks to PiKVM, now we can.
publishedAt: 2021-07-01T16:38:17.000-04:00
updatedAt: 2026-05-07T07:21:38.000-04:00
featureImage: /content/images/2021/07/IMG_0041.jpg
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
ghostId: 6775c6279e78ea00017cbc21
tags:
  - technical
  - linux
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 3
---

This is every homelabbers dream isn't it? Controlling multiple systems that don't have IPMI natively, remotely. Thanks to [PiKVM](https://pikvm.org/?ref=blog.ktz.me), we've been able to do this on a 1:1 basis for a while - but I've found a HDMI/USB KVM switch which will let us up that number to 4:1.

<div class="kg-card kg-callout-card kg-callout-card-red"><div class="kg-callout-emoji">💡</div><div class="kg-callout-text">This post is out of date - see <a href="/use-1-pikvm-instance-to-control-4-systems/">https://blog.ktz.me/use-1-pikvm-instance-to-control-4-systems/</a> instead.</div></div>

PiKVM is designed to run on a Raspberry Pi 4 (it will run on a Zero but performance will be awful). It uses an HDMI CSI bridge adapter to capture the input from a remote system and using the OTG capabilities of the USB-C port on the Pi 4, spoofs standard HID devices like keyboard and mouse in software. All this is presented in a slick webUI which can handle up to 30fps like a champ.

With this software is possible to control a remote system as if you were sat in front of it. This includes getting into the BIOS and everything else - even virtual disk mounting is possible! There are full instructions on the PiKVM project website for ATX power control too allowing you to emulate pushing the buttons on your case.

<h2 id="hardware">Hardware</h2>

You will require the following hardware to make this work:

-   1x Raspberry Pi 4 (2GB is fine for PiKVM) - [](https://amzn.to/3xd3sfc?ref=blog.ktz.me)[https://amzn.to/3xd3sfc](https://amzn.to/3w990Gg?ref=blog.ktz.me)
-   1x HDMI-CSI bridge - [https://amzn.to/3hspyUk](https://amzn.to/3hspyUk?ref=blog.ktz.me)
-   1x HDMI/USB AIMOS KVM Switcher - [https://amzn.to/2UXwQrA](https://amzn.to/2UXwQrA?ref=blog.ktz.me)
-   1x *optional* USB C Power splitter - [https://www.pishop.us/product/usb-c-pwr-splitter/](https://www.pishop.us/product/usb-c-pwr-splitter/?ref=blog.ktz.me)

You should expect to pay around $60 for the KVM switcher, about $40 for the HDMI CSI bridge and about $50 for a Pi 4. Total cost will be comfortably under $200 even factoring in all the power supplies and other cables needed.

You'll also need a USB power splitter because the Pi 4 slurps up the juice. Full details on that can be found in the PiKVM project's [documentation](https://github.com/pikvm/pikvm?ref=blog.ktz.me#hardware-for-v2).

<figure class="kg-card kg-embed-card kg-card-hascaption"><iframe width="200" height="113" src="https://www.youtube.com/embed/iqQ5GAWHl38?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" loading="lazy" title="YouTube video player"></iframe><figcaption>Showing the 4:1 switching in action</figcaption></figure>

The above video was recorded a few minutes after I got this working a few days ago, it's not pretty but hopefully illustrates the point. Here's a basic wiring diagram that should help explain things a little more clearly.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/07/3F132013-EB64-4FFB-9592-ED9A2DE898AF.jpeg" class="kg-image" alt="" loading="lazy" width="1280" height="1037" srcset="/content/images/size/w600/2021/07/3F132013-EB64-4FFB-9592-ED9A2DE898AF.jpeg 600w, /content/images/size/w1000/2021/07/3F132013-EB64-4FFB-9592-ED9A2DE898AF.jpeg 1000w, /content/images/2021/07/3F132013-EB64-4FFB-9592-ED9A2DE898AF.jpeg 1280w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>An example of wiring up two servers to the KVM switch and then into the PiKVM Raspberry Pi</figcaption></figure>

It's absolutely critical to use a good power supply here as the Raspberry Pi 4 can pull up to 3 amps, most USB power supplies are 2 amps or less. The KVM switcher itself is USB bus powered (no AC adapter required).

<h2 id="pikvm-switching">PiKVM + Switching</h2>

To start, set up PiKVM as you would any other Raspberry Pi OS. Download the image, flash it to an SD card and boot. Default username in the webUI is admin/admin.

Once you've got the PiKVM software going it's simple to change between systems. Press `Ctrl, Ctrl 1` where 1 is the input number into the KVM of the system you want to switch to. So `Ctrl, Ctrl 2` would select input 2.

<h3 id="quicksync-and-power-saving">Quicksync and power saving</h3>

There might be some issues with Intel GPUs going to sleep if the input is not selected. A typical workaround to this is to use dummy HDMI dongles but here we can use HDMI to VGA to HDMI adapters, this tricks the GPU into negotiating an always on signal with the digital to analog converter meaning it won't go into power saving mode.

This step is optional and only needed if you're running Quicksync - other more expensive KVM switchers are available which spoof EDIDs on the switch so these converter dongles would not be needed. I haven't tested any of those though so please let me know in the comments if you find one that works this way.

<h2 id="podcast">Podcast</h2>

For more information about this we covered it in episode 48 of Self-Hosted.

<iframe src="https://player.fireside.fm/v2/dUlrHQih+p2FnTk26?theme=dark" width="740" height="200" frameborder="0" scrolling="no" loading="lazy" title="Embedded media"></iframe>
