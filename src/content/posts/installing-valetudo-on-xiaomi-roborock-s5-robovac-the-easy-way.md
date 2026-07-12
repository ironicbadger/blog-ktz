---
title: Installing Valetudo on Xiaomi Roborock S5 Robovac - The easy way!
slug: installing-valetudo-on-xiaomi-roborock-s5-robovac-the-easy-way
description: |-
  In December I wrote a convoluted post on obtaining the token from a Xiaomi robovac. I'm pleased to detail a much simpler way in this post.

  We are going to install Valetudo which is a standalone binary that runs on rooted Vacuums of the Xiaomi ecosystem and aims to enable the user to operate the robot vacuum without any Cloud Connection whatsoever.


  Reset the Robovac to Factory Settings

  First, reset the Robovac to factory settings.

   * Press and hold the recharge button for 3-5 seconds - do no
customExcerpt: null
publishedAt: 2020-10-05T22:28:30.000-04:00
updatedAt: 2026-05-07T07:21:57.000-04:00
featureImage: https://images.unsplash.com/photo-1573486095983-f95bf05c3ac2?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc18
tags:
  - technical
  - xiaomi
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

In December I [wrote](/getting-a-xiaomi-api-token-for-a-roborock-s5-to-link-with-home-assistant/) a convoluted post on obtaining the token from a Xiaomi robovac. I'm pleased to detail a *much* simpler way in this post.

We are going to install [Valetudo](https://github.com/Hypfer/Valetudo?ref=blog.ktz.me) which is a standalone binary that runs on **rooted Vacuums of the Xiaomi ecosystem** and aims to enable the user to operate the robot vacuum without any Cloud Connection whatsoever.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/10/image.png" class="kg-image" alt="" loading="lazy" width="362" height="81" decoding="async"></figure>

<h2 id="reset-the-robovac-to-factory-settings">Reset the Robovac to Factory Settings</h2>

First, reset the Robovac to factory settings.

-   Press and hold the recharge button for 3-5 seconds - *do not let go*
-   Use a pin to press the reset button under the flap by the dustbin whilst still holding the recharge button

You will hear the vacuum announce it is performing a factory reset that could take 5-10 minutes.

Once complete, the Robovac will start broadcasting a Wifi network 'roborock-xxxxxx' or something like that.

<h2 id="grab-a-laptop">Grab a laptop</h2>

These steps are largely a regurgitation of the Valetudo [installation documentation](https://valetudo.cloud/pages/installation/roborock.html?ref=blog.ktz.me).

Begin by downloading and/or compiling the firmware. The git repo [zvldz/vacuum](https://github.com/zvldz/vacuum?ref=blog.ktz.me) contains all the steps for compiling a custom firmware image, if you want to do this - you'll know.

Download a pre-compiled firmware image from [here](https://vacuumz.info/download/gen2/?ref=blog.ktz.me) (for example - `vacuum_1898_valetudo_0_6_1.pkg`)

Create a temporary directory and put the firmware pkg in it:

```bash
mkdir flasher
cd flasher
python3 -m venv venv
pip3 install python-miio
```

Next, connect to the Wifi network being broadcast by the Robovac. Note your IP address which should be `192.168.8.xxx`, we'll need it shortly. Then:

```
mirobo --debug discover --handshake true
```

This will output your token if it's a factory fresh Robovac:

```
(venv) alex@mooncake flasher % mirobo --debug discover --handshake true
INFO:miio.vacuum_cli:Debug mode active
INFO:miio.miioprotocol:Sending discovery to <broadcast> with timeout of 5s..
DEBUG:miio.protocol:Unable to decrypt, returning raw bytes: b''
DEBUG:miio.miioprotocol:Got a response: Container:
    data = Container:
        data = b'' (total 0)
        value = b'' (total 0)
        offset1 = 32
        offset2 = 32
        length = 0
    header = Container:
        data = b'!1\x00 \x00\x00\x00\x00\x0f\x91h%_{\xb8\xef' (total 16)
        value = Container:
            length = 32
            unknown = 0
            device_id = unhexlify('0f916825')
            ts = 2020-10-06 00:23:11
        offset1 = 0
        offset2 = 16
        length = 16
    checksum = b'\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff\xff' (total 16)
INFO:miio.miioprotocol:  IP 192.168.1.236 (ID: 0f916825) - token: b'ffffffffffffffffffffffffffffffff'
```

If you see `ffffffffff` like above, reset the vac again (which also resets the token).

Now you should be able to flash the custom firmware. I found it a little unreliable and on occasion had to run this command two or three times before the vac was successfully upgraded.

```
mirobo --ip 192.168.8.1 --token XXXXXXXXXXXXXXXX update-firmware --ip 192.168.8.xxx image.pkg
```

This will take 5-10 minutes. Once completed you will be able to connect to the vacuum at `192.168.8.1` and configure your real wifi credentials.

Enjoy your Valetudo flashed Vac. You might find, as I just did, that the Vac randomly resets itself after 6-12 months - if so you can just repeat this guide.
