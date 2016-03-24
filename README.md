[![apm](https://img.shields.io/apm/l/build-makensis-wine.svg?style=flat-square)](https://atom.io/packages/build-makensis-wine)
[![apm](https://img.shields.io/apm/v/build-makensis-wine.svg?style=flat-square)](https://atom.io/packages/build-makensis-wine)
[![apm](https://img.shields.io/apm/dm/build-makensis-wine.svg?style=flat-square)](https://atom.io/packages/build-makensis-wine)
[![Travis](https://img.shields.io/travis/idleberg/atom-build-makensis-wine.svg?style=flat-square)](https://travis-ci.org/idleberg/atom-build-makensis-wine)
[![David](https://img.shields.io/david/dev/idleberg/atom-build-makensis-wine.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-makensis-wine#info=dependencies)
[![Gitter](https://img.shields.io/badge/chat-Gitter-ff69b4.svg?style=flat-square)](https://gitter.im/NSIS-Dev/Atom)

# build-makensis-wine

[Atom Build](https://atombuild.github.io/) provider for makensis on Wine, compiles NSIS

## Installation

### apm

* Install package `apm install build-makensis-wine` (or use the GUI)

### GitHub

1. Change directory `cd ~/.atom/packages/`
2. Clone repository `git clone https://github.com/idleberg/atom-build-makensis-wine build-makensis-wine`

## Usage

### Build

Before you can build, select an active target with your preferred build option.

Available targets:

`makensis (Wine)` — compile *as-is* using Win32 makensis (<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd>)

Should you get a *Permission denied* error, you need to adjust the permissions of  the build script: 

    chmod +x ~/.atom/packages/build-makensis-wine/lib/makensis-wine.sh

 Alternatively, you can specify a path for `makensis-wine.sh` outside the package directory in your `config.cson`:

 ```cson
 "build-makensis-wine":
    pathToScript: "path/to/makensis-wine.sh"
 ```

### Shortcuts

Here's a reminder of the default shortcuts you can use with this package:

**Select active target**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>T</kbd> or <kbd>F7</kbd>

**Build script**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd> or <kbd>F9</kbd>

**Jump to error**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>G</kbd> or <kbd>F4</kbd>

**Toggle build panel**

<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>V</kbd> or <kbd>F8</kbd>

## License

This work is licensed under the [The MIT License](LICENSE.md).

## Donate

You are welcome support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/atom-build-makensis-wine) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`