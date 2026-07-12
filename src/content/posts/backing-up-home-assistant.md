---
title: Backing up Home Assistant
slug: backing-up-home-assistant
description: |-
  HASSIO is probably the easiest way to run Home Assistant. It's a pre-packaged appliance aimed at a few key devices such as Raspberry Pi and so on. Being an appliance has pros and cons. The primary con is that installing software and advanced system configuration is not possible, though this is conversely also the primary advantage! You spend time with Home Assistant not administrating the system.

  Bad things happen and backups are your last line of defense in the event of hardware failure, theft
customExcerpt: null
publishedAt: 2019-12-09T15:39:15.000-05:00
updatedAt: 2026-05-07T07:22:40.000-04:00
featureImage: https://images.unsplash.com/photo-1562414962-a6b4f966070d?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbbfe
tags:
  - home-assistant
  - home-automation
  - linux
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: home-assistant
featured: false
readingTime: 2
---

[HASSIO](https://www.home-assistant.io/hassio/?ref=blog.ktz.me) is probably the easiest way to run Home Assistant. It's a pre-packaged appliance aimed at a few key devices such as Raspberry Pi and so on. Being an appliance has pros and cons. The primary con is that installing software and advanced system configuration is not possible, though this is conversely also the primary advantage! You spend time with Home Assistant not administrating the system.

Bad things happen and backups are your last line of defense in the event of hardware failure, theft or other disaster. There exist several plugins to backup your Home Assistant configuration to Dropbox or similar but I wanted something local and also something that used the built-in snapshotting functionality. I therefore wrote a little script that does this for me.

```bash
#!/bin/bash

# create new snapshot remotely
ssh hassio hassio snapshot new

# use rsync to copy only archives that dont already exist on NAS
rsync -rtvu hassio:/backup/ /mnt/storage/backups/hassio/archives/

# delete snapshots older than 14 days to save disk space
ssh hassio find /backup/ -type f -name '*.tar' -mtime +14 -exec rm {} \;

# rename tar files based on mtime
cd archives/
for f in *.tar
do
    mv -n "$f" "$(date -r "$f" +"%Y%m%d_%H%M%S").tar"
done
```

Let's break this down a bit. This script is set to run via cron every night at 3am on my Linux based home server, not hassio itself. Here is the crontab entry:

```
0 3 * * * /bin/bash /mnt/storage/backups/hassio/hassiobackup.sh 1> /mnt/storage/backups/hassio/backup.log 2> /mnt/storage/backups/hassio/error.log
```

This script relies on a Hassio plugin [SSH & Web terminal](https://github.com/hassio-addons/addon-ssh?ref=blog.ktz.me) which also provides some useful tools such as rsync. It runs ssh as a container on hassio so has some quirks but works fine for the job. Once you have the plugin install you must configure ssh to run with passwordless keys. Here is a snippet from my `.ssh/config` file:

```bash
# ~/.ssh/config

Host hassio
  User root
  Port 22222
  Hostname 192.168.1.17
```

You will need to add your ssh public key to the SSH & Web terminal container as explained [here](https://github.com/hassio-addons/addon-ssh?ref=blog.ktz.me#option-ssh-authorized_keys). Once you have your keys and `.ssh/config` file set up you will be able to ssh to the hassio instance using `ssh hassio`. Verifiy this and then ensure that the file paths in my script match what you want and then we're good to run it.

It's important to note that the script will delete any snapshots that are older than 14 days by default from HASSIO only. These files will remain available on your NAS or server for restore at any time.

Try it manually with `./hassiobackup.sh` as a test. The script expects to live in a directory one level above `archives` as it stores the backups themselves in this directory. One nice little feature is that the script modifies the useless `.tar` file name based on `mtime` so that your backup filenames have a date and timestamp in them.

After this is done I then backup these archives in an encrypted format to Google Drive using Duplicati but that is beyond the scope of this here article.

One final point. TEST YOUR BACKUPS. A backup is useless until you've tested it. Spin up a fresh instance of Hassio on another device, in a VM or whatever and restore your backup. It's worth doing this at least once every few months to be on the safe side given how important Home Assistant hopefully is to you and your house.
