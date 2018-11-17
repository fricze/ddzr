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

// const act = 47

const Pads = () => {
    const [note, setNote] = useState(-1)
    const [velocity, setVelocity] = useState(0)

    window.noteOn = (n, v) => {setNote(n); setVelocity(v)}

    let hit = velocity / 127
    hit = hit < 0.5 ? 0.5 : hit

    const padsView = partition(range(...bounds)
                               .map(x => ({a: x === note ? velocity : false,
                                           i: x})),
                               padsInLine)
          .map((line, lineIdx) =>
               line.map(({a, i}, colIdx) =>
                        e('div', {
                            className: a ? 'single-pad played' : 'single-pad',
                            style: {
                                gridRow: 4 - lineIdx,
                                gridCol: colIdx,
                                background: a ? `rgba(${velocity + 100}, 80, 100, ${hit})` : '#000'
                            }
                        }, null)))
          .flat()

    return e('div', {
        className: 'pads'
    }, padsView)
}

const domContainer = document.querySelector('#ddzr')
ReactDOM.render(e(Pads), domContainer)
