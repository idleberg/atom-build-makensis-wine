'use babel';

import {exec} from 'child_process';
import os from 'os';
import path from 'path';

const self = '[makensis-wine] ';
const pathToScript = atom.config.get('build-makensis-wine.pathToScript');
const makeNsis = pathToScript ? '"' + pathToScript + '"' : path.join(__dirname, 'makensis-wine.sh');
const debug = atom.config.get('build-makensis-wine.debug');

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
            console.log(self + error);
            // No Wine installed
            return false;
          }
          if (debug === true) console.log(self + stdout);
        });
        // Darwin, FreeBSD, Linux, or SunOS (Solaris) platform
        return true;
      }
      // Win32 platform
      return false;
    }

    settings() {
      const errorMatch = [
        '\\n(?<message>.+)\\nError in script "(?<file>[^"]+)" on line (?<line>\\d+) -- aborting creation process'
      ];
      const warningMatch = [
        '\\S*[^!]warning: (?<message>.*) \\((?<file>[^:]+):(?<line>\\d+)\\)'
      ];

      return [
        {
          name: 'makensis (Wine)',
          exec: makeNsis,
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'cmd-alt-b',
          atomCommandName: 'makensis:compile-on-wine',
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
          atomCommandName: 'makensis:compile-on-wine-and-stop-at-warning',
          errorMatch: errorMatch
        }
      ];
    }
  };
}
