---
title: Secret Management with docker-compose and Ansible Vault
slug: secret-management-with-docker-compose-and-ansible
description: Secret management with docker-compose doesn't have to be an enigma.
customExcerpt: Secret management with docker-compose doesn't have to be an enigma.
publishedAt: 2020-07-18T16:27:57.000-04:00
updatedAt: 2026-05-07T07:21:43.000-04:00
featureImage: https://images.unsplash.com/photo-1572435555646-7ad9a149ad91?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=2000&fit=max&ixid=eyJhcHBfaWQiOjExNzczfQ
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
ghostId: 6775c6279e78ea00017cbc0c
tags:
  - ansible
  - automation
  - technical
internalTags:
  - hash-import-2025-01-01-22-48
primaryTag: ansible
featured: false
readingTime: 9
---

Many of you will know that I am a huge proponent of Ansible and Infrastructure as Code in general. Using automation and version control to manage the configuration of your systems not only saves you time in the long run but it also makes you more employable. The latest Red Hat certifications, for example, are *all-in* on Ansible.

> Every file I reference in this blog post will be available in [this Git repo](https://github.com/ironicbadger/compose-secret-mgt?ref=blog.ktz.me).

This article is an outline of how I use Ansible and Ansible Vault in conjunction with docker-compose to keep my secrets safe and encrypted whilst still being able to push my repos to Github publicly.

<figure class="kg-card kg-embed-card"><iframe width="200" height="113" src="https://www.youtube.com/embed/CUh8FDLbj8M?feature=oembed" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen="" title="Secret Management with Ansible Vault and docker-compose" loading="lazy"></iframe></figure>

<h1 id="why">Why?</h1>

Why bother using Ansible to manage a file that you can very easily edit yourself by hand? It seems like a lot of overhead. In some ways, you are right.

If all you're doing is deploying one or two services using a docker-compose file or a docker run command then at first, it is easier to hand crank these files. That is, until you try and remember the parameters used to configure the container 6 months from now or a disaster strikes.

A disaster could mean you accidentally deleted the VM, made a breaking change to a config file without realising it, or simply did something you shouldn't have. There are many ways you could lose the configuration used to create your containers and by committing these files to git (Github, Gitlab, a self-hosted Gitea instance, etc) you instantly create a versionable backup. You can go back through history and see what changed, when, where and if your commit messages are ok maybe even figure out why, retrospectively.

This comes with a cost though. You must make *every single change* using this method from here on out. If you make a manual change to your compose yaml file and then run Ansible again next week, those manual changes will be overwritten. You have to commit.

Another issue we need to overcome is that your configuration is now out in the open (if you push to a public Github), including secrets. Secrets can include (but are not limited to) domain names, file paths, API keys, passwords, email addresses and so on. Essentially, they're anything you'd rather someone else didn't know.

We need a way to encrypt those secrets but also access them when generating our docker-compose yaml file. Ansible Vault makes this simple. I'll be the first to admit this isn't a totally straightforward process at first but over time, it will become second nature. Promise!

<h1 id="ansible-vault-101">Ansible Vault 101</h1>

We'll come onto integrating Ansible Vault with Ansible in a moment. It's also easy to confuse [Ansible Vault](https://docs.ansible.com/ansible/latest/user_guide/vault.html?ref=blog.ktz.me) with [Hashicorp Vault](https://www.vaultproject.io/?ref=blog.ktz.me), they are two different secret handling projects that have nothing whatsoever to do with one another.

To create a new, empty encrypted file run:

```
ansible-vault create foo.yaml
```

You'll be asked for a password before being launched into your `$EDITOR` (the default is vi). Save and close this file and you'll have an AES encrypted file on disk.

To edit this file execute:

```
ansible-vault edit foo.yaml
```

Again, you'll be asked for your password and be launched into your `$EDITOR`. Make your changes, then save and quit.

<h2 id="protecting-you-from-yourself">Protecting you from yourself</h2>

  
However, here's a second way to edit vault files. This method is is my personal preference using:

```
ansible-vault decrypt foo.yaml
```

This decrypts your file and leaves it decrypted until you encrypt it again with:

```
ansible-vault encrypt foo.yaml
```

The upside of this approach is that `foo.yaml` is just another clear-text file making edits via vscode or another editor besides `$EDITOR` trivial. I find this preferable in long editing sessions.

The downside is it's all too easy to accidentally commit an unencrypted file to git. I had to delete a git repo once when I leaked my gmail password on Github, it was picked up by bots in under 20 minutes! Once a file is pushed to a public repository, the values in this file are there forever or until you delete the repository due to the way git's db tracks files for versioning (or until you do some clever editing to the git db, but ain't no-one got time for that).

Nick Busey from [HomelabOS](https://homelabos.com/?ref=blog.ktz.me) wrote me a neat little pre-commit hook that will not allow an unencrypted vars file to be committed.

```bash
if ( cat vars/vault.yaml | grep -q "\$ANSIBLE_VAULT;" ); then
echo "[38;5;108mVault Encrypted. Safe to commit.[0m"
else
echo "[38;5;208mVault not encrypted! Run 'make encrypt' and try again.[0m"
exit 1
fi
```

This pre-supposes your secrets live in `vars/vault.yaml`. In the git repo accompanying this post look for `git-init.sh`, this installs the hook to `.git/hooks/pre-commit`.

More on Ansible Vault shortly.

<h1 id="a-quick-ansible-primer">A quick Ansible primer</h1>

  
With a bit of effort you'll be able to pick up the key principles of Ansible in a day or two. [Jeff Geerling](https://twitter.com/geerlingguy?ref=blog.ktz.me) just released a really excellent set of [Ansible 101](https://www.youtube.com/watch?v=goclfp6a2IQ&ref=blog.ktz.me) videos on Youtube. If you're confused about anything relating to Ansible, his videos are a good place to start.

To make things easy, I assume you have two hosts. The first is the target host which will be running docker and where your completed, clear-text docker-compose yaml file will ultimately live -- let's call this `server`. The second is where you do your development work, probably a desktop or laptop -- let's call this `client`.

<figure class="kg-card kg-image-card kg-width-wide"><img src="/content/images/2020/07/Screen-Shot-2020-07-18-at-4.01.51-PM.png" class="kg-image" alt="" loading="lazy" width="1784" height="748" srcset="/content/images/size/w600/2020/07/Screen-Shot-2020-07-18-at-4.01.51-PM.png 600w, /content/images/size/w1000/2020/07/Screen-Shot-2020-07-18-at-4.01.51-PM.png 1000w, /content/images/size/w1600/2020/07/Screen-Shot-2020-07-18-at-4.01.51-PM.png 1600w, /content/images/2020/07/Screen-Shot-2020-07-18-at-4.01.51-PM.png 1784w" sizes="(min-width: 1200px) 1200px" decoding="async"></figure>

Ensure that Ansible is installed on the `client` and that Python is installed on the `server`. Installation varies per OS so please refer to the Ansible [documentation](https://docs.ansible.com/ansible/latest/installation_guide/intro_installation.html?ref=blog.ktz.me) for steps on your system.

Ansible works over SSH. In order for the best experience it is suggested that you have SSH keys copied to the `server` so that you can connect without a password. From your `client` run `ssh-copy-id user@server`.

> In my testing for this article `192.168.1.50` was an Ubuntu 20.04 VM. There is nothing unique here to Ubuntu, so these concepts will apply to almost any Linux host.

Ensure that `ssh server` works without specifying a password. If you'd like extra points make use of `~/.ssh/config` with the following entry:

```bash
# ~/.ssh/config

Host server
  Hostname 192.168.1.50
  User alex
```

<h1 id="getting-started">Getting Started</h1>

  
We're going to create an inventory file so that Ansible knows which hosts we want to manage. Remember all files can be found in [this git repo](https://github.com/ironicbadger/compose-secret-mgt?ref=blog.ktz.me).

```
[server]
192.168.1.50
```

This inventory file assigns the host `192.168.1.50` to the group `[server]`. Ansible can do a whole lot with 'host groups' but that's largely beyond the scope of this article, check out the Ansible docs if you're interested in learning more.

We can test that Ansible is working with an ad-hoc command like this.

```shellsession
alex@mooncake compose-secret-mgt % ansible -m ping -i inventory server
192.168.1.50 | SUCCESS => {
    "ansible_facts": {
        "discovered_interpreter_python": "/usr/bin/python3"
    },
    "changed": false,
    "ping": "pong"
}
```

This show us that the server replied `pong` to our `ping` request made using the [ping module](https://docs.ansible.com/ansible/latest/modules/ping_module.html?ref=blog.ktz.me).

[Modules](https://docs.ansible.com/ansible/latest/modules/modules_by_category.html?ref=blog.ktz.me) are an important concept in Ansible and are written in Python. They are what actually do the work we define in our tasks, roles and playbooks.

Now that we've verified connectivity between our `client` and `server` we can move onto templating.

<h1 id="templating">Templating</h1>

We're going to template an example `ini` file, this has nothing to with your eventual compose templating. However, it shows that we can use these principals to manage our entire server configuration, including the apps that run on it.

Ansible uses the [Jinja2](https://palletsprojects.com/p/jinja/?ref=blog.ktz.me) templating language to perform substitutions in template files. We will be using the [template](https://docs.ansible.com/ansible/latest/modules/template_module.html?ref=blog.ktz.me) module for this. Here is a *non-functional* snippet of the config file for [Gitea](https://gitea.io/en-us/?ref=blog.ktz.me), a self-hosted Github alternative. The full file was much too long but you'll get the idea by the time we're done with this example.

```ini
APP_NAME = {{ subdomain_git }}.{{ domain_full }}
RUN_MODE = prod
RUN_USER = git

[repository]
ROOT = {{ data_root_path }}/git/repositories

[server]
APP_DATA_PATH    = {{ data_root_path }}/gitea
SSH_DOMAIN       = {{ subdomain_git }}.{{ domain_full }}
HTTP_PORT        = {{ listen_port_gitea }}
ROOT_URL         = https://{{ subdomain_git }}.{{ domain_full }}/
DOMAIN           = {{ subdomain_git }}.{{ domain_full }}
```

You can see above, several variables surrounded by `{{ }}`. Jinja2 uses these double braces to know where to perform substitutions. The values of these substitutions come from Ansible variables.

Note that we can construct strings using concatenation with multiple variables like `{{ subdomain }}.{{ domain_full }}`. This allows us to easily change the subdomain used for git independently from the main domain and is especially useful when the same string is required multiple times in the same file.

We can also reuse `domain_full` elsewhere throughout our entire infrastructure and only define it in one place.

For example, suppose that in your compose file you want to reuse some of these values. Port numbers, paths, etc. To change the port the app is listening on manually would be half a dozen edits. Using Ansible, it's *just one*. It is automatically updated everywhere it appears all at once using templating.

> You can follow along in the git repo by running `ansible-playbook -i inventory example1.yaml`.

```yaml
# example1.yaml - barebones templating example
- hosts: server
  vars:
    - subdomain_git: git 
	  - domain_full: domain.com
	  - data_root_path: /data
	  - listen_port_gitea: 3000
  tasks:
    - name: template test
      template:
        src: example.ini.j2
        dest: example.ini
```

For example if we execute the playbook above and run the template through Jinja2, we create the following output.

```shellsession
alex@blogtest:~$ cat example.ini
APP_NAME = git.domain.com
RUN_MODE = prod
RUN_USER = git

[repository]
ROOT = /data/git/repositories

[server]
APP_DATA_PATH    = /data/gitea
SSH_DOMAIN       = git.domain.com
HTTP_PORT        = 3000
ROOT_URL         = https://git.domain.com/
DOMAIN           = git.domain.com
```

We told Ansible to run the templating module against the group of hosts defined under `server`. It then performed variable substitutions using the variables values defined in the playbook (variables are tightly scoped in Ansible) and templated them into our target file. Finally the module copied this file to the target `server` file path we provided.

<h1 id="encrypting-secrets">Encrypting secrets</h1>

Take a look at the file `vars/vault.yaml`. It looks like complete gibberish doesn't it? Execute `ansible-vault decrypt vars/vault.yaml` and use the password `example` to decrypt this file and look at the contents.

```yaml
---
# gitea secrets
secret_subdomain_git: git
secret_domain_full: domain.com
secret_listen_port_gitea: 3000
secret_ssh_port_gitea: 22
```

If you're thinking, "This looks a lot like a normal set of variables", that's because it does! The only difference is that they are stored in an encrypted fashion. We provide Ansible the decryption password at runtime.

> Note: although I've used the prefix `secret_` for each variable in `vault.yaml` you don't need to, there is no 'best practice' saying you should. As long as it's valid variable syntax for Ansible, it will work here. The prefix was added to make things more obvious for this article.

The final piece of the jigsaw is using these variables elsewhere in our code. `group_vars` refer to Ansible inventory groups. We defined one earlier in our inventory file called `[server]`. A host group can contain multiple hosts, but in this case only contains one with the IP `192.168.1.50`.

Therefore, every variable we configure in `group_vars/server.yaml` will apply **only** to *host(s) in this group*. The yaml file name must match the group name exactly.

Remember how I said Ansible tightly scopes variables? This is what I meant. We can use this concept to great effect here by putting each host we want to manage into it's own host group and providing a unique set of variables to it.

Really this feature is designed for larger deployment but it works very well for our needs here. For example, imagine a larger deployment where you wanted 3 identically configured web servers. You'd create a `webservers` group, a `group_vars/webservers.yaml` file and configure any webserver specific variables in there.

Therefore by abusing the concept of a group a little, we end up with one variable file per host (group). This allows us to specify our containers, file paths, etc on a host by host basis. `group_vars/server1.yaml` and `group_vars/server2.yaml` and so on.

Now, it's totally worth admitting here that `group_vars` are a bit weird if you just have one host per group. You should probably use `host_vars` as [documented here](https://docs.ansible.com/ansible/latest/user_guide/intro_inventory.html?ref=blog.ktz.me#splitting-out-vars) instead. Thanks to [u/breen](https://www.reddit.com/r/ansible/comments/hto1vz/secret_management_using_ansible_vault_and/fyibzxv/?ref=blog.ktz.me) on r/ansible for pointing this out.

If you're still a little confused at this point, that's OK. Take a look at my [infra](https://github.com/IronicBadger/infra/tree/master/group_vars?ref=blog.ktz.me) repo and the `group_vars` defined over there and hopefully it will click.

<h1 id="putting-it-all-together">Putting it all together</h1>

It's finally time to put it all together and create our docker-compose file from our Ansible code.

Take a look at `example2.yaml` and you'll see there's a lot more going on than before. Note the dictionary called `containers` in `group_vars/server.yaml` which defines 3 containers. Gitea, Tiddlywiki and Smokeping.

I've written an Ansible role to take care of most of the heavy lifting here. All you need to do is provide the variables and install the role from [Ansible Galaxy](https://galaxy.ansible.com/?ref=blog.ktz.me) (a kind of app store for Ansible roles). But for the purposes of this post I have provided an example in the form of the `example2.yaml` playbook.

Install the role from Ansible Galaxy by running:

```
ansible-galaxy -r requirements.yaml install
```

Then run the playbook with:

```
ansible-playbook example2.yaml
```

When we're done, you should see a fully functional `docker-compose.yaml` file in your users home folder on `server`, `appdata` directories for each app and in the `gitea` appdata folder the example ini file.

The Ansible playbook also installed some handy bash aliases:

-   `dcp` is short-hand for `docker-compose -f ~/docker-compose.yaml`
-   `dcp up -d` will start all containers in the background
-   `dcpull` will pull all containers but not start them

There are more defined in `group_vars/all.yaml`.

If you're feeling like that's a lot to remember, take a look at the Makefile in the git repo. I store these commands in there for a couple of reasons. First, `ansible-playbook` invocations can get quite long and unwieldy if you aren't careful. Second, it prevents typos by having a repeatable execution. It's just one less thing to go wrong.

<h1 id="wrap-up">Wrap-up</h1>

  
Like in life, the preparation takes much longer than the actual event. But we all know, proper preparation is key to a smooth finish.

Now you know how to define your containers in Ansible and have that configuration end up on your server.

Good luck and please feel free to ask any questions over on my Discord at [https://selfhosted.show/discord](https://selfhosted.show/discord?ref=blog.ktz.me). I'm there as @alexktz and on Twitter @IronicBadger.

Consider giving my podcast a listen over at [selfhosted.show](https://selfhosted.show/?ref=blog.ktz.me) if you found this interesting. Thanks!
