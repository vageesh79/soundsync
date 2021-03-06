<p align="center">
  <img src="res/logo_transparent.png" width="400">
</p>

## Connect virtual cables between any audio source and any audio output

Soundsync is a web and desktop app to manage every audio source and every audio output in your home from a single interface. Link any audio source to multiple speakers connected to any devices on your home network. Soundsync will keep the music synchronized between all of them.

- 🆓 Free to use
- 🕸️ Work with any number of connected devices, audio sources, audio outputs and every link of your choosing
- 🎶 Compatible with a lot of different audio sources (Spotify Connect with a premium account, Airplay, Hardware Audio input (line in / microphone), Linux system audio ; coming soon: Windows system audio, UPnP and more)
- 🔊 Broadcast sound to any speaker connected to a computer (Windows, MacOS, Linux, RapsberryPi), a web browser (Chrome, Firefox) or a Chromecast and soon more
- 🔗 Group speakers together to synchronize them to the same audio source
- 🎛️ Control everything from a web browser
- 🔓 Not linked to any external service, works offline, no account creation

<p align="center">
  <img src="res/screenshot_controller.png" height="400">
  <img src="res/screenshot_menu.png" height="400">
</p>

## Quick start

Download and install Soundsync for you operating system on every device in your home you want to use.

<table width="100%" align="center"><tr>
  <td align="center">
    <h3>Windows</h3>
    <p><a href="https://github.com/geekuillaume/soundsync/releases/download/bleeding-edge/Soundsync_Setup_0.1.0.exe">Download development version</a></p>
  </td>
  <td align="center">
    <h3>MacOS</h3>
    <p><a href="https://github.com/geekuillaume/soundsync/releases/download/bleeding-edge/Soundsync-0.1.0.dmg">Download development version</a></p>
  </td>
  <td align="center">
    <h3>Linux</h3>
    <p><a href="https://github.com/geekuillaume/soundsync/releases/download/bleeding-edge/soundsync_0.1.0_amd64.deb">Download development version (.deb for Ubuntu/Debian)</a></p>
    <p><a href="https://github.com/geekuillaume/soundsync/releases/download/bleeding-edge/soundsync-0.1.0.pacman">Download development version (.pacman for Archlinux)</a></p>
  </td>
  <td align="center">
    <h3>Linux ARM (Raspberry)</h3>
    <p><a href="https://github.com/geekuillaume/soundsync/releases/download/bleeding-edge/soundsync_0.1.0_armv7l.deb">Download development version (.deb for Ubuntu/Debian/Raspbian)</a></p>
  </td>
</tr></table>

Now go to https://soundsync.app/ to control every Soundsync install on your home network.

## Project status

Soundsync is still in an early stage. It's evolving quickly but there is still a lot to do. Here are some features that are being considered:

- Updating info for Spotify sink from WebUI
- Allow changing the name of a peer from the webui
- Group of sinks
- Use [waveform-data](https://www.npmjs.com/package/waveform-data) to show activity on webui
- Integration of media info on webui
- Create a ready to use RaspberryPi image
- Stop audio device when no audio has been received for a while to save energy
- Allow devices on multiple networks to be connected together
- Improve linux script by detecting Pulseaudio process if run as root
- Better explain Spotify integration options (user account being optional)
- Find an alternative way to connect from rendez-vous service for device with DNS Rebinding Protection
- Adds audio visualization for Chromecast view and add an option to use this view from webui
- Resample the audio for each sink to handle drifting clocks instead of seeking to the corrected audio position and hearing an artifact
- Audio integration with:
  - Philips Hue (in progress)
  - Airplay as a audio output
  - Bluetooth as a audio input
  - Bluetooth as a audio output
  - Windows monitor (in progress)
  - UPnP
  - Sonos (blocked: I do not own a test device)
  - HEOS (blocked: I do not own a test device)
  - Amazon Echo (blocked: I do not own a test device)
  - Yamaha MusicCast (blocked: I do not own a test device)

## FAQ

- *Is it Open-source ?* <br/>Soundsync code is released under the Business Source License. It is a special open-source compatible license which is 100% free to use as long as you don't use it for production work. It means you can use it at home, in your office but you cannot resell it or sell a service/product that directly use it. I'm open to licensing it for a business usage, [contact me](mailto:guillaume+soundsync@besson.co) to work out the details.

- *How to debug it?* <br/>You can activate the debug logs on the Webui with the command `window.soundsyncDebug()`. For the desktop version, you need to start the process from the command line (`/opt/Soundsync/soundsync` for Linux).

- *I need an integration with X!* <br/> Soundsync being a free to use project, I cannot invest money into buying every kind of speakers to build integration for them. I've listed the possible integrations above and you can create an issue if you do not see what you need. As the goal os Soundsync is to support every speaker combination, I'll be happy to work on the integration if someone sends me a compatible device. [Contact me](mailto:guillaume+soundsync@besson.co) for the details.

- *Is it available offline?* <br/> Every Soundsync peer (a device on which Soundsync is installed) can be used offline. Each peer will detect other peer on the local network with Bonjour and if connected to internet, will use a rendez-vous service to detect other peer with the same IP address. As Bonjour isn't available in a web browser, you need to connect to a peer on your local network with its IP and the port 6512 (for example `http://192.168.1.12:6512`). Also note that you won't be able to use the webpage as an audio output because the page cannot be served in a `https` context.

## Development

### Building opus

```
git submodule update --init --recursive
cd src/utils/opus_vendor
./autogen.sh
emconfigure ./configure --disable-extra-programs --disable-doc --disable-intrinsics --disable-hardening --disable-rtcd --disable-stack-protector
emmake make
cd ../
emcc -s INITIAL_MEMORY=10MB -s MAXIMUM_MEMORY=10MB -O2 -o opus_wasm.js -s EXPORT_ES6=1 -s MODULARIZE=1 -s SINGLE_FILE=1 -s EXPORT_NAME="Opus" -s USE_ES6_IMPORT_META=0 -s FILESYSTEM=0 -s EXPORTED_RUNTIME_METHODS="['setValue', 'getValue', 'AsciiToString']" -s EXPORTED_FUNCTIONS="['_malloc', '_free', '_opus_decoder_create','_opus_decode_float','_opus_decoder_destroy','_opus_encoder_create','_opus_encoder_destroy','_opus_encode','_opus_strerror']" -s ENVIRONMENT=node,web ./opus_vendor/.libs/libopus.a
```

## Attributions

- Speaker by Mestman from the Noun Project
- Slashed zero by Rflor from the Noun Project
- web browser by Iconstock from the Noun Project
- Computer by iconcheese from the Noun Project
- AirPlay by Michiel Willemsen from the Noun Project
