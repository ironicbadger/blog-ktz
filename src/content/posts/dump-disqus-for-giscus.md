---
title: Dump Disqus for Giscus
slug: dump-disqus-for-giscus
description: This is an easy project. Sure it will probably take an hour or two to get your head around but don't put it off. The end result is great and means no ads or tracking are insidiously injected into your content anymore.
customExcerpt: This is an easy project. Sure it will probably take an hour or two to get your head around but don't put it off. The end result is great and means no ads or tracking are insidiously injected into your content anymore.
publishedAt: 2022-12-02T00:28:28.000-05:00
updatedAt: 2026-05-07T07:21:48.000-04:00
featureImage: /content/images/2022/12/migrate.png
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
ghostId: 6775c6279e78ea00017cbc2e
tags:
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

Whilst at AWS re:Invent 2022 I left the comfort of my LAN and the warm blanket of my network wide adblocker behind. Whilst looking at a previous post of mine from a few years ago I noticed a whole bunch of ads. I don't want ads on this blog. But Disqus was stuffing them in just next to the comments section without my knowledge.

In order to solve this problem I found [Giscus](https://giscus.app/?ref=blog.ktz.me) which uses Github to store the comments and embed them into the page. No ads. The only requirement is commentors have a Github account which suits me as it should help reduce any risk of spammers.

However there was one big problem. This blog dates back to before I founded Linuxserver.io and some of the comments do too. Whilst it's not 100% essential to maintain the comments I wanted to try.

<h2 id="giscus">Giscus</h2>

This uses Github discussions to track interactions and comments. Each post gets a new discussion attached to a repo you create and install the Giscus app to.

<h2 id="disqus-export">Disqus export</h2>

Exporting the comments from Disqus is really easy. They provide them as an XML file which Elio's script parses and creates new discussions from.

<h2 id="elios-blog">Elio's Blog</h2>

To be honest, a lot of the information in this post I owe to the great work done by Elio over on [his blog](https://www.eliostruyf.com/migrate-disqus-github-discussions-giscus/?ref=blog.ktz.me). There's an accompanying Github repo with the migration script over [here](https://github.com/estruyf/disqus-to-github-discussions?ref=blog.ktz.me).

<h2 id="github-tokens-and-apps">Github Tokens and Apps</h2>

I won't go into huge amounts of detail on the process because that'd be a bit redundant. However I found the process of navigating the various Github tokens and app creations a bit complex.

Creating an app can be done under `settings -> developer settings -> new github app`. Give it the permissions needed (read/write to discussions for the repo that now hosts your comments).

Feed the various tokens and private keys into the `.env` file the linked Github repo requires. Run `npm start` and be prepared to wait for while depending on how many comments you're migrating.

A few times during the process I hit API rate limits and had to wait up to 5 mins to try again but this was all handled automatically by the script. After about 30-40 minutes the migration was complete and my dependence on disqus was removed.

<h2 id="ghost-theme-modifications">Ghost Theme modifications</h2>

I run a customised Casper theme. Migrating to Giscus was a simple affair in terms of code - see the changes in my theme repository [here](https://github.com/ironicbadger/Casper/blob/1b67f02cb1ca24ed26b2a2410f51ecd9e7bfae99/post.hbs?ref=blog.ktz.me#L117).

<h2 id="conclusion">Conclusion</h2>

This is an easy project really. Sure it will probably take an hour or two to get your head around but don't put it off. The end result is great and means no ads or tracking are insidiously injected into *your* content. I can't tell you how much that pissed me off when I found that out today.

<figure class="kg-card kg-image-card"><img src="/content/images/2022/12/image.png" class="kg-image" alt="" loading="lazy" width="2000" height="665" srcset="/content/images/size/w600/2022/12/image.png 600w, /content/images/size/w1000/2022/12/image.png 1000w, /content/images/size/w1600/2022/12/image.png 1600w, /content/images/2022/12/image.png 2110w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

The only thing I don't like is that the Disqus users can't map to Github users so you end up with an injected banner detailing the original commentor plus the original date and time.

So far so good with Giscus. Give it a try and let me know how it goes in the comments down below!
