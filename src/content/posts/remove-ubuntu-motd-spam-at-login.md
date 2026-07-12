---
title: Remove Ubuntu MOTD spam at login
slug: remove-ubuntu-motd-spam-at-login
description: For some reason lately the spam from Ubuntu at login via MOTD (message of the day) seems to have gotten worse. Here's how to remove it.
customExcerpt: For some reason lately the spam from Ubuntu at login via MOTD (message of the day) seems to have gotten worse. Here's how to remove it.
publishedAt: 2020-07-15T10:11:36.000-04:00
updatedAt: 2026-05-07T07:22:32.000-04:00
featureImage: https://images.unsplash.com/photo-1582502580092-0dc3088c7aeb?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc0d
tags:
  - linux
  - ansible
  - ubuntu
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: linux
featured: false
readingTime: 2
---

For some reason lately the spam from Ubuntu at login via MOTD (message of the day) seems to have gotten worse. Here's what I'm talking about:

```shellsession
[alex@ktzTP ~]$ ssh bastion
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-40-generic x86_64)

 * Documentation:  https://help.ubuntu.com
 * Management:     https://landscape.canonical.com
 * Support:        https://ubuntu.com/advantage

  System information as of Wed Jul 15 09:50:35 EDT 2020

  System load:  0.3                Processes:               220
  Usage of /:   45.0% of 19.56GB   Users logged in:         1
  Memory usage: 31%                IPv4 address for ens160: 192.168.1.1
  Swap usage:   0%                 IPv4 address for wg0:    192.168.13.1

 * "If you've been waiting for the perfect Kubernetes dev solution for
   macOS, the wait is over. Learn how to install Microk8s on macOS."

   https://www.techrepublic.com/article/how-to-install-microk8s-on-macos/

5 updates can be installed immediately.
0 of these updates are security updates.
To see these additional updates run: apt list --upgradable


Last login: Wed Jul 15 09:48:41 2020 from 192.168.1.101
```

Do I *really* need all that crap every time I open an SSH session? Often multiple times a day across multiple systems? No. No I don't.

The files responsible for this live in `/etc/update-motd.d/`. You could delete them by hand as you see fit but I manage close on a dozen systems so that's not going to work for me. These are the files I removed on Ubuntu 18.04 and 20.04, change the list as you see fit.

```bash
- 80-livepatch
- 95-hwe-eol
- 10-help-text
- 50-motd-news
```

Using Ansible this fits under the `all` hosts group tasks now when the distro = Ubuntu.

```yaml
  - hosts: all
    roles:
      - role: ironicbadger.ansible_role_bash_aliases
      - role: grog.package
      - role: geerlingguy.security
      - role: weareinteractive.environment
      - role: geerlingguy.ntp
    tasks:
      - name: remove ubuntu motd spam
        become: true
        file:
          path: "/etc/update-motd.d/{{ item }}"
          state: absent
        loop:
          - 80-livepatch
          - 95-hwe-eol
          - 10-help-text
          - 50-motd-news
        when: ansible_distribution == 'Ubuntu'
```

Voila, problem solved!

```shellsession
[alex@ktzTP ~]$ ssh bastion
Welcome to Ubuntu 20.04 LTS (GNU/Linux 5.4.0-40-generic x86_64)

System information as of Wed Jul 15 09:50:35 EDT 2020

  System load:  0.3                Processes:               220
  Usage of /:   45.0% of 19.56GB   Users logged in:         1
  Memory usage: 31%                IPv4 address for ens160: 192.168.1.1
  Swap usage:   0%                 IPv4 address for wg0:    192.168.13.1

5 updates can be installed immediately.
0 of these updates are security updates.
To see these additional updates run: apt list --upgradable

Last login: Wed Jul 15 09:50:51 2020 from 192.168.1.101
```
