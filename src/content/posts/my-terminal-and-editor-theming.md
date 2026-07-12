---
title: My Terminal and Editor Theming
slug: my-terminal-and-editor-theming
description: It's not ricing. Promise.
customExcerpt: It's not ricing. Promise.
publishedAt: 2025-09-12T12:07:44.000-04:00
updatedAt: 2026-05-07T07:21:22.000-04:00
featureImage: /content/images/2025/09/Screenshot-2025-09-12-at-12.07.30.png
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
ghostId: 68c4427e5878990001f6a448
tags:
  - technical
internalTags: []
primaryTag: technical
featured: false
readingTime: 2
---

As you may know, I make YouTube videos for Tailscale for a living. One of the most common questions in the comments I get (weirdly) is, "how do you theme your tools?"  
  
This post will set out to answer that question in more detail than I can provide in a simple comment reply.

<h2 id="font">Font</h2>

Where possible I use [Berkeley Mono](https://usgraphics.com/products/berkeley-mono?ref=blog.ktz.me). Fira Code or Jetbrains Mono are nice fallbacks.

<h2 id="terminal">Terminal</h2>

-   macOS terminal - [ghostty](https://ghostty.org/?ref=blog.ktz.me)
-   Linux terminal - omarchy defaults ([A](https://alacritty.org/?ref=blog.ktz.me)[lacritty](https://alacritty.org/?ref=blog.ktz.me))

Here's my ghostty config.

```bash
# appearance
font-family = "BerkeleyMono Nerd Font"
font-size = 16
window-inherit-font-size = true
window-height = 33
window-width = 130

# shell
mouse-hide-while-typing = true
shell-integration = zsh
clipboard-paste-protection = false

# macos
## nix handles updates
auto-update = off
macos-titlebar-style = native
macos-option-as-alt = true
quit-after-last-window-closed = true
keybind = shift+enter=text:\n
```

<h2 id="shell-prompt">Shell Prompt</h2>

-   [Starship](https://starship.rs/?ref=blog.ktz.me)

The prompt that you see (the bit that contains the filepath, username, etc) is configured using [Starship](https://starship.rs/?ref=blog.ktz.me) - a minimal, blazing fast, customizable shell prompt.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2025/09/Screenshot-2025-09-12-at-12.00.56.png" class="kg-image" alt="" loading="lazy" width="1968" height="1122" srcset="/content/images/size/w600/2025/09/Screenshot-2025-09-12-at-12.00.56.png 600w, /content/images/size/w1000/2025/09/Screenshot-2025-09-12-at-12.00.56.png 1000w, /content/images/size/w1600/2025/09/Screenshot-2025-09-12-at-12.00.56.png 1600w, /content/images/2025/09/Screenshot-2025-09-12-at-12.00.56.png 1968w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

The configuration I use hangs out in my [nix-config git repo](https://github.com/ironicbadger/nix-config/blob/main/home/starship/starship.toml?ref=blog.ktz.me). I use nix and nix-darwin to apply this configuration automatically.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://github.com/ironicbadger/nix-config/blob/main/home/starship/starship.toml?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">nix-config/home/starship/starship.toml at main · ironicbadger/nix-config</div><div class="kg-bookmark-description">Contribute to ironicbadger/nix-config development by creating an account on GitHub.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="/content/images/icon/pinned-octocat-093da3e6fa40-3.svg" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">GitHub</span><span class="kg-bookmark-publisher">ironicbadger</span></div></div><div class="kg-bookmark-thumbnail"><img src="/content/images/thumbnail/nix-config-1" alt="" onerror="this.style.display = 'none'" loading="lazy" decoding="async"></div></a></figure>

<h2 id="editor">Editor</h2>

-   VSCode - the editor that in the darkness bound them
-   Neovim - I am still experimenting with neovim but you can find my configuration [on GitHub](https://github.com/ironicbadger/neovim-config?ref=blog.ktz.me)

The VSCode theme shown below is `Bearded Theme Monokai Stone`. For right now I am using the default icons but in the past the Bearded Icons pack may have been shown too.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2025/09/Screenshot-2025-09-12-at-12.03.51.png" class="kg-image" alt="" loading="lazy" width="2000" height="1390" srcset="/content/images/size/w600/2025/09/Screenshot-2025-09-12-at-12.03.51.png 600w, /content/images/size/w1000/2025/09/Screenshot-2025-09-12-at-12.03.51.png 1000w, /content/images/size/w1600/2025/09/Screenshot-2025-09-12-at-12.03.51.png 1600w, /content/images/2025/09/Screenshot-2025-09-12-at-12.03.51.png 2136w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

<h2 id="other-useful-tools">Other useful tools</h2>

In no particular order a list of other tools I use and enjoy on macOS in particular are:

-   [BentoBox](https://bentoboxapp.com/?ref=blog.ktz.me) - Window management app
-   [Snippety](https://snippety.app/?ref=blog.ktz.me) - Text expansion
-   [Raycast](https://www.raycast.com/?ref=blog.ktz.me) - Spotlight replacement
-   [Ice](https://icemenubar.app/?ref=blog.ktz.me) - makes app "systray" icons on macOS bearable (especially with a notch)
-   [iStat Menus](https://bjango.com/mac/istatmenus/?ref=blog.ktz.me) - Shows me what's going at a glance
-   [Hammerflow](https://hammerflow.dev/?ref=blog.ktz.me) (and Hammerspoon) - Keyboard driven task navigation
