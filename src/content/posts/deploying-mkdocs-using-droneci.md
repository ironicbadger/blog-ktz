---
title: Deploying mkdocs using DroneCI and Gitea
slug: deploying-mkdocs-using-droneci
description: Todays post will discuss the steps required to deploy a fully self-hosted, automatically updating documentation stack using Gitea, mkdocs, nginx, traefik and Drone CI.
customExcerpt: Todays post will discuss the steps required to deploy a fully self-hosted, automatically updating documentation stack using Gitea, mkdocs, nginx, traefik and Drone CI.
publishedAt: 2021-09-07T00:49:02.000-04:00
updatedAt: 2026-05-07T07:21:52.000-04:00
featureImage: /content/images/2021/09/Screen-Shot-2021-09-07-at-00.32.46.png
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
ghostId: 6775c6279e78ea00017cbc23
tags:
  - docker
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: docker
featured: false
readingTime: 6
---

[mkdocs](https://www.mkdocs.org/?ref=blog.ktz.me) is a static site generator that I use for several documentation sites both public and private. Up until recently I've relied on Github actions to automate deployments to VPS hosts (eschewing Github pages).

Todays post will discuss the steps required to deploy a fully self-hosted, automatically updating documentation stack using [Gitea](https://gitea.io/en-us/?ref=blog.ktz.me), mkdocs, nginx, [traefik](https://traefik.io/?ref=blog.ktz.me) and [Drone CI](https://www.drone.io/?ref=blog.ktz.me).

<h2 id="pre-requisites">Pre-requisites</h2>

For the purposes of this guide we should assume you are familiar with the basics of DNS. However we'll need to make sure that you have created a record which points your chosen domain to the IP of the system running traefik and mkdocs.

<figure class="kg-card kg-image-card"><img src="/content/images/2021/09/image-2.png" class="kg-image" alt="" loading="lazy" width="1608" height="642" srcset="/content/images/size/w600/2021/09/image-2.png 600w, /content/images/size/w1000/2021/09/image-2.png 1000w, /content/images/size/w1600/2021/09/image-2.png 1600w, /content/images/2021/09/image-2.png 1608w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

There are lots of ways to achieve this end result but the way that I do it is by hosting the DNS for domain on Cloudflare. I give Traefik my Cloudflare API key which it uses to verify my ownership of the domain in question via [`dnsChallenge`](https://doc.traefik.io/traefik/user-guides/docker-compose/acme-dns/?ref=blog.ktz.me) and once successful automatically generates the required TLS certificates.

For a full overview of everything related to Traefik see my other site where I wrote up a getting started "Traefik 101" type post at [perfectmediaserver.com/remote-access/traefik101.html](https://perfectmediaserver.com/remote-access/traefik101.html?ref=blog.ktz.me).

As CI/CD is a fairly advanced topic I assume familiarity with docker, docker-compose and managing that stack. I've written (as have others) about it many times before - [for example](https://perfectmediaserver.com/tech-stack/docker-compose.html?ref=blog.ktz.me).

<h2 id="overview">Overview</h2>

First, let's take a look at a picture attempting to explain what we're trying to put together.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2021/09/Screen-Shot-2021-09-07-at-00.40.20.png" class="kg-image" alt="" loading="lazy" width="801" height="435" srcset="/content/images/size/w600/2021/09/Screen-Shot-2021-09-07-at-00.40.20.png 600w, /content/images/2021/09/Screen-Shot-2021-09-07-at-00.40.20.png 801w" decoding="async"></figure>

From now on, whatever you push to git will get built and deployed automatically. There are lots of nuances to this approach and if you're doing this in production you might wish to read into [promotions](https://readme.drone.io/promote/?ref=blog.ktz.me) to control what appears in which environment and when.

Next, let's take a look at the `docker-compose.yml` file needed in its entirety (it's quite long but we're defining traefik, gitea, drone, drone-docker-runner, and the nginx container running the wiki itself all in one file):

```yaml
---
version: "2"
services:
  traefik:
    image: traefik
    container_name: tr
    volumes:
      - /home/alex/appdata/traefik/letsencrypt:/letsencrypt
      - /var/run/docker.sock:/var/run/docker.sock:ro
    ports:
      - 80:80
      - 443:443
    environment:
      - CLOUDFLARE_EMAIL=email@example.com
      - CLOUDFLARE_API_KEY=CFglobalAPIkey
    command:
      - --providers.docker=true
      - --entrypoints.web.address=:80
      - --entrypoints.web.http.redirections.entryPoint.to=websecure
      - --entrypoints.web.http.redirections.entryPoint.scheme=https
      - --entrypoints.websecure.address=:443
      - --certificatesresolvers.cloudflare.acme.dnschallenge=true
      - --certificatesresolvers.cloudflare.acme.dnschallenge.provider=cloudflare
      - --certificatesresolvers.cloudflare.acme.email=email@example.com
      - --certificatesresolvers.cloudflare.acme.storage=/letsencrypt/acme.json
###
  gitea:
    image: gitea/gitea
    container_name: gitea
    volumes:
      - /opt/appdata/gitea:/data
    labels:
      - traefik.http.routers.git.rule=Host(`git.ktz.me`)
      - traefik.http.routers.git.tls.certresolver=cloudflare
    ports:
      - "2222:2222"
    environment:
      - USER_UID=1000
      - USER_GID=1000
      - ROOT_URL=https://git.ktz.me
      - SSH_DOMAIN=git.ktz.me
      - APP_NAME=git.ktz.me
      - SSH_PORT=2222
      - DISABLE_REGISTRATION=true
      - REQUIRE_SIGNIN_VIEW=true
    depends_on:
      - mysql
    restart: unless-stopped
###
  drone:
    image: drone/drone:latest
    container_name: drone
    labels:
      - traefik.http.routers.drone.rule=Host(`drone.m.wd.ktz.me`)
      - traefik.http.routers.drone.tls.certresolver=cloudflare
    environment:
      - DRONE_GITEA_SERVER=https://git.ktz.me/
      - DRONE_GIT_ALWAYS_AUTH=true
      - DRONE_GITEA_CLIENT_ID=1234
      - DRONE_GITEA_CLIENT_SECRET=1234
      - DRONE_SERVER_HOST=drone.m.wd.ktz.me
      - DRONE_SERVER_PROTO=https
      - DRONE_RPC_SECRET=super-duper-rpc-secret
      - DRONE_USER_CREATE=username:alex,admin:true
    restart: unless-stopped
  drone-runner-docker:
    image: drone/drone-runner-docker:1
    container_name: drone-runner-docker
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      - DRONE_RPC_PROTO=https
      - DRONE_RPC_HOST=drone.m.wd.ktz.me
      - DRONE_RPC_SECRET=super-duper-rpc-secret
      - DRONE_RUNNER_CAPACITY=2
      - DRONE_RUNNER_NAME=whatsinaname
    restart: unless-stopped
###
  mkdocswiki:
    image: nginx
    container_name: mkdocswiki
    volumes:
      - /opt/appdata/mkdocswiki/site:/usr/share/nginx/html:ro
    labels:
      - traefik.http.routers.wellandwiki.rule=Host(`wiki.domain.com`)
      - traefik.http.routers.wellandwiki.tls.certresolver=cloudflare
    restart: unless-stopped
```
<figcaption class="kg-code-caption">docker-compose.yaml</figcaption>

If you're struggling to find some of these values then review the Gitea configuration section coming up shortly.

For some reason, Drone CI recommend against running Gitea and Drone on the same instance *especially* when using docker-compose due to "network complications". We're using Traefik and all the routing is handled internally or via DNS, so there are no port conflicts.

Whatever Drone's reasoning for this disclaimer is, laziness or otherwise, you should be fine to configure your system using the one-file docker-compose approach outlined above. In my case I actually *wanted* everything co-located on one node so that `drone-docker-runner` had access to the filesystem for spitting out my statically generated mkdocs site to disk.

<h2 id="gitea-configuration">Gitea configuration</h2>

The drone CI [documentation](https://readme.drone.io/server/provider/gitea/?ref=blog.ktz.me) does a good job of providing an overview of the configuration you need to undertake in Gitea.

> Create an OAuth Application -> Create a Shared Secret with `openssl` -> Start Drone CI (as a docker container in our case) -> Start some [runners](https://readme.drone.io/runner/docker/overview/?ref=blog.ktz.me)

Next, obviously, you will need an mkdocs repository. If you don't have one ready, you can use [the repo](https://github.com/IronicBadger/pms-wiki?ref=blog.ktz.me) behind perfectmediaserver.com as an example.

<h2 id="configure-a-build">Configure a build</h2>

We can finally move on to actually configuring a build now that we have everything up and running.

```yaml
---
kind: pipeline
type: docker
name: build
steps:
- name: build
  image: squidfunk/mkdocs-material:7.1.9
  volumes:
  - name: site
    path: /site
  commands:
  - pip install -U -r ./requirements.txt
  - mkdocs build
  - cp -r site/ /site
  - chmod -R 777 /site
volumes:
- name: site
  host:
    path: /opt/appdata/mkdocswiki
```
<figcaption class="kg-code-caption">.drone.yml</figcaption>

This file lives in the root of your Git repo and tells Drone what to do. We're using the `squidfunk/mkdocs-material:7.1.9` docker image (it is automatically pulled from docker hub by Drone) and performing the build entirely within the context of that container. No dependencies or other mess is put onto the host system which is clean AF and really nice.

The only real gotcha here is to make sure that the volume path matches that of the nginx container you're using to serve the wiki itself - `/opt/appdata/mkdocswiki` in this case.

<h2 id="connecting-gitea-and-drone">Connecting Gitea and Drone</h2>

When you first launch Drone in your browser you will be greeted with the following screen.

<figure class="kg-card kg-image-card"><img src="/content/images/2021/09/drone-continue.png" class="kg-image" alt="" loading="lazy" width="941" height="625" srcset="/content/images/size/w600/2021/09/drone-continue.png 600w, /content/images/2021/09/drone-continue.png 941w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Once you click continue you will be asked to authenticate with Gitea and then will be automatically redirected back to the Drone interface below.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/09/drone-dashboard.png" class="kg-image" alt="" loading="lazy" width="1186" height="856" srcset="/content/images/size/w600/2021/09/drone-dashboard.png 600w, /content/images/size/w1000/2021/09/drone-dashboard.png 1000w, /content/images/2021/09/drone-dashboard.png 1186w" decoding="async"><figcaption>Drone dashboard</figcaption></figure>

The dashboard of Drone is quite pretty to look at but is also pretty functional. Click `SYNC` in the top right to ensure that the list of repos in Drone is synchronised with Gitea. Once sync'd, use the filter to find the repo you're interested in and activate it by clicking on it.

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/09/drone-trustedbuild.png" class="kg-image" alt="" loading="lazy" width="1170" height="754" srcset="/content/images/size/w600/2021/09/drone-trustedbuild.png 600w, /content/images/size/w1000/2021/09/drone-trustedbuild.png 1000w, /content/images/2021/09/drone-trustedbuild.png 1170w" decoding="async"><figcaption>Trusted build</figcaption></figure>

You'll need to ensure you enable `Trusted` in the settings page for the build so that the container can access host volumes.

<figure class="kg-card kg-image-card kg-card-hascaption"><img src="/content/images/2021/09/drone-untrusted.png" class="kg-image" alt="" loading="lazy" width="481" height="86" decoding="async"><figcaption>What happens if you don't give the <code>Trusted</code> permission to the build</figcaption></figure>

After this, we can trigger build either by performing a commit + push to your repository with git or by clicking `+ NEW BUILD`.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2021/09/drone-build.png" class="kg-image" alt="" loading="lazy" width="1184" height="856" srcset="/content/images/size/w600/2021/09/drone-build.png 600w, /content/images/size/w1000/2021/09/drone-build.png 1000w, /content/images/2021/09/drone-build.png 1184w" decoding="async"></figure>

Like most CI history graphs, there are plenty of failures as you tinker and improve stuff. For this reason I have created a dedicated Drone CI testing repo - in my case to test Ansible plays.

<h2 id="running-an-ansible-playbook">Running an Ansible Playbook</h2>

This is a bit more advanced as it makes use of secrets in Drone. These are configured in the web interface but the file below should give you a good idea of what's possible outside of just a simple static site deployment.

The Ansible plugin for Drone is documented [here](http://plugins.drone.io/drone-plugins/drone-ansible/?ref=blog.ktz.me).

```yaml
kind: pipeline
name: default

steps:
- name: check ansible syntax
  image: plugins/ansible:3
  settings:
    playbook: run.yaml
    galaxy: requirements.yaml
    inventory: hosts.ini
    vault_password:
      from_secret: ansible_vault_password
    syntax_check: true
  when:
    event:
    - push

- name: apply ansible playbook
  image: plugins/ansible:3
  # environment:
  #   additional_var:
  #     from_secret: additional_var
  #   another_var: foo
  settings:
    playbook: run.yaml
    galaxy: requirements.yaml
    inventory: hosts.ini
    private_key:
      from_secret: ansible_private_key
    vault_password:
      from_secret: ansible_vault_password
  when:
    event:
    - push
    - tag
```
