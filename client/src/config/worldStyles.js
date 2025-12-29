export const worldFilters = [
    { id: 'noir', name: 'Noir', class: 'filter-noir', style: { filter: 'grayscale(100%) contrast(120%) brightness(90%)' } },
    { id: 'analog', name: 'Analog', class: 'filter-analog', style: { filter: 'sepia(20%) contrast(90%) brightness(110%) hue-rotate(-10deg) saturate(85%)' } },
    { id: 'cyber', name: 'Cyber', class: 'filter-cyber', style: { filter: 'saturate(150%) contrast(110%) hue-rotate(180deg) brightness(110%)' } },
    { id: 'sepia', name: 'Sepia Dream', class: 'filter-sepia', style: { filter: 'sepia(80%) contrast(90%) brightness(95%)' } },
    { id: 'vogue', name: 'Vogue', class: 'filter-vogue', style: { filter: 'contrast(115%) saturate(80%) brightness(105%)' } },
    { id: 'ethereal', name: 'Ethereal', class: 'filter-ethereal', style: { filter: 'brightness(115%) contrast(90%) saturate(110%) blur(0.5px)' } },
    { id: 'grunge', name: 'Grunge', class: 'filter-grunge', style: { filter: 'contrast(150%) saturate(0%) brightness(80%) sepia(50%)' } },
    { id: 'pastel', name: 'Pastel', class: 'filter-pastel', style: { filter: 'contrast(90%) brightness(110%) saturate(90%) sepia(10%)' } },
    { id: 'cinema', name: 'Cinema', class: 'filter-cinema', style: { filter: 'contrast(110%) saturate(120%) brightness(90%) hue-rotate(-10deg)' } },
    { id: 'bold', name: 'Bold', class: 'filter-bold', style: { filter: 'contrast(130%) saturate(150%) brightness(100%)' } },
];

export const worldBackgrounds = [
    { id: 'pure', name: 'Pure White', style: { background: '#ffffff' } },
    { id: 'dot-grid', name: 'Dot Grid', style: { backgroundColor: '#f0f0f0', backgroundImage: 'radial-gradient(#ccc 1px, transparent 1px)', backgroundSize: '20px 20px' } },
    { id: 'paper', name: 'Paper Texture', style: { backgroundColor: '#fdfbf7', backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.08'/%3E%3C/svg%3E")` } },
    { id: 'peach', name: 'Soft Peach', style: { background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)' } }, // Placeholder for peach, actually faint gray, let's fix
    { id: 'peach-real', name: 'Peach Sunset', style: { background: 'linear-gradient(to top, #fad0c4 0%, #ffd1ff 100%)' } },
    { id: 'midnight', name: 'Midnight Grain', style: { backgroundColor: '#1a1a1a', backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")` } },
    { id: 'holographic', name: 'Holographic', style: { background: 'linear-gradient(45deg, #ff9a9e 0%, #fad0c4 99%, #fad0c4 100%)' } }, // Simple gradients for now
    { id: 'earth', name: 'Earth Tones', style: { background: 'linear-gradient(to right, #d7d2cc 0%, #304352 100%)' } },
    { id: 'concrete', name: 'Concrete', style: { backgroundColor: '#959595', backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z' fill='%23808080' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E")` } },
    { id: 'ocean', name: 'Deep Ocean', style: { background: 'linear-gradient(to top, #30cfd0 0%, #330867 100%)' } },
    { id: 'lavender', name: 'Lavender Mist', style: { background: 'linear-gradient(to top, #cfd9df 0%, #e2ebf0 100%)' } },
];
