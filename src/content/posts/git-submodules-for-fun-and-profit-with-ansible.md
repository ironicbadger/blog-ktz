---
title: git submodules for fun and profit with Ansible
slug: git-submodules-for-fun-and-profit-with-ansible
description: |-
  No matter how hard I try to fully switch over to Nix, I always seem to end up back at the altar of Ansible. This post isn't about Nix so I won't go into some of my frustrations there (yet!). This post is about my newly rekindled relationship with the old, trusty, git submodule.

  Git submodules effectively allow you to embed one repo inside another whilst retaining complete independence of the embedded repo. For example, it is common in Ansible to import roles from external sources. Simply add th
customExcerpt: null
publishedAt: 2024-12-24T10:11:08.000-05:00
updatedAt: 2026-05-07T07:21:32.000-04:00
featureImage: /content/images/2024/12/Screenshot-2024-12-24-at-10.06.27.png
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
ghostId: 6775c6279e78ea00017cbc46
tags:
  - ansible
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: ansible
featured: false
readingTime: 2
---

No matter how hard I try to fully switch over to Nix, I always seem to end up back at the altar of Ansible. This post isn't about Nix so I won't go into some of my frustrations there (yet!). This post is about my newly rekindled relationship with the old, trusty, [git submodule](https://git-scm.com/book/en/v2/Git-Tools-Submodules?ref=blog.ktz.me).

Git submodules effectively allow you to embed one repo inside another whilst retaining complete independence of the embedded repo. For example, it is common in Ansible to import roles from external sources. Simply add the remote role as a git submodule and now you can edit the imported role right alongside your main code without switching to a different editor window. This also lets you reuse one role across many projects if written properly. Nice!

I'm a big fan of the command helper tool [`casey/just`](https://github.com/casey/just?ref=blog.ktz.me) and created a basic helper function to add new submodules to my projects.

```bash
# git submodule - repo URL + optional local folder name
add-submodule URL *NAME:
    #!/usr/bin/env sh
    if [ -z "{{NAME}}" ]; then
        # Extract repo name from URL if no name provided
        basename=$(basename "{{URL}}" .git)
        git submodule add {{URL}} "roles/${basename}"
        git submodule update --init --recursive
        git add .gitmodules "roles/${basename}"
        git commit -m "Adds ${basename} as a submodule"
    else
        git submodule add {{URL}} "roles/{{NAME}}"
        git submodule update --init --recursive
        git add .gitmodules "roles/{{NAME}}"
        git commit -m "Adds {{NAME}} as a submodule"
    fi
```

This allows the user to specify `just add-submodule git@github.com/user/repo.git outputdir.name`. Specifying the `outputdir.name` parameter is optional.

What I like most about this workflow vs what I was doing previously via Ansible Galaxy (a failed experiment in my view - or at least a very unloved one), is that the upstream git repos remain fully independent but I retain the ability to make changes to fix bugs whilst testing - and then adding those changes to SCM is one step.

Before, I would test the changes in the locally installed version from Galaxy, then have to go update the upstream repo separately, tag a new release, fart around with Galaxy to make sure the version got imported correctly (this did not always happen), and then have to manually reinstall the contents of the requirements.yaml file. This often required a `--force` so as not to overwrite the existing role even if there was an update available - very frustrating.

Not only this but the submodules are included as part of a commit. So you are able to go and look at the upstream repo based on a commit hash making reproducibility kind of possible. At the very least, this gives the ability to see what code was running against what other piece of code.

Pulling in upstream changes requires a separate command - this is done with `git submodule update --init --recursive`. If you're making changes alongside your code you won't need this but if the upstream repo changes you will. This also ties in with the specific commits you commit to your repo to, in effect, link the repos together.

Git submodules aren't perfect, and they do clutter up the git control surfaces a bit. They can be a little intimidating honestly. But if you have the workflows straight in your mind of which repo is doing what and which files live where I think you'll find the git submodule approach superior to using Ansible Galaxy.

There is a downside for discoverability as these roles are no longer published the Galaxy but I don't think that many people go to Galaxy looking for stuff nowadays - maybe I'm wrong!
