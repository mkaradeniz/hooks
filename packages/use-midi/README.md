# useMidi

`useMidi` is a low-level custom [React](https://reactjs.org/) [Hook](https://reactjs.org/hooks) to access the [Web MIDI API](https://webaudio.github.io/web-midi-api/). It provides access to incoming [`MIDIMessageEvent`](https://webaudio.github.io/web-midi-api/#midimessageevent-interface)s and helpers to request and observe the user's permission.

## Installation

```bash
yarn add @mkaradeniz/use-midi
```

or

```bash
npm install @mkaradeniz/use-midi
```

## Usage

```typescript
const [midiMessages, { isSupported, isRequested, isAllowed }, requestMidiAccess, midiAccess] = useMidi()
```

## API

### Input

| Type      | Default                                                                                        |
| --------- | ---------------------------------------------------------------------------------------------- |
| `Options` | `{ debug: false, manuallyRequestPermission: true, suppressActiveSensing: true, sysex: false }` |

#### `MidiMessage`

| Property      | Type                       | Description                                                                                                |
| ------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------- |
| `commandCode` | `number`                   | Recieved command code.                                                                                     |
| `note`        | `number | undefined`       | If recieved, the given note.                                                                               |
| `timestamp`   | `DOMHighResTimeStamp`      | High-resolution time of when the event was received.                                                       |
| `rawEvent`    | `WebMidi.MIDIMessageEvent` | The raw [`WebMidi.MIDIMessageEvent`](https://webaudio.github.io/web-midi-api/#midimessageevent-interface). |
| `velocity`    | `number | undefined`       | If recieved, the given velocity.                                                                           |

#### `Options`

| Option                      | Type                                 | Description                                                                                                                                                              | Default     |
| --------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- |
| `callback`                  | `(midiMessage: MidiMessage) => void` | If provided, the callback will be called on every received `MidiMessage`.                                                                                                | `undefined` |
| `debug`                     | `boolean`                            | If set to `true`, `useMidi` will log every event to the console.                                                                                                         | `false`     |
| `manuallyRequestPermission` | `boolean`                            | If set to `true`, `useMidi` will _not_ automatically ask for the user's permission to access the MIDI devices. Instead the consumer is expected to call `requestAccess`. | `true`      |
| `suppressActiveSensing`     | `boolean`                            | If set to `true`, `useMidi` will ignore the [Active Sensing](http://electronicmusic.wikia.com/wiki/Active_sensing) event.                                                | `true`      |
| `sysex`                     | `boolean`                            | If set to `true`, `useMidi` use the [sysex option](https://webaudio.github.io/web-midi-api/#dom-midioptions-sysex) when requesting MIDI access.                          | `false`     |

### Returns

| Index | Variable        | Type            | Description                                                                                | Default                                                      |
| ----- | --------------- | --------------- | ------------------------------------------------------------------------------------------ | ------------------------------------------------------------ |
| `0`   | `midiMessages`  | `MidiMessage[]` | An array of all `MidiMessage`s, from oldest (index `0`) to newest.                         | `[]`                                                         |
| `1`   | `status`        | `Status`        | Object with all statuses.                                                                  | `{isAllowed: false, isRequested: False, isSupported: false}` |
| `2`   | `requestAccess` | `() => void`    | Function to request the user's permission to access MIDI devices.                          | `() => void`                                                 |
| `3`   | `midiAccess`    | `MIDIAccess`    | The [MIDIAccess](https://webaudio.github.io/web-midi-api/#midiaccess-interface) interface. | `undefined`                                                  |

#### Status

| Status        | Type      | Description                                                                                       | Default |
| ------------- | --------- | ------------------------------------------------------------------------------------------------- | ------- |
| `isAllowed`   | `boolean` | Whether the user gave permission to access MIDI devices.                                          | `false` |
| `isRequested` | `boolean` | Whether we requested the user to grant permission to access MIDI devices.                         | `false` |
| `isSupported` | `boolean` | Whether the [Web MIDI API](https://webaudio.github.io/web-midi-api/) is supported by the browser. | `false` |

## Development

This project is written in [TypeScript](https://github.com/Microsoft/TypeScript) and setup as a monorepo managed by [Yarn-Workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) & [Lerna](https://github.com/lerna/lerna).

⚠️ Only release through `yarn release` in root. Do not `npm publish` individual packages.
