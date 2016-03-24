'use babel';

import {exec} from 'child_process';
import os from 'os';
import path from 'path';

const self = '[makensis-wine] ';

export function provideBuilder() {

  return class MakensisWineProvider {
    constructor(cwd) {
      this.cwd = cwd;
    }

    getNiceName() {
      return 'NSIS (Wine)';
    }

    isEligible() {
      // Builds on Darwin, FreeBSD, Linux, and SunOS (Solaris)
      if (os.platform() !== 'win32') {
        exec('wine --version', function(error, stdout, stderr) {
            if (error !== null) {
                console.log(self + error);
                return false;
            }
            console.log(self + stdout);
        });
        return true;
      }
      // Win32 platform
      return false;
    }

    settings() {
      const errorMatch = [
        '\\n(?<error>.+)\\nError in script "(?<file>[^"]+)" on line (?<line>\\d+) -- aborting creation process'
      ];

      return [
        {
          name: 'makensis (Wine)',
          exec: path.join(__dirname, 'makensis-wine.sh'),
          args: [ '{FILE_ACTIVE}' ],
          cwd: '{FILE_ACTIVE_PATH}',
          sh: true,
          keymap: 'cmd-alt-b',
          atomCommandName: 'makensis:compile-on-wine',
          errorMatch: errorMatch
        }
      ];
    }
  }
}
