---
title: How to use count with modules in Terraform 0.13
slug: terraform-0-13-count-modules
description: |-
  The upcoming 0.13 release of Terraform adds many new features. In my opinion none are more exciting than finally being able using count when calling a module. At last this means that we can define a reusable chunk of code, in the form of a module, and use the fantastic count feature of Terraform as if we were inside a resource.


  Modules


  In it's most basic form a module is a block of re-usable code. Confusingly, a module in Terraform is technically any set of templates in a folder. However, in
customExcerpt: null
publishedAt: 2020-08-10T21:46:55.000-04:00
updatedAt: 2026-05-07T07:22:01.000-04:00
featureImage: https://images.unsplash.com/photo-1548690596-f1722c190938?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc12
tags:
  - terraform
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: terraform
featured: false
readingTime: 4
---

The upcoming [0.13 release](https://www.hashicorp.com/blog/announcing-the-terraform-0-13-beta/?ref=blog.ktz.me) of Terraform adds many new features. In my opinion none are more exciting than finally being able using `count` when calling a module. At last this means that we can define a reusable chunk of code, in the form of a `module`, and use the fantastic `count` feature of Terraform as if we were inside a `resource`.

<h2 id="modules">Modules</h2>

  
In it's most basic form a `module` is a block of re-usable code. Confusingly, a module in Terraform is *technically* any set of templates in a folder. However, in my opinion, it makes more sense to divide modules up into "parent" and "child". The parent module defines infrastructure by passing variables to the children.

<div class="postit postit-note">You can find the code used for this post on Github at <a target="_blank" href="https://github.com/IronicBadger/terraform-0.13-examples?ref=blog.ktz.me">IronicBadger/terraform-0.13-examples</a>.</div>

This concept took me a long time to "get" until it finally clicked when I drew a correlation with Ansible. If you're familiar with Ansible you'll be used to the concept of a playbook and a role. It helped me to think of child modules much like an Ansible role and parent modules, where you likely define your infrastructure and *include other modules,* like a playbook.

Modules behave much like functions in general-purpose programming languages accepting variables *but also* returning them as well.

```bash
def example_function(param1, param2) 
  echo "Hello, #{param1} #{param2}"
end

# Other places in your code
example_function("foo", "bar")
```

This is probably best explained with an example. Let's create some virtual machines on Digitalocean, though of course these concepts translate to any resources or providers.

```
.
├── infra
│   └── prod
│       ├── main.tf
│       ├── variables.tf
│       └── versions.tf
└── modules
    └── droplet
        ├── main.tf
        ├── variables.tf
        └── versions.tf
```

Here we have a parent module called `prod`. It utilises the child module `droplet` to create a droplet (what DigitalOcean call a VM or instance).

<h2 id="doing-it-the-old-way">Doing it the old way</h2>

  
Traditionally we'd write the following Terraform code to define a `digitalocean_droplet` resource called `web` (full documentation [here](https://registry.terraform.io/providers/digitalocean/digitalocean/latest/docs/resources/droplet?ref=blog.ktz.me)).

```hcl
# Create a new Web Droplet in the nyc2 region
resource "digitalocean_droplet" "web" {
  image  = "ubuntu-18-04-x64"
  name   = "web-1"
  region = "nyc2"
  size   = "s-1vcpu-1gb"
}
```

If we're not careful we'd end up specifying many of these variables many times. It would be better if we could declare we want X number of droplets with these parameters please wouldn't it?

```hcl
# Create a new Web Droplet in the nyc2 region
resource "digitalocean_droplet" "web" {
  count  = 2
  image  = "ubuntu-18-04-x64"
  name   = "web-1"
  region = "nyc2"
  size   = "s-1vcpu-1gb"
}
```
<figcaption class="kg-code-caption">Spot the problem.</figcaption>

Easy enough, we just add `count` and Terraform will create two instances. Except, there's a problem here.

Some attributes, such as `name` must be unique. Here we can leverage the `count` arrays `index` and append it to the `name` attribute like so:

```hcl
# Create a new Web Droplet in the nyc2 region
resource "digitalocean_droplet" "web" {
  count  = 2
  image  = "ubuntu-18-04-x64"
  name   = "web-${count.index + 1}"
  region = "nyc2"
  size   = "s-1vcpu-1gb"
}
```
<figcaption class="kg-code-caption">That's better. Name is now unique.</figcaption>

The resulting names would be `web-1`, `web-2` and so on. We perform the `+1` operation on the interpolation because arrays start at `0` but my brain starts at `1` and this gets us there.

<h2 id="doing-it-the-new-way">Doing it the new way</h2>

  
As you can see the old way involves a lot of hard-coding specific values. It would be better to write a generic module that can be fed some variables instead. Here's what that looks like:

```hcl
# modules/droplet/main.tf

resource "digitalocean_droplet" "droplet" {
    name     = var.droplet_name
    image    = var.droplet_image
    size     = var.droplet_size
    region   = var.do_region
    ssh_keys = var.ssh_keys
}
```

On it's own, this code does nothing. We need to feed it some inputs.

Note here that the module `resource` references `var.droplet_name` and `var.droplet_image` and so on. When feeding in our variables as we call the module, these are the names we must use. For example:

```hcl
# infra/prod/main.tf

module "example-prod" {
    source = "../../modules/droplet"
    count  = 2

    droplet_name       = "tf-prod-${count.index + 1}"
    droplet_image      = var.droplet_image
    droplet_size       = var.droplet_size_1vcpu_1gb
    do_region          = var.do_region
    ssh_keys           = var.do_ssh_keys
}
```

You have the option in your `parent` module to define these values as your requirements dictate. Use `data` objects, reference other variables in your code as we have done here with `var.do_region` for example or straight-up hard-code the values as we did with `droplet_name`.

Variables in the `parent` module are defined in the parents `variables.tf` and `terraform.tfvars` files. They are scoped to that module. In other words, the folder you're currently in, is the scope of these variables.

Perhaps you noticed that we snuck `count` into our `infra/prod/main.tf` file. This wasn't possible before Terraform `0.13`! Hurrah for progress.

<h2 id="so-that-looks-the-same-i-m-confused-">So, that looks the same? I'm confused.</h2>

  
A small, but vitally important difference between 0.11/0.12 and 0.13 is that the definition of `count` is moved out of the individual resource creation step and moved to module definition instead. This includes references to `count.index` and so on.

Instead of accessing elements via their index during `resource` creation, we do so during `module` definition instead. When referring to variables or other data in the `module` code there is no concept of `count` at that level. We are dealing with one resource at a time.

At the small scale in the example repo it might not seem like a big deal. But when we take things a step further...

<h2 id="taking-it-a-step-further">Taking it a step further</h2>

  
The reason I learned about modules was because I use Terraform to deploy Openshift clusters. Openshift is Red Hat's enterprise flavour of Kubernetes. It often requires half a dozen machines to be spun up and down at the same time. As you can imagine, doing this by hand is not an option numerous times a day for testing as I often do.

The code in the [`ironicbadger/ocp4`](https://github.com/ironicbadger/ocp4?ref=blog.ktz.me) repo is a much more complicated example of using `count` with 0.13. It uses outputs to template HAProxy configuration files and targets VMware, not DigitalOcean.

<h2 id="wrap-up">Wrap-up</h2>

  
That should be it for getting you started with modules, count and Terraform 0.13.

Feel free to reach out on to me Twitter, I'm @IronicBadger, with any questions or comments. You might consider giving my podcast a listen over at [selfhosted.show](https://selfhosted.show/?ref=blog.ktz.me) if you're in Self-Hosting / NAS's and general home server nerdiness.
