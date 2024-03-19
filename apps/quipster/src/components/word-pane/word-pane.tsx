import { useEffect, useState } from 'react';
import { useApp } from '../../providers/app-provider';
import { FaEdit } from 'react-icons/fa';
import { Button, Form, Textarea } from 'dread-ui';
import { useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { ExamplesSection } from './examples-section';
import { MarkdownInput } from '../form-components/markdown-input';
import { SectionTile } from './section-tile';
import { SingleFormField } from '../form-components/single-form-field';
import { DefinitionSection } from './definition-section';

export type Example = {
  id: string;
  example: string;
  source: string;
  sourceUrl: string;
};

export type WordFormData = {
  definition: string;
  partOfSpeech: string;
  blurb: string;
  background: string;
  examples: Example[];
};

const DEFAULT_FORM_VALUES: WordFormData = {
  definition: '',
  partOfSpeech: '',
  blurb: '',
  background: '',
  examples: [],
};

const WordPane = () => {
  const { words, saveWord } = useApp();
  const { word: wordId } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [wordInfo, setWordInfo] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [tempExamples, setTempExamples] = useState<Example[]>([]);

  const form = useForm<WordFormData>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  useEffect(() => {
    const _word = words.find((word) => word.word === wordId) || {};
    setWordInfo(_word);
    form.reset({
      ...DEFAULT_FORM_VALUES,
      ..._word,
    });
    setTempExamples([]);
  }, [wordId, words, form]);

  const handleSubmit = (data: WordFormData) => {
    saveWord({ ...wordInfo, ...data });
    setIsEditing(false);
  };

  useEffect(() => {
    if (!isEditing) {
      form.reset({
        ...DEFAULT_FORM_VALUES,
        ...wordInfo,
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
        <SectionTile isEditing={isEditing} label='Definition'>
          <DefinitionSection wordInfo={wordInfo} isEditing={isEditing} />
        </SectionTile>
        <SectionTile isEditing={isEditing} label='Blurb'>
          <MarkdownInput
            value={wordInfo.blurb}
            isEditing={isEditing}
            fieldName='blurb'
            label='Blurb'
            inputComponent={Textarea}
            inputProps={{ rows: 2 }}
          />
        </SectionTile>
        <SectionTile isEditing={isEditing} label='Background'>
          <MarkdownInput
            value={wordInfo.background}
            isEditing={isEditing}
            fieldName='background'
            label='Background'
            inputComponent={Textarea}
            inputProps={{ rows: 4 }}
          />
        </SectionTile>
        <ExamplesSection isEditing={isEditing} />
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
