const e = React.createElement
const useState = React.useState
const useEffect = React.useEffect

const bounds = [0, 31]

const padsInLine = 12

const range = (a, b) => (new Array(b - a + 1)).fill(0)
      .map((_, idx) => a + idx)

const notez = range(0, 11).map(row => range(0, 7).map(col => ({ row, col })))
      .flat()

const _part = (base, parts, by) =>
      base.length > 0 ?
      _part(base.slice(by), parts.concat([base.slice(0, by)]), by) :
      parts

const partition = (arr, by) => _part(arr, [], by)

const pads = partition(range(...bounds), padsInLine)

const useWindowKeys = () => {
    const [notesPlucked, pluckNote] = useState([{}])
    const [rowPlucked, pluckRow] = useState(0)

    const [inControl, setControl] = useState(false)

    const pluckNoteHandler = (e, notesPlucked, rowPlucked) => {
        const row = (notesPlucked[rowPlucked] || {})
        notesPlucked[rowPlucked] =
            { ...row,
              [e.key]: !row[e.key]
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

const notesNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'H']

const Notes = () => {
    const {notesPlucked, inControl, rowPlucked} = useWindowKeys()

    const activeRow = e('div', {
        className: 'active-dot',
        style: {
            gridRow: rowPlucked + 1,
            gridCol: 0,
        }
    }, '⬤')

    const notesNamesView = notesNames.map((name, id) => {
        return e('div', {
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

        return e('div', {
            key: String(row) + String(col),
            className: activePadClass,
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
