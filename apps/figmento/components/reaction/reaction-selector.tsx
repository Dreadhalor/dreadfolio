import { useCursorState } from '@figmento/providers/cursor-state-provider';
import React from 'react';

type ReactionButtonProps = {
  reaction: string;
  onSelect: (reaction: string) => void;
};
const ReactionButton = ({ reaction, onSelect }: ReactionButtonProps) => (
  <button
    className='transform select-none p-2 text-xl transition-transform hover:scale-150 focus:scale-150 focus:outline-none'
    onPointerDown={() => onSelect(reaction)}
  >
    {reaction}
  </button>
);

const ReactionSelector = () => {
  const { setReaction } = useCursorState();

  return (
    <div
      className='absolute bottom-20 left-0 right-0 mx-auto w-fit transform rounded-full bg-white px-2'
      onPointerMove={(e) => e.stopPropagation()}
    >
      <ReactionButton reaction='👍' onSelect={setReaction} />
      <ReactionButton reaction='🔥' onSelect={setReaction} />
      <ReactionButton reaction='😍' onSelect={setReaction} />
      <ReactionButton reaction='👀' onSelect={setReaction} />
      <ReactionButton reaction='😱' onSelect={setReaction} />
      <ReactionButton reaction='🙁' onSelect={setReaction} />
    </div>
  );
};

export { ReactionSelector };
