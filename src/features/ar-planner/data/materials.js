// Генератор текстур для підлоги, стін та меблів
function generateTexture(type) {
  if (typeof document === 'undefined') return '';
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const noise = (colorStr, count) => {
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = `rgba(${colorStr}, ${Math.random() * 0.15})`;
      ctx.fillRect(Math.random() * 512, Math.random() * 512, 2, 2);
    }
  };

  if (type === 'tile') {
    ctx.fillStyle = '#f8f9fa';
    ctx.fillRect(0, 0, 512, 512);
    ctx.strokeStyle = '#e9ecef';
    ctx.lineWidth = 4;
    for (let i = 0; i <= 512; i += 128) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
    }
  } else if (type === 'marble') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 512, 0);
      ctx.bezierCurveTo(Math.random() * 512, 200, Math.random() * 512, 300, Math.random() * 512, 512);
      ctx.strokeStyle = `rgba(200, 200, 200, ${Math.random() * 0.3})`;
      ctx.lineWidth = Math.random() * 2 + 1;
      ctx.stroke();
    }
  } else if (type === 'concrete') {
    ctx.fillStyle = '#dee2e6';
    ctx.fillRect(0, 0, 512, 512);
    noise('150, 150, 150', 8000);
  } else if (type === 'wallpaper') {
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(0, 0, 512, 512);
    ctx.fillStyle = '#cbd5e1';
    for (let i = 0; i < 512; i += 64) {
      ctx.fillRect(i, 0, 32, 512);
    }
  } else if (type === 'paint') {
    ctx.fillStyle = '#ffedd5';
    ctx.fillRect(0, 0, 512, 512);
  } else if (type === 'parquet') {
    ctx.fillStyle = '#f5e6d3';
    ctx.fillRect(0, 0, 512, 512);
    const plankW = 32;
    const plankH = 128;
    for (let y = -plankH; y < 512 + plankH; y += plankH / 2) {
      for (let x = -plankW; x < 512 + plankW; x += plankW * 2) {
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = Math.random() > 0.5 ? '#e3c298' : '#d4a373';
        ctx.fillRect(0, 0, plankW, plankH); ctx.strokeStyle = '#b0855b'; ctx.strokeRect(0, 0, plankW, plankH); ctx.restore();
        ctx.save(); ctx.translate(x + plankW, y + plankW); ctx.rotate(Math.PI / 4);
        ctx.fillStyle = Math.random() > 0.5 ? '#d4a373' : '#e3c298';
        ctx.fillRect(0, 0, plankW, plankH); ctx.strokeStyle = '#b0855b'; ctx.strokeRect(0, 0, plankW, plankH); ctx.restore();
      }
    }
  } 
  // --- ТЕКСТУРИ ДЛЯ МЕБЛІВ (БРУТАЛІЗМ) ---
  else if (type === 'furnitureConcrete') {
    ctx.fillStyle = '#8a8d91';
    ctx.fillRect(0, 0, 512, 512);
    noise('50, 50, 50', 15000);
    noise('200, 200, 200', 5000);
  } else if (type === 'furnitureWood') {
    ctx.fillStyle = '#2b1a13';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 512; i += 8) {
      ctx.fillStyle = `rgba(0, 0, 0, ${Math.random() * 0.3})`;
      ctx.fillRect(0, i + Math.random() * 4, 512, 2);
    }
    noise('100, 60, 30', 2000);
  } else if (type === 'furnitureMetal') {
    ctx.fillStyle = '#555555';
    ctx.fillRect(0, 0, 512, 512);
    for (let i = 0; i < 512; i += 4) {
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.05})`;
      ctx.fillRect(0, i, 512, 1);
    }
  } else if (type === 'furnitureLeather') {
    ctx.fillStyle = '#3b2a22';
    ctx.fillRect(0, 0, 512, 512);
    noise('20, 10, 5', 30000);
  }

  return canvas.toDataURL();
}

export const MATERIALS = {
  // Підлога
  wood: { name: 'Дерево (дошка)', url: 'https://threejs.org/examples/textures/hardwood2_diffuse.jpg', roughness: 0.7, metalness: 0.1, scale: 2 },
  parquet: { name: 'Паркет (ялинка)', url: generateTexture('parquet'), roughness: 0.6, metalness: 0.1, scale: 2 },
  tile: { name: 'Керамічна плитка', url: generateTexture('tile'), roughness: 0.2, metalness: 0.1, scale: 2 },
  marble: { name: 'Мармур', url: generateTexture('marble'), roughness: 0.1, metalness: 0.1, scale: 2 },
  concrete: { name: 'Бетон', url: generateTexture('concrete'), roughness: 0.9, metalness: 0, scale: 2 },

  // Стіни
  brick: { name: 'Цегла', url: 'https://threejs.org/examples/textures/brick_diffuse.jpg', roughness: 0.9, metalness: 0, scale: 2 },
  wallpaper: { name: 'Шпалери', url: generateTexture('wallpaper'), roughness: 1, metalness: 0, scale: 2 },
  paint: { name: 'Фарба', url: generateTexture('paint'), roughness: 1, metalness: 0, scale: 2 },

  // Меблі (Брутальні матеріали)
  concreteMat: { name: 'Бетон', url: generateTexture('furnitureConcrete'), roughness: 0.8, metalness: 0.1, color: '#ffffff' },
  woodMat: { name: 'Темне дерево', url: generateTexture('furnitureWood'), roughness: 0.6, metalness: 0.1, color: '#ffffff' },
  metalMat: { name: 'Метал', url: generateTexture('furnitureMetal'), roughness: 0.3, metalness: 0.8, color: '#ffffff' },
  leatherMat: { name: 'Шкіра', url: generateTexture('furnitureLeather'), roughness: 0.5, metalness: 0.1, color: '#ffffff' },
};
