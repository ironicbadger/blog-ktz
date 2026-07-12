---
title: Unprivileged LXCs are just a bit annoying
slug: proxmox-9-made-unprivileged-lxcs-pointless-for-quicksync-users
description: "Proxmox 9's AppArmor 4.1 upgrade broke Intel QuickSync monitoring in unprivileged LXC containers. The workarounds require such significant security compromises that privileged containers are arguably the only realistic option now. "
customExcerpt: "Proxmox 9's AppArmor 4.1 upgrade broke Intel QuickSync monitoring in unprivileged LXC containers. The workarounds require such significant security compromises that privileged containers are arguably the only realistic option now. "
publishedAt: 2025-09-29T21:07:34.000-04:00
updatedAt: 2026-05-07T07:21:22.000-04:00
featureImage: /content/images/2025/09/20210222_002939.jpg
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
ghostId: 68db27612699110001831c6e
tags:
  - technical
  - quicksync
  - proxmox
internalTags: []
primaryTag: technical
featured: false
readingTime: 4
---

Proxmox 9 shipped with AppArmor 4.1 in August 2025, and the new security restrictions make Intel GPU "passthrough" with monitoring tools like `intel_gpu_top` effectively impossible without either host-wide security reductions or abandoning the unprivileged model entirely.

Recently, I documented [a workaround](/proxmox-9-broke-my-docker-containers/) for issues the new AppArmor release introduced in my configuration. This led to folks suggesting that running docker containers on the Linux Proxmox host itself was "*evil"* (I jest but you know how comment sections can get).

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2025/09/image.png" class="kg-image" alt="" loading="lazy" width="655" height="409" srcset="/content/images/size/w600/2025/09/image.png 600w, /content/images/2025/09/image.png 655w" decoding="async"><figcaption><span style="white-space: pre-wrap;">Credit: Midwesternrodent at selfhosted.show/discord</span></figcaption></figure>

So, to dogfood what the "just run it in an LXC crowd" were espousing, I decided to attempt to port my homelab to LXCs this weekend - and follow all best practices in the process.

*It has not gone well*.

<h2 id="why-unprivileged-containers-matter">Why unprivileged containers matter</h2>

In a privileged LXC container, root inside the container is the same as root on the host. Container escapes means full host compromise. And whilst these escapes are rare, the LXC security team [doesn't consider](https://people.kernel.org/brauner/runtimes-and-the-curse-of-the-privileged-container?ref=blog.ktz.me) escape exploits in privileged containers as security issues because the isolation is minimal by design.

Unprivileged containers use UID/GID mapping to run as high-numbered users (100000+) on the host whilst appearing as root (UID 0) inside. Even if an attacker escapes, they're a nobody on the host with no privileges. It's the difference between "rebuild the container" versus "rebuild your entire hypervisor."

<h2 id="whats-broken">What's broken?</h2>

Proxmox VE 9.0 shipped with AppArmor 4.1, a major version jump from 3.x in the previous Proxmox release.

With this new release, any attempt to run `intel_gpu_top` in an unprivileged LXC fails with "Failed to initialize PMU! (Permission denied)" in unprivileged containers, even with correct GPU device passthrough. Privileged containers continue to work as you would expect.

Here's the frustrating part: **GPU transcoding still works fine**. You can pass `/dev/dri/renderD128` to your container and transcode just fine. Of course, we could just use `intel_gpu_top` on the host itself but that's not the point here is it?

There's also a great deal of complexity when it comes to mounting network shares and many other things the UID shifts introduce.

<h2 id="why-it-fails-technically">Why it fails technically</h2>

The `intel_gpu_top` tool needs access to Intel's PMU (Performance Monitoring Unit) through the Linux perf\_events interface via the `perf_event_open()` syscall. In unprivileged containers, this syscall crosses the UID remapping boundary. Container root (UID 0) becomes UID 100000+ on the host, and the kernel strips all capabilities.

Modern Linux distributions set `kernel.perf_event_paranoid` to 2 or higher (Debian/Ubuntu use 3-4), blocking performance monitoring for unprivileged users. Even setting it to -1 doesn't help because of UID remapping. AppArmor 4.1's stricter enforcement makes this worse.

<h2 id="your-options-theyre-all-bad">Your options (they're all bad)</h2>

**Option 1: Host-wide kernel parameter changes**

Set `kernel.perf_event_paranoid=0` on your Proxmox host. This reduces security system-wide. Every container and VM can now access performance monitoring, potentially leaking information about other processes.

**Option 2: Disable AppArmor confinement**

Add `lxc.apparmor.profile: unconfined` to your container config. You've removed the mandatory access control layer that prevents container escapes. You're left with just namespace isolation and UID mapping.

**Option 3: Combine both**

Many "successful" deployments use both workarounds. You've made host-wide security reductions AND disabled container-level protections just to monitor GPU usage.

**Option 4: Run privileged containers**

Set `unprivileged: 0` and accept that root in your LXC container equals root on your host. **At least you're being honest about your security posture.**

Here's the uncomfortable truth: if you're already making host-wide kernel changes or disabling AppArmor, running privileged containers is arguably more pragmatic. You've already accepted substantial security reductions. Privileged containers at least give you full functionality without pretending you've maintained security through half-measures.

**Option 5: Run privileged containers and rootless docker/podman**

We're getting a bit into Inception spinning top territory here but what if we combine everything in option 4 - run the LXC as `unprivileged: 0` but then also migrate our application containers to rootless podman? At least then we have the applications isolated from root as much as possible. Of course, not every container supports running rootless so this introduces its own set of problems. Sigh.

<h2 id="proxmox-is-changing-with-enterprise-focus">Proxmox is changing with enterprise focus</h2>

Proxmox has seen significant growth since Broadcom's VMware pricing changes in late 2023. The project is now competing for corporate deployments that demand security certifications and compliance checkboxes. And in a world where you're competing against Red Hat who have had SELinux for *years* at this point AppArmor seems like an obvious W.

And indeed, AppArmor 4.1's aggressive security posture makes sense for that audience. The challenge is that Proxmox's existing user base includes many homelabbers running exactly the workloads that broke, and we can be a bit of annoying, vocal bunch at times.. Media servers with QuickSync aren't exactly your typical enterprise use case.

Largely speaking theses changes are probably long term good for the Proxmox project in so much as they can make a business out of a truly excellent product. But is it good for the homelab user base that put them there overall? Time will tell.

<h2 id="the-practical-path-forward">The practical path forward</h2>

Every successful deployment of an unprivileged LXC in the forums I've been able to find involves either host-wide kernel changes, disabling AppArmor entirely, or both.

The most pragmatic solution I can come up with? Install `intel-gpu-tools` on the Proxmox host itself and run `intel_gpu_top` there. It shows GPU usage from all containers without configuration changes. This defeats the point of containerized monitoring, but that's where we are. Arguably it makes more sense to do it at the host level to get a holistic picture of the entire system so really you can argue this one either way.

But if you're running a homelab with QuickSync transcoding and need GPU monitoring, just run privileged containers. You've lost the security benefits anyway with host-wide kernel changes or unconfined AppArmor profiles.

The *security theater* of running "unprivileged" containers with `unconfined` AppArmor and modified kernel parameters is just that: theater. You're checking a box that says `unprivileged: 1` whilst undermining the mechanisms that make unprivileged containers meaningful.

Hopefully a solution comes along that will permit unprivileged LXCs to access a specific resource like the PMU but technically I do not know enough to know whether that's even feasible. Until then, `unprivileged: 0` it is.
