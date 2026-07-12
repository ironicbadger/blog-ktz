---
title: Configure Unbound DNS for Openshift 4
slug: configure-unbound-dns-for-openshift-4
description: |-
  A little while ago I wrote a post over on openshift.com about installing Openshift 4 on VMware. Some of you reading it have asked me how I configured the DNS in my particular set up so this post aims to outline that for you.

  My current firewall software of choice is opnsense, a fork of the popular pfsense project. Both of these projects share a lot of DNA, including their usage of the DNS server unbound.

  Note this post was written to compliment the openshift.com blog post and was tested agains
customExcerpt: null
publishedAt: 2020-07-28T15:26:04.000-04:00
updatedAt: 2026-05-07T07:22:32.000-04:00
featureImage: https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc0f
tags:
  - openshift
  - linux
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: openshift
featured: false
readingTime: 4
---

A little while ago I wrote a post over on [openshift.com](https://www.openshift.com/blog/installing-ocp-4.3-on-vmware-with-upi?ref=blog.ktz.me) about installing Openshift 4 on VMware. Some of you reading it have asked me how I configured the DNS in my particular set up so this post aims to outline that for you.

My current firewall software of choice is [opnsense](https://opnsense.org/?ref=blog.ktz.me), a fork of the popular [pfsense](https://www.pfsense.org/?ref=blog.ktz.me) project. Both of these projects share a lot of DNA, including their usage of the DNS server [unbound](https://nlnetlabs.nl/projects/unbound/about/?ref=blog.ktz.me).

> Note this post was written to compliment the openshift.com blog post and was tested against OCP 4.3.

Configuring unbound wasn't particularly difficult but it did take a bit more Googling than I'd like to admit. Firstly you should examine the [DNS requirements](https://docs.openshift.com/container-platform/4.3/installing/installing_vsphere/installing-vsphere.html?extIdCarryOver=true&sc_cid=701f2000001OH74AAG&ref=blog.ktz.me#installation-dns-user-infra_installing-vsphere) for Openshift 4.

Here's how I laid out the hosts needed for a fairly minimal homelab grade cluster.

| Node | FQDN | IP Address | Other Info |
| --- | --- | --- | --- |
| lb | lb.ocp4.ktz.lan | 192.168.1.160 | RHEL7 |
| master1 | master1.ocp4.ktz.lan | 192.168.1.161 | etcd-0.ocp4.ktz.lan |
| master2 | master2.ocp4.ktz.lan | 192.168.1.162 | etcd-1.ocp4.ktz.lan |
| master3 | master3.ocp4.ktz.lan | 192.168.1.163 | etcd-2.ocp4.ktz.lan |
| worker1 | worker1.ocp4.ktz.lan | 192.168.1.164 |  |
| worker2 | worker2.ocp4.ktz.lan | 192.168.1.165 |  |
| webserver | ignition.ocp4.ktz.lan | 192.168.1.168 | RHEL7 |
| bootstrap | bootstrap.ocp4.ktz.lan | 192.168.1.169 | RHCOS |

<h2 id="requirements">Requirements</h2>

  
The following records need to be created and pointed at the load balancer. Do this under `Services -> Unbound DNS -> Overrides`. Top tip here is to use aliases.

```
* lb.ocp4.ktz.lan
* api.ocp4.ktz.lan
* api-int.ocp4.ktz.lan
```

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-8.png" class="kg-image" alt="" loading="lazy" width="1239" height="674" srcset="/content/images/size/w600/2020/07/image-8.png 600w, /content/images/size/w1000/2020/07/image-8.png 1000w, /content/images/2020/07/image-8.png 1239w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

<h3 id="wildcard-records">Wildcard records</h3>

  
The apps subdomain needs a wildcard entry. With Unbound on OPNsense you can do this via `Services -> Unbound DNS -> General -> Advanced -> Custom Options`.:

```conf
server:
local-zone: "apps.ocp4.ktz.lan" redirect
local-data: "apps.ocp4.ktz.lan 86400 IN A 192.168.1.160"
```

Verify with `dig`:

```shellsession
[alex@ktzTP redhat]$ dig *.apps.ocp4.ktz.lan +short
192.168.1.160
```

<h3 id="srv-records">SRV records</h3>

OPNsense uses Unbound and to create SRV records use the following code under `Services -> Unbound DNS -> General -> Advanced -> Custom Options`.

```
server:
local-data: "_etcd-server-ssl._tcp.ocp4.ktz.lan 180 IN SRV 0 10 2380 etcd-0.ocp4.ktz.lan."
local-data: "_etcd-server-ssl._tcp.ocp4.ktz.lan 180 IN SRV 0 10 2380 etcd-1.ocp4.ktz.lan."
local-data: "_etcd-server-ssl._tcp.ocp4.ktz.lan 180 IN SRV 0 10 2380 etcd-2.ocp4.ktz.lan."
```

Verify with `dig`:

```shellsession
[alex@ktzTP redhat]$ dig _etcd-server-ssl._tcp.ocp4.ktz.lan SRV +short
0 10 2380 etcd-0.ocp4.ktz.lan.
0 10 2380 etcd-1.ocp4.ktz.lan.
0 10 2380 etcd-2.ocp4.ktz.lan.
```

<h2 id="configuring-custom-options">Configuring custom options</h2>

  
Custom options are needed because not everything is configurable via the UI. Using the menu `Services -> Unbound DNS -> General` and the `Custom options` box (might be hidden under Advanced on first load).

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/07/unbound-dns-configuration.png" class="kg-image" alt="" loading="lazy" width="1202" height="1245" srcset="/content/images/size/w600/2020/07/unbound-dns-configuration.png 600w, /content/images/size/w1000/2020/07/unbound-dns-configuration.png 1000w, /content/images/2020/07/unbound-dns-configuration.png 1202w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

Here, we can configure some required custom options. Namely the SRV, PTR and wildcard records.

```
server:
local-data: "_etcd-server-ssl._tcp.ocp4.ktz.lan 180 IN SRV 0 10 2380 etcd-0.ocp4.ktz.lan."
local-data: "_etcd-server-ssl._tcp.ocp4.ktz.lan 180 IN SRV 0 10 2380 etcd-1.ocp4.ktz.lan."
local-data: "_etcd-server-ssl._tcp.ocp4.ktz.lan 180 IN SRV 0 10 2380 etcd-2.ocp4.ktz.lan."
local-zone: "apps.ocp4.ktz.lan" redirect
local-data: "apps.ocp4.ktz.lan 86400 IN A 192.168.1.160"
local-data-ptr: "192.168.1.161 etcd-0.ocp4.ktz.lan"
local-data-ptr: "192.168.1.162 etcd-1.ocp4.ktz.lan"
local-data-ptr: "192.168.1.163 etcd-2.ocp4.ktz.lan"
```

Next, we need to configure the overrides for each host. Use the `Services -> Unbound DNS -> Overrides` menu for this. Here's an overview of some of my entries.

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-6.png" class="kg-image" alt="" loading="lazy" width="935" height="394" srcset="/content/images/size/w600/2020/07/image-6.png 600w, /content/images/2020/07/image-6.png 935w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

To save configuring the same thing over and over you can make use of aliases so that if your master1 IP changes, etcd-0 will change with it. Like this:

<figure class="kg-card kg-image-card"><img src="/content/images/2020/07/image-7.png" class="kg-image" alt="" loading="lazy" width="1006" height="661" srcset="/content/images/size/w600/2020/07/image-7.png 600w, /content/images/size/w1000/2020/07/image-7.png 1000w, /content/images/2020/07/image-7.png 1006w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

That should be it. Feel free to reach out on to me Twitter, I'm @IronicBadger, with any questions or comments.

For more information on actually installing Openshift 4 you can refer to my original [blog post](https://www.openshift.com/blog/installing-ocp-4.3-on-vmware-with-upi?ref=blog.ktz.me) on openshift.com or [this github repo](https://github.com/IronicBadger/openshift-4.3-install-guide?ref=blog.ktz.me), which contains the artifacts required to deploy Openshift using automation.
