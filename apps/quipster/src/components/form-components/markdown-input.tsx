import { useFormContext, useWatch } from 'react-hook-form';
import { Input, Label, Textarea } from 'dread-ui';
import ReactMarkdown from 'react-markdown';
import React from 'react';
import { SingleFormField } from './single-form-field';

type MarkdownInputProps = {
  value: string;
  isEditing: boolean;
  fieldName: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inputComponent?: React.ComponentType<any>;
  inputProps?: React.ComponentProps<typeof Input | typeof Textarea>;
};

const MarkdownInput = ({
  value,
  isEditing,
  fieldName,
  label,
  inputComponent = Input,
  inputProps = {},
}: MarkdownInputProps) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { control } = useFormContext<any>();
  const fieldValue = useWatch({
    control,
    name: fieldName,
    defaultValue: isEditing ? value : '',
  });

  return (
    <>
      {isEditing ? (
        <>
          <Label>Preview</Label>
          <ReactMarkdown>
            {fieldValue || `No ${label.toLowerCase()} provided`}
          </ReactMarkdown>
          <SingleFormField
            value={value}
            isEditing={isEditing}
            fieldName={fieldName}
            label={label}
            inputComponent={inputComponent}
            inputProps={inputProps}
          />
        </>
      ) : (
        <ReactMarkdown>
          {value || `No ${label.toLowerCase()} provided`}
        </ReactMarkdown>
      )}
    </>
  );
};

export { MarkdownInput };
