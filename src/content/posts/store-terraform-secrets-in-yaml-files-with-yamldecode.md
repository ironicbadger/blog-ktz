---
title: Store Terraform secrets in YAML files with yamldecode
slug: store-terraform-secrets-in-yaml-files-with-yamldecode
description: |-
  In May of 2019 Hashicorp released Terraform 0.12. This release completely changed the way in which variable interpolation was performed and whilst some backwards compatibility was kept, there were some breaking changes. Most notably, the way in which functions and interpolations were called with no more "${}" required.

  Here's the problem statement. I want to use Terraform to create VMs on Digitalocean using the token that doctl stores in ~/.config/doctl/config.yaml. Using that same logic it mad
customExcerpt: null
publishedAt: 2020-04-23T21:52:39.000-04:00
updatedAt: 2026-05-07T07:22:35.000-04:00
featureImage: https://images.unsplash.com/photo-1569235186275-626cb53b83ce?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc07
tags:
  - terraform
  - devops
  - automation
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: terraform
featured: false
readingTime: 2
---

In May of 2019 Hashicorp [released Terraform 0.12](https://www.hashicorp.com/blog/announcing-terraform-0-12/?ref=blog.ktz.me). This release completely changed the way in which variable interpolation was performed and whilst some backwards compatibility was kept, there were some breaking changes. Most notably, the way in which functions and interpolations were called with no more `"${}"` required.

Here's the problem statement. I want to use Terraform to create VMs on Digitalocean using the token that `doctl` stores in `~/.config/doctl/config.yaml`. Using that same logic it made sense, to me at least, to store other variables for Cloudflare in a similar way. No tokens or other sensitive secrets in clear text Terraform code was my goal. This is how I achieved it.

> I try to open up as much of infrastructure code as possible and solutions like this one enable me to do that on [Github](https://github.com/IronicBadger/infra?ref=blog.ktz.me).

<h2 id="yamldecode-">yamldecode()</h2>

[`yamldecode`](https://www.terraform.io/docs/configuration/functions/yamldecode.html?ref=blog.ktz.me) parses a string as a subset of YAML, and produces a representation of its value. The documentation contains some examples of YAML objects which were simple enough, but not how I was storing my data. How do you read YAML from a file?

```
yamldecode(file("~/.config/doctl/config.yaml"))["access-token"]
```

Here is the source file.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/04/image-4.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

This file is hundreds of lines long but `yamldecode` lets us pick out the value we want using the key from the key / value pair that defines YAML data structures.

To read in the entire file simple omit the `["key"]` field from the end of the `yamldecode` section.

Here's another example for you.

```hcl
resource "cloudflare_record" "unifitest" {
  zone_id = yamldecode(file("~/.config/tokens/cloudflare.yaml"))["domain-cloud"]
  name  = "unifitest"
  type  = "A"
  ttl   = 300
  value = digitalocean_droplet.cloud.ipv4_address
}
```

Here we are looking up the `zone_id` value from `cloudflare.yaml` which is a file I created.

In time I will write a small installation script for these files and use Ansible Vault to store the encrypted values in Git alongside the code and then installs them to the correct paths.
