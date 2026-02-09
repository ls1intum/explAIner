'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import { useAppDispatch } from '@/store/hooks';
import { updatePracticeBlockAnswer } from '@/store/slices/sessionSlice';
import { useSubmitAnswerMutation } from '@/store/api/blocksApi';
import type { Block } from '@/types/domain';
import AnswerOption from './AnswerOption';

interface PracticeBlockProps {
  block: Block;
  sessionId: string;
  onContinue: () => void;
}

export default function PracticeBlock({
  block,
  sessionId,
  onContinue,
}: PracticeBlockProps) {
  const dispatch = useAppDispatch();
  const practiceBlock = block.practiceBlock;
  const [submitAnswer, { isLoading: isSubmittingAnswer }] =
    useSubmitAnswerMutation();

  // Initialize state from persisted data if available
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    practiceBlock?.studentAnswerOptionIndices || []
  );
  const [isChecked, setIsChecked] = useState(
    practiceBlock?.studentAnswerIsCorrect !== null
  );

  // Reset state when block ID changes (not when practiceBlock data updates)
  useEffect(() => {
    if (practiceBlock) {
      setSelectedOptions(practiceBlock.studentAnswerOptionIndices || []);
      setIsChecked(practiceBlock.studentAnswerIsCorrect !== null);
    }
  }, [block.id]); // Only depend on block.id, not practiceBlock

  if (!practiceBlock) return null;

  const { question, answerOptions, correctAnswerOptionIndices } = practiceBlock;

  // Handle option selection
  const handleOptionToggle = (index: number) => {
    if (isChecked) return; // Prevent changes after checking

    setSelectedOptions((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  // Check answer
  const handleCheckAnswer = async () => {
    if (!practiceBlock) return;

    try {
      // Calculate correctness client-side
      const { correctAnswerOptionIndices } = practiceBlock;
      const isCorrect =
        selectedOptions.length === correctAnswerOptionIndices.length &&
        selectedOptions.every((opt) => correctAnswerOptionIndices.includes(opt));

      // Submit answer to backend (stores for analytics, returns 204)
      await submitAnswer({
        sessionId,
        orderIndex: block.orderIndex,
        student_answer_option_indices: selectedOptions,
      });

      setIsChecked(true);

      // Update Redux store with calculated correctness
      dispatch(
        updatePracticeBlockAnswer({
          blockId: block.id,
          studentAnswerOptionIndices: selectedOptions,
          studentAnswerIsCorrect: isCorrect,
        })
      );
    } catch (error) {
      console.error('Failed to submit answer:', error);
      // Handle error (could show toast notification)
    }
  };

  // Handle continue - just move to next block
  const handleContinue = () => {
    onContinue();
  };

  // Determine if answer is correct
  const isCorrect =
    isChecked &&
    selectedOptions.length === correctAnswerOptionIndices.length &&
    selectedOptions.every((opt) => correctAnswerOptionIndices.includes(opt));

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-[80%] space-y-4">
        {/* Card Container */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-6">
          {/* Question Section (no card wrapper) */}
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-foreground">
              {question}
            </h3>
            <p className="text-sm text-muted-foreground italic">
              Select all that apply
            </p>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {answerOptions.map((option, index) => {
              const isSelected = selectedOptions.includes(index);
              const isCorrectOption = correctAnswerOptionIndices.includes(index);
              const showCorrect = isChecked && isSelected && isCorrectOption;
              const showIncorrect = isChecked && isSelected && !isCorrectOption;
              const showMissed = isChecked && !isSelected && isCorrectOption;

              return (
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

          {/* Feedback */}
          {isChecked && (
            <div
              className={`p-4 rounded-xl flex items-center gap-3 ${
                isCorrect
                  ? 'bg-[#10b981]/10'
                  : 'bg-[#ef4444]/10'
              }`}
            >
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isCorrect 
                    ? 'bg-transparent border-[#10b981]' 
                    : 'bg-transparent border-[#ef4444]'
                }`}
              >
                {isCorrect ? (
                  <svg
                    className="w-4 h-4 text-[#10b981]"
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
                    className="w-4 h-4 text-[#ef4444]"
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
                  isCorrect ? 'text-[#10b981]' : 'text-[#ef4444]'
                }`}
              >
                {isCorrect
                  ? 'Correct! Well done.'
                  : 'Not quite right. Check the correct answer above.'}
              </p>
            </div>
          )}
        </div>

        {/* Check Answer Button (outside card, blue-purple gradient) */}
        {!isChecked && (
          <div className="flex justify-end">
            <button
              onClick={handleCheckAnswer}
              disabled={selectedOptions.length === 0 || isSubmittingAnswer}
              className="bg-brand-gradient text-white font-semibold text-base py-3 px-8 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              {isSubmittingAnswer ? 'Checking...' : 'Check Answer'}
            </button>
          </div>
        )}

        {/* Continue Button (outside card, green gradient - same as inform block) */}
        {isChecked && (
          <div className="flex justify-end">
            <button
              onClick={handleContinue}
              className="bg-success-gradient text-white font-semibold text-base py-3 px-8 rounded-xl hover:opacity-90 transition-opacity shadow-lg flex items-center gap-2"
            >
              <span>Continue</span>
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
