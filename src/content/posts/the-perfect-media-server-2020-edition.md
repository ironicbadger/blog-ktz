---
title: The Perfect Media Server - 2020 Edition
slug: the-perfect-media-server-2020-edition
description: We're back! A fresh new installment of Perfect Media Server ready for 2021 and we launch perfectmediaserver.com
customExcerpt: We're back! A fresh new installment of Perfect Media Server ready for 2021 and we launch perfectmediaserver.com
publishedAt: 2020-12-31T17:52:05.000-05:00
updatedAt: 2026-05-07T07:21:57.000-04:00
featureImage: /content/images/2020/12/Screen-Shot-2020-12-30-at-11.20.44-PM.png
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
ghostId: 6775c6279e78ea00017cbc1d
tags:
  - perfect-media-server
  - technical
  - linux
  - ansible
  - docker
  - automation
  - opinion
  - reverse-proxy
  - self-hosted
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: perfect-media-server
featured: false
readingTime: 9
---

Squeakin' in at the finish line of 2020, Perfect Media Server is back!

The 5th anniversary of the series is in February and to celebrate I have prepared a complete overhaul of the material and would like to present a brand new home both for the blog posts (this blog) and [perfectmediaserver.com](https://perfectmediaserver.com/?ref=blog.ktz.me).

> [perfectmediaserver.com](https://perfectmediaserver.com/?ref=blog.ktz.me) is the new home of the series.

The new site is a wiki and will guide new and experienced users through the process of selecting the software and hardware to build a Perfect Media Server of their own.

It represents 100's of hours worth of work and aims to lower the barrier of entry for some of you to building your own PMS and to help spread the good word about Free and Open-Source Software. The site has a lot of the fundamentals completed but expect to see some work in progress labels here and there - they'll disappear over the next few weeks.

So what does this mean for the annual blog posts? Great question!

These blogs posts will now serve as an annual opinion piece on the state of the Perfect Media Server solution and chronicle any major changes that occurred throughout the year. Also on the agenda will be discussing the general state of Self-Hosting too. I do this regularly on the [Self-Hosted](https://selfhosted.show/?ref=blog.ktz.me) podcast anyway so why not bring the highlights to the fore each year.

And now, on with the blog post...

<h2 id="the-2020-edition">The 2020 edition</h2>

Phewf, what a year. I don't know about you but the stay home orders have meant I've had more time to tinker and perfect things than ever before. However, I find that this entire system is so reliable that each year when it comes to write the post I find myself thinking "OK, it still just works. But that doesn't make for such great content. So... What do I even write about?".

I know that things are very stable and reliable for many of you too because you find me and tell me via [Discord](https://selfhosted.show/discord?ref=blog.ktz.me) or [Twitter](https://twitter.com/IronicBadger?ref=blog.ktz.me). Several times a month I get contacted asking if [PMS](https://perfectmediaserver.com/?ref=blog.ktz.me) is still relevant in 2020 and the answer is yes! Absolutely, yes.

You can find the previous incarnations of PMS below:

-   [Perfect Media Server (2016 Edition) - The Original Solution](https://blog.linuxserver.io/2016/02/02/the-perfect-media-server-2016/?ref=blog.ktz.me)
-   [Perfect Media Server (2017 Edition) - From scratch installation with extensive video guides](https://blog.linuxserver.io/2017/06/24/the-perfect-media-server-2017/?ref=blog.ktz.me)
-   [Perfect Media Server (2019 Edition) - Boring is reliable and adding ZFS to the mix](https://blog.linuxserver.io/2019/07/16/perfect-media-server-2019/?ref=blog.ktz.me)

This year though it occurred to me that yet another blog post on it's own might not be that useful. However, a properly curated, open-source site with first class search and some kind of structure was the way forward.

<h2 id="the-great-debate">The Great Debate</h2>

Xbox vs Playstation. Gas vs Electric. Pragmatism vs Idealism. Build vs Buy. Emacs vs Vim. Unraid vs PMS. These are truly the great debates of our time.

In the end, there is no right or wrong answer and the only person who can decide which works best for you, is you. That said, there are plenty of reasons why rolling your solution might just be a better idea.

<h2 id="cost-and-flexibility">Cost and Flexibility</h2>

One might be forgiven for valuing the overall cost of a solution as the pain inflicted upon their wallet. But there is much more to it than that.

Of course, cost can be quantified financially but also consider the world altering power of Free and Open Source Software (FOSS). Every piece of software used to bring this text to your eyeballs is an open source project (Linux, Ghost, docker, docker-compose, nginx, rsync, mkdocs, Joplin, emacs + org-mode, QEMU, Proxmox etc).

Open Source is a gift and as such, supporting it wherever possible will lead to the betterment of humanity. Formula 1 even announced an open-source [design initiative](https://us.motorsport.com/f1/news/teams-open-source-designs-proposal/4552509/?ref=blog.ktz.me), wow!

By rolling your own solution you are investing in yourself. You are learning skills that will make you more likely to interview well if you'd like to get a job working with Linux. In my opinion, this angle is all too often completely overlooked when picking a solution. The skills I learned building the original Perfect Media Server lead to several wonderful, life-changing situations and it is my hope that comparable opportunities are afforded to my readers and others undertaking a similar path.

Let us next consider money. A license for UnRaid costs $59-129 depending on how many hard drives you connect to it. A Synology or QNAP box will have an associated "tax" to cover the R&D costs of their Operating System maintenance and development. Here's an awkward question though, what happens when these companies stop supporting these products or are acquired?

> "That'll never happen!"  
> \- You at some moment in time

Sadly though, these types of scenarios are much more likely to occur than we like to admit and there are countless examples in just the last 10 years. You must also consider what happens if the new owners decide to kill off your favourite product (Google are *the worst* for this). Perhaps they aren't making enough money because one-off license or hardware purchases are just that, one-offs.

It's a lottery in this scenario as to what happens next. Maybe the source code will be released and the open source community will take it over, maybe it won't. Why take the risk? It might make sense if there weren't viable alternatives but lucky for you, you're reading this article.

My final argument in relation to cost is a lack of flexibility. By using a specific vendors product you are deferring many important decisions to them. Sometimes this is good, sometimes not.

In 2016 PMS was running ‘bare metal’. In other words, it was the primary OS installed on the system. Fast forward to today and I’ve moved the installation from bare metal to a VM in Proxmox and last Autumn to VM under VMware ESXi. More on this later.

In the [2019 edition](https://blog.linuxserver.io/2019/07/16/perfect-media-server-2019/?ref=blog.ktz.me) I decided that whilst JBOD + SnapRAID parity was good enough for my ephemeral media collection, I wanted to enjoy some of the benefits of ZFS for my irreplaceable bits and bytes. Because PMS is 'just regular Linux', ZFS was just a single package install away. No waiting for a plug-in to be developed or for the vendor "officially" support it.

Technically Unraid can run ZFS, but it literally required a [Wendell](https://forum.level1techs.com/t/zfs-on-unraid-lets-do-it-bonus-shadowcopy-setup-guide-project/148764?ref=blog.ktz.me) to figure it out -it is just Linux under the hood after all. Some of this lack of flexibility comes from the unique USB boot method employed by Lime Technology. They ship Unraid this way to make it more n00b friendly and easier to troubleshoot but paradoxically have created a unicorn that only they and their (honestly pretty great) community are intimately familiar with.

This is in contrast to using Ubuntu where almost any issue you encounter is not unique. You are probably able to Google yourself to an answer relatively quickly. Plus LTS releases, like 20.04, are guaranteed 5 years of maintenance updates from Canonical. I know of no such *guarantee* from Lime Technology, Synology, Q-NAP or other NAS vendor.

> Under the guise of simplicity we create elegant abstractions whilst inadvertently often making things harder to fix. Remember that cost is not just financial.

The flexibility afforded to you by using full-blown Linux is vast. It is that flexibility which has enabled PMS to last me for 4 years and counting. The PMS system changes and adapts as I do.

<h3 id="infrastructure-as-code-and-docker-compose">Infrastructure as Code and docker-compose</h3>

A few years ago, I read a book called [Infrastructure as Code](https://amzn.to/2WjBb5c?ref=blog.ktz.me) by Kief Moris. In this book, Kief lays out a framework for defining every part of your infrastructure in text files - or as we sometimes call it, code. This simple philosophy of managing configuration in the same manner as source code revolutionized the way I approach building systems. Tools like Ansible and Terraform may seem overkill for your average media server administrator but I firmly believe they have their place. An afternoon or two learning Ansible, and that is all it takes, will save you dozens of future afternoons scratching your head wondering how you accomplished something 3 weeks, 3 months or 3 years ago. We already covered improved job prospects but these skills are in demand, just do a quick Google search for "DevOps Engineer" jobs.

Readers frequently ask me "Which GUI do you recommend for docker?" and my answer is always `docker-compose`, which understandbly confuses folks as this isn't a GUI at all. This opinion is born out of countless times rebuilding boxes of my own and of others. If you've used a GUI you'll be able to relate to the tedium of clicking and typing over and over again, often guessing at the required input and having no way other than screenshots! to remember what you did. GUIs might feel as if they make the initial set up of a system easier but in the long run, they will bite you and be more difficult to maintain.

Let's now examine the supportability angle for a moment. Put yourself in the shoes of a friendly internet stranger helping you with something via a Discord chat or forum post to fix a problem with a container. It's likely they'll have to ask you to share the parameters used when creating that container. At some point, they're likely to ask you for a screenshot of the web interface of your NAS software or to paste a `docker-compose` yaml snippet. The yaml snippet is easier for you to share, easier for others to read and debug and also means you can't forget the variables used when creating that container. Reverse engineering a random `docker run` command from 6 months ago is no fun.

Recovering from a disaster is easier with a text file too. A backup can be as simple as copying and pasting a file to a Github repository. How do you backup a GUI? Maybe it's possible, maybe not. We can extend this philosophy well beyond just the `docker-compose.yaml` file. What about file sharing configuration via Samba? Users? Packages installed? Bash aliases? Monitoring configurations? The list goes on. Using Ansible 100% of the answers to these questions are stored in my [IronicBadger/infra](https://github.com/ironicbadger/infra?ref=blog.ktz.me) git repo. Using two or three commands it is trivial to take a vanilla Ubuntu installation to fully functional media server in only a few minutes.

Your server will never be "finished". It is a living, breathing manifestation of your tinkering and learning. Infrastructure as Code allows you to track changes made in real-time to the *actual code* used to deploy your *actual server*.

In reality storing configuration as code is a simple concept but requires some discipline. For example, you deploy a server using automation and then begin to make manual changes to it. Before long the code no longer reflects what is deployed and "configuration drift" begins to occur. Reconcillation can often be time consuming. If you commit to Infrastructure as Code, every single change should be made via a configuration management tool such as Ansible. This sounds daunting but the alternative is a special snowflake you are scared to touch. We've all had that install we're scared to format because we aren't sure quite what we'll lose if we do.

<h4 id="using-docker-compose">Using docker-compose</h4>

Time to look at some actual code. Here is an example `docker-compose.yaml` snippet for [Librespeed](https://github.com/librespeed/speedtest?ref=blog.ktz.me), a self-hosted speed test app.

```yaml
---
version: "2"
services:
  librespeed:
    image: linuxserver/librespeed
    container_name: librespeed
    ports:
      - 8008:80
    environment:
      - PUID=1001
      - PGID=1001
      - TZ=America/New_York
      - MODE=standalone
      - TELEMETRY=true
      - PASSWORD=badger1
```

YAML stands for Yet Another Markup Language and for correct parsing of these files careful attention to indentations made up of spaces are key. The specific number of spaces in the indentation is unimportant as long as parallel elements have the same left justification and the hierarchically nested elements are indented further. In short, make sure everything lines up vertically and you'll be OK. Use an editor which highlights spaces for bonus points. VSCode has some nice syntax plug-ins and YAML is one of them.

To create the container defined above is very simple. Copy and paste the above into a file placed at `~/docker-compose.yaml`, run `docker-compose up -d` and you're done.

I use something called bash aliases to make managing over 30 services via on `docker-compose.yaml` file simple enough I can do it from my phone when something goes wrong.

```bash
# /etc/bash_aliases
# Aliases in this file are available to all users
# To install for one user place in ~/.bash_aliases

# Tail last 50 lines of docker logs
alias dtail='docker logs -tf --tail='50' '

# Shorthand, customise docker-compose.yaml location as needed
alias dcp='docker-compose -f ~/docker-compose.yaml '

# Remove unused images (useful after an upgrade)
alias dprune='docker image prune'

# Remove unused images, unused networks *and data* (use with care)
alias dprunesys='docker system prune --all'
```

<h2 id="summary">Summary</h2>

Please bear with me as I finish up the rest of perfectmediaserver.com, there are a few WIP banners as I write this and I wanted to ship *something* in 2020. Producing documentation of a quality that I am happy with takes time and this is a hobby project of mine!

I *passionately* believe in open sourcing as much as possible (hence this blog and the site). If humanity can come together and share information freely then it benefits us all. [perfectmediaserver.com](https://perfectmediaserver.com/?ref=blog.ktz.me) is unlikely to ever be "finished", I'll continue adding to the site for many years to come but I would also like to welcome other contributors to help make the site better too via a pull request or two.

If pull requests aren't your thing, get in touch with me with Twitter (social icons are at the top of each page here) or some other means. Feedback on what you found useful or was too complicated will help out future PMS builders so please let me know!

I hope that you got something thought provoking and useful out of this years edition, see you in 2021! Happy new year!
