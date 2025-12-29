export const themes = [
    {
        id: 'minimal',
        name: 'Pure Minimal',
        label: '⚪️',
        // Clean, crisp
        imgStyle: {
            filter: 'brightness(105%) contrast(105%)',
        },
        overlayStyle: {
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
        },
        containerClass: 'bg-white text-zinc-900',
        buttonColor: '#ffffff'
    },
    {
        id: 'techno',
        name: 'Dark Techno',
        label: '⚫️',
        // The Matrix/Club vibe
        imgStyle: {
            filter: 'grayscale(100%) contrast(125%) brightness(80%)',
        },
        overlayStyle: {
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
        },
        containerClass: 'bg-black text-zinc-100',
        buttonColor: '#000000'
    },
    {
        id: 'analog',
        name: 'Analog Film',
        label: '🎞️',
        // Sepia tones, soft blurring, warm overlay
        imgStyle: {
            filter: 'sepia(20%) contrast(90%) brightness(110%)',
        },
        overlayStyle: {
            backgroundColor: '#14532d', // green-900
            mixBlendMode: 'screen',
            opacity: 0.1
        },
        containerClass: 'bg-stone-50 text-stone-800',
        buttonColor: '#14532d'
    },
    {
        id: 'cyberpunk',
        name: 'Cyberpunk Neon',
        label: '🟣',
        // High saturation
        imgStyle: {
            filter: 'contrast(130%) saturate(120%)',
        },
        overlayStyle: {
            backgroundColor: '#701a75', // fuchsia-900
            mixBlendMode: 'soft-light',
            opacity: 0.3
        },
        containerClass: 'bg-zinc-900 text-fuchsia-400',
        buttonColor: '#701a75'
    },
    {
        id: 'golden',
        name: 'Golden Hour',
        label: '🌅',
        // Warm overlay
        imgStyle: {
            filter: 'sepia(40%) contrast(110%)',
        },
        overlayStyle: {
            backgroundColor: '#f97316', // orange-500
            mixBlendMode: 'overlay',
            opacity: 0.2
        },
        containerClass: 'bg-orange-50 text-orange-900',
        buttonColor: '#f97316'
    },
    {
        id: 'vogue',
        name: 'Vogue B&W',
        label: '📸',
        // High fashion editorial look
        imgStyle: {
            filter: 'grayscale(100%) contrast(150%) brightness(110%)',
        },
        overlayStyle: {
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
        },
        containerClass: 'bg-white text-black',
        buttonColor: '#333333'
    },
    {
        id: 'polaroid',
        name: 'Polaroid Fade',
        label: '📷',
        // Washed out vintage
        imgStyle: {
            filter: 'contrast(80%) brightness(120%) saturate(80%)',
        },
        overlayStyle: {
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
        },
        containerClass: 'bg-yellow-50 text-stone-600',
        buttonColor: '#fef3c7'
    },
    {
        id: 'crimson',
        name: 'Crimson Room',
        label: '🔴',
        // Moody red
        imgStyle: {
            filter: 'grayscale(100%) contrast(120%)',
        },
        overlayStyle: {
            backgroundColor: '#b91c1c', // red-700
            mixBlendMode: 'multiply',
            opacity: 0.4
        },
        containerClass: 'bg-red-950 text-red-100',
        buttonColor: '#b91c1c'
    },
    {
        id: 'arctic',
        name: 'Arctic Blue',
        label: '❄️',
        // Cold exclusion
        imgStyle: {
            filter: 'saturate(50%)',
        },
        overlayStyle: {
            backgroundColor: '#164e63', // cyan-900
            mixBlendMode: 'exclusion',
            opacity: 0.2
        },
        containerClass: 'bg-slate-900 text-cyan-50',
        buttonColor: '#164e63'
    },
    {
        id: 'grain',
        name: 'Midnight Grain',
        label: '🌃',
        // High contrast dark
        imgStyle: {
            filter: 'grayscale(80%) contrast(140%)',
        },
        overlayStyle: {
            backgroundColor: 'transparent',
            mixBlendMode: 'normal',
        },
        containerClass: 'bg-neutral-950 text-neutral-400',
        buttonColor: '#171717'
    }
];

export const defaultTheme = themes[0];
