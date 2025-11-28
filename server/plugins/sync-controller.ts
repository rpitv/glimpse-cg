import type { NitroApp } from 'nitropack';
import { replicants } from '~/utils/replicants';
import { SerialPortStream } from '@serialport/stream';
import type { MockPortBinding } from '@serialport/binding-mock';
import { MockBinding } from '@serialport/binding-mock';
import { SerialPort } from 'serialport';
import { daktronicsRtdListener, daktronicsTVListener } from '../utils/daktronics-rtd/protocol';
import { replicantEvents } from '~/utils/pathHelpers';

let port: SerialPortStream | null = null;
const currentPort: string | null = null;
const configuration = replicants.configuration;
const daktronics = configuration.sync.daktronics;
// Calculate connection bitrate every second. This loop occurs even if the port is closed.
let bitrateCalculationCache: { timestamp: number; byteCount: number }[] = [];

/**
 * Close the currently open serial port. If no serial port is open, then do nothing. Returns a promise that resolves
 *  when the port is closed.
 */
export async function closeSerialPort(): Promise<void> {
  if (port && port.isOpen) {
    await new Promise(resolve => port?.close(resolve));
  }
  port = null;
  daktronics.status.error = false;
  daktronics.status.connected = false;
}

/**
 * Open a Daktronics RTD serial port connection. If a port is already open, then it will be closed first.
 * @param path Path to the serial port to open. In Unix-like systems, this will be something like "/dev/ttyUSB0". In
 *  Windows, this will be something like "COM3". If the path is "MOCK", then a mock serial port will be opened instead.
 *  This is useful for testing without a physical serial port. Data can be passed to the mock port by sending it to the
 *  "glimpse-graphics.daktronics.mock" channel.
 * @param baudRate Baud rate to use when communicating with the serial port. This should almost certainly be 19200.
 */
export async function openSerialPort(path: string, baudRate: number = 19200): Promise<void> {
  // If a port is already open, then close it.
  if (port && port.isOpen) {
    await closeSerialPort();
  }

  // Open the serial port.
  if (path === 'MOCK') {
    // "MOCK" port is a special port which can take in any data and echo it back out.
    MockBinding.createPort('MockPort', { echo: true, record: true });
    port = new SerialPortStream({ binding: MockBinding, path: 'MockPort', baudRate });
  }
  else {
    // Confirm that the serial port exists.
    // if(!(await SerialPort.list()).some(port => port.path === path)) {
    //   console.error("Serial port does not exist.");
    // }
    port = new SerialPort({ path, baudRate, endOnClose: true });
  }

  port.on('error', (err) => {
    // logger.trace("openSerialPort() error");
    // logger.error(err);
    daktronics.status.error = true;
    daktronics.status.errorMsg = `${err.name}: ${err.message}`;
  });

  // Whenever data is received by the port, send it out as a message so users can monitor the connection status.
  port.on('data', async (data) => {
    daktronics.status.error = false;
    bitrateCalculationCache.push({ timestamp: Date.now(), byteCount: data.length });
  });

  // Set up the Daktronics RTD listener on the port.
  port.on('data', (data: Buffer) => {
    if (daktronics.feed === 'rtd')
      daktronicsRtdListener(data);
    else if (daktronics.feed === 'tv')
      daktronicsTVListener(data);
  });

  port.on('open', () => {
    daktronics.status.error = false;
    daktronics.status.connected = true;
  });
  port.on('close', () => {
    daktronics.status.error = false;
    daktronics.status.connected = false;
  });
}

export default defineNitroPlugin((nitroApp: NitroApp) => {
  daktronics.status = { connected: false, bitrate: 0, error: false, errorMsg: '' };
  setInterval(() => {
    // Remove data older than 5 seconds.
    bitrateCalculationCache = bitrateCalculationCache.filter(c => c.timestamp > Date.now() - 5000);
    // Calculate total number of bytes received within our 5-second window.
    const byteCount = bitrateCalculationCache.reduce((a, b) => a + b.byteCount, 0);
    // Find the oldest timestamp in our 5-second window (probably close to 5 seconds, but may be less, especially if the
    //   port was just opened within the last 5 seconds).
    const oldestTimestamp = bitrateCalculationCache.reduce((a, b) => a < b.timestamp ? a : b.timestamp, Date.now());
    // Update bitrate to be total number of bits sent divided by the number of seconds since the oldest timestamp.
    daktronics.status.bitrate = Math.floor((byteCount / ((Date.now() - oldestTimestamp) / 1000)) * 8) || 0;
  }, 1000);

  // Update the list of available serial ports every second.
  daktronics.availablePorts = [];
  setInterval(async () => {
    daktronics.availablePorts = (await SerialPort.list()).map(p => p.path);
  }, 1000);

  // Attempt to connect to serial port every second if it's currently closed. This way, if the serial port is unplugged
  //   and plugged back in, the server will automatically reconnect. Server will also auto connect with saved values on
  //   startup.
  setInterval(async () => {
    if (daktronics.selectedPort !== null && !port?.isOpen) {
      try {
        await openSerialPort(daktronics.selectedPort!, daktronics.feed === 'tv' ? 9600 : 19200);
      }
      catch (ignored) {}
    }
  }, 1000);

  replicantEvents.on('change', async (path, value) => {
    if (JSON.stringify(path) === JSON.stringify(['configuration', 'sync', 'daktronics', 'selectedPort'])) {
      if (!daktronics.selectedPort)
        return;

      // If the selected port has changed, then close the current port.
      if (daktronics.selectedPort !== currentPort) {
        await closeSerialPort();
        await openSerialPort(daktronics.selectedPort, daktronics.feed === 'tv' ? 9600 : 19200);
      }
    }
    if (JSON.stringify(path) === JSON.stringify(['configuration', 'sync', 'daktronics', 'mock', 'packet'])) {
      if (replicants.configuration.sync.daktronics.selectedPort === 'MOCK' && port && port.isOpen) {
        (<MockPortBinding>port.port).emitData(value);
      }
    }
  });

  // Feed mock data to the serial port if the port is open and is a mock port
  // mockMessageChannel.listen((data) => {
  //   if (replicants.sync.selectedPort.value === "MOCK" && port && port.isOpen) {
  //     (<MockPortBinding>port.port).emitData(data)
  //   }
  // })
});
