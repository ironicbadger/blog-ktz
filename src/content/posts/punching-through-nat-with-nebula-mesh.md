---
title: Punching through tricky NAT with Nebula Mesh VPN and OPNSense
slug: punching-through-nat-with-nebula-mesh
description: OPNsense rewrites all outgoing UDP traffic by default - here's how to make Nebula work whilst traversing NAT which does this.
customExcerpt: OPNsense rewrites all outgoing UDP traffic by default - here's how to make Nebula work whilst traversing NAT which does this.
publishedAt: 2021-08-30T21:57:23.000-04:00
updatedAt: 2026-05-07T07:21:53.000-04:00
featureImage: https://images.unsplash.com/photo-1580691746056-4badd831b86e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDE3fHxldGhlcm5ldHxlbnwwfHx8fDE2MzAzNzQ5Nzg&ixlib=rb-1.2.1&q=80&w=2000
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
ghostId: 6775c6279e78ea00017cbc25
tags:
  - networking
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: networking
featured: false
readingTime: 2
---

[Nebula](https://github.com/slackhq/nebula?ref=blog.ktz.me) is a distributed mesh VPN and is written by the folks behind [Slack](https://slack.com/?ref=blog.ktz.me). Unlike traditional VPNs which typically rely on a hub and spoke topology Nebula is contextually aware of peer layout and routes packets between them intelligently.

For example, if two nodes are on the same LAN the mesh won't route packets via the "hub" but instead make a direct connection between these two hosts. This reduces unnecessary overhead and makes self-hosting a central server - or as Nebula calls it a *lighthouse* - on a bandwidth constrained VPS a viable proposition.

Furthermore, we can use Nebula to traverse NAT. As long as a node can connect to a publicly reachable *lighthouse* then the mesh can traverse NAT making firewall rules a thing of the past.

<h2 id="the-problem">The Problem</h2>

That is until a clever feature built-in to OPNsense and pfSense decide to make things more secure by rewriting all outgoing traffic using UDP - [details here](https://docs.netgate.com/pfsense/en/latest/nat/outbound.html?ref=blog.ktz.me#static-port). Due to this, you will find that nodes behind a \*sense based firewall are not able to talk to one another.

Take the following mesh topology for example:

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/08/image-10.png" class="kg-image" alt="" loading="lazy" width="851" height="721" srcset="/content/images/size/w600/2021/08/image-10.png 600w, /content/images/2021/08/image-10.png 851w" decoding="async"><figcaption>A typical Nebula topology with two hosts behind OPNsense firewalls</figcaption></figure>

However, in this example with the default firewall configuration nodes `10.10.10.2` and `10.10.10.3` cannot communicate with each other. Pinging each node will most likely show some kind of activity in the logs on both nodes however traffic will not successfully flow.

<h2 id="the-solution">The Solution</h2>

It's actually a really simple solution. I wish to thank @icebladerage on the Self-Hosted podcast Discord server for [providing the answer](https://discord.com/channels/693469700109369394/693473676527403048/882039853368348802?ref=blog.ktz.me).

You will need to create a firewall rule on each OPNsense firewall involved in the transaction to disable UDP port rewriting that looks like this:

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-11.png" class="kg-image" alt="" loading="lazy" width="998" height="117" srcset="/content/images/size/w600/2021/08/image-11.png 600w, /content/images/2021/08/image-11.png 998w" sizes="(min-width: 720px) 720px" decoding="async"><figcaption><code>Firewall -&gt; NAT -&gt; Outbound</code></figcaption></figure>

The mechanics of the rule look like this:

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/08/image-12.png" class="kg-image" alt="" loading="lazy" width="529" height="976" decoding="async"><figcaption>Ensure that Static-Port is ticked</figcaption></figure>

Save and apply the rule and your traffic will start to flow almost immediately.
