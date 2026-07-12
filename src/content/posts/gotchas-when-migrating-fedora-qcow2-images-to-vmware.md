---
title: Gotchas when migrating Fedora qcow2 images to vmware
slug: gotchas-when-migrating-fedora-qcow2-images-to-vmware
description: My issue was that the initramfs didn't contain the necessary drivers for the emulated hardware and as such the VM refused to boot except into emergency mode.
customExcerpt: My issue was that the initramfs didn't contain the necessary drivers for the emulated hardware and as such the VM refused to boot except into emergency mode.
publishedAt: 2019-09-27T00:35:38.000-04:00
updatedAt: 2026-05-07T07:22:31.000-04:00
featureImage: /content/images/2019/09/Gotcha-Shutterstock-Arisa_J.jpg
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
ghostId: 6775c6279e78ea00017cbbf5
tags:
  - linux
  - vmware
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: linux
featured: false
readingTime: 2
---

In my [last post](/migrate-qcow2-images-from-kvm-to-vmware/) I described the steps I took to migrate a qcow2 based image from KVM to VMWare but I ran into an issue with Fedora. My issue was that the initramfs didn't contain the necessary drivers for the emulated hardware and as such the VM refused to boot except into emergency mode.

It took me a while to figure this one out because I can't read. Boot from an ISO and enter a chroot environment with the following commands from a terminal as root.

```
mkdir /mnt/sysimage
mount /dev/mapper/fedora-root /mnt/sysimage
mount /dev/sda1 /mnt/sysimage/boot

mount -o bind /dev /mnt/sysimage/dev
mount -o bind /proc /mnt/sysimage/proc
mount -o bind /sys /mnt/sysimage/sys
mount -o bind /run /mnt/sysimage/run

chroot /mnt/sysimage
```

Now you're inside a chroot and can execute commands as if you're booted into the system (well, close enough for our purposes here).

<figure class="kg-card kg-image-card"><img src="/content/images/2019/09/image-2.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

List the contents of `/boot` and then take note of your initramfs kernel version and run the following

```
mkinitrd -v -f /boot/initramfs-5.2.11-100.fc29.x86_64.img 5.2.11-100.fc29.x86_64
```

This should now build an initramfs with the kernel drivers required for the VM to boot successfully on the VMWare stack. Bear in mind because the live ISO we're booted from is probably running a different kernel to your installation you almost certainly will need to explicitly define the kernel to build for else `mkinitrd` will assume you mean the running kernel version. This is probably *not* what you want.

Some links on the internet will have you rebuilding grub2 too but I didn't find that to be required after the initramfs was fixed, but you can use these steps to fix grub problems as well which is quite handy!

Useful links:

-   [https://forums.fedoraforum.org/showthread.php?321349-Fedora-29-upgrade-to-30-grub-boot-fails-and-cannot-grub2-mkconfig-in-chroot](https://forums.fedoraforum.org/showthread.php?321349-Fedora-29-upgrade-to-30-grub-boot-fails-and-cannot-grub2-mkconfig-in-chroot=&ref=blog.ktz.me)
-   [https://kb.vmware.com/s/article/1002402](https://kb.vmware.com/s/article/1002402?ref=blog.ktz.me)
