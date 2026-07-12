---
title: Use 1 PiKVM instance to control 4 systems
slug: use-1-pikvm-instance-to-control-4-systems
description: And there we have it. One PiKVM able to control and view up to 4 systems at once. And with the addition of a USB thumb drive to the KVM we can even boot any ISO we want!
customExcerpt: And there we have it. One PiKVM able to control and view up to 4 systems at once. And with the addition of a USB thumb drive to the KVM we can even boot any ISO we want!
publishedAt: 2023-02-25T21:30:00.000-05:00
updatedAt: 2026-05-07T07:21:45.000-04:00
featureImage: /content/images/2023/02/Screenshot-2023-02-25-at-21.28.57.png
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
ghostId: 6775c6279e78ea00017cbc33
tags:
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 4
---

I've previously written about [this topic](/pikvm-controlling-up-to-4-servers-simultaneously/) but feel the need to post an update as after watching a recent [TechnoTim](https://youtu.be/aOgcqVcY4Yg?ref=blog.ktz.me) video, I have adopted a new 4x1 HDMI matrix which works a whole lot better.

The goal here is to use 1 PiKVM to control 4 servers "at once". By "at once", I mean "one at a time but with the ability to dynamically switch between up to 4 systems from a single PiKVM instance".

I know the Raspberry Pi 4 is practically impossible to buy these days but if you have one from the old days you can use, then this project still makes a ton of sense.

<h2 id="bill-of-materials">Bill of Materials</h2>

You will need:

| Item | Approx Price | Affiliate Link | Remarks |
| --- | --- | --- | --- |
| Raspberry Pi 4 | unobtanium | [rpilocator.com](https://rpilocator.com/?ref=blog.ktz.me) | 2gb model (or more) is fine |
| Raspberry Pi 4 USB-C PSU | $13 | [Amazon US](https://amzn.to/3EDgYyv?ref=blog.ktz.me) |  |
| Ezcoo HDMI 2.0 KVM Switch 4x1 | $140 | [Amazon US](https://amzn.to/3IwzsBU?ref=blog.ktz.me) |  |
| HDMI to CSI module for Pi | $33 | [Amazon US](https://amzn.to/3ECUn4W?ref=blog.ktz.me) |  |
| HDMI cables | $5+ | Amazon US |  |
| USB-C / Power OTG Splitter | $5 | [aliexpress](https://www.aliexpress.us/item/3256803607115029.html?gatewayAdapt=glo2usa&_randl_shipto=US&ref=blog.ktz.me) | You can [make your own](https://kaydron1000.github.io/pikvm/docs/hardware-diy/otg-splitter?ref=blog.ktz.me) if you like |

<h2 id="connection-diagram">Connection Diagram</h2>

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/02/image-9.png" class="kg-image" alt="" loading="lazy" width="1594" height="1133" srcset="/content/images/size/w600/2023/02/image-9.png 600w, /content/images/size/w1000/2023/02/image-9.png 1000w, /content/images/2023/02/image-9.png 1594w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

Note the MicroUSB from the Pi to the KVM switch? That's where the magic really happens! USB based input switching, more on this in a second.

<h2 id="pikvm-configuration">PiKVM configuration</h2>

Installation of PiKVM is much like any other Pi based imaging setup. Download the image from their website, flash it onto an SD card (or a USB drive if you prefer to live less dangerously) and boot the Pi. Update your system on first boot:

```bash
# login via ssh is root / root
$ rw
$ pacman -Syu
$ reboot
```

Now your PiKVM system is running, connect the matrix as shown in the wiring diagram above. Ensure there is nothing except a usb-c cable between the Pi usb-c port and your OTG usb-c splitter. I have the canakit Pi power switch and it strips the OTG functionality.

<div class="kg-card kg-callout-card kg-callout-card-grey"><div class="kg-callout-emoji">📖</div><div class="kg-callout-text"><a href="https://docs.pikvm.org/ezcoo/?ref=blog.ktz.me">Full documentation</a> on the Ezcoo matrix configuration is available from the PiKVM project.</div></div>

You should be able to test the switching functionality on the matrix itself now by pressing the `input` button. PiKVM natively supports controlling this matrix via USB directly making it much more reliable than previous attempts.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/02/image-8.png" class="kg-image" alt="" loading="lazy" width="1608" height="894" srcset="/content/images/size/w600/2023/02/image-8.png 600w, /content/images/size/w1000/2023/02/image-8.png 1000w, /content/images/size/w1600/2023/02/image-8.png 1600w, /content/images/2023/02/image-8.png 1608w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

In order to configure the `GPIO` menu you will need to edit the file `/etc/kvmd/override.yaml`. Assuming your matrix shows up on `/dev/ttyUSB0` (this is the default) the following code will require only minor naming adjustments. To check your TTY device in Linux use `sudo dmesg | grep TTY` looking for something like `[   12.927244] usb 1-1.4: ch341-uart converter now attached to ttyUSB0`.

<h2 id="code-snippet">Code snippet</h2>

Here's the snippet for `/etc/kvmd/override.yaml`:

```yaml
kvmd:
    gpio:
        drivers:
            ez:
                type: ezcoo
                protocol: 2
                device: /dev/ttyUSB0
            reboot:
                type: cmd
                cmd: [/usr/bin/sudo, reboot]
            restart_service:
                type: cmd
                cmd: [/usr/bin/sudo, systemctl, restart, kvmd]
        scheme:
            ch0_led:
                driver: ez
                pin: 0
                mode: input
            ch1_led:
                driver: ez
                pin: 1
                mode: input
            ch2_led:
                driver: ez
                pin: 2
                mode: input
            ch3_led:
                driver: ez
                pin: 3
                mode: input
            pikvm_led:
                pin: 0
                mode: input
            ch0_button:
                driver: ez
                pin: 0
                mode: output
                switch: false
            ch1_button:
                driver: ez
                pin: 1
                mode: output
                switch: false
            ch2_button:
                driver: ez
                pin: 2
                mode: output
                switch: false
            ch3_button:
                driver: ez
                pin: 3
                mode: output
                switch: false
            reboot_button:
                driver: reboot
                pin: 0
                mode: output
                switch: false
            restart_service_button:
                driver: restart_service
                pin: 0
                mode: output
                switch: false
        view:
            table:
                - ["#m1", ch0_led, ch0_button]
                - ["#c137", ch1_led, ch1_button]
                - ["#input3", ch2_led, ch2_button]
                - ["#input4", ch3_led, ch3_button]
                - ["#PiKVM", "pikvm_led|green", "restart_service_button|confirm|Service", "reboot_button|confirm|Reboot"]
```

Note that `table:` essentially creates a table in the drop down menu using commas as column separators. Here's a table help your understanding:

| Title | webUI LED | webUI button | webUI button2 |
| --- | --- | --- | --- |
| input1 | `ch0_led` | `ch0_button` |  |
| input2 | `ch1_led` | `ch1_button` |  |
| input3 | `ch2_led` | `ch2_button` |  |
| input4 | `ch3_led` | `ch3_button` |  |
| PiKVM control | `pikvm_led` | `restart service` | `reboot pi` |

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2023/02/image-11.png" class="kg-image" alt="" loading="lazy" width="2000" height="1317" srcset="/content/images/size/w600/2023/02/image-11.png 600w, /content/images/size/w1000/2023/02/image-11.png 1000w, /content/images/size/w1600/2023/02/image-11.png 1600w, /content/images/size/w2400/2023/02/image-11.png 2400w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption>Access your systems BIOS from a browser!</figcaption></figure>

<h2 id="the-usb-thumb-drive-trick">The USB thumb drive trick</h2>

Throw a USB thumb drive with [Ventoy](https://www.ventoy.net/en/index.html?ref=blog.ktz.me) on it into the USB 3.0 data ports on the front of the KVM and you'll be able to boot any ISO you'd like. For extra bonus points, try [netboot.xyz](https://netboot.xyz/?ref=blog.ktz.me) as one of those ISOs to *netboot* any ISO you'd like! It's so slick it's almost unbelievable!

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/02/image-12.png" class="kg-image" alt="" loading="lazy" width="1243" height="783" srcset="/content/images/size/w600/2023/02/image-12.png 600w, /content/images/size/w1000/2023/02/image-12.png 1000w, /content/images/2023/02/image-12.png 1243w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

<h2 id="conclusion">Conclusion</h2>

And there we have it. One PiKVM able to control and view up to 4 systems at once. And with the addition of a USB thumb drive to the KVM we can even boot any ISO we want!

In my testing so far this works flawlessly. The last version had some edge case weirdness around power on order due to HDMI power backfeed, but this solution seems to have no such issues.

If you're familiar with PiKVM and have been wanting to make it easier to control multiple systems "at once" then there's really never been a more polished solution than this. Huge thanks to the PiKVM project for this truly amazing project - they are launching the [PiKVM v4](https://www.kickstarter.com/projects/mdevaev/pikvm-v4?ref=blog.ktz.me) very soon! And thanks should also go to TechnoTim for putting me on this new ezcoo HDMI matrix.
