---
title: Making mkdocs tables look like Github markdown tables
slug: making-mkdocs-tables-look-like-github-markdown-tables
description: |-
  Adding custom CSS to the mkdocs material theme is straightforward. Follow the docs and you can make tweaks to the CSS of the theme as you need.

  I'm a big fan of the way in which Githubs markdown rendering engine renders tables. Alternate coloured lines, reasonable padding for decent information density that is easy on the eyes and legible text. These are things I felt that the stock mkdocs material theme table "skin" failed on, so I spent a bit of time figuring out how to fix that today.


  Stoc
customExcerpt: null
publishedAt: 2021-11-18T16:14:59.000-05:00
updatedAt: 2026-05-07T07:21:50.000-04:00
featureImage: https://images.unsplash.com/photo-1573104049264-5324ea0027d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxMTc3M3wwfDF8c2VhcmNofDU4fHx0YWJsZXxlbnwwfHx8fDE2MzcyNzAwNTY&ixlib=rb-1.2.1&q=80&w=2000
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
ghostId: 6775c6279e78ea00017cbc28
tags:
  - mkdocs
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: mkdocs
featured: false
readingTime: 2
---

Adding custom CSS to the mkdocs material theme is straightforward. Follow the [docs](https://squidfunk.github.io/mkdocs-material/customization/?ref=blog.ktz.me) and you can make tweaks to the CSS of the theme as you need.

I'm a big fan of the way in which Githubs markdown rendering engine renders tables. Alternate coloured lines, reasonable padding for decent information density that is easy on the eyes and legible text. These are things I felt that the stock mkdocs material theme table "skin" failed on, so I spent a bit of time figuring out how to fix that today.

<h3 id="stock-mkdocs-material-theme-tables">Stock mkdocs material theme tables</h3>

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/11/telegram-cloud-photo-size-4-5816435396362483780-y.jpg" class="kg-image" alt="" loading="lazy" width="921" height="284" srcset="/content/images/size/w600/2021/11/telegram-cloud-photo-size-4-5816435396362483780-y.jpg 600w, /content/images/2021/11/telegram-cloud-photo-size-4-5816435396362483780-y.jpg 921w" decoding="async"><figcaption>Before: The stock table. Lots and lots and lots and lots of padding.</figcaption></figure>

<h3 id="githubs-take">Githubs take</h3>

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y.jpg" class="kg-image" alt="" loading="lazy" width="1005" height="222" srcset="/content/images/size/w600/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y.jpg 600w, /content/images/size/w1000/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y.jpg 1000w, /content/images/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y.jpg 1005w" decoding="async"><figcaption>Github rendered table</figcaption></figure>

<h3 id="mkdocs-with-custom-css">mkdocs with custom css</h3>

<figure class="kg-card kg-image-card kg-width-wide kg-card-hascaption"><img src="/content/images/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y-1.jpg" class="kg-image" alt="" loading="lazy" width="1005" height="222" srcset="/content/images/size/w600/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y-1.jpg 600w, /content/images/size/w1000/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y-1.jpg 1000w, /content/images/2021/11/telegram-cloud-photo-size-4-5816435396362483778-y-1.jpg 1005w" decoding="async"><figcaption>mkdocs with custom css</figcaption></figure>

<h2 id="css-code">CSS Code</h2>

Here's the code I used to customise the table view.

```css
th, td {
    border: 1px solid var(--md-typeset-table-color);
    border-spacing: 0;
    border-bottom: none;
    border-left: none;
    border-top: none;
}

.md-typeset__table {
    line-height: 1;
}

.md-typeset__table table:not([class]) {
    font-size: .74rem;
    border-right: none;
}

.md-typeset__table table:not([class]) td,
.md-typeset__table table:not([class]) th {
    padding: 9px;
}

/* light mode alternating table bg colors */
.md-typeset__table tr:nth-child(2n) {
    background-color: #f8f8f8;
}

/* dark mode alternating table bg colors */
[data-md-color-scheme="slate"] .md-typeset__table tr:nth-child(2n) {
    background-color: hsla(var(--md-hue),25%,25%,1)
}
```
