import { useEffect, useState } from 'react'

// Util

const debugLogger = (logDebugMessage: boolean, message: string, ...rest: any[]) => {
  if (logDebugMessage) {
    // tslint:disable-next-line no-console
    console.log(message, ...rest)
  }
}

// Types

interface MidiMessage {
  commandCode: number
  note?: number
  rawEvent: WebMidi.MIDIMessageEvent
  timestamp: DOMHighResTimeStamp
  velocity?: number
}

type Callback = (midiMessage: MidiMessage) => void
type RequestPermission = () => void

interface Options {
  automaticallyRequestPermission?: boolean
  callback?: Callback
  debug?: boolean
  messagesHistoryCount?: number
  suppressActiveSensing?: boolean
  sysex?: boolean
}

interface Status {
  isAllowed: boolean
  isRequested: boolean
  isSupported: boolean
}

type Returns = [MidiMessage[], Status, RequestPermission, WebMidi.MIDIAccess?]

const useMidi = (options: Options = {}): Returns => {
  const {
    automaticallyRequestPermission = false,
    callback,
    debug = false,
    messagesHistoryCount = 256,
    suppressActiveSensing = true,
    sysex = false,
  } = options

  const [isAllowed, setIsAllowed] = useState<boolean>(false)
  const [isRequested, setIsRequested] = useState<boolean>(false)
  const [midiAccessInterface, setMidiAccessInterface] = useState<WebMidi.MIDIAccess | undefined>(undefined)
  const [midiMessages, setMidiMessages] = useState<MidiMessage[]>([])
  const isSupported = !!window && !!window.navigator && !!window.navigator.requestMIDIAccess

  const messageReciever = (midiMessageEvent: WebMidi.MIDIMessageEvent) => {
    const [commandCode, note, velocity] = midiMessageEvent.data
    const { timeStamp: timestamp } = midiMessageEvent

    const midiMessage = { commandCode, note, rawEvent: midiMessageEvent, timestamp, velocity }

    switch (commandCode) {
      // Active Sensing Event (see: http://electronicmusic.wikia.com/wiki/Active_sensing)
      case 254:
        if (suppressActiveSensing) {
          debugLogger(debug, 'Skipping `active sensing` message.')

          break
        }
      // Falling through!

      // tslint:disable-next-line no-switch-case-fall-through
      default:
        debugLogger(debug, 'Adding `midiMessage` to `midiMessages` array.', { midiMessage, options })

        setMidiMessages(prevMidiMessages => [
          ...(prevMidiMessages.length === messagesHistoryCount ? [...prevMidiMessages].slice(1) : prevMidiMessages),
          midiMessage,
        ])

        if (!callback) {
          debugLogger(debug, 'Skipping `callback`.', { midiMessage, options })
        }

        if (!!callback) {
          debugLogger(debug, 'Calling `callback` with `midiMessage`.', { midiMessage, options })

          callback(midiMessage)
        }
    }
  }

  const handleSuccess = (midiAccess: WebMidi.MIDIAccess) => {
    debugLogger(debug, 'Successfully requested permission from user.', { midiAccess, options })

    setIsAllowed(true)
    setMidiAccessInterface(midiAccess)

    debugLogger(debug, 'Mapping input devices to `messageReciever`.', { midiAccess, options })

    for (const input of midiAccess.inputs.values()) {
      debugLogger(debug, 'Mapping input device to `messageReciever`.', { input, midiAccess, options })

      input.onmidimessage = messageReciever
    }
  }

  const handleFailure = (error: Error) => {
    debugLogger(debug, 'Unsuccessfully requested permission from user.', { error, options })

    setIsAllowed(false)
  }

  const requestAccess = async () => {
    if (isSupported) {
      setIsRequested(true)

      try {
        debugLogger(debug, 'Requesting permission from user.', { options })

        const midiAccess = await window.navigator.requestMIDIAccess({ sysex })

        handleSuccess(midiAccess)
      } catch (error) {
        handleFailure(error)
      }
    } else {
      debugLogger(debug, 'Canceling request for permission, `requestMIDIAccess` is not supported.', { options })
    }
  }

  useEffect(() => {
    if (automaticallyRequestPermission) {
      debugLogger(debug, 'Automatically requesting permission from user.', { options })

      requestAccess()
    } else {
      debugLogger(debug, 'Waiting to manually request user permission.', { options })
    }
  }, [])

  return [midiMessages, { isSupported, isRequested, isAllowed }, requestAccess, midiAccessInterface]
}

export default useMidi
