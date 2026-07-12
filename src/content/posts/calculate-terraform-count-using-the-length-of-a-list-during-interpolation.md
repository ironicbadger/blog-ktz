---
title: Calculate Terraform count using the length of a list during interpolation
slug: calculate-terraform-count-using-the-length-of-a-list-during-interpolation
description: How do you use Terraform's count feature and have custom attributes per system? Use arrays and the length function, that's how.
customExcerpt: How do you use Terraform's count feature and have custom attributes per system? Use arrays and the length function, that's how.
publishedAt: 2019-09-27T20:13:21.000-04:00
updatedAt: 2026-05-07T07:22:44.000-04:00
featureImage: /content/images/2019/09/og-image-large-e60c82fe.png
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
ghostId: 6775c6279e78ea00017cbbf6
tags:
  - terraform
  - devops
  - vmware
  - automation
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: terraform
featured: false
readingTime: 2
---

Recently I ran into a really interesting problem with Terraform. I wanted to be able to simultaneously specify the number of instances to be created using its `count` feature but I couldn't figure out how to give each instance a custom MAC address. That was until I spent an evening with Google before coming across the idea of using the `length` function to populate my `count` value. Here's the general idea...

In my homelab I use MAC address assignments in pfsense to map IP addresses to systems and as such I don't need to configure each system with a static IP, it gets a static IP via DHCP. I was creating an Openshift cluster and because this is Kubernetes underneath the concept of masters, workers and infra nodes comes to fore. Now, each of these class of nodes has several shared characteristics but also several custom ones, MAC address being the most important to begin with. Take the following instance definition:

```hcl
resource "vsphere_virtual_machine" "masters311" {
  name             = "ocp311-m${count.index + 1}"
  resource_pool_id = "${data.vsphere_compute_cluster.cluster.resource_pool_id}"
  datastore_id     = "${data.vsphere_datastore.ds-spc500.id}"
  folder           = "awesomo/ocp311"
  count            = length(var.macs_311_masters)

  num_cpus = 4
  memory   = 8192
  guest_id = "${data.vsphere_virtual_machine.template-rhel77.guest_id}"

  network_interface {
    network_id   = "${data.vsphere_network.network.id}"
    adapter_type = "${data.vsphere_virtual_machine.template-rhel77.network_interface_types[0]}"
    use_static_mac = true
    mac_address = "${var.macs_311_masters[count.index]}"
  }

  disk {
    label            = "disk0"
    size             = "${data.vsphere_virtual_machine.template-rhel77.disks.0.size}"
    eagerly_scrub    = "${data.vsphere_virtual_machine.template-rhel77.disks.0.eagerly_scrub}"
    thin_provisioned = "${data.vsphere_virtual_machine.template-rhel77.disks.0.thin_provisioned}"
  } 

  clone {
    template_uuid = "${data.vsphere_virtual_machine.template-rhel77.id}"

    customize {
      linux_options {
        host_name = "ocp311-m${count.index + 1}"
        domain    = "ktz.lan"
      }
      network_interface {}
    }
  }
}
```

Note under `count` the following `count = length(var.macs_311_masters)`. This references a variable from `variables.tf` thus

```hcl
variable "macs_311_masters" {
    description = "311 master mac addresses"
    type        = list(string)
    default     = ["d6:18:04:15:3e:e4","9a:c0:31:6b:3a:b5","02:a3:17:8c:8d:d4"]
}
```

One of the most important features of Terraform is [interpolation](https://www.terraform.io/docs/configuration-0-11/interpolation.html?ref=blog.ktz.me) and in this instance the length calculation would return a value of 3 with a starting index of 0 (because in coding arrays always have an initial index of 0). This means I can use the value of 3 to populate the `count` variable but I can *also* reference each specific item in the list using the index.

This comes in useful in two places `mac_address` and `host_name`.

```
mac_address = "${var.macs_311_masters[count.index]}"
```

This example shows reference the mac address I want to access using `[count.index]` and is how each instance is assigned it's MAC.

```
host_name = "ocp311-m${count.index + 1}"
```

This example shows that you can not only dynamically populate variables using interpolation but you can also perform arithmetic operations on them. In this instance I perform `{count.index + 1}` because array indices always start at `0` and we don't want a hostname that reads `ocp311-m0`. Instead we want `ocp311-m1` and our `+ 1` gets us there.

There you have it. A very neat and elegant solution that can be extended to many other more complex edge cases such as RAM, disk, CPU and more. The limit is your creativity.
