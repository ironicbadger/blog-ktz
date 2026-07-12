---
title: Check for duplicate items in a list with Ansible using a custom filter
slug: check-for-duplicate-items-in-a-list-with-ansible-using-a-custom-filter
description: I expected writing a custom filter was going to be difficult and cumbersome but it was very simple and in the end, much faster than trying to turn YAML into a programming language!
customExcerpt: I expected writing a custom filter was going to be difficult and cumbersome but it was very simple and in the end, much faster than trying to turn YAML into a programming language!
publishedAt: 2023-01-23T11:24:50.000-05:00
updatedAt: 2026-05-07T07:21:46.000-04:00
featureImage: https://images.unsplash.com/photo-1517224187585-e3016a5fddc8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDIzfHxmaWx0ZXJ8ZW58MHx8fHwxNjc0NDg5Njk0&ixlib=rb-4.0.3&q=80&w=2000
featureImageAlt: null
featureImageCaption: Photo by <a href="https://unsplash.com/@klosinski?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Jacek</a> / <a href="https://unsplash.com/?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Unsplash</a>
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 6775c6279e78ea00017cbc30
tags:
  - ansible
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: ansible
featured: false
readingTime: 2
---

Ansible provides some [useful ways](https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_filters.html?ref=blog.ktz.me#selecting-from-sets-or-lists-set-theory) to manipulate data and filter items from sets or lists. None of these built-in filters provided what I thought would be a simple task - show duplicate items in a list.

Let's assume that I mistyped and entered a duplicate IP address into a list - like so:

```
- {mac: 3E:79:66:00:87:F7, ip: 192.168.1.1, hostname: dns}
- {mac: F2:8F:35:40:8A:9C, ip: 192.168.1.1, hostname: irc}
- {mac: 92:A9:C6:04:AE:CA, ip: 192.168.1.3, hostname: dev}
```

I need a way to not only check each item for duplicate but also for convenience it would be nice to print out the error to the user. Imagine this list is 100+ items long!

You'd think using one of the set-theory filters like `unique` or `difference` would work. `unique` is designed to take a list with duplicate items and just completely discard these duplicates. `difference` compares two lists and both sides of the comparison contain the same information so it returns that there is no difference.

<div class="postit postit-hint">There's a full example of my entire solution in my <a href="https://github.com/ironicbadger/infra/blob/master/roles/ktz-dhcp-dns/tasks/duplicate_checks.yaml?ref=blog.ktz.me">infra repo</a>.</div>

<h2 id="custom-filter">Custom Filter</h2>

The answer turned out to be straight forward. Create a custom filter - [source](https://stackoverflow.com/questions/60828923/ansible-how-to-get-duplicate-items-from-list/70948690?ref=blog.ktz.me#70948690). Create a folder in the root of your Ansible project named `filter_plugins` and put the following code into a file named something like `dupcliate_filter.py`.

```python
#!/usr/bin/python

class FilterModule(object):
    def filters(self):
        return {'duplicates': self.duplicates}

    def duplicates(self, items):
        sums = {}
        result = []

        for item in items:
            if item not in sums:
                sums[item] = 1
            else:
                if sums[item] == 1:
                    result.append(item)
                sums[item] += 1
        return result
```

Then in your Ansible code you can call this new custom filter named `duplicates` thus:

```yaml
- name: dupe check
  debug:
    msg: "Duplicate entry: {{ item | duplicates }}"
  loop:
    - "{{ dhcp_reservations | selectattr('mac', 'defined') | map(attribute='mac') }}"
    - "{{ dhcp_reservations | selectattr('ip', 'defined') | map(attribute='ip') }}"
    - "{{ dhcp_reservations | selectattr('hostname', 'defined') | map(attribute='hostname') }}"
```

This produces the following output:

```text
TASK [ktz-dhcp-dns : dupe check] ****************************************************************************************************************************************************************************************
ok: [10.42.0.201] => (item=['3E:79:66:00:87:F7', 'F2:8F:35:40:8A:9C', '92:A9:C6:04:AE:CA']) => {
    "msg": "Duplicate entry: []"
}
ok: [10.42.0.201] => (item=['192.168.1.1', '192.168.1.1', '192.168.1.3']) => {
    "msg": "Duplicate entry: ['192.168.1.1']"
}
ok: [10.42.0.201] => (item=['dns', 'irc', 'dev']) => {
    "msg": "Duplicate entry: []"
}
```

Thus we can see easily that the duplicated field here was the IP address `192.168.1.1`.

I expected writing a custom filter was going to be difficult and cumbersome but it was very simple and in the end, much faster than trying to turn YAML into a programming language!
