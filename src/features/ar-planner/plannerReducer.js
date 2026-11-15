export const initialPlannerState = {
  roomShape: 'square',
  roomWidth: 10,
  roomDepth: 10,
  roomHeight: 3,
  gridStep: 1,
  floor: { material: 'parquet', color: '#b98750' },
  walls: { material: 'wallpaper', color: '#d5cbb9' },
  items: [
    {
      id: 'initial-sofa',
      type: 'sofa',
      position: [-1.5, 0, 0],
      rotation: [0, Math.PI / 2, 0],
      color: '#777e91',
      material: 'fabric',
      size: [1.8, 0.8, 0.9],
    },
  ],
  selectedId: 'initial-sofa',
  nextId: 1,
};

export function plannerReducer(state, action) {
  switch (action.type) {
    case 'SET_ROOM_SHAPE': {
      const dimensions = {
        square: [10, 10],
        rect: [12, 6],
      };
      const [roomWidth, roomDepth] =
        dimensions[action.payload] || dimensions.square;

      return { ...state, roomShape: action.payload, roomWidth, roomDepth };
    }

    case 'SET_ROOM_DIMENSIONS':
      return {
        ...state,
        roomWidth: Math.max(2, Math.min(30, Number(action.payload.width) || 2)),
        roomDepth: Math.max(2, Math.min(30, Number(action.payload.depth) || 2)),
      };

    case 'SET_ROOM_HEIGHT':
      return {
        ...state,
        roomHeight: Math.max(2, Math.min(6, Number(action.payload) || 3)),
      };

    case 'SET_GRID_STEP':
      return { ...state, gridStep: Number(action.payload) || 1 };

    case 'SET_SURFACE':
      return {
        ...state,
        [action.payload.surface]: {
          material: action.payload.material,
          color: action.payload.color,
        },
      };

    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        selectedId: action.payload.id,
        nextId: state.nextId + 1,
      };

    case 'SELECT_ITEM':
      return { ...state, selectedId: action.payload };

    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, ...action.payload.updates }
            : item
        ),
      };

    case 'REMOVE_SELECTED':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== state.selectedId),
        selectedId: null,
      };

    case 'LOAD_PROJECT':
      return {
        ...initialPlannerState,
        ...action.payload,
        floor: action.payload?.floor || initialPlannerState.floor,
        walls: action.payload?.walls || initialPlannerState.walls,
        items: action.payload?.items || [],
      };

    case 'CLEAR_ALL':
      return { ...state, items: [], selectedId: null };

    default:
      return state;
  }
}
