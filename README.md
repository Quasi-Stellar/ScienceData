# ScienceData
[![Build Status](https://travis-ci.org/sirDonovan/Cassius.svg)](https://travis-ci.org/sirDonovan/Cassius)

A bot for [Pokemon Showdown][1].

  [1]: https://github.com/Zarel/Pokemon-Showdown

## Installation
ScienceData requires [Node.js][2] version 6.0.0 or later and a command line (e.g. `Command Prompt` on Windows or `Terminal` on Mac OS/Linux) to run. Once you have compatible software, complete installation by following these steps:

1. Obtain a copy of ScienceData

  You can do this through the [GitHub client][3] by clicking the "Clone or download" button on the home page of the repository and then clicking "Open in Desktop". You can also use the following [Git][4] command:
  
  `git clone https://github.com/Aurolux/Sciece-Data.git`

  [2]: https://nodejs.org/
  [3]: https://desktop.github.com/
  [4]: https://git-scm.com/

2. Navigate to the root directory

  The remaining steps will take place in the root directory of your ScienceData files. Navigate there with the command:

  `cd DIRECTORY`
  
  Replace `DIRECTORY` with the filepath to your directory (e.g. `C:\Users\Aurolux\Documents\GitHub\Science-Data`).

3. Install dependencies

  Run the following command to install required dependencies:

  `npm install --production`

  If you plan to contribute to development, run the command without the `--production` flag to also install dependencies used for testing.

4. Set up the config file

  Copy and paste the `config-example.js` file, rename it to `config.js`, and open it in your text editor to enter your desired information.

From this point on, you can start the bot by running the following command:

  `node app.js`

## Development

  Issues and pull requests are welcomed! When submitting a pull request, be sure that you have installed development dependencies and ran `npm test` to check for errors in your code.

#### Credits

  * Quinton Lee ([@sirDonovan][5]) - Lead developer
  * [Pokemon Showdown][1] - In-game data files, Tools module, and various helper functions
  * [Contributors][6]

  [5]: https://github.com/Aurolux
  [6]: https://github.com/Aurolux/Science-Data/graphs/contributors

## License

  Science-Data is distributed under the terms of the [MIT License][7].

  [7]: https://github.com/Aurolux/Science-Data/blob/master/LICENSE
