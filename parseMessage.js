export const parseMessage = function (type, args) {
    const types = {
        'noteoff': 0x08,
        'noteon': 0x09,
        'poly aftertouch': 0x0A,
        'cc': 0x0B,
        'program': 0x0C,
        'channel aftertouch': 0x0D,
        'pitch': 0x0E
    }
    const extendedTypes = {
        'sysex': 0xF0,
        'mtc': 0xF1,
        'position': 0xF2,
        'select': 0xF3,
        'tune': 0xF6,
        'sysex end': 0xF7,
        'clock': 0xF8,
        'start': 0xFA,
        'continue': 0xFB,
        'stop': 0xFC,
        'reset': 0xFF
    }

    var bytes = []
    if (types[type]) {
        args.channel = args.channel || 0
        bytes.push((types[type] << 4) + args.channel)
    } else if (extendedTypes[type]) {
        bytes.push(extendedTypes[type])
    } else {
        throw new Error('Unknown midi message type: ' + type)
    }

    if (type == 'noteoff' || type == 'noteon') {
        bytes.push(args.note)
        bytes.push(args.velocity)
    }
    if (type == 'cc') {
        bytes.push(args.controller)
        bytes.push(args.value)
    }
    if (type == 'poly aftertouch') {
        bytes.push(args.note)
        bytes.push(args.pressure)
    }
    if (type == 'channel aftertouch') {
        bytes.push(args.pressure)
    }
    if (type == 'program') {
        bytes.push(args.number)
    }
    if (type == 'pitch' || type == 'position') {
        bytes.push(args.value & 0x7F) // lsb
        bytes.push((args.value & 0x3F80) >> 7) // msb
    }
    if (type == 'mtc') {
        bytes.push((args.type << 4) + args.value)
    }
    if (type == 'select') {
        bytes.push(args.song)
    }
    if (type == 'sysex') {
        // sysex commands should start with 0xf0 and end with 0xf7. Throw an error if it doesn't.
        if (args.length<=3 || args[0]!=0xf0 || args[args.length-1]!=0xf7) { //
            throw new Error("sysex commands should be an array that starts with 0xf0 and end with 0xf7")
        }
        args.slice(1).forEach(function(arg){bytes.push(arg)}); // 0xf0 was already added at the beginning of parseMessage.
    }
    return bytes
}
