---
title: "After 11 years, I dropped Ghost"
slug: ghost-to-astro
description: "After nearly eleven years of being continuously served via Ghost, this blog is now a static site built with Astro."
customExcerpt: null
publishedAt: 2026-07-13T16:02:23-04:00
updatedAt: 2026-07-13T16:02:23-04:00
featureImage: /content/images/2026/07/ghost-to-astro/309b6bf448e2c3ca.webp
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
ghostId: local-ae345776-9eab-433d-bfa6-1b3309572e27
tags:
  - technical
  - self-hosted
  - docker
internalTags: []
primaryTag: technical
featured: false
readingTime: 3
drafts: false
---

If I've done this right, my blog is now migrated to a fully static site using Astro. I didn't radically redesign the theme for the migration MVP, but I did add better search, an archive, and some other small things likely only I'll notice.

The site should look familiar, that was deliberate. The MVP was about safely replacing the underpinngs of the site, not redesigning everything all at once.

## A point of record

This blog serves as a journal, a point of record for what I was into a given point in history. I also really enjoy having this as an outlet for some of my photography. Photos were never meant to rot on hard drives!

<figure class="kg-card kg-image-card kg-card-hascaption">
  <img
    src="/content/images/2026/07/ghost-to-astro/140a6530.webp"
    alt="Glacial run-off at Peyto Lake near the Ice Fields Parkway in Canada. Oct 2023."
    class="kg-image"
    loading="lazy"
  >
  <figcaption>Glacial run-off at Peyto Lake near the Ice Fields Parkway in Canada. Oct 2023.</figcaption>
</figure>

The header image for this site was one particularly special November evening after AWS reInvent where I had to escape the madness. The evening light just caught the tips of the painted hills.

More recently I've taken to YouTube and the blog has taken a bit of a back seat. You might have noticed that a couple of videos lately have been accompanied by blog posts, notably the Nvidia SHIELD video; that is a pattern I intend continue with.

## More than a CMS migration

Completing this project is a big day, really. This marks the end of my blog being CMS-based since before it morphed into what is now LinuxServer.io (before splitting off again a while later). LSIO was just [my blog](https://www.linuxserver.io/blog/2013-08-10-install-ubuntu-server-13-04-and-compile-a-custom-kernel-ready-for-xen) in the earliest days; it's far more than that now, as it should be.

I have maintained this thing consistently since 2013, from its WordPress origins through to the migration to Ghost on August 17th, 2015 (according to the DB). I migrated it all the way from pre-1.0 Ghost to the current v6 release. It's been a good run.

## Eleven years

I knew it had been running for a long time, but the Ghost database confirms the earliest entry was 2015. The same database carried this blog from August 17th, 2015 until this migration, surviving every upgrade from pre-1.0 Ghost to v6.

This blog ran continuously on a single Docker Engine, on a single Docker host, migrating from DigitalOcean to Linode to Hetzner over the years. No Kubernetes, no cluster, and no elaborate orchestration. Just a simple system serving the site year after year that I could easily understand at a moments notice when it went south. Backups were handled by a simple ZFS replication job and it just kept working, for over a decade.

I don't have a precise availability figure for the whole period, but I would wager it came remarkably close to the uptime of many vastly more complicated Kubernetes setups. There is something worth celebrating in that! Boring infrastructure, maintained carefully, can be extraordinarily durable.

## Why I finally had to leave Ghost

A couple of months ago, my fully patched Ghost instance got popped by two different CVEs in two weeks, and it was at that moment I knew I had to drop the CMS.

This wasn't a rage-quit from Ghost, though that project certainly has undergone some massive changes in that time period. It was more just that finally the accumlated risk of even a fully patched CMS, still leaves an internet-facing application and database running at all times.

## Moving eleven years of history

It was a huge task, as you might imagine, going through 11+ years of posts with images, tags, and other data too. I used an LLM to help with this task, it was just too big without help.

Writing on this site has been, and always will be, my own and not AI slop bile.

The migration tooling brought the Ghost content into the structure this site now uses:

- Posts are Markdown files stored in Git.
- Astro builds the entire site as static HTML.
- The existing post slugs, image paths, RSS URL, and tag and author feeds are preserved.
- The asset manifest contains 5,782 objects—about 3.7 GiB—now served from Cloudflare R2.
- The current site contains 234 published posts, plus this draft.
- Cloudflare Pages deploys the output from the `main` branch.

Preserving the accumlated history was a bit tricky. I had to convert the old Ghost content as cleanly as I could, including image galleries, styling and making sure that links and feeds were preserved.

## Publishing architecture

The basic publishing flow is, I write a post in Markdown, which lives in the same Git repository as the Astro site. Astro turns that content into static HTML, and when the finished change reaches the `main` branch, Cloudflare Pages builds and deploys it.

Images are the large exception and a pain to handle tbh. Several gigabytes of photographs would make the Git repository a terrible place to store the whole library, so the image files and their responsive variants live in Cloudflare R2. The posts still refer to familiar `/content/images/` paths, while an asset manifest keeps the site and the bucket in agreement.

I use [`just`](https://just.systems/) as the entry point to all of this. It is a command runner, a little like `make`, and gives the common jobs memorable names: create a post, add an inline or featured image, start a local preview, check the site, stage a release, and publish it. Docker, npm, Astro, image processing, R2, and Git commands are all hidden simple to remember commands. I only need to remember what I want to do, not the exact incantation needed to do it.

Eventually I would like to put a small WYSIWYG editor over the top of this workflow. Dragging photographs into a masonry gallery, reordering them, adding alt text and captions, or choosing a featured image should all be visual jobs.

## Flipping the switch

I flipped the switch tonight and the blog migration is complete.

I do hope you'll follow the RSS feed over at [blog.ktz.me](https://blog.ktz.me) for many years to come. Thank you to everyone who read even one word of one post. I owe any of you who've read my stuff over the years, a great debt of gratitude in this life.
