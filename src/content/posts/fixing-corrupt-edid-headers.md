---
title: Fixing "kernel EDID has corrupt header" in Proxmox 8 and NixOS
slug: fixing-corrupt-edid-headers
description: |-
  Since fairly recently my Proxmox install has shown an almost barf inducing amount of errors along the lines of edid block 0 is all zeroes or kernel EDID has corrupt header. The issue is present on at least Promox 8.1.5 running kernel Linux 6.5.13-3-pve.

  Thanks for the fix goes to a couple of threads here and here.

  Some folks suggested disabling AST graphics, or blacklisting the i915 driver - this had no effect on my ASRock Rack E3C246D4U motherboard with i5 8500 CPU.

  This is a vanilla install
customExcerpt: null
publishedAt: 2024-03-23T20:36:12.000-04:00
updatedAt: 2026-05-07T07:21:36.000-04:00
featureImage: /content/images/2024/03/server.jpg
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
ghostId: 6775c6279e78ea00017cbc3f
tags:
  - linux
  - technical
  - proxmox
  - nixos
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: linux
featured: false
readingTime: 1
---

Since fairly recently my Proxmox install has shown an almost barf inducing amount of errors along the lines of `edid block 0 is all zeroes` or `kernel EDID has corrupt header`. The issue is present on at least Promox 8.1.5 running kernel `Linux 6.5.13-3-pve`.

Thanks for the fix goes to a couple of threads [here](https://forum.proxmox.com/threads/pve8-kernel-edid-has-corrupt-header.129409/?ref=blog.ktz.me) and [here](https://forum.proxmox.com/threads/grub-parameters-when-using-proxmox-boot-tool-refresh.118649/?ref=blog.ktz.me).

Some folks suggested disabling AST graphics, or blacklisting the i915 driver - this had no effect on my [ASRock Rack E3C246D4U](/asrock-rack-e3c246d4u-the-perfect-media-server-motherboard/) motherboard with i5 8500 CPU.

This is a vanilla install of Proxmox 8 straight from the ISO with almost no customisation and booted via EFI. If this is you, you can assume that you're using systemd-boot, and not grub. You will therefore need to modify *`/etc/kernel/cmdline`* by appending something like the following to the file.

```
root=ZFS=rpool/ROOT/pve-1 boot=zfs i915.fastboot=1 drm.edid_firmware=edid/1920x1080.bin
```

Note that this *must* all be on one line, with no random spaces. You may choose whatever resolution makes you most happy. I did 1080p as this box is hooked into a PiKVM.

Now perform an initramfs rebuild and reboot after it is done.

```
update-initramfs -u -k all && pve-efiboot-tool refresh
```

To verify the parameters applied at boot use

```bash
# cat /proc/cmdline
initrd=\EFI\proxmox\6.5.13-3-pve\initrd.img-6.5.13-3-pve root=ZFS=rpool/ROOT/pve-1 boot=zfs i915.fastboot=1 drm.edid_firmware=edid/1920x1080.bin
```

That should be that for Proxmox.

<h2 id="nixos">NixOS</h2>

Same idea applies to NixOS but all you need specify in your `configuration.nix` file is `boot.kernelParams = ["i915.fastboot=1" "drm.edid_firmware=edid/1280x1024.bin"];`. Followed of course with `nixos-rebuild switch` and a reboot to apply.

Full example [here](https://github.com/ironicbadger/nix-config/commit/ab77bbebb81e8930563d21f541e1850a0a551cf0?ref=blog.ktz.me).
