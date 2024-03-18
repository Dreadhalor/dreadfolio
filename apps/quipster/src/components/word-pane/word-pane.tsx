import { useEffect, useState } from 'react';
import { useApp } from '../../providers/app-provider';
import { FaEdit } from 'react-icons/fa';
import { Button, Form } from 'dread-ui';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { DefinitionTile } from './definition-tile';
import { ExamplesSection } from './examples-section';

export type Example = {
  id: string;
  example: string;
  source: string;
  sourceUrl: string;
};

export type WordFormData = {
  definition: string;
  examples: Example[];
};

const WordPane = () => {
  const { words, saveWord } = useApp();
  const { word: wordId } = useParams();
  const [wordInfo, setWordInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempExamples, setTempExamples] = useState<Example[]>([]);

  const form = useForm<WordFormData>({
    defaultValues: {
      definition: wordInfo.definition || '',
      examples: wordInfo.examples || [],
    },
  });

  useEffect(() => {
    const _word = words.find((word) => word.word === wordId) || {};
    setWordInfo(_word);
    form.reset({
      definition: _word.definition || '',
      examples: _word.examples || [],
    });
    setTempExamples([]);
  }, [wordId, words, form]);

  const handleSubmit = (data: WordFormData) => {
    saveWord({ ...wordInfo, ...data });
    setIsEditing(false);
  };

  const handleAddExample = () => {
    const newExample = { example: '', source: '', sourceUrl: '', id: uuidv4() };
    setTempExamples((prevExamples) => [...prevExamples, newExample]);
    form.setValue('examples', [...form.getValues('examples'), newExample]);
  };

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        definition: wordInfo.definition || '',
        examples: wordInfo.examples || [],
      });
      setTempExamples([]);
    }
  }, [isEditing, wordInfo, form]);

  const handleCancel = () => {
    setIsEditing(false);
    setTempExamples([]);
  };

  return (
    <div className='flex h-fit w-full max-w-screen-lg flex-col gap-4 p-8 pt-4 text-center'>
      <h2 className='flex w-full flex-nowrap items-center justify-center gap-2 text-xl font-bold capitalize'>
        {wordInfo.word}
        <FaEdit
          className='cursor-pointer text-gray-500 hover:text-white'
          onClick={() => setIsEditing(!isEditing)}
        />
      </h2>
      <Form {...form}>
        <DefinitionTile
          definition={wordInfo.definition}
          isEditing={isEditing}
        />
        <ExamplesSection
          wordInfo={wordInfo}
          tempExamples={tempExamples}
          isEditing={isEditing}
          handleAddExample={handleAddExample}
        />
        {isEditing && (
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className='space-y-4'
          >
            <div className='flex flex-nowrap justify-end gap-4'>
              <Button className='rounded-md' type='submit'>
                Save
              </Button>
              <Button
                type='button'
                className='rounded-md'
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </Form>
    </div>
  );
};

export { WordPane };