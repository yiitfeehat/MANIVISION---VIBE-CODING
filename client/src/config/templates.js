export const templates = [
    {
        id: 'chaos-dream',
        name: 'Chaos Dream',
        bgStyle: { background: 'radial-gradient(circle at center, #27272a 0%, #09090b 100%)' },
        titleSlot: { top: '45%', left: '50%', transform: 'translate(-50%, -50%) rotate(-5deg)', width: '80%', fontSize: '4rem', zIndex: 50, textAlign: 'center', color: 'white', textShadow: '0 0 20px rgba(0,0,0,0.8)' },
        slots: [
            { top: '5%', left: '5%', width: '35%', height: '40%', transform: 'rotate(-6deg)', zIndex: 1 },
            { top: '10%', left: '55%', width: '40%', height: '35%', transform: 'rotate(4deg)', zIndex: 2 },
            { top: '50%', left: '2%', width: '30%', height: '35%', transform: 'rotate(3deg)', zIndex: 3 },
            { top: '45%', left: '60%', width: '35%', height: '45%', transform: 'rotate(-2deg)', zIndex: 4 },
            { top: '35%', left: '35%', width: '30%', height: '30%', transform: 'rotate(10deg)', zIndex: 5 }, // Center overlapping piece
        ]
    },
    {
        id: 'focus-grid',
        name: 'Focus Grid',
        bgStyle: { background: 'linear-gradient(to bottom right, #18181b, #27272a)' },
        titleSlot: { top: '8%', left: '50%', transform: 'translate(-50%, 0)', width: '100%', fontSize: '3rem', zIndex: 50, textAlign: 'center', color: '#e4e4e7', letterSpacing: '0.2em' },
        slots: [
            { top: '20%', left: '5%', width: '43%', height: '35%', transform: 'rotate(-1deg)', zIndex: 1 },
            { top: '20%', left: '52%', width: '43%', height: '35%', transform: 'rotate(1deg)', zIndex: 1 },
            { top: '58%', left: '5%', width: '28%', height: '30%', transform: 'rotate(0deg)', zIndex: 1 },
            { top: '58%', left: '36%', width: '28%', height: '30%', transform: 'rotate(0deg)', zIndex: 1 },
            { top: '58%', left: '67%', width: '28%', height: '30%', transform: 'rotate(0deg)', zIndex: 1 },
        ]
    },
    {
        id: 'polaroid-pile',
        name: 'Polaroid Pile',
        bgStyle: { background: '#000000' },
        titleSlot: { top: '85%', left: '50%', transform: 'translate(-50%, 0)', width: '100%', fontSize: '3.5rem', zIndex: 60, textAlign: 'center', color: 'white', fontFamily: 'serif', fontStyle: 'italic' },
        slots: [
            { top: '15%', left: '20%', width: '40%', height: '50%', transform: 'rotate(-15deg)', zIndex: 1 },
            { top: '20%', left: '45%', width: '40%', height: '50%', transform: 'rotate(10deg)', zIndex: 2 },
            { top: '40%', left: '10%', width: '35%', height: '40%', transform: 'rotate(5deg)', zIndex: 3 },
            { top: '5%', left: '55%', width: '30%', height: '35%', transform: 'rotate(-20deg)', zIndex: 0 },
        ]
    },
    {
        id: 'maximalist-chaos',
        name: 'Maximalist Chaos',
        bgStyle: { background: 'linear-gradient(45deg, #ff00cc, #333399)' },
        titleSlot: { top: '50%', left: '50%', transform: 'translate(-50%, -50%) rotate(-10deg)', width: '90%', fontSize: '5rem', zIndex: 100, textAlign: 'center', color: '#fff', textShadow: '4px 4px 0px #000' },
        slots: Array.from({ length: 20 }).map((_, i) => ({
            top: `${Math.random() * 80}%`,
            left: `${Math.random() * 80}%`,
            width: `${20 + Math.random() * 20}%`,
            height: `${20 + Math.random() * 20}%`,
            transform: `rotate(${Math.random() * 40 - 20}deg)`,
            zIndex: i + 1
        }))
    }
];

export const defaultTemplate = templates[0];
