export function checkCollision(itemA, itemB) {
  const getBounds = (item) => {
    const size = Array.isArray(item.size) ? item.size : [1, 1, 1];
    const rot = Array.isArray(item.rotation) ? item.rotation : [0, 0, 0];
    const pos = Array.isArray(item.position) ? item.position : [0, 0, 0];
    
    // Враховуємо поворот (спрощено: якщо повернуто на 90/270 градусів, міняємо місцями ширину і глибину)
    const isRotated = Math.abs(rot[1] % Math.PI) > 0.1;
    const w = isRotated ? size[2] : size[0];
    const d = isRotated ? size[0] : size[2];
    
    return {
      minX: pos[0] - w / 2, maxX: pos[0] + w / 2,
      minZ: pos[2] - d / 2, maxZ: pos[2] + d / 2,
    };
  };

  const a = getBounds(itemA);
  const b = getBounds(itemB);

  return a.minX < b.maxX && a.maxX > b.minX && a.minZ < b.maxZ && a.maxZ > b.minZ;
}

export function checkRoomBounds(item, roomWidth = 10, roomDepth = 10) {
  // Запобігаємо помилкам, якщо прийде рядок замість числа
  const width = Number(roomWidth) || 10;
  const depth = Number(roomDepth) || 10;

  const size = Array.isArray(item.size) ? item.size : [1, 1, 1];
  const rot = Array.isArray(item.rotation) ? item.rotation : [0, 0, 0];
  const pos = Array.isArray(item.position) ? item.position : [0, 0, 0];
  
  const isRotated = Math.abs(rot[1] % Math.PI) > 0.1;
  const w = isRotated ? size[2] : size[0];
  const d = isRotated ? size[0] : size[2];
  
  const halfW = w / 2;
  const halfD = d / 2;
  
  // Додаємо відступ 0.05, щоб меблі могли стояти впритул до стіни, але не проходили крізь неї
  const limitX = (width / 2) - 0.05;
  const limitZ = (depth / 2) - 0.05;

  if (pos[0] - halfW < -limitX || pos[0] + halfW > limitX) return false;
  if (pos[2] - halfD < -limitZ || pos[2] + halfD > limitZ) return false;
  
  return true;
}
