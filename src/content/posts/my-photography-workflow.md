---
title: My Photography Workflow
slug: my-photography-workflow
description: I received a tweet asking me about my photography workflow and whilst this is something that is constantly evolving I thought it might make sense to at least capture what I’m doing at the moment and share it with the world.
customExcerpt: I received a tweet asking me about my photography workflow and whilst this is something that is constantly evolving I thought it might make sense to at least capture what I’m doing at the moment and share it with the world.
publishedAt: 2019-10-15T21:51:48.000-04:00
updatedAt: 2026-05-07T07:22:43.000-04:00
featureImage: /content/images/2019/10/IMG_1810.jpg
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
ghostId: 6775c6279e78ea00017cbbf9
tags:
  - photography
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: photography
featured: false
readingTime: 5
---

I received a tweet asking me about my photography workflow and whilst this is something that is constantly evolving I thought it might make sense to at least capture what I’m doing at the moment and share it with the world.

<figure class="kg-card kg-embed-card"><blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hi <a href="https://twitter.com/IronicBadger?ref_src=twsrc%5Etfw&amp;ref=blog.ktz.me">@IronicBadger</a> if I remember correctly you were talking about Photography in one of <a href="https://twitter.com/jupitersignal?ref_src=twsrc%5Etfw&amp;ref=blog.ktz.me">@jupitersignal</a> Podcast. Can you share your workflow or can you point me to the right podcast episode? Thanks :D</p>— humbug (@humbugio) <a href="https://twitter.com/humbugio/status/1184102754006061056?ref_src=twsrc%5Etfw&amp;ref=blog.ktz.me">October 15, 2019</a></blockquote><script async="" src="https://platform.twitter.com/widgets.js" charset="utf-8"></script></figure>

I’m loathed to admit that my primary tool of choice for photo library management is Adobe Lightroom. This piece of software really does pretty much everything I need and for the rest, Photoshop is included in my subscription too. Like most people, I suspect, I have a love / hate relationship with Lightroom.

It’s a bit of heavyweight juggernaut and at times, feels intolerably slow to render full resolution pictures and adjustments but it’s the software that I keep coming back to time after time. Nothing else on the market quite matches Lightroom from a library management and hugely powerful adjustments toolkit perspective whilst simultaneously not being hideous and overly complex. Then there’s the subscription aspect to Adobe these days, I *HATE* this business model and would absolutely prefer to pay $250 every few years and own the software outright rather than a subscription model. Anyway, this isn’t an Adobe article but these are my feelings on the topic. I still mourn the loss of Apple’s Aperture software a few years back when they began to abandon their pro customers.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2019/10/IMG_7367.jpg" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Bay of Kotor, Montenegro 2015</figcaption></figure>

Generally speaking I’m not one to take photos every day or even every week. Most of my photos fall neatly into easily categorised trips which I represent with a parent folder and then usually one child folder per day depending on how shot heavy the trip is. Timelapses are an exception and they end up in a folder per timelapse inside the child day folder thus.

```
pictures/
└── 2019
    └── USA\ -\ Yellowstone
        ├── 20190701\ -\ Denver\ to\ Tetons
        │   └── Timelapses
        │       ├── TL1\ -\ Mountains
        │       ├── TL2\ -\ Mountains
        │       ├── TL3\ -\ Road
        └── 20190702\ -\ Tetons\ to\ Yellowstone
```

I almost always make sure to download the images off my SD card each night. Besides my rudimentary sorting into folders on import I generally don’t apply tags or do any other processing at this stage. Once the images are off my SD card I’ll then try to perform a time machine backup to an external hard drive before wiping the SD card. There’s a saying in the backup industry that one is none and that particularly applies to something you literally cannot recreate (a photograph) and this is at the forefront of my mind on a trip.

Once the backup to my external hard drive is complete I’ll then try to sync as much as possible back home overnight using BitTorrent Sync (now called Resilio Sync). In large cities hotel WiFi often has ridiculous upload speeds making this surprisingly practical but sometimes you can barely even get a single bar of phone signal, let alone internet above dial-up speeds so this is not a strategy to rely on. I’ve actually considered on more than one occasion purchasing an SD card per day of the trip so that I never have to wipe and have way more space than I’ll ever need but that feels excessive when you consider the images are on my laptop SSD plus the external 4tb WD USB drive I carry around. Recently, I purchased a SanDisk 1TB USB 3.1 SSD which has replaced the 4tb spinner on trips, mostly to save weight.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2019/10/IMG_4971.jpg" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Slovenia 2016</figcaption></figure>

After an image has been imported into the library I’ll go through and do some basic adjustments and make some edits picking out the images I like most from that day. To do this, I use the star rating tool in Lightroom. On the day of a picture I do not allow myself to rate anything higher than 2 stars because at this point you’re still way too emotionally attached to make an objective judgement about an image. Most images worth keeping get 1 star, the ones I think are exceptional get 2 stars and the rest are doomed to a starless life henceforth (I rarely, if ever, delete anything unless it’s just black or blurry). Hard drive space is cheap and who knows when that image might take my fancy in future years.

After my adjustments and edits are complete I’ll usually end up with anywhere from a few to a dozen images per day. Then it is time to write a blog post using ghost (the software that powers this site). This software has seen multiple updates over the years and continues to improve and go from strength to strength. One such example is the new galleries feature that lets you select up to a 9 images at once and place them in a gallery. I upload the images, give the post a catchy title and then begin to fill in the blanks between the images with memories and descriptions about what I was thinking at the time. And that’s a fairly typical travel evening with me. This process can take anywhere from 30 minutes to 2 hours+ depending on the day we’ve had.

Once I get home again there’s a whole 'nother routine to consider. Merging the laptop Lightroom library with the master Library that lives on a Windows 10 VM at home. To do this I ensure that Lightroom uses sidecar XMP files to write out any adjustments and then I simply ensure the folders are copied to my NAS and then ask my master instance of Lightroom to synchronize that directory. I usually use BTSync for this purpose but sometimes just copy the files manually over SMB or something, whatever works - it doesn’t matter.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2019/10/IMG_0069.jpg" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Brands Hatch Truck Racing 2017</figcaption></figure>

After the master library is up to date and reflects an accurate state of things Duplicati comes along each night and encrypts then backs up the whole lot to Google Drive and a small file server I have at my parents house in England (I’m in NC). My current gigabit upload makes light work of this and can back almost any trip up within a day or two completely. I also have Duplicati back up to a USB hard disk connected to my server which every 6 months or so and I swap with a geographically distant friend (all content is encrypted). By this point I have so many darned copies of this data that it would really take a catastrophic foul up on my end to loose all of the data. Famous last words!!

So there you have it, this is how I manage my photography workflow from a data library perspective including how I back that shit up.
