---
title: Keeping secrets secret with git-crypt
slug: keeping-secrets-secret-with-git-crypt
description: Figuring out how to keep secrets secret using git-crypt and PGP keys.
customExcerpt: Figuring out how to keep secrets secret using git-crypt and PGP keys.
publishedAt: 2024-12-27T20:15:36.000-05:00
updatedAt: 2026-05-07T07:21:29.000-04:00
featureImage: /content/images/2024/12/featured.jpg
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
ghostId: 6775c6279e78ea00017cbc47
tags:
  - secret-management
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: secret-management
featured: false
readingTime: 3
---

My adventures with retooling my personal [infra repo](https://github.com/ironicbadger/infra?ref=blog.ktz.me) continue this week with figuring out how to keep secrets secret outside of my previous method using [ansible-vault](https://docs.ansible.com/ansible/latest/cli/ansible-vault.html?ref=blog.ktz.me).

The Ansible based solution has worked reasonably well for me for the last 7+ years but when making large repo edits I have a nasty habit of leaving the file decrypted and committing it to Github. Note my infra repos joke counter of "99.7% less leaked credentials" - yes that means I've leaked things *three* times. Yikes.

Enter [git-crypt](https://github.com/AGWA/git-crypt?ref=blog.ktz.me) which offers transparent encryption to the user. Files you choose are encrypted when committed, and decrypted when checked out. It allows you to mix plain-text and encrypted content and allows for collaborators all via the battle tested [GPG key system](https://www.openpgp.org/?ref=blog.ktz.me).

An example repo is provided at [ironicbadger/gctest](https://github.com/ironicbadger/gctest?ref=blog.ktz.me) for you to view, fork, and otherwise enjoy.

<h2 id="gpg-key-basics">GPG key basics</h2>

A GPG key pair contains a pair of keys, a public key and a private key. Much like with SSH keys the private key is a very important secret and should be guarded carefully.

If you don't have a GPG key it is simple to create one with:

```bash
gpg --full-gen-key

# 1) RSA and RSA
# keysize (default is 3072) - 4096
# key validity length - up to you
# GnuPG needs to construct a user ID to identify your key
# complete the prompts appropriately
# 
# When happy with your selections, press O (Okay) to create the keypair
```

Verify the keys known to the system now includes your newly created key with:

```bash
gpg --list-keys

# /Users/bob/.gnupg/pubring.kbx
------------------------------
pub   rsa4096/0xEB4F8DBF8DBF8DB3 2024-12-27 [SC]
      Key fingerprint = F8DB F8DB F8DB F8DB F8DB  F8DB F8DB F8DB F8DB 1463
uid                   [ultimate] bob <bob@bob.com>
sub   rsa4096/0xF8DBF8DB07C2F8DB 2024-12-27 [E]
```

<h2 id="git-crypt-basics">git-crypt basics</h2>

You'll need to install git-crypt - full instructions are provided via the [git-crypt GitHub repo](https://github.com/AGWA/git-crypt/blob/master/INSTALL.md?ref=blog.ktz.me). This guide continues once git-crypt is installed.

Enter into your git repo directory. Make sure you are on the main/master branch, with no outstanding changes, initialise git-crypt, and add the key to repo. For example:

```bash
$ cd gctest
$ git-crypt init
$ git-crypt add-gpg-user bob@bob.com
```

git-crypt already committed the change (a new .gpg file in the .git-crypt directory), so now do:

```bash
$ git push
```

<h2 id="git-crypt-encryption-instructions">git-crypt encryption instructions</h2>

The files that you choose to encrypt are governed by the contents of the `.gitattributes` file.

The following example file will automatically encrypt any file which containers `.enc` somewhere in its filename. This could be `secrets.enc` or `secrets.enc.yaml` - both will be committed to GitHub as encrypted files all transparently to you.

```
.gitattributes !filter !diff
**/*.enc.* filter=git-crypt diff=git-crypt
**/*.enc/** filter=git-crypt diff=git-crypt
```

Commit the `.gitattributes` file and then create a file with a pattern that matches your chose encryption filter pattern (\`.enc\` in my case).

You might at first wonder if git-crypt is doing anything. But once you commit and push your `.enc` file it will automatically be encrypted and only viewable by someone with your PGP key (hopefully that's only you!). You'll be asked for a passphrase in addition to the key, so keep that safe too.

You can add extra collaborators to a repo with git-crypt but that's beyond the scope of this article - useful if you're in a dev team though!

If you'd like to keep the contents of that file encrypted on your local disk, we can do that with git-crypt too using `git-crypt lock`. For example:

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2024/12/Screenshot-2024-12-27-at-20.08.05.png" class="kg-image" alt="" loading="lazy" width="1358" height="526" srcset="/content/images/size/w600/2024/12/Screenshot-2024-12-27-at-20.08.05.png 600w, /content/images/size/w1000/2024/12/Screenshot-2024-12-27-at-20.08.05.png 1000w, /content/images/2024/12/Screenshot-2024-12-27-at-20.08.05.png 1358w" sizes="(min-width: 1200px) 1200px" decoding="async"><figcaption><span style="white-space: pre-wrap;">An example of encrypted content with git-crypt</span></figcaption></figure>

<h2 id="multiple-machines">Multiple machines</h2>

It's likely you'll want to access this git repo from multiple machines. You'll need to copy your GPG key over, or add that GPG identity to the repo. If you're copying the key over export the private key (with care!) using:

```bash
$ gpg --export-secret-key -a > secretkey.asc
```

Then copy that file wherever you need it and import it on the other end with

```bash
$ gpg --import secretkey.asc
```

Once the keyfiles have served their purose securely delete them with:

```bash
$ shred secretkey.asc
$ rm secretkey.asc
```
