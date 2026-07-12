---
title: Home Assistant External Reverse Proxy Setup with nginx
slug: home-assistant-external-reverse-proxy-setup
description: |-
  I run nginx as my reverse proxy of choice from the folks over at linuxserver.io with automated Let's Encrypt functionality. It plugs neatly into the 20 or so containers I run on my primary server VM and the thought of migrating over the in-built Home Assistant plus reconfiguring all my configs made me go weak at the fingertips.

  My fully Ansiblised home infrastructure is open sourced at github.com/ironicbadger/infra including all my reverse proxy configs

  I was running into an issue for a while 
customExcerpt: null
publishedAt: 2020-03-10T21:10:29.000-04:00
updatedAt: 2026-05-07T07:22:38.000-04:00
featureImage: https://images.unsplash.com/photo-1544256718-3bcf237f3974?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc03
tags:
  - home-assistant
  - home-automation
  - nginx
  - reverse-proxy
  - technical
  - networking
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: home-assistant
featured: false
readingTime: 2
---

I run nginx as my reverse proxy of choice from the folks over at [linuxserver.io](https://hub.docker.com/r/linuxserver/letsencrypt?ref=blog.ktz.me) with automated Let's Encrypt functionality. It plugs neatly into the 20 or so containers I run on my primary server VM and the thought of migrating over the in-built Home Assistant plus reconfiguring all my configs made me go weak at the fingertips.

> My fully Ansiblised home infrastructure is open sourced at [github.com/ironicbadger/infra](https://github.com/IronicBadger/infra?ref=blog.ktz.me) including all my reverse proxy configs

I was running into an issue for a while tonight where I could get Home Assistant itself working just fine but any add-ons that used web sockets wouldn't load properly.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/03/image.png" class="kg-image" alt="" loading="lazy" decoding="async"></figure>

Node-RED (pictured above) would load but the connection would always fail after a few seconds (in fact it never loaded). The iFrame for VSCode just refused to do anything.

To diagnose the issue was with the reverse proxy and not Home Assistant or the add-ons in question was simple. Browse to the IP address version of the web interface such as `http://192.168.1.99:8123` and if everything works fine, it's the reverse proxy. This was the case for me.

Next I moved onto Google, then various Discord servers before getting a common theme that these add-ons required websockets connections. Eventually I found [this post](https://github.com/hassio-addons/addon-vscode/issues/49?ref=blog.ktz.me#issuecomment-552197469) in a Github issue which led me to fix needed.

The important section was to include `proxy_set_header` in *both* location blocks. So in both `/` and `/api/websocket`.

```
	proxy_set_header Upgrade $http_upgrade;
	proxy_set_header Connection "upgrade";
```

After I did this and restarted the proxy, everything worked as expected.

Here is the full `homeassistant.conf` used by nginx:

```nginx

server {
	listen 443 ssl;
	listen [::]:443 ssl;

	server_name ha.*;

	include /config/nginx/ssl.conf;

	client_max_body_size 0;

	# enable for ldap auth, fill in ldap details in ldap.conf
	#include /config/nginx/ldap.conf;

	location / {
		# enable the next two lines for http auth
		#auth_basic "Restricted";
		#auth_basic_user_file /config/nginx/.htpasswd;

		# enable the next two lines for ldap auth
		#auth_request /auth;
		#error_page 401 =200 /login;

		include /config/nginx/proxy.conf;
		resolver 127.0.0.11 valid=30s;
		set $upstream_homeassistant 192.168.1.99;
		proxy_pass http://$upstream_homeassistant:8123;

		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}

	location /api/websocket {
		resolver 127.0.0.11 valid=30s;
		set $upstream_homeassistant 192.168.1.99;
		proxy_pass http://$upstream_homeassistant:8123;
		proxy_set_header Host $host;

		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}
}
```
