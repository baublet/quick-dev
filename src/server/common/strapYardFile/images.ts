export const images = {
  "ubuntu-18-04-x64": "Ubuntu 18.04 (LTS) x64",
  "ubuntu-16-04-x32": "Ubuntu 16.04.6 (LTS) x32",
  "debian-10-x64": "Debian 10 x64",
  "debian-9-x64": "Debian 9 x64",
  "freebsd-11-x64-zfs": "FreeBSD 11.4 zfs x64",
  "freebsd-11-x64-ufs": "FreeBSD 11.4 ufs x64",
  "centos-7-x64": "CentOS 7.6 x64",
  "fedora-32-x64": "Fedora 32 x64",
  "ubuntu-20-04-x64": "Ubuntu 20.04 (LTS) x64",
  "ubuntu-16-04-x64": "Ubuntu 16.04 (LTS) x64",
  "ubuntu-20-10-x64": "Ubuntu 20.10 x64",
  "fedora-33-x64": "Fedora 33 x64",
  "centos-8-x64": "CentOS 8.3 x64",
  "freebsd-12-x64-ufs": "FreeBSD 12.2 ufs x64",
  "freebsd-12-x64-zfs": "FreeBSD 12.2 zfs x64",
  rancheros: "RancherOS 1.5.8 x64",
} as const;

export type Images = typeof images;
export type ImageSlug = keyof Images;
export type ImageName = { [K in keyof Images]: Images[K] }[keyof Images];
