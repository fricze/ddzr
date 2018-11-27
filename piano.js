import { notesNames, useWindowKeys } from './useWindowKeys.js'
import { use8Tick } from './scheduler.js'

const e = React.createElement

let keys

const range = (a, b) => (new Array(b - a + 1)).fill(0)
      .map((_, idx) => a + idx)

const notez = range(0, 11).map(row => range(0, 7).map(col => ({ row, col })))
      .flat()

const Notes = () => {
    const {notesPlucked, inControl, rowPlucked} = useWindowKeys(keys)()
    const tick = use8Tick()

    const activeRow = e('div', {
        key: 'active-dot',
        className: 'active-dot',
        style: {
            gridRow: rowPlucked + 1,
            gridCol: 0,
        }
    }, '⬤')

    const notesNamesView = notesNames.map((name, id) => {
        return e('div', {
            key: 'note' + id,
            style: {
                gridRow: id + 1,
                gridCol: 0,
                lineHeight: 1.9
            }
        }, name)
    })

    const padsView = notez.map(({ row, col }) => {
        const activePadClass = (notesPlucked[row] || {})[col + 1] ?
              'single-pad active-pad' : 'single-pad'

        const ticked = col === (tick - 1) ? 'ticked' : ''

        return e('div', {
            key: String(row) + String(col),
            className: activePadClass + ' ' + ticked,
            style: {
                gridRow: row + 1,
                gridColumn: col + 2,
            }
        }, null)
    })

    return e('div', {
        className: 'pads'
    }, padsView.concat(notesNamesView).concat([activeRow]))
}

const domContainer = document.querySelector('#piano')
ReactDOM.render(e(Notes), domContainer)

function onMIDISuccess(midiAccess) {
    const outs = midiAccess.outputs
    // take first midi output and assign
    keys = outs.values().next().value
    keys.open()
}

function onMIDIFailure(msg) {
    console.log("Failed to get MIDI access - " + msg)
}

navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure)
