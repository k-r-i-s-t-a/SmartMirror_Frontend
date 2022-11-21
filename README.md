# SmartMirror_Frontend
This project is the bare frontend fpr the KRISTA smart mirror which can be manually installed on a device which provides a browser.

![](/doc/images/mirror.jpg)

# Missing Features
- apt install package
- Docker Image
- CI (pre-build package)
- configuration app

# Installation
There are several ways to install and provide the mirror application. 

## Install through package manager
Currently only `apt` under `ubuntu xx.xx` is supported.

`$ apt update && apt install krista-mirror`, assuming you are a user with root privileges.  

This method also installs a backend which can be used with the KRISTA configuration application. 

## Use pre-build package
If you want to host the frontend on your own, you can use the pre-build package from GitHub or use the Docker image `@krista/smart-mirror`. 
```
If you host the frontend with the pre-build package, you also need to provide a proxy like apache or nginx. The Docker image already bundled this.
```

## Configuration
TODO: add description

# Security
The files `environment.prod.ts` and `environment.ts` are removed, because they hold API keys. This files will be generated dynamically during build time.
