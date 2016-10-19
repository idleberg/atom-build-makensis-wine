'use babel';

import { install } from 'atom-package-deps';
import { execSync } from 'child_process';
import { EventEmitter } from 'events';
import os from 'os';
import path from 'path';


// Package settings
import meta from '../package.json';
const pathToScript = path.join(__dirname, 'makensis-wine.sh');

this.config = {
  customArguments: {
    title: "Custom Arguments",
    description: "Specify your preferred arguments for `makensis`, supports [replacement](https://github.com/noseglid/atom-build#replacement) placeholders",
    type: "string",
    "default": "{FILE_ACTIVE}",
    order: 0
  }
};

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class MakensisWineProvider extends EventEmitter {
    constructor(cwd) {
      super();
      this.cwd = cwd;
      atom.config.observe('build-makensis-wine.customArguments', () => this.emit('refresh'));
    }

    getNiceName() {
      return 'NSIS (Wine)';
    }

    isEligible() {
      if (os.platform() !== 'win32') {
        // Darwin, FreeBSD, Linux, or SunOS (Solaris) platform
        try {
          stdout = execSync('wine --version');
          if (atom.inDevMode()) atom.notifications.addInfo(meta.name, { detail: stdout, dismissable: false });
          return true;
        } catch (error) {
          if (atom.inDevMode()) atom.notifications.addError(meta.name, { detail: error, dismissable: true });
          return false;
        }
      }
      // Win32 platform
      return false;
    }

    settings() {
      let customArguments, customErrorMath, customWarningMatch;

      const errorMatch = [
        '(\\r?\\n)(?<message>.+)(\\r?\\n)Error in script "(?<file>[^"]+)" on line (?<line>\\d+) -- aborting creation process'
      ];
      const warningMatch = [
        '[^!]warning: (?<message>.*) \\((?<file>(\\w{1}:)?[^:]+):(?<line>\\d+)\\)'
      ];
      const comboMatch = errorMatch.concat(warningMatch);

      // User settings
      customArguments = atom.config.get('build-makensis-wine.customArguments').trim().split(" ");

      // Adjust errorMatch and warningMatch
      if (customArguments.indexOf("-WX") != -1) {
        customErrorMatch = comboMatch;
        customWarningMatch = null;
      } else {
        customErrorMatch = errorMatch;
        customWarningMatch = warningMatch;
      }

      return [
        {
          name: 'makensis on Wine',
          exec: pathToScript,
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'cmd-alt-b',
          atomCommandName: 'MakeNSIS-on-wine:compile',
          errorMatch: errorMatch,
          warningMatch: warningMatch
        },
        {
          name: 'makensis on Wine (strict)',
          exec: pathToScript,
          args: [ '-WX', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'ctrl-alt-cmd-b',
          atomCommandName: 'MakeNSIS-on-wine:compile-and-stop-at-warning',
          errorMatch: comboMatch
        },
        {
          name: 'makensis on Wine (user)',
          exec: pathToScript,
          args: customArguments,
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          atomCommandName: 'MakeNSIS-on-wine:compile-and-stop-at-warning',
          errorMatch: customErrorMatch,
          warningMatch: customWarningMatch
        }
      ];
    }
  };
}
