---
title: The Enshittification of Plex 💩
slug: the-enshittification-of-plex
description: '"But lifetime passers are grandfathered in" you might say, "so why should I care?".'
customExcerpt: '"But lifetime passers are grandfathered in" you might say, "so why should I care?".'
publishedAt: 2026-05-24T16:44:44.000-04:00
updatedAt: 2026-05-24T16:44:44.000-04:00
featureImage: https://images.unsplash.com/photo-1695509120014-83adf2b2d6e3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTc3M3wwfDF8c2VhcmNofDMwfHx2aWRlbyUyMHJlbnRhbCUyMHN0b3JlfGVufDB8fHx8MTc3OTYzODE2N3ww&ixlib=rb-4.1.0&q=80&w=2000
featureImageAlt: null
featureImageCaption: '<span style="white-space: pre-wrap;">Photo by </span><a href="https://unsplash.com/@pray4bokeh?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit"><span style="white-space: pre-wrap;">Bruno Guerrero</span></a><span style="white-space: pre-wrap;"> / </span><a href="https://unsplash.com/?utm_source=ghost&amp;utm_medium=referral&amp;utm_campaign=api-credit"><span style="white-space: pre-wrap;">Unsplash</span></a>'
authors:
  - name: Alex Kretzschmar
    slug: alex
    profileImage: https://www.gravatar.com/avatar/fe787a6cc9815aba6f8d6fc22471f238?s=250&r=x&d=mp
canonicalUrl: null
seo:
  title: null
  description: null
  image: null
ghostId: 6a131f1102e4350001a456f8
tags:
  - technical
internalTags: []
primaryTag: technical
featured: false
readingTime: 7
---

Perhaps you heard the news this week that Plex is raising the cost of a lifetime pass from $250 to $750? Perhaps you've become numb to the general enshittification of the Plex Media Server software?

<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/s9ELRrIXVmQ?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen="" title="What Happened to Plex? The 15 Year Timeline" loading="lazy"></iframe></figure>

Today, I'm going to break down everything that's happened over the last decade that got us to this point. I'll aim to be as factually accurate as possible. But I'm now at the point with Plex where I'm done. I'm out. It has been obvious for years that there is only one end result here and with the news of the massive price hike recently I'm fairly certain we are watching the final stages of collapse.

"But lifetime passers are grandfathered in" you might say, "so why should I care?". That is true, they are. But Plex has to exist for their authentication services, live TV EPG services, and many more aspects of the Plex experience to work at all. So if Plex the company goes away, then so will everything else around it regardless of whether you have a lifetime pass, as I do, or not.

I'm switching to Jellyfin for good, and I hope you will too.

<h2 id="what-is-plex">What is Plex?</h2>

It's a "bring your own files", self-hosted version of a media streaming platform like a Netflix or Spotify. But you run the service on your hardware, streaming your files, using your electricity, hardware, and so forth.

Plex began as a fork of XBMC, originally as a Mac OS X port of XBMC. At the time it was known as OSXBMC and was the creation of [Elan Feingold](https://www.crunchbase.com/person/elan-feingold?ref=blog.ktz.me). In May 2008 the Plex name was adopted after the XBMC codebase was forked. Kodi's own wiki - Kodi is the newer modern name for the XBMC project - notes that newer Plex clients were later rewritten and are no longer based on the forked code.

License is a particularly messy area of Plex's history. XBMC was GPL-based, so early Plex inherited open-source obligations, but Plex evolved into a commerical product with significant closed-source/proprietary parts. Some Plex client code has remained [open](https://support.plex.tv/articles/204096476-license-information/?ref=blog.ktz.me) for compliance reasons, but the core Plex Media Server code is not open-source.

<h2 id="what-is-jellyfin">What is Jellyfin?</h2>

To answer this we must introduce [Emby](https://emby.media/?ref=blog.ktz.me). Emby [came from](https://emby.media/introducing-emby.html?ref=blog.ktz.me) a separate lineage of media software known as Media Browser in March 2015. Jellyfin is a fork of Emby. The split here occurred in 2018 from Emby v3.5.2 after Emby moved toward a proprietary/closed-source model.

[Jellyfin](https://jellyfin.org/?ref=blog.ktz.me) is the free-software continuation and alternative to both Emby and Plex.

<h2 id="a-timeline-of-events">A timeline of events</h2>

The idea here is give you a picture of the notably things that have happened in the Plex universe over the last decade or so. You can see quite clearly around 2019+ how the company has been flailing and looking for a purpose since The Verge's article in July 2019.

-   [August 2012](https://www.plex.tv/blog/part-2-introducing-plexpass/?ref=blog.ktz.me) - PlexPass launches
    -   Plex framed PlexPass as a supporter / early-access program
    -   Early access, private forums, premium feature testing, and discounts were part of the pitch
    -   Launch price was $3.99/month
-   [November 2012](https://www.plex.tv/blog/announcing-the-new-plexpass-feature/?ref=blog.ktz.me) - PlexSync becomes an early premium feature
    -   PlexSync let users reformat and load media onto mobile devices for offline viewing
    -   Announced as a PlexPass feature
-   [September 2014](https://web.archive.org/web/20160816132608/https://www.plex.tv/blog/upcoming-price-increase-new-plex-pass-subscriptions/) - Plex Pass price hike
    -   Plex announced new pricing effective Sept 2014
        -   Monthly increased from $3.99 -> $4.99
        -   Annual increased from $29.99 -> $39.99
        -   Lifetime increase from $74.99 -> $149.99
-   [November 2014](https://www.plex.tv/en-gb/blog/introducing-plex-home/?ref=blog.ktz.me) - Plex Home / parental-control tiering
    -   Plex introduced Plex Home, managed users, and finer access controls
    -   Some multiuser features became free
    -   More advanced Home / sharing controls stayed Plex Pass
-   [July 2015](https://haveibeenpwned.com/Breach/Plex?ref=blog.ktz.me) - [Forum security breach](https://web.archive.org/web/20160708094738/https://www.plex.tv/blog/security-notice-forum-user-password-resets/)
    -   Plex’s forum was hacked.
    -   HaveIBeenPwnd.net listed 327,000+ exposed accounts including emails, IPs, usernames, and weakly implemented salted password hashes.
    -   Plex reset users passwords
    -   Reports noted a ransom demand
-   [September 2016](https://www.techspot.com/news/66183-plex-adds-dvr-feature-over-air-broadcasts.html?ref=blog.ktz.me) - DVR beta added to Plex Pass
    -   Plex DVR launched in beta for Plex Pass subscribers
    -   Initially tied to HDHomeRun tuners and guide data
-   [December 2016](https://forums.plex.tv/t/plex-beta-1-7-1-3856/193235?ref=blog.ktz.me) - Hardware transcoding preview
    -   Plex Media Server 1.4.0 added a Hardware Transcoding Preview
    -   It was introduced as a Plex Pass feature for Windows, macOS, and Linux
    -   Early support included Intel graphics caveats
    -   [Plex's current docs](https://support.plex.tv/articles/115002178853-using-hardware-accelerated-streaming/?ref=blog.ktz.me) still list hardware-accelerated streaming as premium, while ordinary software transcoding remains free
        -   exceptions include NVIDIA SHIELD and WD My Cloud Pro PR2100 / PR4100 servers
-   [June-August 2017](https://www.plex.tv/de/blog/well-do-it-live/?ref=blog.ktz.me) - Live TV / DVR solidifies as Plex Pass
    -   Plex added Live TV and later expanded time shifting / DVR support
    -   Live TV / DVR required Plex Pass plus supported tuner / antenna hardware
-   [August 2017](https://techcrunch.com/2017/08/21/plex-changes-its-new-privacy-policy-after-backlash-clarified-its-not-trying-to-see-whats-in-your-library/?ref=blog.ktz.me) - Privacy policy changes and backlash
    -   A proposed policy removed users’ ability to opt out of some data collection, prompting fears about library tracking
    -   Plex revised the policy in response and restored opt-out controls
-   [December 2017](https://medium.com/plexlabs/introducing-plexamp-9493a658847a?ref=blog.ktz.me) - Plexamp launches
    -   Plex Labs unveiled Plexamp as its first project
    -   A Winamp-inspired desktop music player for Plex music libraries
-   [October 2018](https://web.archive.org/web/20251209132452/https://forums.plex.tv/t/discontinuation-of-plugins-watch-later-recommended-and-cloud-sync/312312) - Plex Cloud and feature retirements
    -   Plex retires Watch Later, Recommended, Cloud Sync and plugins
    -   Plex shutdown their hosted Plex Cloud service after reliability / cost problems
-   [Nov 2018](https://www.plex.tv/blog/turning-plex-music-up-to-eleventy/?ref=blog.ktz.me) - Plex adds TIDAL integration
    -   This added streaming music, TIDAL-powered discovery, universal playlists/search, and library augmentation alongside personal music collections
-   [July 2019](https://web.archive.org/web/20260520081748/https://www.theverge.com/2019/7/23/20697751/piracy-plex-netflix-hulu-streaming-wars) - The Verge very publicly highlights Plex's piracy problem
    -   A Verge feature highlighted Plex’s role in private shared libraries
    -   Plex is framed as enabling "unofficial piracy streaming clubs"
    -   Emphasizes the piracy problem that Plex has (ed: and always will have!)
-   [Dec 2019](https://web.archive.org/web/20260128101801/https://techcrunch.com/2019/12/04/plex-launches-a-free-ad-supported-streaming-service-in-over-200-countries/) - Ad-supported streaming launches
    -   Plex launched free, ad-supported movies and TV in 200+ countries,
    -   This marked a major pivot beyond personal media libraries into studio-backed streaming
-   [Feb 2020](https://web.archive.org/web/20260511034244/https://www.netscout.com/blog/asert/plex-media-ssdp-pmssdp-reflectionamplification-ddos-attack) - Plex servers used for DDoS amplication
    -   Researchers found exposed Plex Media Server instances being abused for PMSSDP reflection/amplification DDoS attacks
    -   Plex said unusual network exposure was required and shipped a hotfix
-   [Apr 2020](https://techcrunch.com/2020/04/16/media-software-maker-plex-launches-new-subscriber-only-apps-for-music-and-server-management/?ref=blog.ktz.me) - Plexamp 3.0 relaunch
    -   Plexamp was rewritten/relaunched across desktop and mobile as a Plex Pass app
    -   coverage notes its search/recent plays included servers, podcasts, and TIDAL
-   [May 2020](https://www.plex.tv/en-au/blog/go-ahead-and-skip-that-intro/?ref=blog.ktz.me) - Skip Intro added
    -   Plex launched Skip Intro as a new Plex Pass feature for TV libraries
-   [May 2020](https://web.archive.org/web/20200630022418/https://forums.plex.tv/t/security-regarding-cve-2020-5741/586819) - CVE-2020-5741
    -   Flaw where an attacker with admin account access could abuse Camera Upload to execute malicious code
-   [July 2020](https://web.archive.org/web/20251213182957/https://www.plex.tv/blog/the-one-where-plex-announces-free-streaming-live-tv/) - Free Live TV expands Plex's ad business
    -   Plex launched free Live TV in 220+ countries with 80+ channels, further broadening its shift toward ad-supported streaming
-   [Jan 2021 - Mar 2022](https://web.archive.org/web/20251216150726/https://www.plex.tv/blog/game-on-a-plex-blog-story/) - Plex Arcade gets the "killed by Google" treatment
    -   Plex launched a retro-game streaming subscription with Atari/Parsec
    -   Then announced Plex Arcade would shut down on Mar. 31, 2022
-   [April 2021](https://www.globenewswire.com/de/news-release/2021/04/14/2210024/34264/en/Streaming-Media-Platform-Plex-Raises-50-Million-in-Growth-Equity-to-Become-the-One-Stop-Shop-for-Movies-and-TV.html?ref=blog.ktz.me) - Plex [raises $50m](https://web.archive.org/web/20260524145722/https://www.globenewswire.com/de/news-release/2021/04/14/2210024/34264/en/Streaming-Media-Platform-Plex-Raises-50-Million-in-Growth-Equity-to-Become-the-One-Stop-Shop-for-Movies-and-TV.html)
    -   Plex announced a growth equity investment round from existing investor Intercap
    -   Only about $15M was new capital
    -   The rest was used to buy shares/options from employees and shareholders
-   [Dec 2021](https://forums.plex.tv/t/security-regarding-cve-2021-42835/761510?ref=blog.ktz.me) - CVE-2021-42835
    -   Plex disclosed a Windows local privilege-escalation flaw affecting PMS before 1.25.0
    -   Exploitation required local/physical access and was fixed in 1.25.0.5282+
-   [April 2022](https://web.archive.org/web/20260523013553/https://techcrunch.com/2022/04/05/huge-plex-update-adds-a-universal-watchlist-cross-service-search-and-new-discovery-features/) - Universal Watchlist and cross-service search
    -   Plex launched Discover ([to a *mixed* response](https://www.reddit.com/r/PleX/comments/u1uvqf/how_do_i_turn_off_discovery/?ref=blog.ktz.me))
    -   Launched cross-service search
    -   And a universal watchlist to help users find content across streaming services
    -   Presumably aimed at become a "one stop shop" for all your streaming needs?
-   [August 2022](https://web.archive.org/web/20250919134743/https://forums.plex.tv/t/important-notice-of-a-potential-data-breach-24th-of-august-2022/806518) - Account database breach
    -   Another breach this time involving suspicious database activity
    -   A third party accessed emails, usernames, and encrypted/bcrypt-hashed passwords
    -   Plex forced account password resets and said payment data was not stored
-   [Feb 2023](https://www.plex.tv/en-gb/blog/let-the-next-episode-roll/?ref=blog.ktz.me) - Skip Credits added
    -   Skip Credits became available for Plex Pass holders on personal libraries
    -   Plex's own free streaming catalog also got the feature
-   [Mar 2023](https://web.archive.org/web/20260519095025/https://thehackernews.com/2023/03/lastpass-hack-engineers-failure-to.html) - LastPass breach linked to unpatched Plex on an employees computer
    -   Reports said attackers exploited an old Plex flaw on a LastPass engineer’s home computer
    -   CISA added CVE-2020-5741 to its known-exploited catalog
-   [Jul 2023](https://www.plex.tv/blog/free-bird-plexamp-spreads-its-wings-for-every-music-lover/?ref=blog.ktz.me) - Plexamp becomes free
    -   Plex made core Plexamp free for all users
    -   Advanced features such as downloads, Sonic Sage, and some Guest DJ features behind Plex Pass
-   [Sept 2023](https://web.archive.org/web/20230915165531/https://torrentfreak.com/plex-will-block-media-servers-at-prevalent-hosting-company-230915/) - Hetzner ban hammer on Plex servers
    -   Plex warned users that servers at a hosting provider widely identified as Hetzner would be blocked over large-scale ToS violations
    -   Sparked *yet another* anti-piracy and legitimisation debate
-   [November 2023](https://www.theverge.com/2023/11/27/23978451/plex-users-have-some-valid-concerns-about-its-new-activity-sharing-feature?ref=blog.ktz.me) - Discovery Together privacy controversy
    -   "Your week in review" emails leak user watch habits
    -   This triggering Reddit/forum outrage over opt-out social sharing and concerns that personal-server watch history was being exposed without clear consent
-   [Feb 2024](https://techcrunch.com/2024/02/07/streamer-plex-launches-its-long-promised-movie-rentals-store/?ref=blog.ktz.me) - Movie rentals launch
    -   Plex launched a movie-rental store with 1,000+ titles
    -   Coverage criticized limits such as U.S.-focused availability, 1080p/5.1 quality, no 4K HDR, and no downloads
-   [April 2024 - Jun 2025](https://news.bloomberglaw.com/litigation/plex-user-advances-suit-over-sharing-of-viewing-info-with-meta?ref=blog.ktz.me) - VPPA / Meta lawsuit
    -   Plex faced a proposed class action alleging it shared viewing histories with Meta
    -   The suit advanced in Mar. 2025 but was voluntarily dismissed in Jun. 2025
-   [October 2024](https://forums.plex.tv/t/tidal-integration-with-plex-ending-october-28-2024/885728?ref=blog.ktz.me) - TIDAL integration removed
    -   This meant Plexamp would no longer connect to TIDAL
    -   Plex-billed TIDAL subs stopped
-   [Apr-Nov 2025](https://web.archive.org/web/20250319151649/https://www.plex.tv/blog/important-2025-plex-updates/) - Price hikes and remote paywalls go up
    -   Plex Pass prices went up for the first time in a decade
        -   Monthly - $4.99 -> $6.99
        -   Annual - $39.99 -> $69.99
        -   Lifetime - $149.99 -> $249.99
    -   Remote personal-playback became paid
    -   Enforcement began later in 2025
    -   [Alex and Robbie purchase soapboxes](https://www.youtube.com/watch?v=FcorAYtHHhQ&ref=blog.ktz.me) and make use of them
-   [Aug 2025](https://www.bleepingcomputer.com/news/security/plex-warns-users-to-patch-security-vulnerability-immediately/?ref=blog.ktz.me) - CVE-2025-34158
    -   NVD described the flaw as exposing server-owner credentials in PMS 1.41.7.x–1.42.0.x before 1.42.1
-   [Sep 2025](https://web.archive.org/web/20250908213946/https://forums.plex.tv/t/important-notice-of-security-incident/930523) - A security incident
    -   An unauthorized third party accessed emails, usernames, securely hashed passwords, and authentication data from one database
    -   users were told to reset passwords or SSO sessions
-   [May 2026](https://arstechnica.com/gadgets/2026/05/plexs-200-lifetime-pass-price-hike-tries-forcing-users-to-another-subscription/?ref=blog.ktz.me) - Plex hikes the prices by 200% for lifetime
    -   Lifetime increases from $249.99 -> $749.99
-   [Jun 2026](https://www.androidauthority.com/plex-remote-watch-pass-price-increase-3663060?ref=blog.ktz.me) \- Remote Watch Pass price increase scheduled
    -   Official plan pages show Remote Watch Pass intro pricing ending June 1
    -   Prices rise from $1.99/$19.99 to $2.99/$29.99 monthly/yearly
-   [July 2026](https://alternativeto.net/news/2026/5/plex-to-raise-lifetime-plex-pass-price-to-749-99-on-july-1-2026/?ref=blog.ktz.me) - Lifetime Plex Pass jumps again
    -   Scheduled for July 1, 2026
    -   Lifetime Plex Pass increases from $249.99 -> $749.99
    -   Monthly and annual prices stay unchanged

<h2 id="my-conclusions-from-this-timeline">My conclusions from this timeline</h2>

Over the past decade we have watched Plex flail around looking for a viable business model. What started as a paid supporter tier for early access and genuinely useful personal-media features has slowly become a ratchet. More investor pressure, ad-supported streaming, attempts to become a discovery layer for other services, privacy controversies, price hikes, pieces of the personal-media experience moved behind some kind of recurring payment.

The company has never fully escaped the piracy shadow, but it has also spent years drifting away from the people who used Plex for the legitimate and simple reason that it was the best way to stream their own files from their own hardware.

Plex's core users provided the servers, the storage, the electricity, the libraries, the bug reports, the community, and in many cases lifetime payments made in good faith. Now those same users are being asked to pay more (ignoring of course that lifetimers are grandfathered at their pre-existing price for the lifetime of Plex the company), accept more cloud dependency, and tolerate a product strategy increasingly aimed somewhere else.

Maybe Plex survives this by becoming a broader streaming portal with personal media as a legacy feature. But if that is the future, then I would rather move now to software whose incentives are aligned with self-hosting, ownership, and local control. That future is Jellyfin.
