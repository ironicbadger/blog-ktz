---
title: docker compose generator v2 release
slug: docker-compose-generator-v2-release
description: For the last ~7 years I have been using an Ansible role to manage my docker compose files. It was time for a major overhaul.
customExcerpt: For the last ~7 years I have been using an Ansible role to manage my docker compose files. It was time for a major overhaul.
publishedAt: 2025-01-04T12:09:33.000-05:00
updatedAt: 2026-05-07T07:21:31.000-04:00
featureImage: /content/images/2025/01/e136c5544699799ea2e1609b0dc0b423.jpg
featureImageAlt: Joshua Tree NP at Sunset - March 2024 - Alex Kretzschmar
featureImageCaption: '<span style="white-space: pre-wrap;">Joshua Tree NP at Sunset - March 2024 - Alex Kretzschmar</span>'
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 67794092d19077000173e5b9
tags:
  - technical
  - docker
internalTags: []
primaryTag: technical
featured: false
readingTime: 5
---

For the last ~7 years I have been using an Ansible role to manage my docker compose files. The premise was simple, manage my compose files declaratively and have them sanitised so that they could be shared publicly in a git repo.

**Note that v1 to v2 is a completely breaking change. v1 repos will need to be entirely refactored to be compatible.**

<div class="kg-card kg-callout-card kg-callout-card-green"><div class="kg-callout-emoji">🌵</div><div class="kg-callout-text">This first section is an explanation of why v2 was necessary. You can skip ahead to the specifics about <a href="/#v2">v2 here</a>.</div></div>

In today's post I will outline why v1 came to be, why v2 became an obvious evolution of that process, and a bit about how to use v2 as well.

<h2 id="a-quick-v1-history-lesson">A quick v1 history lesson</h2>

I, along with [many contributors](https://github.com/ironicbadger/ansible-role-docker-compose-generator/graphs/contributors?ref=blog.ktz.me), built up and ever more elaborate Jinja2 based template structure which was *full* of `if` and `for` statements. This actually worked rather well, but always left me feeling that it was unnecessarily clunky when it came to constructing the `containers` list variable.

<figure class="kg-card kg-image-card"><img src="/content/images/2025/01/image-7.png" class="kg-image" alt="" loading="lazy" width="2000" height="1397" srcset="/content/images/size/w600/2025/01/image-7.png 600w, /content/images/size/w1000/2025/01/image-7.png 1000w, /content/images/size/w1600/2025/01/image-7.png 1600w, /content/images/2025/01/image-7.png 2148w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Take Jellyfin, for example.

```yaml
# group_vars/morphnix.yaml
containers:
  - service_name: jellyfin
    active: true
    image: jellyfin/jellyfin
    hostname: us-rdu
    devices:
      - /dev/dri:/dev/dri
    labels:
      - traefik.enable=true
      - "traefik.http.routers.jellyfin.rule=Host(`jf.{{ wd_domain_me }}`)"
      - traefik.http.services.jellyfin.loadbalancer.server.port=8096
    ports:
      - 2285:8096
    volumes:
      - "{{ appdata_path }}/mediaservers/jellyfin:/config"
      - "{{ storage_path }}:/data:ro"
      - "{{ bigrust18_path }}/media:/bigrust18/media:ro"
    environment:
      - "JELLYFIN_PublishedServerUrl=jf.{{ wd_domain_me }}"
    include_global_env_vars: true
    restart: unless-stopped
```

This looks *almost* like a docker compose file doesn't it? But *it isn't*. This is an entirely bespoke construction that had to be assembled for each and every container I wanted to run through the compose generator mechanism.

Sure. We get some niceities like being able to update entire compose files worth of variables in one spot. For example, if you renamed the underlying `{{ appdata_path }}` directory. And being able to use Ansible Vault for secret management was a particularly nice feature. But it still felt *off*.

> *Why do I have to take a perfectly functional compose file from a projects website and then convert it to this esoteric format that is not portable?*

Wouldn't it be better if I could just copy / paste compose files at random from the internet and have the automation ingest them?

Late one holiday evening talking with [a friend](https://github.com/fuzzymistborn?ref=blog.ktz.me), we came up with just such a solution. Enter `docker-compose-generator v2`!

<h2 id="v2">v2</h2>

The idea was simple. Supply a directory of standard `compose.yaml` files and have the automation slurp them up and spit out a single compose file per host. So that's what I built.

<div class="kg-card kg-callout-card kg-callout-card-green"><div class="kg-callout-emoji">🐳</div><div class="kg-callout-text">Find all the code in a fully working example at <a href="https://github.com/ironicbadger/infra/tree/main/services?ref=blog.ktz.me" rel="noreferrer">ironicbadger/infra</a>.</div></div>

In the root of your Ansible git repo, create a directory named `services/hostname` - see [Node naming](/#node-naming) for more info on `hostname` specifics. All compose files live here, separated by a directory per remote host.

Take the following directory structure as an example:

```
└── services
    ├── morphnix
    │   ├── 01-traefik
    │   │   └── compose.yaml
    │   ├── 02-media-servers
    │   │   └── compose.yaml
    │   ├── 03-arrmatey
    │   │   └── compose.yaml
    │   └── 04-monitoring
    │       └── compose.yaml
    └── nix-nvllama
        ├── 01-traefik
        │   └── compose.yaml
        ├── 02-immich-ml
        │   └── compose.yaml
        └── 03-ai
            └── compose.yaml
```
<figcaption class="kg-code-caption"><p><span style="white-space: pre-wrap;">Numbered dirs are optional but allow for controlling the output order of services in the final rendered compose file.</span></p></figcaption>

Each of the `compose.yaml` files is a fully working, standalone file. But in most cases on my servers I want those files concatenated together into a single larger file which is then managed further with the standard `docker compose` tool chain.

A few moments with [claude](https://claude.ai/new?ref=blog.ktz.me) later and I was able to happily figure out the required regex syntax to do just that. v2 *largely* eschews large complex j2 template files but it still relies on Jinja2 for variable substitution and interpolation. Therefore, *technically* these YAML files are actually treated by the role as `.j2` files. However, in order for the interoperability and portability goal I set forth with the rewrite to be achieved we want to treat them as YAMLs.

The role itself walks the filetree using a neat Ansible plugin named [filetree](https://docs.ansible.com/ansible/latest/collections/community/general/filetree_lookup.html?ref=blog.ktz.me) and slurps up all the files named `compose.yaml` in a directory that matches the Ansible magic variable `{{ inventory_hostname }}`. Next, a bit of regex strips parts of the files we don't want to concatenate (`services:` for example) and then iterates over each file until we have a rendered output.

All standard docker compose features are supported, the one caveat is that your file must begin with `services:` at the top. Any other configurations like volumes or network configurations must be placed at the bottom of the last file to be ingested. I plan to work on making this a bit less brittle moving forward. To ensure the file containing the extra configurations ends up in the right place number it something like `99-services` (it must start with `services:` even if it contains none - I know, I know).

After all this regex'ing is complete, the rendered output file is created using the standard Ansible `template` module (we inherit all the goodies there like Ansible Vault support and variable interpolation j2 style).

<h2 id="node-naming">Node naming</h2>

This one has tripped up a couple of my early testers. In an Ansible hosts file you'll probably have a couple of lines that look like this:

```
[morphnix]
morphnix ansible_ssh_user=alex

[deepthought]
deepthought ansible_ssh_user=alex
```

The `node names` here happen to match the `[group names]` but sometimes that isn't the case. Sometimes you'll call your hosts via an IP address thus breaking the `hostname` lookup in the role.

If this is you, specify `docker_compose_hostname` in `group_vars` or `host_vars` to match the name of the directory you placed your `compose.yaml` files in under `services/`.

Here's [a working example](https://github.com/FuzzyMistborn/infra/blob/a01595b1fc4842c09fef7cc408c869ae2c6f1287/group_vars/all.yaml?ref=blog.ktz.me#L172) for you. Here, u/fuzzymistborn uses the `group_vars/all.yaml` feature to automatically apply the `hostname` variable (which he sets elsewhere by hand) to match the naming convention he wanted for the directories structure under the `services` directory.

<h2 id="disabling-services">Disabling services</h2>

Sometimes you want to disable a service - be it for testing or any other number of reasons. The role can handle this too by creating a list variable in `group_vars` or `host_vars` thus:

```yaml
disabled_compose_files:
  - directory-name1 # e.g. 01-traefik
  - directory-name2 # e.g. 02-apps
```

This will disable the `compose.yaml` file found in the named directory. Here's a [working example](https://github.com/ironicbadger/infra/blob/7636e498d83a8c761cab28813773862e0981d136/host_vars/ktz-cloud-new.yaml?ref=blog.ktz.me).

<h2 id="conclusion">Conclusion</h2>

Overall, in my opinion this is a big step up in removing friction for trying out new projects whilst maintaining the original goals of santised, safe files for sharing via GitHub. There are a couple of small gotchas which I will work out in time but for now, I've switched over all my primary infra to this v2 of the role.

Let me know your thoughts below and if you're so inclined, I'll happily take PRs on the [GitHub repo too](https://github.com/ironicbadger/ansible-role-docker-compose-generator?ref=blog.ktz.me). Thanks, and enjoy!
