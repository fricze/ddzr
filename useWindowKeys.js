import { parseMessage } from './parseMessage.js'

const e = React.createElement
const useState = React.useState
const useEffect = React.useEffect

export const notesNames = ['C', 'C#', 'D', 'D#', 'E', 'F',
                           'F#', 'G', 'G#', 'A', 'A#', 'H']
    .reverse()

export const useWindowKeys = keys => () => {
    const [notesPlucked, pluckNote] = useState([{}])
    const [rowPlucked, pluckRow] = useState(0)

    const [inControl, setControl] = useState(false)

    const pluckNoteHandler = (e, notesPlucked, rowPlucked) => {
        const row = (notesPlucked[rowPlucked] || {})
        notesPlucked[rowPlucked] =
            { ...row,
              [e.key]: !row[e.key]
            }

        if (notesPlucked[rowPlucked][e.key]) {
            const note = notesNames[rowPlucked]
            const noteMsg = 11 - rowPlucked

            // keys.send(parseMessage('noteon', {
            //     note: 60 + noteMsg,
            //     velocity: 127,
            //     channel: 3
            // }))

            // setTimeout(_ => {
            //     keys.send(parseMessage('noteoff', {
            //         note: 60 + noteMsg,
            //         velocity: 127,
            //         channel: 3
            //     }))
            // }, 1000)
        }

        pluckNote(notesPlucked)
    }

    const handlerDown = (e, notesPlucked, rowPlucked, inControl) => {
        const isNumber = Number.isInteger(parseInt(e.key))
        const isCtrl = 'Control' === e.key

        if (e.key === 'ArrowDown') {
            pluckRow(rowPlucked + 1)
        }

        if (e.key === 'ArrowUp') {
            pluckRow(rowPlucked - 1)
        }

        if (isNumber) {
            if (inControl) {
                pluckRow(Number(e.key))
            } else {
                pluckNoteHandler(e, notesPlucked, rowPlucked)
            }
        }

        if (isCtrl) {
            setControl(true)
        }
    }

    const handlerUp = e => {
        const isCtrl = 'Control' === e.key

        if (isCtrl) {
            setControl(false)
        }
    }

    useEffect(_ => {
        window.onkeydown = e => handlerDown(e, notesPlucked, rowPlucked, inControl)
        return _ => window.onkeydown = _ => null
    }, [notesPlucked, inControl, rowPlucked])

    useEffect(_ => {
        window.onkeyup = e => handlerUp(e, notesPlucked)
        return _ => window.onkeyup = _ => null
    }, [notesPlucked])

    return {notesPlucked, inControl, rowPlucked}
}
