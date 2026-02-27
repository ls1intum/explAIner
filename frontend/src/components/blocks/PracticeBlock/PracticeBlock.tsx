'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useSubmitAnswerMutation } from '@/store/api/blocksApi';
import { useAppDispatch } from '@/store/hooks';
import { addToast } from '@/store/slices/uiSlice';
import type { Block } from '@/types/domain/block.types';
import { BLOCK_TYPE } from '@/types/domain/enums';
import AnswerOption from './AnswerOption';

interface PracticeBlockProps {
  block: Block;
  sessionId: string;
  onContinue: () => void;
}

/** PracticeBlock component */
export default function PracticeBlock({
  block,
  sessionId,
  onContinue,
}: PracticeBlockProps) {

  // Redux hooks
  const dispatch = useAppDispatch();
  const [submitAnswer, { isLoading: isSubmittingAnswer }] = useSubmitAnswerMutation();

  // Extract practice block data
  const practiceBlock = block.type === BLOCK_TYPE.PRACTICE ? block.practiceBlock : undefined;
  const [selectedOptions, setSelectedOptions] = useState<number[]>(practiceBlock?.studentAnswerOptionIndices || []);
  const [isChecked, setIsChecked] = useState(practiceBlock?.studentAnswerIsCorrect !== null);

  // Sync local state (e.g. after block refetch post-submit or when navigating blocks)
  useEffect(() => {
    if (practiceBlock) {
      setSelectedOptions(practiceBlock.studentAnswerOptionIndices || []);
      setIsChecked(practiceBlock.studentAnswerIsCorrect !== null);
    }
  }, [block.id, practiceBlock]);

  if (!practiceBlock) return null;

  // Extract practice block data
  const { question, answerOptions, correctAnswerOptionIndices } = practiceBlock;

  // Single answer option is clicked (selected/deselected)
  const handleOptionToggle = (index: number) => {
    if (isChecked) return; // Prevent changes after checking
    setSelectedOptions((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // "Check Answer" button is clicked
  const handleCheckAnswer = async () => {
    if (!practiceBlock) return;
    try {
      await submitAnswer({
        sessionId,
        orderIndex: String(block.orderIndex),
        studentAnswerOptionIndices: selectedOptions,
      });
      setIsChecked(true);
    } catch (error) {
      dispatch(addToast({ message: 'Could not submit answer. Please try again.', type: 'error' }));
    }
  };

  // "Continue" button is clicked
  const handleContinue = () => {
    onContinue();
  };

  // Determine if whole practicequestion is correctly answered (i.e. all selected answer options are correct)
  const isCorrect =
    isChecked &&
    selectedOptions.length === correctAnswerOptionIndices.length &&
    selectedOptions.every((opt) => correctAnswerOptionIndices.includes(opt));

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-4">
        {/* Card */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
          {/* Question */}
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-foreground">
              {question}
            </h3>
            <p className="text-sm text-muted-foreground italic">
              Select all that apply
            </p>
          </div>

          {/* All Answer Options */}
          <div className="space-y-3">
            {answerOptions.map((option, index) => {

              // Determine the state of the answer option
              const isSelected = selectedOptions.includes(index); // whether the answer option is selected by the user
              const isCorrectOption = correctAnswerOptionIndices.includes(index); // whether the answer option is correct 
              const showCorrect = isChecked && isSelected && isCorrectOption; // derive correct answer option
              const showIncorrect = isChecked && isSelected && !isCorrectOption; // derive incorrect answer option
              const showMissed = isChecked && !isSelected && isCorrectOption; // derive missed answer option

              return (
                /* Answer Option */
                <AnswerOption
                  key={index}
                  label={String.fromCharCode(65 + index)} // A, B, C, D
                  text={option}
                  isSelected={isSelected}
                  isChecked={isChecked}
                  showCorrect={showCorrect}
                  showIncorrect={showIncorrect}
                  showMissed={showMissed}
                  onToggle={() => handleOptionToggle(index)}
                />
              );
            })}
          </div>

          {/* Feedback Message after checking the answer */}
          {isChecked && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                isCorrect ? 'bg-success/10' : 'bg-destructive/10'
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isCorrect
                    ? 'bg-transparent border-success'
                    : 'bg-transparent border-destructive'
                }`}
              >
                {isCorrect ? (
                  <svg
                    className="w-4 h-4 text-success"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-4 h-4 text-destructive"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
              </div>
              <p
                className={`font-medium ${
                  isCorrect ? 'text-success' : 'text-destructive'
                }`}
              >
                {isCorrect
                  ? 'Correct! Well done.'
                  : 'Not quite right. Check the correct answer above.'}
              </p>
            </div>
          )}
        </div>

        {/* Check Answer Button */}
        {!isChecked && (
          <div className="flex justify-end">
            <span className="inline-block rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleCheckAnswer}
                disabled={selectedOptions.length === 0 || isSubmittingAnswer}
                className="bg-brand-gradient text-white font-semibold text-base py-3 px-8 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed border-0 appearance-none"
              >
                {isSubmittingAnswer ? 'Checking...' : 'Check Answer'}
              </button>
            </span>
          </div>
        )}

        {/* Continue Button */}
        {isChecked && (
          <div className="flex justify-end">
            <span className="inline-block rounded-xl shadow-lg overflow-hidden">
              <button
                onClick={handleContinue}
                className="bg-success-gradient text-white font-semibold text-base py-3 px-8 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2 border-0 appearance-none"
              >
                <span>Continue</span>
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
