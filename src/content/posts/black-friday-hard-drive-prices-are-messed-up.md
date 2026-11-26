---
title: "Black Friday hard drive prices are messed up"
slug: black-friday-hard-drive-prices-are-messed-up
description: "The same 20TB drive went from $249.99 to $549.99 in two Black Fridays. I dug through eight years of receipts, including my ServerPartDeals orders."
customExcerpt: null
publishedAt: 2026-11-26T10:43:54-05:00
updatedAt: 2026-11-26T10:43:54-05:00
featureImage: /content/images/2026/11/black-friday-hard-drive-prices-are-messed-up/row-of-easystore-drives-on-a-cluttered-workbench.webp
featureImageAlt: "A row of WD EasyStore drives on a cluttered workbench."
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
ghostId: local-4e1797ee-5bc1-4759-8970-ff74a61e41ab
tags:
  - technical
  - hardware
internalTags: []
primaryTag: technical
featured: false
readingTime: 3
drafts: false
---

For years now, I’ve made it an annual tradition to replace one or two hard drives on Black Friday. I typically run around ten physical disks, and swapping a couple out each year means I almost never have a drive older than five years in my systems. I’ve even previously made videos about [shucking disks around this time of year](https://www.youtube.com/watch?v=c2mvIbY9n28).

But current hardware pricing is totally screwed. So what is a lifelong self-hoster to do in times like these? With disk capacities increasing massively over the last 10 years I can now fit 20TB per slot. This means I could realistically go from ten spinners to five, and not really feel it too acutely. This will mean redoing my zpool layouts, which in turn means shuffling some data around as ZFS doesn't like changes to the layout of existing pools. But, at these prices, I’m starting to think the hassle might be worth it.

Let's take a look at disk prices over the past 8 years in today's post.

The 20TB WD EasyStore I bought for **$249.99** in November 2024 is, today, on sale, **$549.99** this Black Friday. $300 more than 2 years ago for the same product, from the same store. It shows just how bad hard drive pricing has gotten ([BestBuy 20TB listing](https://www.bestbuy.com/product/wd-easystore-20tb-external-usb-3-0-hard-drive-black/6500985)).

<figure aria-labelledby="price-per-tb-caption">
<svg role="img" aria-labelledby="price-per-tb-title price-per-tb-desc" viewBox="0 0 560 261" style="display:block;width:100%;height:auto">
<title id="price-per-tb-title">What a terabyte cost me</title>
<desc id="price-per-tb-desc">Nov 2018 (10TB), $18.00 per TB; Oct 2020 (12TB), $14.58 per TB; Nov 2021 (14TB), $14.29 per TB; May 2022 (14TB), $17.86 per TB; Aug 2022 (14TB), $17.14 per TB; Oct 2023 (18TB), $11.11 per TB; Nov 2024 (20TB), $12.50 per TB; May 2025 (20TB), $14.00 per TB; Nov 2026 (20TB), $27.50 per TB</desc>
<g font-family="system-ui, sans-serif" fill="currentColor" font-size="13">
<text x="12" y="23" font-size="18" font-weight="700">What a terabyte cost me</text>
<path d="M52 224 H514" stroke="currentColor" opacity=".18"/>
<text x="43" y="228" text-anchor="end">$0</text>
<path d="M52 164 H514" stroke="currentColor" opacity=".18"/>
<text x="43" y="168" text-anchor="end">$10</text>
<path d="M52 104 H514" stroke="currentColor" opacity=".18"/>
<text x="43" y="108" text-anchor="end">$20</text>
<path d="M52 44 H514" stroke="currentColor" opacity=".18"/>
<text x="43" y="48" text-anchor="end">$30</text>
<text x="52.0" y="247" text-anchor="middle">2018</text>
<text x="144.0" y="247" text-anchor="middle">2020</text>
<text x="255.7" y="247" text-anchor="middle">2022</text>
<text x="367.6" y="247" text-anchor="middle">2024</text>
<text x="502.0" y="247" text-anchor="middle">2026</text>
<polyline points="52.0,116.0 159.9,136.5 218.7,138.3 247.9,116.8 264.8,121.2 329.8,157.3 389.5,149.0 414.8,140.0" fill="none" stroke="currentColor" stroke-width="2"/>
<polyline points="414.8,140.0 502.0,59.0" fill="none" stroke="#c2410c" stroke-width="2" stroke-dasharray="5 5"/>
<circle cx="52.0" cy="116.0" r="4.5" fill="currentColor"><title>Nov 2018 (10TB) · $18.00/TB</title></circle>
<circle cx="159.9" cy="136.5" r="4.5" fill="currentColor"><title>Oct 2020 (12TB) · $14.58/TB</title></circle>
<circle cx="218.7" cy="138.3" r="4.5" fill="currentColor"><title>Nov 2021 (14TB) · $14.29/TB</title></circle>
<circle cx="247.9" cy="116.8" r="4.5" fill="currentColor"><title>May 2022 (14TB) · $17.86/TB</title></circle>
<circle cx="264.8" cy="121.2" r="4.5" fill="currentColor"><title>Aug 2022 (14TB) · $17.14/TB</title></circle>
<circle cx="329.8" cy="157.3" r="4.5" fill="currentColor"><title>Oct 2023 (18TB) · $11.11/TB</title></circle>
<circle cx="389.5" cy="149.0" r="4.5" fill="currentColor"><title>Nov 2024 (20TB) · $12.50/TB</title></circle>
<circle cx="414.8" cy="140.0" r="4.5" fill="currentColor"><title>May 2025 (20TB) · $14.00/TB</title></circle>
<circle cx="502.0" cy="59.0" r="4.5" fill="#c2410c"><title>Nov 2026 (20TB) · $27.50/TB</title></circle>
<text x="52.0" y="105.0" text-anchor="start" font-weight="650">$18.00 (10TB)</text>
<text x="329.8" y="178.3" text-anchor="middle" font-weight="650">$11.11 (18TB)</text>
<text x="502.0" y="47.0" text-anchor="end" font-weight="650">$27.50 (20TB)</text>
</g>
</svg>
<figcaption id="price-per-tb-caption">Price per TB before tax.</figcaption>
</figure>

Shucking is homelab speak for taking a perfectly good external drive out of its USB enclosure and sticking the SATA drive in your server. At $12.50/TB it was a fantastically affordable way to get massive amounts of storage. At $27.50/TB, absolutely not.

## I dug through my receipts

In November 2018 I bought five 10TB EasyStores for $179.99 each. At the time I wrote about doing the rounds of my local Best Buys to pickup more drives on Black Friday as quantities were limited at each location ([My 2018 server build log](https://blog.ktz.me/new-server-build-log/)).

<style>
#easystore-receipts { width: 100%; overflow-x: auto; }
#easystore-receipts table { display: table; width: 100%; min-width: 34rem; margin: 0; font-variant-numeric: tabular-nums; }
#easystore-receipts :is(th, td) { padding: 1.15rem clamp(.8rem, 2vw, 1.8rem); }
#easystore-receipts :is(th, td):not(:first-child) { text-align: right; }
</style>
<div id="easystore-receipts" role="region" aria-label="EasyStore receipts" tabindex="0">
<table>
<thead>
<tr><th scope="col">Order date</th><th scope="col">Drives</th><th scope="col">Each</th><th scope="col">$/TB</th></tr>
</thead>
<tbody>
<tr><td>Nov 8, 2018</td><td>5 × 10TB</td><td>$179.99</td><td>$18.00</td></tr>
<tr><td>Oct 13, 2020</td><td>2 × 12TB</td><td>$174.99</td><td>$14.58</td></tr>
<tr><td>Nov 1, 2021</td><td>2 × 14TB</td><td>$199.99</td><td>$14.29</td></tr>
<tr><td>May 11, 2022</td><td>1 × 14TB</td><td>$249.99</td><td>$17.86</td></tr>
<tr><td>Aug 29, 2022</td><td>1 × 14TB</td><td>$239.99</td><td>$17.14</td></tr>
<tr><td>Oct 28, 2023</td><td>3 × 18TB</td><td>$199.99</td><td><strong>$11.11</strong></td></tr>
<tr><td>Nov 21, 2024</td><td>1 × 20TB</td><td>$249.99</td><td>$12.50</td></tr>
<tr><td>May 5, 2025</td><td>1 × 20TB</td><td>$279.99</td><td>$14.00</td></tr>
</tbody>
</table>
</div>
<br />

October 2023 was my best haul on a per-TB basis. Three 18TB drives put 54TB in my hands for $599.97. This year’s “deal” is fifty bucks shy of that *entire order*. Best Buy was still advertising those 18TB drives for $199.99 in November 2023. [November 2023 deal archive](https://slickdeals.net/f/17069239-18tb-wd-easystore-usb-3-0-external-hard-drive-200-free-store-pickup)

<figure aria-labelledby="same-drive-price-caption">
<svg role="img" aria-labelledby="same-drive-price-title same-drive-price-desc" viewBox="0 0 560 184" style="display:block;width:100%;height:auto">
<title id="same-drive-price-title">Same 20TB drive, three prices</title>
<desc id="same-drive-price-desc">November 2024 purchase, $249.99. May 2025 purchase, $279.99. November 2026 listing, $549.99.</desc>
<g font-family="system-ui, sans-serif" fill="currentColor" font-size="13">
<text x="12" y="23" font-size="18" font-weight="700">Same 20TB drive, three prices</text>
<path d="M157 40 V151" stroke="currentColor" opacity=".18"/>
<text x="157" y="171" text-anchor="middle">$0</text>
<path d="M241 40 V151" stroke="currentColor" opacity=".18"/>
<text x="241" y="171" text-anchor="middle">$150</text>
<path d="M325 40 V151" stroke="currentColor" opacity=".18"/>
<text x="325" y="171" text-anchor="middle">$300</text>
<path d="M409 40 V151" stroke="currentColor" opacity=".18"/>
<text x="409" y="171" text-anchor="middle">$450</text>
<path d="M493 40 V151" stroke="currentColor" opacity=".18"/>
<text x="493" y="171" text-anchor="middle">$600</text>
<text x="12" y="62">Nov 2024 purchase</text>
<path d="M157 58 H493" stroke="currentColor" opacity=".18"/>
<circle cx="297.0" cy="58" r="6" fill="currentColor"/>
<text x="307.0" y="62" font-weight="650">$249.99</text>
<text x="12" y="102">May 2025 purchase</text>
<path d="M157 98 H493" stroke="currentColor" opacity=".18"/>
<circle cx="313.8" cy="98" r="6" fill="currentColor"/>
<text x="323.8" y="102" font-weight="650">$279.99</text>
<text x="12" y="142">Nov 2026 listing</text>
<path d="M157 138 H493" stroke="currentColor" opacity=".18"/>
<circle cx="465.0" cy="138" r="6" fill="#c2410c"/>
<text x="475.0" y="142" font-weight="650">$549.99</text>
</g>
</svg>
<figcaption id="same-drive-price-caption">WD EasyStore 20TB, SKU 6500985. Prices are before tax.</figcaption>
</figure>

## What about ServerPartDeals?

Buying refurbished or recertified enterprise drives used to be an easy way to bring the cost down. In August 2024 I bought four recertified 14TB Ultrastars from ServerPartDeals for **$529.96 before tax**. That was 56TB at **$9.46/TB**, even cheaper than the EasyStores and no shucking to do.

<figure aria-labelledby="spd-price-caption">
<svg role="img" aria-labelledby="spd-price-title spd-price-desc" viewBox="0 0 480 359" style="display:block;width:100%;height:auto">
<title id="spd-price-title">ServerPartDeals price per TB</title>
<desc id="spd-price-desc">Ultrastar 14TB 4Kn, 2024: $9.29 per TB, 2026: $14.64 per TB, sold out. Ultrastar 14TB 512e, 2024: $9.64 per TB, 2026: $30.64 per TB, sold out. Exos X20 20TB, 2024: $11.80 per TB, 2026: $29.45 per TB, in stock. Exos X22 20TB, 2024: $11.25 per TB, 2026: $32.45 per TB, sold out.</desc>
<defs><pattern id="spd-sold-out" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M0 0 V6" stroke="currentColor" stroke-width="3"/></pattern></defs>
<g font-family="system-ui, sans-serif" fill="currentColor" font-size="13">
<text x="12" y="22" font-size="18" font-weight="700">ServerPartDeals price per TB</text>
<text x="12" y="43">2024 order (top) · Nov 2026 listing (bottom)</text>
<path d="M12 57 V325" stroke="currentColor" opacity=".15"/>
<text x="12" y="345" text-anchor="middle">$0</text>
<path d="M58.5 57 V325" stroke="currentColor" opacity=".15"/>
<text x="58.5" y="345" text-anchor="middle">$5</text>
<path d="M105 57 V325" stroke="currentColor" opacity=".15"/>
<text x="105" y="345" text-anchor="middle">$10</text>
<path d="M151.5 57 V325" stroke="currentColor" opacity=".15"/>
<text x="151.5" y="345" text-anchor="middle">$15</text>
<path d="M198 57 V325" stroke="currentColor" opacity=".15"/>
<text x="198" y="345" text-anchor="middle">$20</text>
<path d="M244.5 57 V325" stroke="currentColor" opacity=".15"/>
<text x="244.5" y="345" text-anchor="middle">$25</text>
<path d="M291 57 V325" stroke="currentColor" opacity=".15"/>
<text x="291" y="345" text-anchor="middle">$30</text>
<path d="M337.5 57 V325" stroke="currentColor" opacity=".15"/>
<text x="337.5" y="345" text-anchor="middle">$35</text>
<text x="12" y="72" font-weight="700">Ultrastar 14TB 4Kn</text>
<rect x="12" y="79" width="86.4" height="11" rx="2" fill="currentColor" opacity=".48"/>
<text x="105.4" y="89">$9.29</text>
<rect x="12" y="97" width="136.2" height="11" rx="2" fill="url(#spd-sold-out)" opacity="1"/>
<text x="155.2" y="107">$14.64 · Sold out</text>
<text x="12" y="137" font-weight="700">Ultrastar 14TB 512e</text>
<rect x="12" y="144" width="89.7" height="11" rx="2" fill="currentColor" opacity=".48"/>
<text x="108.7" y="154">$9.64</text>
<rect x="12" y="162" width="285.0" height="11" rx="2" fill="url(#spd-sold-out)" opacity="1"/>
<text x="304.0" y="172">$30.64 · Sold out</text>
<text x="12" y="202" font-weight="700">Exos X20 20TB</text>
<rect x="12" y="209" width="109.7" height="11" rx="2" fill="currentColor" opacity=".48"/>
<text x="128.7" y="219">$11.80</text>
<rect x="12" y="227" width="273.9" height="11" rx="2" fill="#c2410c" opacity="1"/>
<text x="292.9" y="237">$29.45 · In stock</text>
<text x="12" y="267" font-weight="700">Exos X22 20TB</text>
<rect x="12" y="274" width="104.6" height="11" rx="2" fill="currentColor" opacity=".48"/>
<text x="123.6" y="284">$11.25 · refunded</text>
<rect x="12" y="292" width="301.8" height="11" rx="2" fill="url(#spd-sold-out)" opacity="1"/>
<text x="320.8" y="302">$32.45 · Sold out</text>
</g>
</svg>
<figcaption id="spd-price-caption">US dollars per TB. Hatched bars mark equivalent sold-out listings as of Nov 2026.</figcaption>
</figure>

| Drive | 2024 price per drive | Nov 26, 2026 listing | Change per TB |
| --- | ---: | ---: | ---: |
| WD Ultrastar HC530 14TB 4Kn, recertified (`WUH721414ALN604`) | $129.99 · $9.29/TB | $204.99 · $14.64/TB · [Sold out](https://serverpartdeals.com/products/western-digital-ultrastar-dc-hc530-wuh721414aln604-0f31102-14tb-7-2k-rpm-sata-6gb-s-4kn-3-5-recertified-hard-drive) | +58% |
| WD Ultrastar HC530 14TB 512e, recertified (`WUH721414ALE6L4`) | $134.99 · $9.64/TB | $429.00 · $30.64/TB · [Sold out](https://serverpartdeals.com/collections/western-digital-recertified-all-caps/products/western-digital-ultrastar-dc-hc530-wuh721414ale6l4-0f31284-14tb-7-2k-rpm-sata-6gb-s-512e-512mb-3-5-se-manufacturer-recertified-hdd) | +218% |
| Seagate Exos X20 20TB, refurbished (`ST20000NM007D`) | $235.94 · $11.80/TB | $589.00 · $29.45/TB · [In stock](https://serverpartdeals.com/collections/sata/products/seagate-exos-x20-st20000nm007d-20tb-7-2k-rpm-sata-6gb-s-3-5-refurbished-hdd) | +150% |
| Seagate Exos X22 20TB, recertified (`ST20000NM004E`) | $224.99 · $11.25/TB · later refunded | $649.00 · $32.45/TB · [Sold out](https://serverpartdeals.com/collections/20tb-to-30tb-hard-drives) | +188% |

The sad truth is that across the board prices are up a minimum of 58%, and sometimes as much as 218% in just a year or two.

## How we got down to three HDD makers

When the EasyStore deal looks that bad, my first instinct is to shop around. Try another retailer, buy an enterprise drive, see what’s available recertified. But follow those listings back to the companies that actually make the drives and the choices narrow pretty quickly. There are three big HDD makers left. How did we end up with so few?

Maxtor bought Quantum’s hard drive business in 2001, then Seagate bought Maxtor in 2006. Hitachi combined IBM’s disk business with its own to form HGST in 2003, and Toshiba bought Fujitsu’s HDD business in 2009. Seagate bought Samsung’s HDD business in December 2011, and Western Digital bought HGST in March 2012. The FTC required WD to sell desktop-drive manufacturing assets to Toshiba to keep a third supplier in that market. That left Seagate, Western Digital and Toshiba.

<figure aria-labelledby="hdd-consolidation-caption">
<svg role="img" aria-labelledby="hdd-consolidation-title hdd-consolidation-desc" viewBox="0 0 620 370" style="display:block;width:100%;height:auto">
<title id="hdd-consolidation-title">How the HDD market narrowed to three</title>
<desc id="hdd-consolidation-desc">Quantum’s HDD business went to Maxtor in 2001, then Maxtor went to Seagate in 2006. Seagate bought Samsung’s HDD business in 2011. IBM’s HDD business became part of Hitachi GST in 2003, which Western Digital bought in 2012. Toshiba bought Fujitsu’s HDD business in 2009 and received desktop HDD assets from the WD and HGST deal in 2012.</desc>
<g font-family="system-ui, sans-serif" font-size="14">
<text x="12" y="25" fill="currentColor" font-size="22" font-weight="750">How the HDD market narrowed to three</text>
<g color="#11664b" fill="currentColor">
<rect x="10" y="54" width="600" height="94" rx="12" fill="#e3f4eb"/>
<rect x="24" y="70" width="124" height="26" rx="6" fill="#fff"/>
<text x="34" y="87.5" font-weight="600">Quantum HDD</text>
<path d="M148 83 H218 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="164" y="72" width="42" height="22" rx="7" fill="#fff"/>
<text x="185" y="87" text-anchor="middle" font-size="12" font-weight="650">2001</text>
<rect x="222" y="70" width="100" height="26" rx="6" fill="#fff"/>
<text x="232" y="87.5" font-weight="600">Maxtor</text>
<path d="M322 83 H447 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="365.5" y="72" width="42" height="22" rx="7" fill="#fff"/>
<text x="386.5" y="87" text-anchor="middle" font-size="12" font-weight="650">2006</text>
<rect x="24" y="107" width="124" height="26" rx="6" fill="#fff"/>
<text x="34" y="124.5" font-weight="600">Samsung HDD</text>

<path d="M148 120 H447 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="278.5" y="109" width="42" height="22" rx="7" fill="#fff"/>
<text x="299.5" y="124" text-anchor="middle" font-size="12" font-weight="650">2011</text>
<rect x="451" y="64" width="147" height="74" rx="8"/>
<svg x="469" y="74" width="111" height="27" viewBox="0 0 24 24" fill="#fff" color="#fff" aria-hidden="true"><path fill="currentColor" d="m11.228 22.684l-.776-2.955c.273-.132.498-.236.796-.384c1.239-.528 2.436-1.132 3.55-1.892c1.395-.952 2.698-2.015 3.833-3.268c.89-.983 1.632-2.068 2.056-3.342c.282-.848.42-1.715.296-2.609a4.75 4.75 0 0 0-.796-2.037a5.14 5.14 0 0 0-1.974-1.72c-1.007-.51-2.08-.697-3.198-.664c-.99.03-1.945.248-2.874.587c-1.71.625-3.278 1.518-4.783 2.528c-.44.295-.842.636-1.192 1.038c-.19.218-.336.46-.398.749c-.104.487.175.858.672.881c.348.017.658-.118.962-.262c.946-.446 1.8-1.049 2.683-1.6c.725-.452 1.458-.894 2.255-1.211c.786-.313 1.597-.485 2.447-.343c.925.155 1.67.592 2.122 1.442c.317.595.342 1.227.176 1.87c-.19.734-.615 1.33-1.117 1.877a10.2 10.2 0 0 1-2.372 1.899c-.924.542-1.84 1.1-2.788 1.598c-1.109.583-2.29.996-3.493 1.345c-1.01.293-2.038.426-3.086.333c-.88-.078-1.707-.334-2.437-.842a3.93 3.93 0 0 1-1.44-1.82c-.455-1.16-.431-2.343-.143-3.534C.534 9 1.217 7.838 2.059 6.757c.64-.821 1.376-1.547 2.17-2.215a24 24 0 0 1 3.596-2.524c.433-.246.873-.478 1.285-.702l.421.866c-.38.205-.757.401-1.127.608a20 20 0 0 0-4.36 3.241a9.2 9.2 0 0 0-1.757 2.367c-.474.928-.729 1.91-.617 2.958c.123 1.147.661 2.029 1.718 2.558c.63.316 1.303.41 1.997.395c.956-.02 1.858-.292 2.748-.611c1.328-.475 2.563-1.137 3.765-1.864c.706-.426 1.41-.86 2.007-1.436c.315-.305.63-.615.791-1.038c.286-.754-.12-1.406-.928-1.483c-.44-.041-.838.105-1.226.284c-1.026.475-1.949 1.125-2.905 1.72c-.73.453-1.469.894-2.273 1.208c-.557.218-1.132.354-1.736.284c-1.037-.118-1.685-.937-1.572-1.975c.088-.816.485-1.481 1.022-2.075c.593-.657 1.285-1.195 2.028-1.67c1.141-.729 2.3-1.428 3.539-1.983c1.436-.644 2.91-1.154 4.49-1.293c1.144-.101 2.275-.037 3.391.253a7.8 7.8 0 0 1 2.715 1.28A7 7 0 0 1 23.2 6.138c.446.796.7 1.65.775 2.559a7.5 7.5 0 0 1-.31 2.808a10.5 10.5 0 0 1-1.127 2.537a15.3 15.3 0 0 1-2.449 3.008c-.964.914-1.937 1.815-3.034 2.572c-1.427.984-2.913 1.86-4.52 2.519c-.43.176-.857.356-1.307.543"/></svg>
<text x="524.5" y="122" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">Seagate</text>
</g>
<g color="#214c93" fill="currentColor">
<rect x="10" y="159" width="600" height="94" rx="12" fill="#e8f0ff"/>
<rect x="24" y="194" width="124" height="26" rx="6" fill="#fff"/>
<text x="34" y="211.5" font-weight="600">IBM HDD</text>
<path d="M148 207 H218 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="164" y="196" width="42" height="22" rx="7" fill="#fff"/>
<text x="185" y="211" text-anchor="middle" font-size="12" font-weight="650">2003</text>
<rect x="222" y="194" width="100" height="26" rx="6" fill="#fff"/>
<text x="232" y="211.5" font-weight="600">Hitachi GST</text>
<path d="M322 207 H447 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="365.5" y="196" width="42" height="22" rx="7" fill="#fff"/>
<text x="386.5" y="211" text-anchor="middle" font-size="12" font-weight="650">2012</text>
<rect x="451" y="169" width="147" height="74" rx="8"/>
<svg x="469" y="179" width="111" height="27" viewBox="0 0 24 24" fill="#fff" color="#fff" aria-hidden="true"><path fill="currentColor" d="M1.492 4.62C.177 4.623-.492 6.203.422 7.149l3.47 3.468q3.61 3.571 7.202 7.16l1.07 1.115c.94.953 2.562.266 2.532-1.072v-3.425a1.52 1.52 0 0 0-1.502-1.5H9.038a2.6 2.6 0 0 1-2.615-2.615V6.12a1.52 1.52 0 0 0-1.502-1.5Zm9.26 0c-1.315.002-1.985 1.582-1.072 2.529q5.897 5.892 11.789 11.788c.94.952 2.559.267 2.53-1.07v-3.43a1.52 1.52 0 0 0-1.501-1.5c-1.4.014-2.8-.018-4.201-.042a2.6 2.6 0 0 1-2.613-2.615V6.12a1.52 1.52 0 0 0-1.502-1.5Zm8.273 0c-1.351-.007-2.012 1.645-1.029 2.572l3.431 3.43c.948.913 2.528.243 2.53-1.073V6.12a1.52 1.52 0 0 0-1.5-1.5z"/></svg>
<text x="524.5" y="227" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">Western Digital</text>
</g>
<g color="#a52c38" fill="currentColor">
<rect x="10" y="264" width="600" height="94" rx="12" fill="#fbecef"/>
<rect x="24" y="280" width="124" height="26" rx="6" fill="#fff"/>
<text x="34" y="297.5" font-weight="600">Fujitsu HDD</text>

<path d="M148 293 H447 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
<rect x="278.5" y="282" width="42" height="22" rx="7" fill="#fff"/>
<text x="299.5" y="297" text-anchor="middle" font-size="12" font-weight="650">2009</text>
<rect x="24" y="317" width="179" height="26" rx="6" fill="#fff"/>
<text x="34" y="334.5" font-weight="600">WD–HGST desktop assets</text>

<path d="M203 330 H447 m-5 -4 l5 4 -5 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 2"/>
<rect x="306" y="319" width="42" height="22" rx="7" fill="#fff"/>
<text x="327" y="334" text-anchor="middle" font-size="12" font-weight="650">2012</text>
<rect x="451" y="274" width="147" height="74" rx="8"/>
<svg x="469" y="284" width="111" height="27" viewBox="0 0 24 24" fill="#fff" color="#fff" aria-hidden="true"><path fill="currentColor" d="M5.174 10.172c-1.065 0-1.578.187-1.65 1.148a9 9 0 0 0-.022.68c0 .218.004.451.021.68c.073.96.586 1.148 1.65 1.148s1.58-.188 1.653-1.148c.018-.229.022-.462.022-.68c0-.217-.005-.451-.022-.68c-.073-.96-.588-1.148-1.652-1.148m3.79 0c-.41 0-.82.04-.985.121c-.322.156-.545.38-.545 1.02c0 .375.1.654.293.796c.281.21.553.23 1.31.27c.305.016.47.078.47.34c0 .332-.294.332-.564.332c-.28 0-.366-.025-.46-.096c-.084-.063-.105-.176-.106-.348h-.95c0 .487.01.884.47 1.084c.41.18 1.67.18 2.048.014c.328-.145.563-.337.563-.994c0-.455-.091-.735-.44-.941c-.248-.147-.945-.17-1.298-.192c-.258-.016-.356-.11-.356-.338c0-.297.285-.308.53-.308c.202 0 .34.018.439.105c.038.039.086.099.088.307h.947c0-.408-.014-.848-.455-1.051c-.175-.08-.587-.121-.998-.121zm2.206.062v3.532h.996v-1.362h1.156v1.362h.996v-3.532h-.996v1.29h-1.156v-1.29zm4.023 0v3.532h1.002v-3.532zm1.891 0v3.532h1.887c.869 0 1.162-.376 1.162-.952c0-.401-.092-.755-.643-.894c.444-.114.574-.379.574-.762c0-.776-.487-.924-1.181-.924zm4.373 0l-1.068 3.532h1.037l.187-.655h1.16l.19.655H24l-1.07-3.532zM0 10.236v.881h1.055v2.65H2.11v-2.65h1.055v-.88zm5.174.762c.418 0 .633.063.66.607c.004.085.01.201.01.395c0 .195-.006.31-.01.395c-.027.544-.242.607-.66.607s-.633-.063-.66-.607A8 8 0 0 1 4.506 12c0-.194.003-.31.008-.395c.027-.544.242-.607.66-.607m12.906.045h.69c.18 0 .293.085.293.291c0 .176-.112.285-.293.285h-.69zm4.111.064h.006l.354 1.22h-.713zm-4.11 1.207h.689c.279 0 .337.124.337.323s-.11.32-.337.32h-.69z"/></svg>
<text x="524.5" y="332" text-anchor="middle" fill="#fff" font-size="15" font-weight="700">Toshiba</text>
</g>
</g>
</svg>
<figcaption id="hdd-consolidation-caption">Selected HDD acquisitions by closing year. The dashed arrow shows the desktop-drive assets transferred to Toshiba as a condition of the WD–HGST deal.</figcaption>
</figure>

The 2011 Thailand floods hit while those last two deals were underway. WD halted production at all its Thai plants, and its average hard drive selling price went from $45 in fiscal 2011 to $62 in fiscal 2012. There was also a price-fixing case further up the supply chain. NHK Spring pleaded guilty in 2019 to fixing prices for the suspension assemblies that hold the read/write heads, and the court approved a $28.5 million fine. [WD’s 2012 annual report](https://www.sec.gov/Archives/edgar/data/106040/000119312512361018/d356205d10k.htm) · [Ninth Circuit opinion](https://cdn.ca9.uscourts.gov/datastore/opinions/2026/01/08/24-4470.pdf)

## Market collusion and cartel pricing

It's hard to have anything positive to say in this post. The HDD manufacturing market is so consolidated nowadays - just like the memory market which is equally screwed - that it's hard to see this as anything but mass market collusion by the HDD manufacturing cartel.

Three companies is an awfully short list when you need to buy a hard drive. And with 89% of WD’s revenue coming from its cloud business in fiscal 2026, I don’t reckon those of us buying a couple of drives for a home server have much impact here. Just like with Nvidia and Micron, consumer markets just aren't valuable enough so we have to make do with the crumbs instead.

As of November 26, 2026, the 20TB is **2.2×** what I paid for the exact same SKU in 2024. It’s also $270 more than I paid for it in May 2025. And if you’re thinking you’ll just buy a smaller one, Best Buy’s 8TB Black Friday special is $299.99. That’s $37.50/TB and fifty bucks more than my 20TB cost two years ago. [Best Buy’s EasyStore listings](https://www.bestbuy.com/site/searchpage.jsp?id=pcat17071&st=easystore)

The jump gets sillier when you price a whole NAS. Four of those 20TB drives would have been $999.96 at my 2024 price. This week they’d be $2,199.96. That’s another $1,200 before you’ve bought a case, a board or a single stick of RAM. And the price per *usable* terabyte only gets worse once you set aside a drive for parity.

If I can wish for one thing in 2027, it would be for hardware pricing to return to reasonable levels. I fear it may take a lot longer than that, though. So making do with less is going to be the new normal for a while. And in that creative constraint, maybe we'll have some fun along the way instead.
