---
title: How to enable Intel Quicksync on NixOS with a Supermicro X13SAE-F and an Intel i5-13600k
slug: how-to-enable-intel-quicksync-on-nixos-with-a-supermicro-x13sae-f-and-an-intel-i5-13600k-2
description: |-
  Like most things, getting Quicksync working on NixOS with a motherboard that has IPMI and a 13th gen Intel chip is quite simple once you know how.

  The complexities come from ensuring users are in the right groups, and you have the correct arrangement of packages in the hardware.opengl configuration.

  nix-config/hosts/nixos/morphnix/default.nix at main · ironicbadger/nix-configContribute to ironicbadger/nix-config development by creating an account on GitHub.GitHubironicbadger

  I'll include a mi
customExcerpt: null
publishedAt: 2025-02-22T20:17:56.000-05:00
updatedAt: 2026-05-07T07:21:27.000-04:00
featureImage: /content/images/2025/02/Screenshot-2025-02-22-at-20.16.32.png
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
ghostId: 67ba73cf7732b900015a66d0
tags:
  - linux
  - nixos
  - technical
internalTags: []
primaryTag: linux
featured: false
readingTime: 3
---

Like most things, getting Quicksync working on NixOS with a motherboard that has IPMI and a 13th gen Intel chip is quite simple once you know how.

The complexities come from ensuring users are in the right groups, and you have the correct arrangement of packages in the `hardware.opengl` configuration.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://github.com/ironicbadger/nix-config/blob/main/hosts/nixos/morphnix/default.nix?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">nix-config/hosts/nixos/morphnix/default.nix at main · ironicbadger/nix-config</div><div class="kg-bookmark-description">Contribute to ironicbadger/nix-config development by creating an account on GitHub.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="/content/images/icon/pinned-octocat-093da3e6fa40-1.svg" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">GitHub</span><span class="kg-bookmark-publisher">ironicbadger</span></div></div><div class="kg-bookmark-thumbnail"><img src="/content/images/thumbnail/nix-config" alt="" onerror="this.style.display = 'none'" loading="lazy" decoding="async"></div></a></figure>

I'll include a minimal relevant NixOS configuration below, and you can cherry pick the bits you need to get it working. The full configuration is below as well.

```nix
# Firmware is essential for i915 driver
hardware.firmware = [ pkgs.linux-firmware ];

# Minimal OpenGL/QuickSync configuration
hardware.opengl = {
  enable = true;
  extraPackages = with pkgs; [
    intel-media-driver  # The core QuickSync driver
    intel-compute-runtime  # Required for hardware tonemapping
  ];
};

# Essential environment variable for iHD driver
environment.sessionVariables.LIBVA_DRIVER_NAME = "iHD";

# Essential user groups for hardware access
users.users.YOUR_USERNAME.extraGroups = [ "video" "render" ];
```

<h2 id="full-configurationnix-file">Full <code>configuration.nix</code> file</h2>

I've included the entire file here unedited just for posterity really. The living breathing version is in my `nix-config` repo.

<figure class="kg-card kg-bookmark-card"><a class="kg-bookmark-container" href="https://github.com/ironicbadger/nix-config/commit/a3c4fb442bdd9e09f84e5ecb7097a445bf7fdb90?ref=blog.ktz.me"><div class="kg-bookmark-content"><div class="kg-bookmark-title">quicksync configuration · ironicbadger/nix-config@a3c4fb4</div><div class="kg-bookmark-description">Contribute to ironicbadger/nix-config development by creating an account on GitHub.</div><div class="kg-bookmark-metadata"><img class="kg-bookmark-icon" src="/content/images/icon/pinned-octocat-093da3e6fa40.svg" alt="" loading="lazy" decoding="async"><span class="kg-bookmark-author">GitHub</span><span class="kg-bookmark-publisher">ironicbadger</span></div></div><div class="kg-bookmark-thumbnail"><img src="/content/images/thumbnail/a3c4fb442bdd9e09f84e5ecb7097a445bf7fdb90" alt="" onerror="this.style.display = 'none'" loading="lazy" decoding="async"></div></a></figure>

```nix
{ config, inputs, pkgs, name, ... }:
{
  imports = [
      ./hardware-configuration.nix
      (builtins.fetchTarball {
        url = "https://github.com/nix-community/nixos-vscode-server/tarball/master";
        sha256 = "09j4kvsxw1d5dvnhbsgih0icbrxqv90nzf0b589rb5z6gnzwjnqf";
      })
      ./../../common/nixos-common.nix
      ./../../common/common-packages.nix
    ];

  ## COLMENA
  deployment = {
    targetHost = name;
    targetUser = "root";
    buildOnTarget = true;
    allowLocalDeployment = true;
  };

  boot.loader.systemd-boot.enable = true;
  boot.loader.efi.canTouchEfiVariables = true;
  boot.kernelModules = [ "drivetemp" ];
  boot.kernel.sysctl."net.ipv4.ip_forward" = 1;
  boot.kernelParams = [
    "i915.fastboot=1"
    "i915.enable_guc=3"
  ];

  boot.supportedFilesystems = [ "zfs" ];
  boot.zfs.extraPools = [ "nvme-appdata" "ssd4tb" "bigrust18" ];
  services.zfs.autoScrub.enable = true;

  time.timeZone = "America/New_York";

  home-manager.useGlobalPkgs = true;
  home-manager.useUserPackages = true;
  home-manager.users.alex = { imports = [ ./../../../home/alex.nix ]; };
  users.users.alex = {
    isNormalUser = true;
    extraGroups = [ "wheel" "docker" "render" "video"];
    packages = with pkgs; [
      home-manager
    ];
  };
  users.defaultUserShell = pkgs.bash;
  programs.bash.interactiveShellInit = "echo \"\" \n figurine -f \"3d.flf\" morphnix";

  environment.systemPackages = with pkgs; [
    ansible
    bc
    devbox
    dig
    e2fsprogs # badblocks
    figurine
    git
    gptfdisk
    hddtemp
    htop
    intel-gpu-tools
    inxi
    iotop
    jq
    lm_sensors
    mc
    mergerfs
    molly-guard
    ncdu
    nmap
    nvme-cli
    powertop
    python3
    smartmontools
    snapraid
    tmux
    tree
    wget
    xfsprogs

    # zfs send/rec with sanoid/syncoid
    sanoid
    lzop
    mbuffer
    pv
    zstd
  ];

  ## quicksync
  hardware.firmware = [ pkgs.linux-firmware ];
  hardware.opengl = {
    enable = true;
    extraPackages = with pkgs; [
    # VA-API drivers
    intel-media-driver  # LIBVA_DRIVER_NAME=iHD
    intel-vaapi-driver
    libvdpau-va-gl

    # OpenCL and compute support
    intel-compute-runtime
    intel-gmmlib
    onevpl-intel-gpu

    # VA-API utilities and libraries
    libva
    libva-utils

    # Diagnostic tools
    glxinfo
    pciutils
    ];
  };
  environment.sessionVariables = {
    LIBVA_DRIVER_NAME = "iHD";
    LIBVA_DRIVERS_PATH = "/run/opengl-driver/lib/dri";
    LIBVA_MESSAGING_LEVEL = "1";
    GST_VAAPI_ALL_DRIVERS = "1";
  };

  networking = {
    firewall.enable = false;
    hostName = "morphnix";
    interfaces = {
      enp13s0 = {
        useDHCP = false;
        ipv4.addresses = [ {
          address = "10.42.1.10";
          prefixLength = 21;
        } ];
      };
    };
    defaultGateway = "10.42.0.254";
    nameservers = [ "10.42.0.253" ];
  localCommands = ''
    ip rule add to 10.42.0.0/21 priority 2500 lookup main || true
  '';
  };

  virtualisation = {
    docker = {
      enable = true;
      autoPrune = {
        enable = true;
        dates = "weekly";
      };
    };
  };

  services.fstrim.enable = true;
  services.fwupd.enable = true;
  services.openssh.enable = true;
  services.tailscale.enable = true;

  services.sanoid = {
    enable = true;
    interval = "hourly";
    # backupmedia
    templates.backupmedia = {
      daily = 3;
      monthly = 3;
      autoprune = true;
      autosnap = true;
    };
    datasets."bigrust18/media" = {
      useTemplate = [ "backupmedia" ];
      recursive = true;
    };
    extraArgs = [ "--debug" ];
  };

  services.syncoid = {
    enable = true;
    user = "root";
    interval = "hourly";
    commands = {
      "bigrust18/media" = {
        target = "root@deepthought:bigrust20/media";
        extraArgs = [ "--sshoption=StrictHostKeyChecking=off" ];
        recursive = true;
      };
    };
    commonArgs = [ "--debug"];
  };

  services.vscode-server.enable = true;

  services.samba-wsdd.enable = true; # make shares visible for windows 10 clients
  services.samba = {
    enable = true;
    securityType = "user";
    settings = {
      global = {
        "workgroup" = "WORKGROUP";
        "server string" = "morphnix";
        "netbios name" = "morphnix";
        "security" = "user";
        "guest ok" = "yes";
        "guest account" = "nobody";
        "map to guest" = "bad user";
        "load printers" = "no";
      };
    };
    shares = let
      mkShare = path: {
        path = path;
        browseable = "yes";
        "read only" = "no";
        "guest ok" = "yes";
        "create mask" = "0644";
        "directory mask" = "0755";
        "force user" = "alex";
        "force group" = "users";
      };
    in {
      jbod = mkShare "/mnt/jbod";
      bigrust18 = mkShare "/mnt/bigrust18";
      downloads = mkShare "/mnt/downloads";
    };
  };

  nix = {
    settings = {
        experimental-features = [ "nix-command" "flakes" ];
        warn-dirty = false;
    };
  };
}
```
