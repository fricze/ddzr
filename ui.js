const e = React.createElement
const useState = React.useState

const bounds = [36, 51]

const padsInLine = 4

const range = (a, b) => (new Array(b - a + 1)).fill(0)
      .map((_, idx) => a + idx)


const _part = (base, parts, by) =>
      base.length > 0 ?
      _part(base.slice(by), parts.concat([base.slice(0, by)]), by) :
      parts

const partition = (arr, by) => _part(arr, [], by)

const pads = partition(range(...bounds), padsInLine)

const Pads = () => {
    const [note, setNote] = useState(-1)
    const [velocity, setVelocity] = useState(0)

    const [pads, setPads] = useState({})

    window.noteOn = (n, v) => { setNote(n); setVelocity(v) }

    window.setNote = (note, velocity) => setPads({ ...pads, [note]: velocity })
    window.unsetNote = (note) => setPads({ ...pads, [note]: 0 })

    let hit = velocity / 127
    hit = hit < 0.5 ? 0.5 : hit

    const padsView =
          partition(range(...bounds)
                    .map(x => ({ a: pads[x] || 0,
                                 i: x })),
                    padsInLine)
          .map((line, lineIdx) =>
               line.map(({a, i}, colIdx) =>
                        e('div', {
                            key: String(lineIdx) + String(colIdx),
                            className: a ? 'single-pad played' : 'single-pad',
                            style: {
                                gridRow: 4 - lineIdx,
                                gridCol: colIdx,
                                background: a ?
                                    `rgba(${a + 100}, 80, 100, ${hit})` :
                                    '#000'
                            }
                        }, null)))
          .flat()

    return e('div', {
        className: 'pads'
    }, padsView)
}

const domContainer = document.querySelector('#ddzr')
ReactDOM.render(e(Pads), domContainer)
