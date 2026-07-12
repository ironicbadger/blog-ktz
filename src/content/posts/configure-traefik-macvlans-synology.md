---
title: Configuring Traefik on Synology DSM7 using docker macvlans
slug: configure-traefik-macvlans-synology
description: Recent changes in DSM7 have made guaranteeing being able to free up ports 80/443 for use by traefik rather difficult. Using a combination of several advanced techniques with docker networking we can circumvent this requirement once and for all with the macvlan driver.
customExcerpt: Recent changes in DSM7 have made guaranteeing being able to free up ports 80/443 for use by traefik rather difficult. Using a combination of several advanced techniques with docker networking we can circumvent this requirement once and for all with the macvlan driver.
publishedAt: 2022-08-14T16:44:21.000-04:00
updatedAt: 2026-05-07T07:21:48.000-04:00
featureImage: https://images.unsplash.com/photo-1446770145316-10a05382c470?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDJ8fGJsdWUlMjByaWRnZSUyMHBhcmt3YXl8ZW58MHx8fHwxNjYwNTA5MzI5&ixlib=rb-1.2.1&q=80&w=2000
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
ghostId: 6775c6279e78ea00017cbc2c
tags:
  - docker
  - technical
  - traefik
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: docker
featured: false
readingTime: 5
---

Recent changes in DSM7 have made guaranteeing being able to free up ports 80/443 for use by traefik rather difficult. Using a combination of several advanced techniques with docker networking we can circumvent this requirement once and for all with the [macvlan](https://docs.docker.com/network/macvlan/?ref=blog.ktz.me) driver.

You can find the necessary scripts and resources covered in this post in the gist linked below.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://gist.github.com/ironicbadger/230f66ee7092d9259f695580351ce5d3?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">1-macvlan-setup</div><div class="kg-bookmark-description">GitHub Gist: instantly share code, notes, and snippets.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://github.githubassets.com/favicons/favicon.svg" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">Gist</span><span class="kg-bookmark-publisher">262588213843476</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://github.githubassets.com/images/modules/gists/gist-og-image.png" alt="" loading="lazy" decoding="async"></div></a></figure>

<h2 id="overview">Overview</h2>

The macvlan driver gives each container on your system a "real" IP on your LAN. Why is this useful? In our case we need traefik (our reverse proxy) to bind to ports 80 and 443 but DSM already uses these ports when using the standard docker bridge. Only one service can bind to a port on a specific IP at a time.

By using macvlan to give traefik a real IP, we are able to have traefik bind to ports 80 and 443 and leave DSM alone. This negates the need to patch DSM every time there's an update and will be far less brittle in future.

<figure class="kg-card kg-embed-card kg-card-hascaption"><iframe width="200" height="113" src="https://www.youtube.com/embed/bKFMS5C4CG0?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen="" title="Docker networking is CRAZY!! (you NEED to learn it)" loading="lazy"></iframe><figcaption>networkchuck has this excellent primer on docker networking</figcaption></figure>

However, if we put traefik into it's own network using macvlan then we have to solve another problem. How do the other containers on the system, which are most likely using the default bridge driver, route traffic between the Synology host and the "real" IP we gave to traefik?

The solution is in practice quite simple, but conceptually takes a bit to wrap your head around. We create a new docker bridge network - called `frontend` in the example code - and then add traefik to both the macvlan network **and** the `frontend` network. The final piece is to create a route so that packets from the Synology box end up where they're supposed to - for example `ip route add 192.168.44.204/30 dev macvlan0`.

The end result is traefik is able to serve traffic on its own IP on the LAN and route traffic to containers running on the Synology itself.

<h2 id="configuration">Configuration</h2>

This post was written and tested again `DSM 7.1-42661 Update 4` in September 2022.

The first step is to identify the network adapter to create the macvlan interface against. If you've been using Virtual Machine manager your interfaces will start `ovs_ethX` or if you have a bonded network you'll see something `bond0`. In my case, `ovs_eth0` was the interface. Use `ip link` to find yours.

```shellsession
alexktz@elrond:~$ ip link
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536 qdisc noqueue state UNKNOWN mode DEFAULT group default qlen 1
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: sit0@NONE: <NOARP> mtu 1480 qdisc noop state DOWN mode DEFAULT group default qlen 1
    link/sit 0.0.0.0 brd 0.0.0.0
3: eth0: <BROADCAST,MULTICAST,SLAVE,UP,LOWER_UP> mtu 1500 qdisc pfifo_fast master ovs-system state UP mode DEFAULT group default qlen 1000
    link/ether 00:11:32:e4:58:23 brd ff:ff:ff:ff:ff:ff
    
...

8: ovs_eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc noqueue state UP mode DEFAULT group default qlen 1
    link/ether 00:11:32:e4:58:23 brd ff:ff:ff:ff:ff:ff
```

Add the `macvlan0` interface with the following command.

```
ip link add macvlan0 link ovs_eth0 type macvlan mode bridge
```

Next, figure out the range of IPs you'll be using with [this website](https://www.ipaddressguide.com/cidr?ref=blog.ktz.me). In my example I used `192.168.44.204/30` which is the range `204-207`.

```
ip addr add 192.168.4.204/30 dev macvlan0
ip link set macvlan0 up
```

The final step for the macvlan side of things is to add the route so that containers running on the Synology box know where to route the packets intended for traefik.

```
ip route add 192.168.44.204/30 dev macvlan0
```

Now we move onto the docker side of the configuration. The first step here is to create the docker network for traefik to communicate with containers on the Synology host (not using the macvlan driver).

```bash
docker network create frontend
```

The rest of the configuration is handled in the docker-compose file. The full file is available in this gist.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://gist.github.com/ironicbadger/230f66ee7092d9259f695580351ce5d3?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">1-macvlan-setup</div><div class="kg-bookmark-description">GitHub Gist: instantly share code, notes, and snippets.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://github.githubassets.com/favicons/favicon.svg" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">Gist</span><span class="kg-bookmark-publisher">262588213843476</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://github.githubassets.com/images/modules/gists/gist-og-image.png" alt="" loading="lazy" decoding="async"></div></a></figure>

Let's examine a few specific sections of that compose file. First, note that the traefik container is a member of two networks.

```yaml
  traefik:
    image: traefik
    container_name: tr
    ...
    networks:
      macvlan:
        ipv4_address: 192.168.44.204
      frontend:
    restart: unless-stopped
```

You can see that the traefik container has the IP `192.168.44.204`. I created a wildcard DNS entry in my DNS server pointing to this IP (not the Synology box anymore where traefik used to live). traefik is also a member of the `frontend` network.

At the end of the compose file there is a section where we define the docker networks explicitly.

```yaml
networks:
  frontend:
    external: true
  macvlan:
    name: macvlan
    driver: macvlan
    driver_opts:
      parent: ovs_eth0
    ipam:
      config:
        - subnet: 192.168.44.0/24
          ip_range: 192.168.44.204/30
          gateway: 192.168.44.254
```

You'll need to adjust the values to suit your configuration but hopefully it's straightforward from here.

Next, let's examine the test nginx container. You'll see that it is a member only of the `frontend` network and that there are no ports exposed publicly. traefik handles all public facing traffic and routes it around under the hood.

```yaml
  nginxtest:
    image: nginx
    container_name: nginxtest
    labels:
      - traefik.http.routers.nginxtest.rule=Host(`test.domain.com`)
    networks:
      - frontend
```

<h2 id="automating-interface-creation-on-reboot">Automating interface creation on reboot</h2>

The final piece of this puzzle is automate the creation of the macvlan interface on reboot.

First, create a script on the filesystem with the following contents (making sure to adjust the values as you need for your setup).

```bash
## get interface name (ovs_eth0 below) via ip link
ip link add macvlan0 link ovs_eth0 type macvlan mode bridge
##192.168.4.204/30 (204-207)
ip addr add 192.168.4.204/30 dev macvlan0
ip link set macvlan0 up
ip route add 192.168.44.204/30 dev macvlan0
```

Make sure the script is executable `chmod +x /path/to/script.sh`.

Next, using the Synology webUI add a scheduled task to execute this script *as root* on boot. It must be root or it will not have the required permissions to run.

<figure class="kg-card kg-gallery-card kg-width-wide kg-card-hascaption"><div class="kg-gallery-container"><div class="kg-gallery-row"><div class="kg-gallery-image" style="flex: 1.372684 1 0%"><img src="/content/images/2022/09/Screen-Shot-2022-09-24-at-21.46.05.png" width="2000" height="1457" loading="lazy" alt="" srcset="/content/images/size/w600/2022/09/Screen-Shot-2022-09-24-at-21.46.05.png 600w, /content/images/size/w1000/2022/09/Screen-Shot-2022-09-24-at-21.46.05.png 1000w, /content/images/size/w1600/2022/09/Screen-Shot-2022-09-24-at-21.46.05.png 1600w, /content/images/2022/09/Screen-Shot-2022-09-24-at-21.46.05.png 2226w" sizes="(min-width: 720px) 720px" decoding="async"></div><div class="kg-gallery-image" style="flex: 1.325381 1 0%"><img src="/content/images/2022/09/Screen-Shot-2022-09-24-at-21.46.00.png" width="2000" height="1509" loading="lazy" alt="" srcset="/content/images/size/w600/2022/09/Screen-Shot-2022-09-24-at-21.46.00.png 600w, /content/images/size/w1000/2022/09/Screen-Shot-2022-09-24-at-21.46.00.png 1000w, /content/images/size/w1600/2022/09/Screen-Shot-2022-09-24-at-21.46.00.png 1600w, /content/images/2022/09/Screen-Shot-2022-09-24-at-21.46.00.png 2222w" sizes="(min-width: 720px) 720px" decoding="async"></div></div></div><figcaption>Tip: Right click and "open image in new tab" for a better view</figcaption></figure>

To test, you can manually run the script from the webUI by clicking the run button on the task scheduler page. Use docker-compose to bring up your containers and verify it's working, then reboot and verify again (it may take 30-90 seconds after boot for all containers to come back up again depending on the app in question).

<h2 id="summary">Summary</h2>

In conclusion then, we have configured traefik to run on it's own IP and route traffic around. As I said, in practice it's quite simple but conceptually requires some mental gymnastics to get your head around.

At the end of the gist, there are a collection links that were part of the research that went into this one.
