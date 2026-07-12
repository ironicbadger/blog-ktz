---
title: Packaging a go app for NixOS
slug: packaging-a-go-app-for-nixos
description: The imposter syndrome around almost anything to do with NixOS is as strong as the pull to use it in the first place.
customExcerpt: The imposter syndrome around almost anything to do with NixOS is as strong as the pull to use it in the first place.
publishedAt: 2024-02-15T21:24:53.000-05:00
updatedAt: 2026-05-07T07:21:36.000-04:00
featureImage: https://images.unsplash.com/photo-1615678857339-4e7e51ce22db?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDE0fHxwYWNrYWdlfGVufDB8fHx8MTcwODA1MDI2MXww&ixlib=rb-4.0.3&q=80&w=2000
featureImageAlt: null
featureImageCaption: Photo by <a href="https://unsplash.com/@jiaweizhao?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Jiawei Zhao</a> / <a href="https://unsplash.com/?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Unsplash</a>
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 6775c6279e78ea00017cbc3e
tags:
  - nix
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: nix
featured: false
readingTime: 3
---

The imposter syndrome around almost anything to do with NixOS is as strong as the pull to use it in the first place.

However, when I found that one of the apps I use daily on my servers was not available in [nixpkgs](https://github.com/NixOS/nixpkgs?ref=blog.ktz.me), I thought I'd take a stab at packaging it. What follows is really just a polished up version of my personal notes - it is not intended to replace the NixOS documentation.

I'm not doing this with a Flake because I'm new to packaging and this build is quite simple. If you're curious, here's my ever-evolving and probably flawed [nix-config repo](https://github.com/ironicbadger/nix-config?ref=blog.ktz.me).

<h2 id="useful-links-and-upstream-docs">Useful links and upstream docs</h2>

Here are a few useful links:

-   [https://github.com/NixOS/nixpkgs/blob/master/pkgs/README.md#quick-start-to-adding-a-package](https://github.com/NixOS/nixpkgs/blob/master/pkgs/README.md?ref=blog.ktz.me#quick-start-to-adding-a-package)
-   [https://nixos.wiki/wiki/Go](https://nixos.wiki/wiki/Go?ref=blog.ktz.me)

<h2 id="the-app">The app</h2>

The application I wanted to package was [arsham/figurine](https://github.com/arsham/figurine?ref=blog.ktz.me). I recently made a [YouTube video](https://www.youtube.com/watch?v=GPQ6k2GR17I&ref=blog.ktz.me) about this app if you'd like more information but essentially it's purpose in my workflow is to print out a beautified textual banner at login on a Linux box.

<figure class="kg-card kg-image-card"><img src="/content/images/2024/02/image.png" class="kg-image" alt="" loading="lazy" width="1504" height="844" srcset="/content/images/size/w600/2024/02/image.png 600w, /content/images/size/w1000/2024/02/image.png 1000w, /content/images/2024/02/image.png 1504w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

It's written in Go but it does not exist in nixpkgs. So let's try and fix that.

<h2 id="building-the-app">Building the app</h2>

The first step was to fork the nixpkgs repo. Next, was finding the correct place to place the code. In the end I settled for putting along apps like `cowsay` and `lolcat` which modify text output to the terminal. I have no idea if this was the right place but it seems logical to me.

```
nixpkgs/pkgs/tools/misc/figurine
```

This is the relative path from the root of the nixpkgs repo. This repo is a gigantic monolith containing 1000s of build instructions for all the packges in nixpkgs.

Once I'd created the `figurine` directory, I added the following contents to a file named `default.nix`.

```nix
{ lib
, stdenv
, fetchFromGitHub
, buildGoModule
}:

let
  version = "1.3.0";
in
buildGoModule {
  pname = "figurine";
  inherit version;

  src = fetchFromGitHub {
    owner = "arsham";
    repo = "figurine";
    rev = "v${version}";
    hash = "sha256-1q6Y7oEntd823nWosMcKXi6c3iWsBTxPnSH4tR6+XYs=";
  };

  vendorSha256 = "sha256-mLdAaYkQH2RHcZft27rDW1AoFCWKiUZhh2F0DpqZELw=";

  meta = with lib; {
    homepage = "https://github.com/arsham/figurine";
    description = "Print your name in style";
    license = licenses.asl20;
    maintainers = with maintainers; [ ironicbadger ];
  };
}
```

I largely copied from other go packages and got to the point that I could try doing a build relatively quickly. And so I ran `nix-build default.nix` from within the figurine directory. I was greeted with an error.

```text
error: cannot evaluate a function that has an argument without a value ('lib')
       Nix attempted to evaluate a function as a top level expression; in
       this case it must have its arguments supplied either by default
       values, or passed explicitly with '--arg' or '--argstr'. See
       https://nixos.org/manual/nix/stable/language/constructs.html#functions.

       at /home/alex/git/ib/nixpkgs/pkgs/tools/text/figurine/default.nix:1:3:

            1| { lib
             |   ^
            2| , stdenv
```

Whilst I don't pretend to understand half of what the error messages are saying when dealing with Nix, a kind stranger helped me out and explained to me that I need to pass in an existing nixpkgs context to the build environment for any dependencies to be obtained. That command looks like this.

```
nix-build -E 'with import <nixpkgs> {}; callPackage ./default.nix {}'
```

Next I was met with another error, this time relating to the `vendorSha256` hash. In order to obtain this hash, I used the following, did a build, and updated the value accordingly.

```
vendorSha256 = lib.fakeSha256
```

Which will generate an output something like this (this is faked below but should give you an idea):

```text
	hash mismatch in fixed-output derivation '/nix/store/q4cfnancqqvkc3v18r48zfq0vig6v6y9-pgmetrics-1.6.2-go-modules':
  wanted: sha256:0000000000000000000000000000000000000000000000000000
  got:    sha256:0llbx2sgcx95ym2q4l3334rdj3nkgr9z5jyp8406cp3k1ixi7gdb
```

In order to get the sha256 hash for `fetchFromGithub`, I used the following:

```
nix flake prefetch github:<owner><repo>/<rev>

###
nix flake prefetch github:arsham/figurine/v1.3.0
Downloaded 'github:arsham/figurine/d51c2458c6c429240feca33e999cfb54f418df48' to '/nix/store/pah8nb4pp0b11yj5lgd8izn46zxw0zmr-source' (hash 'sha256-1q6Y7oEntd823nWosMcKXi6c3iWsBTxPnSH4tR6+XYs=').
```

<h2 id="doing-the-build">Doing the build</h2>

Everything just kinda worked after that. The build took a minute or so, and the completed package was deposited in `./result/bin/` where I could run it and test it.

It worked!

So the final step was to submit a PR to nixpkgs. At the time of writing that [PR is still open](https://github.com/NixOS/nixpkgs/pull/289152?ref=blog.ktz.me), and I have no idea if it will be accepted or not but I feel like I climed a small hillock today. Huzzah!
