# build-makensis-wine

[![apm](https://img.shields.io/apm/l/build-makensis-wine.svg?style=flat-square)](https://atom.io/packages/build-makensis-wine)
[![apm](https://img.shields.io/apm/v/build-makensis-wine.svg?style=flat-square)](https://atom.io/packages/build-makensis-wine)
[![apm](https://img.shields.io/apm/dm/build-makensis-wine.svg?style=flat-square)](https://atom.io/packages/build-makensis-wine)
[![Travis](https://img.shields.io/travis/idleberg/atom-build-makensis-wine.svg?style=flat-square)](https://travis-ci.org/idleberg/atom-build-makensis-wine)
[![David](https://img.shields.io/david/idleberg/atom-build-makensis-wine.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-makensis-wine)
[![David](https://img.shields.io/david/dev/idleberg/atom-build-makensis-wine.svg?style=flat-square)](https://david-dm.org/idleberg/atom-build-makensis-wine?type=dev)
[![Gitter](https://img.shields.io/badge/chat-Gitter-ed1965.svg?style=flat-square)](https://gitter.im/NSIS-Dev/Atom)

[Atom Build](https://atombuild.github.io/) provider for makensis on Wine, compiles [NSIS](https://nsis.sourceforge.net). Supports the [linter](https://atom.io/packages/linter) package with a set of error and warning patterns.

If you prefer working with the native compiler, have a look at the [build-makensis](https://atom.io/packages/build-makensis) package.

![Screenshot](https://raw.githubusercontent.com/idleberg/atom-build-makensis-wine/master/screenshot.png)

*See the linter in action (the theme is [Hopscotch](https://atom.io/packages/hopscotch))*

## Installation

### apm

Install `build-makensis-wine` from Atom's [Package Manager](http://flight-manual.atom.io/using-atom/sections/atom-packages/) or the command-line equivalent:

`$ apm install build-makensis-wine`

### Using Git

Change to your Atom packages directory:

```bash
# Windows
$ cd %USERPROFILE%\.atom\packages

# Linux & macOS
$ cd ~/.atom/packages/
```

Clone repository as `build-makensis-wine`:

```bash
$ git clone https://github.com/idleberg/atom-build-makensis-wine build-makensis-wine
```

Inside the cloned directory, install Node dependencies:

```bash
$ yarn || npm install
```

## Usage

### Build

Before you can build, select an active target with your preferred build option.

Available targets:

* `makensis on Wine` — compile *as-is* (<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>B</kbd>)
* `makensis on Wine (strict)` – compile and stop at warnings, requires NSIS 3 (<kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Super</kbd>+<kbd>B</kbd>)
* `makensis on Wine (user)` – compile with custom arguments specified in the package settings (<kbd>Cmd</kbd>+<kbd>Alt</kbd>+<kbd>U</kbd>)

#### Permission denied

Should you get a *Permission denied* error, you can try and adjust the permissions of the build script: 

    chmod +x ~/.atom/packages/build-makensis-wine/lib/makensis-wine.sh

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

This work is dual-licensed under [The MIT License](https://opensource.org/licenses/MIT) and the [GNU General Public License, version 2.0](https://opensource.org/licenses/GPL-2.0)

## Donate

You are welcome to support this project using [Flattr](https://flattr.com/submit/auto?user_id=idleberg&url=https://github.com/idleberg/atom-build-makensis-wine) or Bitcoin `17CXJuPsmhuTzFV2k4RKYwpEHVjskJktRd`