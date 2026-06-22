"use client";

import { useState } from "react";

interface Position {
  id: number;
  title: string;
  description: string;
}

interface Aspirant {
  id: number;
  name: string;
  position_id: number;
  cleared: number;
  position_title: string;
}

interface BallotWizardProps {
  positions: Position[];
  aspirants: Aspirant[];
  onVote: (votes: { position_id: number; aspirant_id: number }[]) => Promise<string | null>;
  onCancel: () => void;
}

export default function BallotWizard({ positions, aspirants, onVote, onCancel }: BallotWizardProps) {
  const validPositions = positions.filter((pos) =>
    aspirants.some((a) => a.position_id === pos.id && a.cleared)
  );
  const [step, setStep] = useState(0);
  const [selectedVotes, setSelectedVotes] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState("");

  const currentPos = validPositions[step];

  const handleSelect = (aspirantId: number) => {
    setSelectedVotes((prev) => ({ ...prev, [currentPos.id]: aspirantId }));
  };

  const handleSkip = () => {
    const next = { ...selectedVotes };
    delete next[currentPos.id];
    setSelectedVotes(next);
    if (step < validPositions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(validPositions.length + 1);
    }
  };

  const handleNext = () => {
    if (!selectedVotes[currentPos.id]) {
      setMsg("Please select a candidate or skip this position.");
      return;
    }
    setMsg("");
    if (step < validPositions.length - 1) {
      setStep(step + 1);
    } else {
      setStep(validPositions.length + 1);
    }
  };

  const handleBack = () => {
    setMsg("");
    if (step === validPositions.length + 1) {
      setStep(validPositions.length - 1);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setMsg("");
    const votes = Object.entries(selectedVotes).map(
      ([positionId, aspirantId]) => ({
        position_id: parseInt(positionId),
        aspirant_id: aspirantId,
      })
    );
    const error = await onVote(votes);
    if (error) {
      setMsg(error);
      setSubmitting(false);
    }
  };

  if (validPositions.length === 0) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-sm text-yellow-700">
        No candidates available for any position yet.
      </div>
    );
  }

  const isReview = step === validPositions.length + 1;

  const progressPercent = isReview
    ? 100
    : ((step + 1) / (validPositions.length + 1)) * 100;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
          <span>
            {isReview ? "Review" : `Position ${step + 1} of ${validPositions.length}`}
          </span>
          <span>{isReview ? "100%" : `${Math.round(((step + 1) / (validPositions.length + 1)) * 100)}%`}</span>
        </div>
        <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-brand-blue transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {msg && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm ${
            msg.includes("successfully")
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {msg}
        </div>
      )}

      {isReview ? (
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-4">Review Your Ballot</h3>
          <div className="space-y-3 mb-6">
            {validPositions.map((pos) => {
              const selectedId = selectedVotes[pos.id];
              const aspirant = aspirants.find(
                (a) => a.id === selectedId && a.position_id === pos.id
              );
              return (
                <div key={pos.id} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-600">{pos.title}</span>
                  <span className="text-sm font-semibold text-brand-blue">
                    {aspirant ? aspirant.name : "Skipped"}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="btn-ghost px-4 py-2 text-sm"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-primary flex-1"
            >
              {submitting ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting...
                </span>
              ) : (
                "Confirm & Submit Votes"
              )}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 rounded-lg border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-lg font-bold text-gray-800">{currentPos.title}</h3>
              <span className="text-xs text-gray-400">
                {step + 1} of {validPositions.length}
              </span>
            </div>
            {currentPos.description && (
              <p className="text-xs text-gray-500 mb-4">{currentPos.description}</p>
            )}
            <div className="space-y-2">
              {aspirants
                .filter((a) => a.position_id === currentPos.id && a.cleared)
                .map((c) => (
                  <label
                    key={c.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all ${
                      selectedVotes[currentPos.id] === c.id
                        ? "border-brand-blue bg-brand-blue/5 ring-1 ring-brand-blue/20"
                        : "border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`pos_${currentPos.id}`}
                      value={c.id}
                      checked={selectedVotes[currentPos.id] === c.id}
                      onChange={() => handleSelect(c.id)}
                      className="h-4 w-4 text-brand-blue focus:ring-brand-blue"
                    />
                    <div>
                      <span className="text-sm font-medium">{c.name}</span>
                    </div>
                  </label>
                ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {step > 0 && (
                <button
                  onClick={handleBack}
                  className="btn-ghost px-4 py-2 text-sm"
                >
                  Back
                </button>
              )}
              <button
                onClick={onCancel}
                className="btn-ghost px-4 py-2 text-sm text-gray-400"
              >
                Cancel
              </button>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSkip}
                className="btn-ghost px-4 py-2 text-sm text-gray-500"
              >
                Skip
              </button>
              <button
                onClick={handleNext}
                className="btn-primary"
              >
                {step < validPositions.length - 1 ? "Next" : "Review"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
