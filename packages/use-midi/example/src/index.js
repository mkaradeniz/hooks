import React from 'react'
import ReactDOM from 'react-dom'

import useMidi from '@mkaradeniz/use-midi'

const MessagesTable = ({ midiMessages }) => {
  return (
    <section>
      <h3>Recieved Messages</h3>

      <table style={{ width: '50vw' }}>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Command Code</th>
            <th>Note</th>
            <th>Velocity</th>
          </tr>
        </thead>
        <tbody>
          {midiMessages
            .slice()
            .reverse()
            .map(midiMessage => (
              <tr key={`${midiMessage.timestamp}|${midiMessage.note}`}>
                <td>{midiMessage.timestamp}</td>
                <td>{midiMessage.commandCode}</td>
                <td>{midiMessage.note}</td>
                <td>{midiMessage.velocity}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </section>
  )
}

const App = () => {
  const [midiMessages, { isSupported, isRequested, isAllowed }, request] = useMidi()

  if (!isSupported) {
    return (
      <div>
        Your current browser does not support the Web MIDI API. See{' '}
        <a href="https://caniuse.com/#feat=midi" rel="noopener noreferrer" target="_blank">
          caniuse.com
        </a>{' '}
        for a list of supported browsers.
      </div>
    )
  }

  if (!isRequested) {
    return <button onClick={request}>Click here to allow access to your MIDI controllers.</button>
  }

  if (isRequested && !isAllowed) {
    return (
      <div>
        <header style={{ backgroundColor: 'red', width: '50%' }}>
          <h2>MIDI Access Not Granted</h2>
        </header>
      </div>
    )
  }

  return (
    <div>
      <header style={{ backgroundColor: 'green', width: '50%' }}>
        <h2>MIDI Access Granted</h2>
      </header>

      <MessagesTable midiMessages={midiMessages} />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
