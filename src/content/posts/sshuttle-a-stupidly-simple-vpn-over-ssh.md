---
title: sshuttle - A stupidly simple "VPN" over SSH
slug: sshuttle-a-stupidly-simple-vpn-over-ssh
description: This simple tool is incredibly useful and allows me to route my DNS requests through an SSH tunnel enabling circumvention of firewalls, geo-location content blocks and even protects your traffic from the casual coffee shop packet sniffer.
customExcerpt: This simple tool is incredibly useful and allows me to route my DNS requests through an SSH tunnel enabling circumvention of firewalls, geo-location content blocks and even protects your traffic from the casual coffee shop packet sniffer.
publishedAt: 2020-02-27T12:54:00.000-05:00
updatedAt: 2026-05-07T07:22:38.000-04:00
featureImage: https://images.unsplash.com/photo-1571350062069-d9b582293bc4?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbb7a
tags:
  - ssh
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: ssh
featured: false
readingTime: 1
---

A few years ago I discovered one of those game changing tools. That tool is [sshuttle](https://github.com/sshuttle/sshuttle?ref=blog.ktz.me). This simple tool is incredibly useful and allows me to route my DNS requests through an SSH tunnel enabling circumvention of firewalls, geo-location content blocks and even protects your traffic from the casual coffee shop packet sniffer.

Installation on Linux is simple via most package managers. Mac is again simple using `brew`. You can also use pip to install `sshuttle` which is documented [here](https://sshuttle.readthedocs.io/en/stable/installation.html?ref=blog.ktz.me).

You can get started via the command line but \`sshuttle\` really comes into its own when wrapped with some bash aliases. Here's some of my examples...

```
alias stun='curl -4 ifconfig.co && sshuttle --dns --daemon --pidfile=/tmp/sshuttle.pid -x host.domain.com -r host 0/0 && curl -4 ifconfig.co'
alias xtun='[[ -f /tmp/sshuttle.pid ]] && kill $(cat /tmp/sshuttle.pid)'
```

Configuration of bash aliases varies a lot per OS so I won't include how to set that up here but those two lines above (typically they live in `~/.bashrc`) enable you to type `stun` and then have your traffic appear as if it originates via the target host. The two curl invocations show you your WAN IP address before and after the command. If everything went as expected your new IP should be the same as the public WAN IP of the SSH host you connected to.
