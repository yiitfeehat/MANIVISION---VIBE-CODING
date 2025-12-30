export const worldFilters = [
    { id: 'normal', name: 'Normal', icon: 'Ban', style: { filter: 'none' } },
    { id: 'noir', name: 'Noir', icon: 'CircleDot', style: { filter: 'grayscale(100%) contrast(120%) brightness(90%)' } },
    { id: 'analog', name: 'Analog', icon: 'Film', style: { filter: 'sepia(20%) contrast(90%) brightness(110%) hue-rotate(-10deg) saturate(85%)' } },
    { id: 'cyber', name: 'Cyber', icon: 'Zap', style: { filter: 'saturate(150%) contrast(110%) hue-rotate(180deg) brightness(110%)' } },
    { id: 'sepia', name: 'Sepia', icon: 'Coffee', style: { filter: 'sepia(80%) contrast(90%) brightness(95%)' } },
    { id: 'vogue', name: 'Vogue', icon: 'Sparkles', style: { filter: 'contrast(115%) saturate(80%) brightness(105%)' } },
    { id: 'ethereal', name: 'Ethereal', icon: 'Wind', style: { filter: 'brightness(115%) contrast(90%) saturate(110%) blur(0.5px)' } },
    { id: 'grunge', name: 'Grunge', icon: 'Scissors', style: { filter: 'contrast(150%) saturate(0%) brightness(80%) sepia(50%)' } },
    { id: 'cinema', name: 'Cinema', icon: 'Clapperboard', style: { filter: 'contrast(110%) saturate(120%) brightness(90%) hue-rotate(-10deg)' } },
    { id: 'delta', name: 'Delta', icon: 'Triangle', style: { filter: 'contrast(140%) saturate(0%) invert(10%)' } },
];

export const worldBackgrounds = [
    // 1. Aura Glow
    {
        id: 'aura',
        name: 'Aura Glow',
        style: {
            background: 'linear-gradient(135deg, #FF9A9E 0%, #FECFEF 50%, #A18CD1 100%)',
            boxShadow: 'inset 0 0 100px rgba(255, 255, 255, 0.3)'
        }
    },
    // 2. Retro Grain
    {
        id: 'retro-grain',
        name: 'Retro Grain',
        style: {
            backgroundColor: '#FFDEE9',
            backgroundImage: `
                linear-gradient(0deg, #FFDEE9 0%, #B5FFFC 100%),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.15'/%3E%3C/svg%3E")
            `,
            backgroundBlendMode: 'overlay'
        }
    },
    // 3. Deep Space
    {
        id: 'deep-space',
        name: 'Deep Space',
        style: {
            backgroundColor: '#050505',
            backgroundImage: `radial-gradient(circle at 50% 50%, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)`, // Fallback/Basis or use subtle nebula
            background: 'radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%)'
        }
    },
    // 4. Holographic
    {
        id: 'holographic',
        name: 'Holographic',
        style: {
            background: 'linear-gradient(45deg, #8EC5FC 0%, #E0C3FC 100%)',
            position: 'relative',
        }
    },
    // 5. Midnight Neon
    {
        id: 'midnight-neon',
        name: 'Midnight Neon',
        style: {
            backgroundColor: '#0f0c29',
            background: 'linear-gradient(to right, #0f0c29, #302b63, #24243e)'
        }
    },
    // 6. Soft Concrete
    {
        id: 'soft-concrete',
        name: 'Soft Concrete',
        style: {
            backgroundColor: '#D7D2CC',
            backgroundImage: `
                linear-gradient(to right, #D7D2CC 0%, #304352 100%),
                url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.2'/%3E%3C/svg%3E")
            `,
            backgroundBlendMode: 'multiply'
        }
    },
    // 7. Golden Hour
    {
        id: 'golden-hour',
        name: 'Golden Hour',
        style: {
            background: 'linear-gradient(120deg, #f6d365 0%, #fda085 100%)'
        }
    },
    // 8. Mystic Forest
    {
        id: 'mystic-forest',
        name: 'Mystic Forest',
        style: {
            background: 'linear-gradient(to top, #093028 0%, #237A57 100%)'
        }
    },
    // 9. Cyber Grid
    {
        id: 'cyber-grid',
        name: 'Cyber Grid',
        style: {
            backgroundColor: '#000000',
            backgroundImage: `
                linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(0, 255, 255, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
        }
    },
    // 10. Abstract Fluid
    {
        id: 'abstract-fluid',
        name: 'Abstract Fluid',
        style: {
            background: 'linear-gradient(45deg, #85FFBD 0%, #FFFB7D 100%)'
        }
    },
];
