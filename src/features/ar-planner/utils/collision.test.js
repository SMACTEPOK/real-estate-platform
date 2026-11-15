import { describe, it, expect } from 'vitest';
import { checkCollision, checkRoomBounds } from './collision';

describe('checkCollision (перевірка зіткнення об\'єктів)', () => {
  const itemA = { position: [0, 0, 0], size: [2, 1, 2], rotation: [0, 0, 0] };

  it('повертає true, якщо об\'єкти перетинаються', () => {
    const itemB = { position: [1, 0, 1], size: [2, 1, 2], rotation: [0, 0, 0] };
    expect(checkCollision(itemA, itemB)).toBe(true);
  });

  it('повертає false, якщо об\'єкти далеко один від одного', () => {
    const itemC = { position: [5, 0, 5], size: [2, 1, 2], rotation: [0, 0, 0] };
    expect(checkCollision(itemA, itemC)).toBe(false);
  });

  it('враховує поворот на 90 градусів', () => {
    // Без повороту: об'єкт займає X[-0.5, 0.5], Z[0, 3]. Він перетинається з itemA (X[-1,1], Z[-1,1]).
    // З поворотом на 90°: об'єкт займає X[-1.5, 1.5], Z[1, 2]. Він лише торкається itemA по Z=1, тому перетину немає.
    const noRot = { position: [0, 0, 1.5], size: [1, 1, 3], rotation: [0, 0, 0] };
    const rotated = { position: [0, 0, 1.5], size: [1, 1, 3], rotation: [0, Math.PI / 2, 0] };
    
    expect(checkCollision(itemA, noRot)).toBe(true);
    expect(checkCollision(itemA, rotated)).toBe(false);
  });
});

describe('checkRoomBounds (перевірка меж кімнати)', () => {
  const roomWidth = 10;
  const roomDepth = 10;

  it('дозволяє об\'єкт у центрі кімнати', () => {
    const item = { position: [0, 0, 0], size: [2, 1, 2], rotation: [0, 0, 0] };
    expect(checkRoomBounds(item, roomWidth, roomDepth)).toBe(true);
  });

  it('забороняє об\'єкт, що виходить за стіну', () => {
    const item = { position: [5, 0, 0], size: [2, 1, 2], rotation: [0, 0, 0] };
    expect(checkRoomBounds(item, roomWidth, roomDepth)).toBe(false);
  });

  it('дозволяє об\'єкт, що стоїть впритул до стіни (з урахуванням відступу 0.05)', () => {
    // Половина кімнати = 5м. Половина об'єкта = 1м. Відступ = 0.05м. Ліміт = 5 - 1 - 0.05 = 3.95
    // Ставимо об'єкт рівно на 3.95, щоб він стояв впритул
    const item = { position: [3.95, 0, 0], size: [2, 1, 2], rotation: [0, 0, 0] };
    expect(checkRoomBounds(item, roomWidth, roomDepth)).toBe(true);
  });

  it('забороняє об\'єкт, що перетинає стіну навіть на 1 см', () => {
    // 3.96 > 3.95, тому об'єкт вважається таким, що вийшов за межі
    const item = { position: [3.96, 0, 0], size: [2, 1, 2], rotation: [0, 0, 0] };
    expect(checkRoomBounds(item, roomWidth, roomDepth)).toBe(false);
  });
});
