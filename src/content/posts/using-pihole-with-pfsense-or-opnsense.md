---
title: Using Pihole with pfsense or opnsense
slug: using-pihole-with-pfsense-or-opnsense
description: |-
  Pihole is a network wide ad blocker. Using DHCP we can tell every device on your network to automatically and transparently use Pihole for DNS. But what if you have custom DNS entries in your firewall? I use OPNsense but this process largely transposes to PFsense as well.

  When your laptop makes a DNS request, it is sent to Pihole. Pihole performs a lookup and if it can't find the requested address, forwards that request on to the next DNS server in the chain. If OPNsense has that DNS record in 
customExcerpt: null
publishedAt: 2020-05-20T13:36:08.000-04:00
updatedAt: 2026-05-07T07:22:34.000-04:00
featureImage: /content/images/2020/05/Untitled-2.png
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
ghostId: 6775c6279e78ea00017cbc09
tags:
  - pihole
  - networking
  - dns
  - technical
  - opnsense
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: pihole
featured: false
readingTime: 3
---

Pihole is a network wide ad blocker. Using DHCP we can tell every device on your network to automatically and transparently use Pihole for DNS. But what if you have custom DNS entries in your firewall? I use OPNsense but this process largely transposes to PFsense as well.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/05/image.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

When your laptop makes a DNS request, it is sent to Pihole. Pihole performs a lookup and if it can't find the requested address, forwards that request on to the next DNS server in the chain. If OPNsense has that DNS record in it's lookup caches or DNS configurations it will return it to the client. If not, it will go out to the upstream DNS provider (cloudflare or google or your ISP) and find it there instead. This process repeats until an authoritative DNS server is found for the requested lookup.

This allows you to use Pihole in conjunction with Unbound and perform network-wide ad-blocking but also retain complete custom local DNS control.

For the purposes of this post the following hostnames and IPs are used.

| Hostname | IP Address |
| --- | --- |
| firewall.ktz.lan | 192.168.1.254 |
| pihole.ktz.lan | 192.168.1.97 |

<h2 id="opnsense-dhcp-configuration">OPNsense DHCP configuration</h2>

First we need to tell every device on our network to use Pihole for DNS.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2020/05/image-1.png" class="kg-image" alt="" loading="lazy" decoding="async"><figcaption>Services -&gt; DHCPv4 -&gt; [LAN]</figcaption></figure>

The next time a device requests an IP via DHCP it will now also receive instructions to use `192.168.1.97` for DNS.

<h2 id="pihole-dns-configuration">Pihole DNS configuration</h2>

Next, we need to tell Pihole where to look when it doesn't know the answer. We want to send these requests to OPNsense, not the internet (yet).

<figure class="kg-card kg-image-card"><img src="/content/images/2020/05/image-2.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

One other thing you might wish to enable is `Conditional Forwarding`.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/05/image-4.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

Without this it will look like all DNS requests came from your firewall and not each individual client.

<h2 id="opnsense-dns-configuration">OPNsense DNS configuration</h2>

Under `System -> Settings -> General -> Networking` set your public upstream DNS providers. I used Cloudflare `1.1.1.1` and Google `8.8.8.8` but you can use whatever you like.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/05/image-3.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

<h2 id="conclusion">Conclusion</h2>

To test everything works as you'd like, create a DNS entry in Unbound on OPNsense under `Services -> Unbound DNS -> Overrides`. In my case I created `blogtest.ktz.lan` to point to `1.2.3.4`. Use `dig` to verify.

```shellsession
alex@stan ~ % dig blogtest.ktz.lan +short
1.2.3.4

alex@stan ~ % dig blogtest.ktz.lan

; <<>> DiG 9.10.6 <<>> blogtest.ktz.lan
;; global options: +cmd
;; Got answer:
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 22032
;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1

;; OPT PSEUDOSECTION:
; EDNS: version: 0, flags:; udp: 4096
;; QUESTION SECTION:
;blogtest.ktz.lan.		IN	A

;; ANSWER SECTION:
blogtest.ktz.lan.	3596	IN	A	1.2.3.4

;; Query time: 4 msec
;; SERVER: 192.168.1.97#53(192.168.1.97)
;; WHEN: Wed May 20 13:34:20 EDT 2020
;; MSG SIZE  rcvd: 61
```

Success! Digs output can be a little cryptic but note the `SERVER` output is `192.168.1.97`, which is our Pihole. However the custom entry is in Unbound on OPNsense so by this logic Pihole must have sent our DNS request on to OPNsense and returned the value we set. Proof it works! Huzzah!
