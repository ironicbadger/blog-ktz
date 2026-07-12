---
title: SplitDNS magic with Tailscale
slug: splitdns-magic-with-tailscale
description: Today, we're going to take a deep dive into the world of DNS. Specifically looking at Tailscale's magicDNS feature which allows us to do neat things like refer to our Tailnet devices by name or configure splitDNS to query remote DNS servers.
customExcerpt: Today, we're going to take a deep dive into the world of DNS. Specifically looking at Tailscale's magicDNS feature which allows us to do neat things like refer to our Tailnet devices by name or configure splitDNS to query remote DNS servers.
publishedAt: 2023-05-08T13:53:00.000-04:00
updatedAt: 2026-05-07T07:21:40.000-04:00
featureImage: /content/images/2023/05/140A5727.jpg
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
ghostId: 6775c6279e78ea00017cbc36
tags:
  - tailscale
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: tailscale
featured: false
readingTime: 7
---

By now, Tailscale is no secret. I've been using for a year or two now and it's been a total game changer for how I interact with my networks.

Gone are the days of generating my own Wireguard keys, finding a good way to keep them in sync across all my devices and whilst I do fully acknowledge that there are downsides in having someone else host my Wireguard keys, for me, it’s trade off in terms of convenience I’m willing to make. The biggest compliment I can give Tailscale is that it just works.

As self-hosters we’ve been trying to solve the problem of accessing our self-hosted services from anywhere in the world, without opening a single port in our firewalls since basically the beginning of time! And what if you are behind carrier grade NAT - meaning you don't have a publicly routable IP address? Or maybeeee, you don't want to use commercial VPN providers to pop-up in different geographic locations? For.... reasons?

That is the promise of Tailscale.

<iframe width="560" height="315" src="https://www.youtube.com/embed/Uzcs97XcxiE?si=JYQ9-1tcGfHQncrz" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" loading="lazy"></iframe>

Today, we're going to take a deep dive into the world of DNS. Specifically looking at Tailscale's magicDNS feature which allows us to do neat things like refer to our Tailnet devices by name or configure splitDNS to query remote DNS servers. I'll explain what all that means in a minute and show you how to get it all set up.

<h2 id="problem-statement">Problem statement</h2>

Alright. In order to visualize this let's imagine we have a remote network that we want to host some services in, perhaps a parents or a friends house. We don't want to expose these services to the internet but we do want to be able to access them via our browser using fully qualified domain names like `myservice.mumshouse.domain.com` wherever we are. We also want our parent to be able to access this service in their local network even if they aren't using Tailscale at all.

In order for this whole SplitDNS thing to be properly useful, we're going to need a local DNS server (in the remote network) and ideally some level of control over DHCP in the remote networks firewall or router and that's to ensure clients there get leases configured with our DNS server.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/05/image.png" class="kg-image" alt="" loading="lazy" width="823" height="635" srcset="/content/images/size/w600/2023/05/image.png 600w, /content/images/2023/05/image.png 823w" decoding="async"></figure>

We could throw this all in public DNS but that feels unnecessarily inefficient given how Tailscales local MagicDNS server caches responses.

If the request is a name found in your Tailnet, it never leaves your device. This is how Tailscales MagicDNS lets you talk to peers via names, not IPs. With SplitDNS the requests must leave the device. But they are forwarded onto a specific DNS server based on the subdomain in the request.

Official Tailscale docs for MagicDNS are [here](https://tailscale.com/kb/1081/magicdns/?ref=blog.ktz.me).

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2023/05/image-1.png" class="kg-image" alt="" loading="lazy" width="900" height="296" srcset="/content/images/size/w600/2023/05/image-1.png 600w, /content/images/2023/05/image-1.png 900w" decoding="async"><figcaption>How MagicDNS <a href="https://tailscale.com/blog/2021-09-private-dns-with-magicdns/?ref=blog.ktz.me">works</a></figcaption></figure>

We're also going to need a way to run a subnet router in the remote network. In my case if I can I run it either on an Opnsense firewall or if that isn't an option, I'll carve out a VM or use a Raspberry Pi or something like that.

One final thing before get into a real example... It's really, really important for your own sanity that the subnet ranges of all the networks in question do not overlap. Pick something unique for each site and it will make your life a whole lot easier. I find postal codes or house numbers helpful in IP ranges as a unique-ish identifier in either the second or third octet.

<h2 id="splitdns-example">SplitDNS example</h2>

I hope you're still visualizing the remote network because now I've decided that I want to deploy Nextcloud both here at home, and also at my parents house. To keep things simple for all of us, let's come up with a standardized naming scheme so its obvious what's going to be running where.

<figure class="kg-card kg-image-card"><img src="/content/images/2023/05/image-2.png" class="kg-image" alt="" loading="lazy" width="800" height="153" srcset="/content/images/size/w600/2023/05/image-2.png 600w, /content/images/2023/05/image-2.png 800w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Putting this model to work we have two entries now for our local and remote sites:

-   `nextcloud.dell-3060.ncusa.badgersbits.io`
-   `nextcloud.synology.lancsuk.badgersbits.io`

Now when we make these requests Tailscale knows thanks to the configuration we've done in our admin panel to forward any request for `lancsuk.badgersbits.io` to the local DNS server in my remote network.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/05/image-3.png" class="kg-image" alt="" loading="lazy" width="809" height="496" srcset="/content/images/size/w600/2023/05/image-3.png 600w, /content/images/2023/05/image-3.png 809w" decoding="async"></figure>

Note that the matching is done at the site level, not at the service or host level. We could do that but it would get messy quite fast having one entry per service in our DNS server. Wildcards make this easy for us and it's why I recommend a 5 layer deep domain name. Wildcards all the way down baby!

Next, we make use of another layer of wildcards by using the HOST level subdomain to send all DNS requests that specific host. Finally in this example, we rely on the reverse proxy running on the target node itself to match the entire domain name to the service that we wanted to view.

If you have a very simple network with only 1 or 2 hosts, you might be able to omit the host level subdomain in your network and just point all requests for that site to your presumably singular reverse proxy directly.

<h2 id="dns-request-flow-overview">DNS request flow overview</h2>

The anatomy of a DNS request flow in this example is as follows:

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/05/image-7.png" class="kg-image" alt="" loading="lazy" width="810" height="409" srcset="/content/images/size/w600/2023/05/image-7.png 600w, /content/images/2023/05/image-7.png 810w" decoding="async"></figure>

This is Split DNS in action. The process of sending requests to different places based on matching the contents of a portion of a URL.

<h2 id="demo-environment-overview">Demo environment overview</h2>

Here's the layout of the demo environment used in the YouTube video. Tailscale is installed on OPNsense and enabled as a subnet router to provide access to all of the systems available in the remote location.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/05/image-4.png" class="kg-image" alt="" loading="lazy" width="819" height="670" srcset="/content/images/size/w600/2023/05/image-4.png 600w, /content/images/2023/05/image-4.png 819w" decoding="async"></figure>

<h2 id="tailscale-admin-dashboard">Tailscale admin dashboard</h2>

For the configuration portion I highly recommend hopping over to the YouTube video as there's a lot of stuff to go over.

The short version is, install Tailscale and enable a subnet router with

```
tailscale up --advertise-routes 192.168.150.0/24
```

Then in the Tailscale DNS settings add a new nameserver with your remote DNS server `192.168.150.2` as the IP, and `demosite1.badgersbits.io` as the domain.

<figure class="kg-card kg-image-card"><img src="/content/images/2023/05/image-6.png" class="kg-image" alt="" loading="lazy" width="525" height="502" decoding="async"></figure>

Here's all the commands I ran in the video in one spot in case they're helpful.

```
+ login to opnsense via ssh
		+ fetch -o /usr/local/etc/pkg/repos/mimugmail.conf https://www.routerperformance.net/mimugmail.conf
	+ pkg update
	+ pkg install tailscale
	+ service tailscaled enable
	+ service tailscaled start
	+ tailscale up --advertise-routes=192.168.150.0/24

+ remote pihole wildcards
	+ /etc/dnsmasq.d
	+ can't set wildcards in the UI
```

<h2 id="recap">Recap</h2>

Pretty cool, right? Users in remote sites are happy with their local dns and it just works. And I can ensure their remote sites are working just fine as well. All transparently.

The upside for me is if I want to host any services in a quiet, dark corner of their network, all I have to do is access them via their site based DNS entry. It keeps things really logically organized and simple.

In fact, this is exactly what I do with backing up my systems. I'll be making a full video on my backup regime in the future but the simple version is that I am running Minio, an S3 compatible storage backend, in a container on a Synology at my parents house. Restic, or more accurately a wrapper I use called Autorestic, queries the DNS for "minio.syno.lancs.domain.com" and gets automatically routed via the Tailnet from here in Raleigh to the Synology box in the UK.

The only real gotcha to all of this is that for the node you're querying from to have the correct routing and knowledge of these remote DNS servers, it must be connected to the tailnet itself. Not a huge deal but certainly something to consider when designing a solution like this.

<h2 id="tailscale-pricing">Tailscale Pricing</h2>

[https://tailscale.com/blog/pricing-v3/](https://tailscale.com/blog/pricing-v3/?ref=blog.ktz.me)

Tailscale made some changes to their pricing structures reducing the limits on the free tier for the numbers of subnet routers, increasing the number of nodes in a Tailnet to 100 and maintain that their business model is based around getting more technical users excited and interested in Tailscale, who'll then take it into work and monetize the product that way. I love this approach and applaud Tailscale for doing it.

<h2 id="outro">Outro</h2>

From an overall solution point of view, it is worth remembering that all of these rules are completely arbitrary and work for me. You're totally at liberty to make up your own naming conventions, rules and break them whenever you like. Whatever works for you - it is your infrastructure after all.

Same goes for my choice of Pihole and Opnsense in the remote subnet. Use whatever you like, Tailscale runs on damn near any OS after all. There are 1000 ways to make a solution like this work. Today's video was designed to give you the understanding to design your own solution, let me know in the comments down below what you end up doing. Also down in the description is a link to a blog post where all of the diagrams from this video can be found.

That's Tailscales MagicDNS in a nutshell. A really simple but very powerful way to route DNS requests around to different endpoints with no client-side configuration or complex routing table foo required.

I've been Alex from KTZ systems and as always, thank you so much for ~watching~ reading :)
