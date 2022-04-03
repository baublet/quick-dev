# StrapFile

For bootstrapping environments and instances.

```yml
name: StrapYard
description: Develop StrapYard.... with StrapYard!

# Base-level environment from which instances are spawned
environment:
  # How often to rebuild the base environment
  build:
    schedule: weekly # Or: monthly, daily, weekdays

  steps:
    - name: Install NVM
      command: curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash

    - name: Install Node
      command: nvm install

    - name: Install Yarn
      command: npm i --global yarn

    - name: Install Dependencies
      command: yarn

    - name: Install Docker dependencies
      command: docker-compose build

# Steps for starting and provisioning a workable instance. These steps run before
# every instance is available to be developed.
instance:
  steps:
    - name: Start Docker services
      command: docker-compose up -d
```
