---
title: Replacing Google with SearXNG as the default in Chrome
slug: replacing-google-with-searxng-as-the-default-in-chrome
description: |-
  No tracking. No ads. Search as it was.
  Now when you enter a search query in the Chrome address bar it will route through your SearXNG instance automatically.
customExcerpt: |-
  No tracking. No ads. Search as it was.
  Now when you enter a search query in the Chrome address bar it will route through your SearXNG instance automatically.
publishedAt: 2024-11-12T10:15:07.000-05:00
updatedAt: 2026-05-07T07:21:33.000-04:00
featureImage: /content/images/2024/11/alexktz_the_end_of_google_search_e2d7120a-74ea-42d2-9335-b3e469bde6e8.png
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
ghostId: 6775c6279e78ea00017cbc45
tags:
  - technical
  - degoogle
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 2
---

Over on the Self-Hosted podcast we've been taking the "no Googtober" challenge for the month of October. Yes it is November now, but this probably gives you a clue as to how the challenge is going. (Spoiler: really well!).

<iframe src="https://player.fireside.fm/v2/dUlrHQih+0Vqy6IxB?theme=dark" width="740" height="200" frameborder="0" scrolling="no" loading="lazy" title="Embedded media"></iframe>

One thing that was irking me though was figuring out how to set a custom default search engine in Chrome. Because as we all know, default is king. Turns out it's quite straightforward so I'll walk you through setting it up!

<h2 id="searxng">SearXNG</h2>

If you're not familiar, [SearXNG](https://github.com/searxng/searxng?ref=blog.ktz.me) is a free internet metasearch engine which aggregates results from various search services and databases. Users are neither tracked nor profiled.

I assume you have SearXNG set up and ready to go - there's a docker compose YAML in [this Gist](https://gist.github.com/ironicbadger/1c15006ea31945ff8ffe7fb4e2cbeef0?ref=blog.ktz.me) I threw together.

<h2 id="configuring-chrome">Configuring Chrome</h2>

Google makes it a little tricky to find exactly where you should configure a custom search engine (cynically this is not too surprising!). But here's how:

1.  In Chrome, click the 3 dot menu button in the top right
2.  Select `Settings`
3.  Select `Search engine` in the left menu pane
4.  Select `Manage search engines and site search`
5.  Leave the default keyboard shortcut set to `Space or Tab` unless you have a good reason not to
6.  Select `Add` under `Site search`
7.  Give your new search provider a name
8.  Enter whatever you like for `Shortcut` - something like `@searxng` is fine
9.  Populate `URL with %s in place of query` with the value from the steps below
10.  Take your SearXNG URL and append `search?q=test` - for example `https://search.example.com/search?q=test`
11.  Assuming that worked replace `test` with `%s` - for example `https://search.example.com/search?q=%s`
12.  Select `Add` once the fields are complete
13.  Make this new `Site search` provider your Chrome default by selecting the 3 dot menu (pictured below) for the new provider, and selecting `Make default`
14.  Profit!

<figure class="kg-card kg-image-card"><img src="/content/images/2024/11/image.png" class="kg-image" alt="" loading="lazy" width="1366" height="1024" srcset="/content/images/size/w600/2024/11/image.png 600w, /content/images/size/w1000/2024/11/image.png 1000w, /content/images/2024/11/image.png 1366w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

Now when you enter a search query in the Chrome address bar it will route through your SearXNG instance. Nice!
