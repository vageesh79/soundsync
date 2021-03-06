import './utils/sentry';
import yargs from 'yargs';
import debug from 'debug';

import { registerAudioSourcesSinksManager, getAudioSourcesSinksManager } from './audio/get_audio_sources_sinks_manager';
import { attachApi } from './api/api';
import { enableAutolaunchAtStartup, disableAutolaunchAtStartup } from './utils/launchAtStartup';
import { getHttpServer } from './communication/http_server';
import { getPeersManager, registerPeersManager } from './communication/get_peers_manager';
import { AudioSourcesSinksManager } from './audio/audio_sources_sinks_manager';
import { getClientCoordinator } from './coordinator/client_coordinator';
// import { ApiController } from './api/api';
import { initConfig, getConfigField } from './coordinator/config';
import { createSystray, refreshMenu } from './utils/systray';
import {
  startDetection, publishService, onDetectionChange,
} from './communication/bonjour';
import { registerLocalPeer } from './communication/local_peer';
import { Capacity } from './communication/peer';
import { enableRendezvousServiceRegister, enableRendezvousServicePeersDetection } from './communication/rendezvous_service';
import { PeersManager } from './communication/peers_manager';
import { isDepAvailableForPlatform } from './utils/deps_downloader';

if (!process.env.DEBUG) {
  debug.enable('soundsync,soundsync:*,-soundsync:timekeeper,-soundsync:*:timekeepResponse,-soundsync:*:timekeepRequest,-soundsync:*:peerDiscovery,-soundsync:api,-soundsync:wrtcPeer:*:soundState,-soundsync:*:librespot,-soundsync:*:peerSoundState,-soundsync:*:peerConnectionInfo');
}
const l = debug('soundsync');

const main = async () => {
  l('Starting soundsync');
  const argv = yargs
    .help('h')
    .option('configDir', {
      type: 'string',
      description: 'Directory where the config and cache files can be found, if it doesn\'t exists it will be created',
    })
    .option('launchAtStartup', {
      type: 'boolean',
      description: 'Register this process to be launched at startup',
    })
    .completion()
    .parse(process.argv.slice(1));

  registerPeersManager(new PeersManager());
  registerAudioSourcesSinksManager(new AudioSourcesSinksManager());
  initConfig(argv.configDir);
  registerLocalPeer({
    name: getConfigField('name'),
    uuid: getConfigField('uuid'),
    capacities: [
      isDepAvailableForPlatform('librespot') && Capacity.Librespot,
      isDepAvailableForPlatform('shairport') && Capacity.Shairport,
      Capacity.HttpServerAccessible,
      Capacity.Hue,
      Capacity.ChromecastInteraction,
    ].filter(Boolean),
  });

  const peersManager = getPeersManager();
  const audioSourcesSinksManager = getAudioSourcesSinksManager();

  audioSourcesSinksManager.addFromConfig();
  if (getConfigField('autoDetectAudioDevices')) {
    audioSourcesSinksManager.autodetectDevices();
  }

  if (argv.launchAtStartup === true) {
    await enableAutolaunchAtStartup();
  } else if (argv.launchAtStartup === false) {
    await disableAutolaunchAtStartup();
  }

  createSystray();
  startDetection();
  refreshMenu();

  try {
    const httpServer = await getHttpServer(getConfigField('port'));
    attachApi(httpServer);
    if (getConfigField('detectPeersOnLocalNetwork')) {
      publishService(httpServer.port);
    }
    if (getConfigField('enableRendezvousService')) {
      enableRendezvousServiceRegister(httpServer.port);
    }
  } catch (e) {}

  getConfigField('peers').forEach((peerHost) => {
    peersManager.joinPeerWithHttpApi(peerHost);
  });

  if (getConfigField('detectPeersOnLocalNetwork')) {
    onDetectionChange((services) => {
      services.forEach((service) => {
        const uuid = service.name.match(/SoundSync @ (.*)/)[1];
        // @ts-ignore
        if (service.addresses.length === 0) {
          return;
        }
        // @ts-ignore
        peersManager.joinPeerWithHttpApi(`${service.addresses[0]}:${service.port}`, uuid);
      });
    });
  }
  if (getConfigField('enableRendezvousService')) {
    enableRendezvousServicePeersDetection();
  }

  getClientCoordinator();
};

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

process.on('uncaughtException', (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});

process.on('unhandledRejection', (e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
