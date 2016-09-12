'use babel';

import { install } from 'atom-package-deps';
import { exec } from 'child_process';
import os from 'os';
import path from 'path';

// Package settings
import meta from '../package.json';
const notEligible = `**${meta.name}**: \`wine\` is not in your PATH`;
const pathToScript = atom.config.get('build-makensis-wine.pathToScript');
const makeNsis = pathToScript ? '"' + pathToScript + '"' : path.join(__dirname, 'makensis-wine.sh');

// This package depends on build, make sure it's installed
export function activate() {
  if (!atom.inSpecMode()) {
    install(meta.name);
  }
}

export function provideBuilder() {
  return class MakensisWineProvider {
    constructor(cwd) {
      this.cwd = cwd;

      // Settings?
      if (!atom.config.get('build-makensis-wine.pathToScript')) {
        atom.config.set('build-makensis-wine.pathToScript', '');
      }
    }

    getNiceName() {
      return 'NSIS (Wine)';
    }

    isEligible() {
      if (os.platform() !== 'win32') {
        exec('wine --version', function (error, stdout, stderr) {
          if (error !== null) {
            // No Wine installed
            if (atom.inDevMode()) atom.notifications.addError(notEligible, { detail: error, dismissable: true });
            return false;
          }
          if (atom.inDevMode()) atom.notifications.addInfo(`**${meta.name}**`, { detail: stdout, dismissable: false });
        });
        // Darwin, FreeBSD, Linux, or SunOS (Solaris) platform
        return true;
      }
      // Win32 platform
      return false;
    }

    settings() {
      const errorMatch = [
        '(\\r?\\n)(?<message>.+)(\\r?\\n)Error in script "(?<file>[^"]+)" on line (?<line>\\d+) -- aborting creation process'
      ];
      const warningMatch = [
        '[^!]warning: (?<message>.*) \\((?<file>(\\w{1}:)?[^:]+):(?<line>\\d+)\\)'
      ];
      const comboMatch = errorMatch.concat(warningMatch);

      return [
        {
          name: 'makensis (Wine)',
          exec: makeNsis,
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'cmd-alt-b',
          atomCommandName: 'MakeNSIS-on-wine:compile',
          errorMatch: errorMatch,
          warningMatch: warningMatch
        },
        {
          name: 'makensis -WX (Wine)',
          exec: makeNsis,
          args: [ '-WX', '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'ctrl-alt-cmd-b',
          atomCommandName: 'MakeNSIS-on-wine:compile-and-stop-at-warning',
          errorMatch: comboMatch
        }
      ];
    }
  };
}
