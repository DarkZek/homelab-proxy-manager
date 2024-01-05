# Homelab-Proxy-Manager-Regulator

This is a binary that sits on the host machine and provides access to system services in a controlled and secure way that means even if the webserver is comprimised, your system won't be! This is used in the container setup process to allow for dropdowns to make the setup process very easy.

Currently it provides read-only data to the webserver about:
- Running docker containers and their networking information
- Running processes on the host system and their respective networking information

## Building

When compiled in release mode the binary accesses local commands and systems to compile the information for the webservice.

When compiled in debug mode a hardcoded set of data is used for testing.

## Communication

This service communicates using the filesystem to avoid networking or permission based attacks. It contains files for each command, and when written one of the command files is written to, the response overwrites the file contents.