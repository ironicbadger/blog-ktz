---
title: A USB Fan Controller that now works under Linux
slug: a-usb-fan-controller-that-now-works-under-linux
description: Relying on the built-in motherboard headers on server grade motherboards to reliably control fans with Linux has been a crapshoot since forever. I'm pleased to report that last summer the Corsair Commander Pro received native Linux kernel driver support in the 5.9 release.
customExcerpt: Relying on the built-in motherboard headers on server grade motherboards to reliably control fans with Linux has been a crapshoot since forever. I'm pleased to report that last summer the Corsair Commander Pro received native Linux kernel driver support in the 5.9 release.
publishedAt: 2021-04-07T01:04:37.000-04:00
updatedAt: 2026-05-07T07:21:56.000-04:00
featureImage: https://images.unsplash.com/photo-1591238372408-8b98667c0460?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDR8fGNvbXB1dGVyJTIwZmFufGVufDB8fHx8MTYxNzc3MTg0Mw&ixlib=rb-1.2.1&q=80&w=2000
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
ghostId: 6775c6279e78ea00017cbc1f
tags:
  - technical
  - linux
  - hardware
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 3
---

Relying on the built-in motherboard headers on server grade motherboards to reliably control fans with Linux has been a crapshoot since forever. I can tune out a constant white noise pretty easily but the one thing that is unacceptable are fan notes that change wildly or oscillate.

Well my friends, I'm pleased to report that last summer the [Corsair Commander Pro](https://amzn.to/3fKRLq8?ref=blog.ktz.me) received native Linux kernel [driver](https://github.com/MisterZ42/corsair-cpro?ref=blog.ktz.me) support in the [5.9 release](https://lwn.net/Articles/824590/?ref=blog.ktz.me).

This device used to be Windows only so it was a really lovely surprise to find that this driver shipped last year. *BIG* thanks to the developer [Marius Zachmann](https://github.com/MisterZ42?ref=blog.ktz.me) who made this happen.

This sleek black box can be had for $40-75, I was fortunate enough to get mine for $40 because it seemed like a good idea before I realised it didn't support Linux and had to run a Windows VM for control. That changes today!

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2021/04/image.png" class="kg-image" alt="" loading="lazy" width="650" height="332" srcset="/content/images/size/w600/2021/04/image.png 600w, /content/images/2021/04/image.png 650w" decoding="async"></figure>

Configuration of this device is quite straightforward but is a little time consuming. You will need a kernel of at least 5.9 or later. I created a tiny Arch VM to run automatically on boot under ESXI and passed the USB device through to the guest for this purpose which uses 256mb of RAM.

<h2 id="configuration">Configuration</h2>

  
First you'll need to connect the Commander Pro to a USB header on your motherboard, hook up some fans and at least one temperature probe.

Next, ensure that `fancontrol` and `lm_sensors` are installed (this varies per distro so no instructions here).  Then run:

```
sensors-detect
```

Follow the prompts and you should see the fan speeds and temp probe readings like this:

```shellsession
[root@fancontrol ~]# sensors
corsaircpro-hid-3-2
Adapter: HID adapter
in0:          12.01 V
in1:           4.90 V
in2:           3.33 V
fan1 4pin:    898 RPM
fan2 4pin:    924 RPM
fan3 4pin:   1062 RPM
fan4 4pin:   1075 RPM
fan5 4pin:   1013 RPM
temp1:        +26.4°C
```

Now it's time to run `pwmconfig` and follow the prompts on the screen to test the various PWM values and how they interact with the RPM values of your fans. That process will look something like this:

<figure class="kg-card kg-image-card"><img src="/content/images/2021/04/image-1.png" class="kg-image" alt="" loading="lazy" width="919" height="783" srcset="/content/images/size/w600/2021/04/image-1.png 600w, /content/images/2021/04/image-1.png 919w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

At the end of the `pwmconfig` wizard you'll be asked to set which temp probe correlates to which fan. You might decide it's easier to configure these values later and hit the "just save" button.

Once you have a working config (my full config is posted at the end of this article), you can test things out by running `watch sensors` in one terminal window and then `fancontrol` in another. If things aren't working quite right make changes to `/etc/fancontrol` and then repeat running `fancontrol` and so on. If you're happy with the outcome then enable the fancontrol service with:

```
systemctl enable fancontrol --now
```

There you have it. Native fan control via a USB controller on Linux.

<h3 id="my-etcfancontrol-for-reference">My /etc/fancontrol for reference</h3>

The snippet below is my tweaked `/etc/fancontrol` file which took about 10 minutes of tweaking values to get everything just where I wanted. Hopefully it's a useful reference for you, `fancontrol` is quite helpful with errors if you screw up some values so tweak away!

```shellsession
[root@fancontrol ~]# cat /etc/fancontrol
# Configuration file generated by pwmconfig, changes will be lost
INTERVAL=2
DEVPATH=hwmon1=devices/pci0000:00/0000:00:11.0/0000:02:00.0/usb2/2-2/2-2.1/2-2.1:1.0/0003:1B1C:0C10.0002
DEVNAME=hwmon1=corsaircpro
FCTEMPS=hwmon1/pwm2=hwmon1/temp1_input hwmon1/pwm1=hwmon1/temp1_input hwmon1/pwm3=hwmon1/temp1_input hwmon1/pwm4=hwmon1/temp1_input hwmon1/pwm5=hwmon1/temp1_input
FCFANS=hwmon1/pwm2=hwmon1/fan2_input hwmon1/pwm1=hwmon1/fan1_input hwmon1/pwm3=hwmon1/fan3_input hwmon1/pwm4=hwmon1/fan4_input hwmon1/pwm5=hwmon1/fan5_input
MINTEMP=hwmon1/pwm2=50 hwmon1/pwm1=50 hwmon1/pwm3=50 hwmon1/pwm4=50 hwmon1/pwm5=50
MAXTEMP=hwmon1/pwm2=60 hwmon1/pwm1=60 hwmon1/pwm3=60 hwmon1/pwm4=60 hwmon1/pwm5=60
MINSTART=hwmon1/pwm2=24 hwmon1/pwm1=24 hwmon1/pwm3=16 hwmon1/pwm4=16 hwmon1/pwm5=16
MINSTOP=hwmon1/pwm2=24 hwmon1/pwm1=24 hwmon1/pwm3=115 hwmon1/pwm4=115 hwmon1/pwm5=165
MINPWM=hwmon1/pwm2=24 hwmon1/pwm1=24 hwmon1/pwm3=115 hwmon1/pwm4=115 hwmon1/pwm5=165
MAXPWM=hwmon1/pwm2=195 hwmon1/pwm1=165 hwmon1/pwm3=185 hwmon1/pwm4=185 hwmon1/pwm5=185
```
