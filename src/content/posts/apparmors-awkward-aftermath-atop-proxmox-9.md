---
title: AppArmor's Awkward Aftermath Atop Proxmox 9
slug: apparmors-awkward-aftermath-atop-proxmox-9
description: Proxmox 9 looks great, but AppArmor keeps getting in the way
customExcerpt: Proxmox 9 looks great, but AppArmor keeps getting in the way
publishedAt: 2025-11-08T20:48:23.000-05:00
updatedAt: 2026-05-07T07:21:20.000-04:00
featureImage: https://images.unsplash.com/photo-1623681153891-2d2dc711beb0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDN8fGhhcmQlMjB0byUyMGxvdmV8ZW58MHx8fHwxNzYyNjUyODkwfDA&ixlib=rb-4.1.0&q=80&w=2000
featureImageAlt: null
featureImageCaption: '<span style="white-space: pre-wrap;">Photo by </span><a href="https://unsplash.com/@gpthree?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit"><span style="white-space: pre-wrap;">George Pagan III</span></a><span style="white-space: pre-wrap;"> / </span><a href="https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit"><span style="white-space: pre-wrap;">Unsplash</span></a>'
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 690fef12405f1d000176723f
tags:
  - technical
  - proxmox
internalTags: []
primaryTag: technical
featured: false
readingTime: 3
---

If you run Docker inside LXC containers on Proxmox you probably woke up this week to a fun surprise. Your containers won't start anymore. The error looks like this:

```
Error response from daemon: failed to create task for container: failed to create shim task: OCI runtime create failed: runc create failed: unable to start container process: error during container init: open sysctl net.ipv4.ip_unprivileged_port_start file: reopen fd 8: permission denied: unknown
```

This isn't a Proxmox bug. It's not even really a Docker bug. It's a security patch that landed in [containerd.io version 1.7.28-2](https://github.com/containerd/containerd/issues/12484?ref=blog.ktz.me) around November 5th fixing CVE-2025-52881, a critical container escape vulnerability. The fix involves reopening file descriptors for procfs operations which triggers AppArmor permission errors when running Docker inside nested LXC containers.

The technical details are actually kind of fascinating. Bear with me, I'll make it as simple as I can.

<h2 id="a-quick-detached-mounts-sidebar">A quick detached mounts sidebar</h2>

A detached mount is a filesystem mount that exists in the kernel but isn't attached to any path in the filesystem tree. Think of it like a mounted filesystem that's floating in memory without a mountpoint.

Normally when you mount something, it gets attached to a specific path thus:

```bash
mount /dev/sda1 /mnt/data  # attached to /mnt/data
```

A detached mount exists but has no path. You can only access it through file descriptors. Runc uses detached mounts as a security feature to avoid race conditions where an attacker could swap out mountpoints while runc is trying to access them.

The problem is that when the kernel tries to generate a pathname for files inside a detached mount (which AppArmor needs since it's path-based), it can only see the relative path from the mount root. So `/proc/sys/net/ipv4/ip_unprivileged_port_start` inside a detached procfs mount just looks like `/sys/net/ipv4/ip_unprivileged_port_start` to AppArmor because the `/proc` part doesn't exist in the filesystem tree.

It's basically a mismatch between two security features: runc's use of detached mounts to prevent path-based attacks, and AppArmor's path-based access control system that needs actual paths to make decisions.

In case you were curious, SELinux wouldn't have this problem because it's label-based rather than path-based.

SELinux assigns security labels (contexts) directly to files, processes, and other objects. When you access a file, SELinux checks if your process label is allowed to perform that action on the file's label.

<h2 id="how-we-do-fix-this">How we do fix this?</h2>

For now, the only way [I could find](https://github.com/opencontainers/runc/issues/4968?ref=blog.ktz.me) is to disable AppArmor entirely on a per LXC basis. Not exactly the ideal long term solution but for now, the only one available.

```
lxc.apparmor.profile: unconfined
lxc.mount.entry: /dev/null sys/module/apparmor/parameters/enabled none bind 0 0
```

OR  
  
As per this comment you can trick Docker into thinking AppArmor is disabled. Also yuck.

```
% mount --bind /dev/null /sys/module/apparmor/parameters/enabled
% systemctl restart docker
```

<h2 id="apparmor-you-are-making-this-hard">AppArmor, you are making this hard</h2>

Look, I get it. AppArmor exists for good reasons. It provides mandatory access control and helps contain potential security issues. But for homelab users and small deployments this stuff is beginning to get exhausting. This is not my first frustration with AppArmor since adopting Proxmox 9 a few months ago. The enterprise folks have teams to deal with this crap, the rest of us are just trying to run some containers.

Unfortunately, I just do not believe AppArmor is not fit for purpose, nor was Proxmox diligent or rigorous in their including it in Proxmox 9. I won't belabor the point any further here but I did [write about it recently](/proxmox-9-made-unprivileged-lxcs-pointless-for-quicksync-users/).

Proxmox is genuinely great software. And I have made countless videos both at [work](https://www.youtube.com/tailscale?ref=blog.ktz.me) and [personally](https://www.youtube.com/@ktzsystems?ref=blog.ktz.me) about it. The team does excellent work and the platform is rock solid for virtualization. But the AppArmor integration continues to be a source of friction that makes recommending it harder than it should be. I'm going to have to start to look for alternatives soon, not that there really are any. Ugh.
