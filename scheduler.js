const e = React.createElement
const useState = React.useState
const useEffect = React.useEffect

var audioContext = new AudioContext()
var futureTickTime = audioContext.currentTime
var current16thNote = 1
var tempo = 120.0 //initial tempo
var delayVal = 0 //initial delay value
var timerID = 0

export const use8Tick = () => {
    const [tick, setTick] = useState(1)

    useEffect(_ => {
        function futureTick() {
            var secondsPerBeat = 60.0 / tempo
            futureTickTime += 0.5 * secondsPerBeat // "future note"
            current16thNote++

            if (current16thNote > 8) {
                current16thNote = 1
            }
        }

        function scheduler() {
            while (futureTickTime < audioContext.currentTime + 0.1) {
                scheduleNote(current16thNote, futureTickTime)
                futureTick()
            }

            timerID = window.setTimeout(scheduler, 50.0)
        }

        scheduler()

        function scheduleNote(beatDivisionNumber, time) {
            if (current16thNote) {
                setTick(beatDivisionNumber)
            }
        }

    }, [])

    return tick
}
