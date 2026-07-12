---
title: 4Kn sector disk passthrough in Proxmox
slug: 4kn-sector-disk-passthrough-in-proxmox
description: Solving an issue with 4Kn sector disks and passthrough in Proxmox with direct KVM arg injection.
customExcerpt: Solving an issue with 4Kn sector disks and passthrough in Proxmox with direct KVM arg injection.
publishedAt: 2024-09-11T20:25:41.000-04:00
updatedAt: 2026-05-07T07:21:34.000-04:00
featureImage: /content/images/2024/09/PXL_20240828_152231920.PORTRAIT.jpg
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
ghostId: 6775c6279e78ea00017cbc44
tags:
  - technical
  - linux
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 3
---

Recently I've been working on a [server project](https://www.youtube.com/watch?v=6CZad9Qjfxo&ref=blog.ktz.me) for Jupiter Broadcasting and as part of this project, we purchased 4x 14tb drives on the refurb market. I didn't really think too much about it at the time but 2 of these 4 were 4Kn (4k native sector) drives, not the more standard 512 byte sector disks we typically see.

This caused issue with passing the disks through with KVM and libvirt which only support 512 byte sector size. The solution? Inject raw KVM args into our Proxmox VM configuration template file. The materials used here was found [in this reddit thread](https://www.reddit.com/r/Proxmox/comments/s1oat1/passthrough_4knadvanced_format_disks_to_vm/?share_id=UMzEIhrOHmAiD_28AvevQ&ref=blog.ktz.me).

<h2 id="into-the-fold">Into the fold</h2>

Direct disk "passthrough" (it's not really passthrough but emulation via qemu) in Proxmox is relatively straightforward if you're only dealing with 512 byte disks - the Proxmox docs on the topic are [here](https://pve.proxmox.com/wiki/Passthrough_Physical_Disk_to_Virtual_Machine_\(VM\)?ref=blog.ktz.me).

To combat this KVM limitation we need to invoke `qm showcmd <VMID>` and add a hardcoded value of `logical_block_size=4096,physical_block_size=4096`. But first we need to add the disks to our VM so that we get a helping hand with the syntax kvm is expecting.

```bash
qm set 1001 -scsi5 /dev/disk/by-id/ata-WDC_WUH721414ALE6L4_9MG6ARZJ
qm set 1001 -scsi6 /dev/disk/by-id/ata-WDC_WUH721414ALE6L4_XJG0HXDM
qm set 1001 -scsi7 /dev/disk/by-id/ata-WDC_WUH721414ALN604_9MH2BWLU
qm set 1001 -scsi8 /dev/disk/by-id/ata-WDC_WUH721414ALN604_X1G4EPXL
```

The VM config which lives at `/etc/pve/qemu-server/VMID.conf` will now contain 4 disks mapped to the SCSI controllers assigned above (these numbers must be unique). Now we can run:

```bash
$ qm showcmd 1001
```

This will spew out a really long and intimidating looking raw kvm command used by Proxmox to interface with the VM. We need to extra the disks from this output. It can be a bit hard to find what you need at first so copy and paste the output into a text editor and make your life easier.

In the end the command we assemble for all 4 disks looks like this (note it is only required to do this on the 4k sector native disks but I wanted to pass the serial number for each disk through to the VM even on the 512byte disks - this is optional).

```bash
qm set 1001 -args \
" -device 'virtio-scsi-pci,id=virtioscsi5,bus=pci.3,addr=0x6' -drive 'file=/dev/disk/by-id/ata-WDC_WUH721414ALE6L4_9MG6ARZJ,if=none,id=drive-scsi5,format=raw,cache=none,aio=io_uring,detect-zeroes=on' -device 'scsi-hd,bus=virtioscsi5.0,channel=0,scsi-id=0,lun=5,drive=drive-scsi5,id=scsi5,serial=9MG6ARZJ' \
-device 'virtio-scsi-pci,id=virtioscsi6,bus=pci.3,addr=0x7' -drive 'file=/dev/disk/by-id/ata-WDC_WUH721414ALE6L4_XJG0HXDM,if=none,id=drive-scsi6,format=raw,cache=none,aio=io_uring,detect-zeroes=on' -device 'scsi-hd,bus=virtioscsi6.0,channel=0,scsi-id=0,lun=6,drive=drive-scsi6,id=scsi6,serial=XJG0HXDM' \
-device 'virtio-scsi-pci,id=virtioscsi7,bus=pci.3,addr=0x8' -drive 'file=/dev/disk/by-id/ata-WDC_WUH721414ALN604_9MH2BWLU,if=none,id=drive-scsi7,format=raw,cache=none,aio=io_uring,detect-zeroes=on' -device 'scsi-hd,bus=virtioscsi7.0,channel=0,scsi-id=0,lun=7,logical_block_size=4096,physical_block_size=4096,drive=drive-scsi7,id=scsi7,serial=9MH2BWLU' \
-device 'virtio-scsi-pci,id=virtioscsi8,bus=pci.3,addr=0x9' -drive 'file=/dev/disk/by-id/ata-WDC_WUH721414ALN604_X1G4EPXL,if=none,id=drive-scsi8,format=raw,cache=none,aio=io_uring,detect-zeroes=on' -device 'scsi-hd,bus=virtioscsi8.0,channel=0,scsi-id=0,lun=8,logical_block_size=4096,physical_block_size=4096,drive=drive-scsi8,id=scsi8,serial=X1G4EPXL' "
```

Now this is done edit the VM config file to remove the originally mapped (and now superflous) scsi device mappings or run:

```bash
qm unlink 1001 --idlist scsi5
qm unlink 1001 --idlist scsi6
qm unlink 1001 --idlist scsi7
qm unlink 1001 --idlist scsi8
```

Then, if all went well run:

```bash
qm start <VMID>
```

And your disks will show up with their native 4k sectors making ZFS and anything else fussy happy. Notice how each disk has a serial too and not just `sda` or whatever? Nice.

```shellsession
[root@moose-jbdata:~]# zpool status
  pool: jbdata
 state: ONLINE
config:

	NAME                                   STATE     READ WRITE CKSUM
	jbdata                                 ONLINE       0     0     0
	  mirror-0                             ONLINE       0     0     0
	    scsi-0QEMU_QEMU_HARDDISK_9MG6ARZJ  ONLINE       0     0     0
	    scsi-0QEMU_QEMU_HARDDISK_9MH2BWLU  ONLINE       0     0     0
	  mirror-1                             ONLINE       0     0     0
	    scsi-0QEMU_QEMU_HARDDISK_XJG0HXDM  ONLINE       0     0     0
	    scsi-0QEMU_QEMU_HARDDISK_X1G4EPXL  ONLINE       0     0     0

errors: No known data errors
```
