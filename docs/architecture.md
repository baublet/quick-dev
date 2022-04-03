# Architecture

## Entities

- Environment
- EnvironmentSetupCommand

- Instance
- InstanceStartCommand

Environments are DigitalOcean "snapshots" of a container. You can have them rebuild at certain intervals. You spawn instances from environments. Actual work is done on an instance.

EnvironmentSetupCommands are commands run to prepare a container to be spawned into an instance. It's stuff like the initial `sudo apt-get upgrade`, installing Docker, running `npm install`, or whatever you need to prepare environments to be spun up.

InstanceStartCommands are run between a developer clicks "start development" and actually begins development. This is stuff like downloading the latest configuration files, updating node packages, or starting Docker containers for the environment.