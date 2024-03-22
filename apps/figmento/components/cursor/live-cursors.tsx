import { useOthers } from '@figmento/liveblocks.config';
import React from 'react';
import { Cursor } from './cursor';
import { COLORS } from '@figmento/constants';

const LiveCursors = () => {
  const others = useOthers();

  return others.map(({ connectionId, presence }) => {
    if (presence == null || !presence?.cursor) {
      return null;
    }

    return (
      <Cursor
        key={connectionId}
        color={COLORS[Number(connectionId) % COLORS.length]}
        x={presence.cursor.x}
        y={presence.cursor.y}
        message={presence.message}
      />
    );
  });
};

export { LiveCursors };