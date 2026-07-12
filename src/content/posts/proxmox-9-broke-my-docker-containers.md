---
title: Proxmox 9 broke my docker containers
slug: proxmox-9-broke-my-docker-containers
description: A simple but effective way to "fix" things is to disable apparmor, here's how.
customExcerpt: A simple but effective way to "fix" things is to disable apparmor, here's how.
publishedAt: 2025-08-17T21:35:18.000-04:00
updatedAt: 2026-05-07T07:21:24.000-04:00
featureImage: /content/images/2025/08/IMG_3451.jpg
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
ghostId: 68a27e2d1d015e0001e2a694
tags:
  - technical
  - proxmox
internalTags: []
primaryTag: technical
featured: false
readingTime: 2
---

[Proxmox 9](https://www.proxmox.com/en/about/company-details/press-releases/proxmox-virtual-environment-9-0?ref=blog.ktz.me) is out 🎉 with a whole host of wonderful upgrades and improvements.

Unfortunately, it prevents any of the docker containers I had running on the host itself from starting as Proxmox 9 ships with apparmor enabled but no default docker apparmor profile.

All containers that need access to the docker socket (*traefik*), or use an s6 overlay (any [Linuxserver.io](https://linuxserver.io/?ref=blog.ktz.me) image and 1000s more) are affected so I am sure this will trip up a lot of you over the coming weeks. Good luck!

After spending about an hour attempting to get a valid, but permissive, apparmor profile working I just needed a quick solution to get things up and running whilst I fixed the problem "properly".

The workaround came via a very old [GitHub issue](https://github.com/moby/moby/issues/41553?ref=blog.ktz.me#issuecomment-2056845244) showing how to disable apparmor for the entire docker daemon.

`$ systemctl edit docker`

```ini
[Service]
Environment=container="setmeandforgetme"
```

After you've edited the file, perform `systemctl daemon-reload` followed by `systemctl restart docker` and you should be up and running.

Hilariously, this works by setting the environment variable value for `container` to literally *any string*, and thus disabling apparmor. A frustrating concatenation of issues led me here for sure.

Keep an eye out for a more secure, betterer, more permanent solution but for tonight this will do nicely.

<h1 id="why-make-it-harder-for-your-users">Why make it harder for your users?</h1>

Apparmor is kind of like SELinux. It has rules that says which things can talk to which other things, what can create network sockets, and so on. It is a very useful security feature in production environments and significantly reduces attack vectors.

HOWEVER, my situation is in a homelab and to be honest I don't want or need that extra complexity.

The Proxmox developers have gone on record to say that you should not run docker containers directly on the host, but run them in a VM instead. Why? It's my system, I will [*hold it*](https://www.engadget.com/2010-06-24-apple-responds-over-iphone-4-reception-issues-youre-holding-th.html?ref=blog.ktz.me) *however I damn well want*.

Seriously, Proxmox is *such* a fantastic project but why make your product harder to use for the vast majority of folks running containers. Docker is the overwhelming leader in this space *not* LXCs.

Running containers on the host for me has several key advantages including (but not limited to):

-   not needing to fart around with PCI passthrough for GPU accelerated workloads (video transcoding, LLMs via an Nvidia GPU)
-   being able to share those hardware resources across multiple containers in a single, easy abstraction (docker)
-   simplicity of adminstration
-   simple and direct access to host storage

Users like the one in [this thread](https://forum.proxmox.com/threads/tip-if-you-would-like-to-host-docker-on-a-pve-9-host.169747/?ref=blog.ktz.me) make for a really bad smell around a project. And whilst [this thread](https://forum.proxmox.com/threads/docker-containers-fail-to-start-on-proxmox-9-debian-13-host-worked-fine-on-proxmox-8.169508/?ref=blog.ktz.me#post-790284) led me to my ultimate workaround tonight, it's frustrating to see folks defending what is ultimately a user hostile decision.

Over the years I have found tremendous benefits from simplifying the stack wherever I can in my homelab. I do enough tinkering and complex stuff at `$dayjob` and Proxmox provides the perfect blend of ZFS, container support, a useful webUI, stable releases, and flexibility because it's *just Linux*.

Stop making me feel bad about using my computer the way I want to. Just be happy we are here, using a tool to get a job done in the way we best see fit.
