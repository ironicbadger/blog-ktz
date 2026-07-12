---
title: I need your help with Intel Quick Sync benchmarking!
slug: i-need-your-help-with-intel-quick-sync-benchmarking
description: Please help me benchmark as many Intel CPUs Quick Sync transcoding performance as possible!
customExcerpt: Please help me benchmark as many Intel CPUs Quick Sync transcoding performance as possible!
publishedAt: 2023-09-08T14:43:09.000-04:00
updatedAt: 2026-05-07T07:21:41.000-04:00
featureImage: https://images.unsplash.com/photo-1532436908675-8b2b1e9ca504?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDY0fHx2aWRlb3xlbnwwfHx8fDE2OTQxOTg1NzJ8MA&ixlib=rb-4.0.3&q=80&w=2000
featureImageAlt: null
featureImageCaption: Photo by <a href="https://unsplash.com/@kushagrakevat?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Kushagra Kevat</a> / <a href="https://unsplash.com/?utm_source=ghost&utm_medium=referral&utm_campaign=api-credit">Unsplash</a>
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 6775c6279e78ea00017cbc38
tags:
  - technical
  - linux
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: technical
featured: false
readingTime: 3
---

If you're building an always on system which is doing any kind of video [transcoding](https://forums.serverbuilds.net/t/guide-hardware-transcoding-the-jdm-way-quicksync-and-nvenc/1408?ref=blog.ktz.me) then you'll want to investigate Intel [Quick Sync](https://www.intel.com/content/www/us/en/architecture-and-technology/quick-sync-video/quick-sync-video-general.html?ref=blog.ktz.me) Video (QSV). Many common video applications can take advantage of this hardware transcoding technology such as [Jellyfin](https://jellyfin.org/?ref=blog.ktz.me), [Plex](https://www.plex.tv/?ref=blog.ktz.me), [Frigate](https://frigate.video/?ref=blog.ktz.me), [Blue Iris](https://blueirissoftware.com/?ref=blog.ktz.me), and many more.

<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/ceUIUyZwchY?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="Is Quick Sync Video any good? Media Server Hardware Encoding Tests | Enquire within, help needed!" loading="lazy"></iframe></figure>

Quick Sync Video is the hardware video transcoding circuitry built into most Intel CPUs for the last few years.

However, we don't really have any standardised testing to allow us to benchmark iGPUs for transcoding performance. There are plenty of benchmarks out there for gaming performance but nothing for those us running these types of always-on server workloads where energy usage matters just as much, if not more, than ultimate performance.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://github.com/ironicbadger/quicksync_calc?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">GitHub - ironicbadger/quicksync_calc</div><div class="kg-bookmark-description">Contribute to ironicbadger/quicksync_calc development by creating an account on GitHub.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://github.com/fluidicon.png" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">GitHub</span><span class="kg-bookmark-publisher">ironicbadger</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://opengraph.githubassets.com/f934e0c76906a954b5d6feb059dbce6ce396f792a1af921092674e582d757d66/ironicbadger/quicksync_calc" alt="" loading="lazy" decoding="async"></div></a></figure>

Therefore I'm pleased to announce the first release of a Quick Sync benchmarking script allowing us to do just that.

> A big thank you to my buddy Morgan Peterman (aka [cptmorgan-rh](https://github.com/cptmorgan-rh/quicksync_calc?ref=blog.ktz.me)) who wrote the majority of this script.

<h2 id="the-test-video">The Test Video</h2>

<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/gCCr-N2RYnQ?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="Ribblehead Viaduct in 2017 drone footage" loading="lazy"></iframe></figure>

To ensure we had a standardised, copyright free video for everyone to use I edited some old drone footage of mine that has never seen the light of day before. The stunning and bleak Ribblehead viaduct is the subject.

The file was rendered out from Final Cut Pro in 4 formats. `H264 at 1080p and 4k` plus `HEVC 8 bit at 1080p` and the final boss level encoding test, `HEVC 10 bit at 4k`.

<h2 id="how-to-run-the-benchmark">How to run the benchmark</h2>

This script requires you have an Intel CPU with Quick Sync. It also requires a Linux host with docker installed and root access for simplicities sake.

During the creation of this benchmarking script I took the decision to use the [Jellyfin ffmpeg fork](https://github.com/jellyfin/jellyfin-ffmpeg?ref=blog.ktz.me) and run the tests from within a Jellyfin container. This removes a bunch of maintenance burden and allows a standardised test environment across multiple users.

> In order to make this test as fair as possible, please stop any running containers or other VMs for the approx 5 min duration of the test. Thank you.

To run the benchmark, do as follows:

```bash
# connect to the system you want the benchmark on (likely via ssh)
ssh user@hostname

# install a couple of dependencies (script tested on proxmox 8 + ubuntu 22.04)
apt install docker jq bc intel-gpu-tools

# clone the git repo with the script
git clone https://github.com/ironicbadger/quicksync_calc.git

# change directory into the cloned repo
cd quicksync_calc

# download the test videos
./video-download.sh

# run the benchmark
./quicksync-benchmark.sh

# copy your results into the following github gist as a comment
https://gist.github.com/ironicbadger/5da9b321acbe6b6b53070437023b844d
```

If you'd like there's also a `tmux.sh` script which will show you `htop` and `intel_gpu_top`  if you're into watching bars fill up as your system goes to work (hint: I am!).

<figure class="kg-card kg-image-card"><img src="/content/images/2023/09/Screenshot-2023-09-08-at-2.38.09-PM.png" class="kg-image" alt="" loading="lazy" width="1298" height="595" srcset="/content/images/size/w600/2023/09/Screenshot-2023-09-08-at-2.38.09-PM.png 600w, /content/images/size/w1000/2023/09/Screenshot-2023-09-08-at-2.38.09-PM.png 1000w, /content/images/2023/09/Screenshot-2023-09-08-at-2.38.09-PM.png 1298w" sizes="(min-width: 720px) 720px" decoding="async"></figure>

<h2 id="results">Results</h2>

Once complete you should have generated a small table of results which looks something like this.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2023/09/image.png" class="kg-image" alt="" loading="lazy" width="747" height="107" srcset="/content/images/size/w600/2023/09/image.png 600w, /content/images/2023/09/image.png 747w" decoding="async"></figure>

Please copy and paste those results into this Github Gist. I hope to make a more interactive results browser available on perfectmediaserver.com in time but for now this will have to do!

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://gist.github.com/ironicbadger/5da9b321acbe6b6b53070437023b844d?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">results</div><div class="kg-bookmark-description">results. GitHub Gist: instantly share code, notes, and snippets.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="https://gist.github.com/fluidicon.png" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">Gist</span><span class="kg-bookmark-publisher">262588213843476</span></div></div><div class="kg-bookmark-thumbnail"><img src="https://github.githubassets.com/images/modules/gists/gist-og-image.png" alt="" loading="lazy" decoding="async"></div></a></figure>
