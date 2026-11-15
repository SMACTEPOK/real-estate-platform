import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import VirtualTourViewer from './VirtualTourViewer';

describe('VirtualTourViewer', () => {
  it('викликає метод mount адаптера при рендері', () => {
    const mockAdapter = {
      mount: vi.fn(),
      destroy: vi.fn(),
    };

    render(<VirtualTourViewer src="test-url.jpg" adapter={mockAdapter} />);
    
    expect(mockAdapter.mount).toHaveBeenCalledTimes(1);
    expect(mockAdapter.mount).toHaveBeenCalledWith(expect.any(HTMLDivElement), 'test-url.jpg');
  });
});
