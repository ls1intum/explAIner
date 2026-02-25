'use client';

import { useState, useEffect } from 'react';
import { ChevronRightIcon } from '@radix-ui/react-icons';
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
  const practiceBlock = block.type === 'Practice' ? block.practiceBlock : undefined;
  const [submitAnswer, { isLoading: isSubmittingAnswer }] =
    useSubmitAnswerMutation();

  // Initialize state from persisted data if available
  const [selectedOptions, setSelectedOptions] = useState<number[]>(
    practiceBlock?.studentAnswerOptionIndices || []
  );
  const [isChecked, setIsChecked] = useState(
    practiceBlock?.studentAnswerIsCorrect !== null
  );

  // Sync local state when block or practiceBlock data changes
  useEffect(() => {
    if (practiceBlock) {
      setSelectedOptions(practiceBlock.studentAnswerOptionIndices || []);
      setIsChecked(practiceBlock.studentAnswerIsCorrect !== null);
    }
  }, [block.id, practiceBlock]);

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
      // Submit answer to backend (stores for analytics); Block tag invalidated, getBlock refetches
      await submitAnswer({
        sessionId,
        orderIndex: String(block.orderIndex),
        studentAnswerOptionIndices: selectedOptions,
      });

      setIsChecked(true);
      // Block tag invalidated by submitAnswer; getBlock refetches and parent passes updated block
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

        {/* Check Answer Button (outside card). Shadow on wrapper to avoid Safari box-shadow + gradient glitch. */}
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

        {/* Continue Button (outside card). Shadow on wrapper to avoid Safari box-shadow + gradient glitch. */}
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
