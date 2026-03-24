"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ThreadMessageLike } from "@assistant-ui/react";
import {
  AssistantRuntimeProvider,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import Thread from "@/components/assistant-ui/thread";
import BudgetSlider from "@/components/BudgetSlider";
import LoadingCards from "@/components/LoadingCards";
import PhoneCard from "@/components/PhoneCard";
import OptionChips from "@/components/chat/OptionChips";
import ResultActions from "@/components/chat/ResultActions";
import SummaryCard from "@/components/chat/SummaryCard";
import YoutubeInsightCard from "@/components/chat/YoutubeInsightCard";
import {
  CHAT_STEPS,
  DEFAULT_GUIDED_ANSWERS,
  type ChatStepDefinition,
  BUDGET_OPTIONS,
  getBudgetRangeLabel,
  getNextStepId,
  getPreviousStepId,
  isConditionalStep,
  shouldAskCameraPriority,
  shouldAskGamingPriority,
} from "@/lib/chat-flow";
import {
  applyQuickStartPreset,
  buildSummaryData,
  createChatMessage,
  formatCurrency,
  formatUserReplyLabel,
  getInitialGuidedAnswers,
  mapGuidedAnswersToRequest,
  normalizeSkippedArray,
  normalizeSkipValue,
} from "@/lib/chat-helpers";
import { cn } from "@/lib/utils";
import type {
  ChatFlowMessage,
  ChatOption,
  ChatStepId,
  FormData,
  GuidedAnswers,
  RecommendationResponse,
  YoutubeInsightResponse,
} from "@/types";

interface GuidedChatProps {
  loading: boolean;
  results: RecommendationResponse | null;
  error: string | null;
  onSubmitFinal: (data: FormData) => Promise<void> | void;
  onStartOver: () => void;
  onFetchYoutubeInsights?: (
    phoneNames: string[]
  ) => Promise<YoutubeInsightResponse[]>;
}

function CompareCard({ results }: { results: RecommendationResponse }) {
  const categories = ["camera", "battery", "performance", "value", "display"] as const;

  const winners = categories.map((category) => {
    const winner = [...results.phones].sort(
      (a, b) => b.scores[category] - a.scores[category]
    )[0];

    return {
      category,
      phone: winner,
    };
  });

  return (
    <div className="glass-card space-y-4 p-4 sm:p-5">
      <div>
        <div className="section-kicker mb-2">Comparison view</div>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.55)", fontSize: 13, lineHeight: 1.6 }}>
          Quick score-based winners across the three recommended phones. No extra AI call needed.
        </p>
      </div>

      <div className="overflow-x-auto app-scrollbar">
        <div className="min-w-[620px] space-y-2">
          <div className="grid grid-cols-[140px_repeat(3,minmax(140px,1fr))] gap-2 px-1">
            <div className="section-kicker self-end px-3 pb-2">Category</div>
            {results.phones.map((phone) => (
              <div key={phone.name} className="rounded-[18px] border border-white/8 bg-white/4 px-3 py-3 text-center">
                <div className="text-sm font-medium text-white/88">{phone.name}</div>
                <div className="mt-1 text-[11px] text-white/42">{phone.price}</div>
              </div>
            ))}
          </div>

          {categories.map((category) => {
            const bestScore = Math.max(...results.phones.map((phone) => phone.scores[category]));

            return (
              <div key={category} className="grid grid-cols-[140px_repeat(3,minmax(140px,1fr))] gap-2 px-1">
                <div className="flex items-center rounded-[18px] border border-white/8 bg-white/4 px-3 py-3 text-sm capitalize text-white/72">
                  {category}
                </div>
                {results.phones.map((phone) => {
                  const isWinner = phone.scores[category] === bestScore;

                  return (
                    <div
                      key={`${phone.name}-${category}`}
                      className={cn(
                        "rounded-[18px] border px-3 py-3 text-center transition-colors",
                        isWinner
                          ? "border-violet-300/30 bg-violet-400/10"
                          : "border-white/8 bg-white/4"
                      )}
                    >
                      <div className="text-sm font-medium text-white/88">{phone.scores[category]}</div>
                      <div className="mt-1 text-[11px] text-white/44">
                        {isWinner ? "Best value here" : "Competitive"}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {winners.map(({ category, phone }) => (
          <div key={category} className="rounded-[20px] border border-white/8 bg-white/4 p-4">
            <div className="section-kicker mb-2" style={{ color: "rgba(255,255,255,0.38)" }}>
              Best {category}
            </div>
            <h4 style={{ margin: "0 0 6px", color: "#f1f0ff", fontSize: 15, fontWeight: 500 }}>
              {phone.name}
            </h4>
            <p style={{ margin: 0, color: "rgba(255,255,255,0.52)", fontSize: 12 }}>
              Score: {phone.scores[category]}/100
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function createPromptMessage(stepId: ChatStepId, prefix?: string) {
  const step = CHAT_STEPS[stepId as Exclude<ChatStepId, "results">];
  const text = prefix ? `${prefix}\n\n${step.title}` : step.title;

  return createChatMessage({
    role: "assistant",
    stepId,
    text,
    kind: stepId === "summary" ? "summary" : "prompt",
  });
}

function createUserAnswerMessage(stepId: ChatStepId, responseLabel: string) {
  return createChatMessage({
    role: "user",
    stepId,
    text: responseLabel,
    responseLabel,
    kind: "answer",
  });
}

function FooterCard({
  title,
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="glass-card-strong space-y-4 p-4 sm:p-5">
      {title ? (
        <div className="space-y-1">
          <p className="section-kicker m-0">Next step</p>
          <h3 style={{ margin: 0, color: "#f1f0ff", fontSize: 17, fontWeight: 500 }}>{title}</h3>
          {subtitle ? (
            <p style={{ margin: 0, color: "rgba(255,255,255,0.5)", fontSize: 13, lineHeight: 1.65 }}>
              {subtitle}
            </p>
          ) : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export default function GuidedChat({
  loading,
  results,
  error,
  onSubmitFinal,
  onStartOver,
  onFetchYoutubeInsights,
}: GuidedChatProps) {
  const [answers, setAnswers] = useState<GuidedAnswers>(getInitialGuidedAnswers);
  const [messages, setMessages] = useState<ChatFlowMessage[]>([]);
  const [currentStep, setCurrentStep] = useState<ChatStepId>("welcome");
  const [draftSelections, setDraftSelections] = useState<string[]>([]);
  const [draftSingleValue, setDraftSingleValue] = useState<string | null>(null);
  const [draftBudget, setDraftBudget] = useState(DEFAULT_GUIDED_ANSWERS.budget);
  const [exactBudgetMode, setExactBudgetMode] = useState(false);
  const [showCompare, setShowCompare] = useState(false);
  const [youtubeInsights, setYoutubeInsights] = useState<YoutubeInsightResponse[]>([]);
  const [youtubeLoading, setYoutubeLoading] = useState(false);

  const bootstrappedRef = useRef(false);
  const resultSignatureRef = useRef<string | null>(null);
  const errorRef = useRef<string | null>(null);
  const loadingMessageIdRef = useRef<string | null>(null);
  const resultsMessageIdRef = useRef<string | null>(null);

  const convertMessage = useCallback((message: ChatFlowMessage): ThreadMessageLike => {
    return {
      id: message.id,
      role: message.role,
      createdAt: new Date(message.createdAt),
      content: [{ type: "text", text: message.text }],
      metadata: {
        custom: {
          stepId: message.stepId,
          kind: message.kind,
        },
      },
    };
  }, []);

  const runtime = useExternalStoreRuntime<ChatFlowMessage>({
    messages,
    setMessages: (nextMessages) => setMessages([...nextMessages]),
    isRunning: loading,
    convertMessage,
    onNew: async () => {
      // The guided flow never sends free-text messages.
    },
  });

  const appendMessage = useCallback((message: ChatFlowMessage) => {
    setMessages((currentMessages) => [...currentMessages, message]);
    return message;
  }, []);

  const moveToStep = useCallback(
    (stepId: ChatStepId, prefix?: string) => {
      setCurrentStep(stepId);
      if (stepId === "results") return;
      appendMessage(createPromptMessage(stepId, prefix));
    },
    [appendMessage]
  );

  const resetConversation = useCallback(() => {
    const nextAnswers = getInitialGuidedAnswers();
    setAnswers(nextAnswers);
    setCurrentStep("welcome");
    setDraftSelections([]);
    setDraftSingleValue(null);
    setDraftBudget(DEFAULT_GUIDED_ANSWERS.budget);
    setExactBudgetMode(false);
    setShowCompare(false);
    setYoutubeInsights([]);
    setYoutubeLoading(false);
    loadingMessageIdRef.current = null;
    resultsMessageIdRef.current = null;
    resultSignatureRef.current = null;
    errorRef.current = null;
    const welcomeMessage = createPromptMessage("welcome");
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
    setMessages([createPromptMessage("welcome")]);
  }, []);

  useEffect(() => {
    if (currentStep === "primary_use") {
      setDraftSelections(answers.primaryUse);
      return;
    }

    if (currentStep === "pain_points") {
      setDraftSelections(answers.currentPainPoints);
      return;
    }

    if (currentStep === "must_have") {
      setDraftSelections(answers.mustHaveFeatures);
      return;
    }

    setDraftSelections([]);
  }, [answers.currentPainPoints, answers.mustHaveFeatures, answers.primaryUse, currentStep]);

  useEffect(() => {
    switch (currentStep) {
      case "brand":
        setDraftSingleValue(answers.brandPreference);
        break;
      case "upgrade_tier":
        setDraftSingleValue(answers.upgradeTier ?? null);
        break;
      case "camera_priority":
        setDraftSingleValue(answers.cameraPriority ?? null);
        break;
      case "gaming_priority":
        setDraftSingleValue(answers.gamingPriority ?? null);
        break;
      default:
        setDraftSingleValue(null);
    }
  }, [answers.brandPreference, answers.cameraPriority, answers.gamingPriority, answers.upgradeTier, currentStep]);

  useEffect(() => {
    if (currentStep === "budget") {
      setDraftBudget(answers.budget);
    }
  }, [answers.budget, currentStep]);

  useEffect(() => {
    if (!loading) return;
    if (loadingMessageIdRef.current) return;

    const loadingMessage = appendMessage(
      createChatMessage({
        role: "assistant",
        text: "Perfect — I’m comparing the strongest matches for you now.",
        kind: "status",
      })
    );

    loadingMessageIdRef.current = loadingMessage.id;
  }, [appendMessage, loading]);

  useEffect(() => {
    if (!results) return;

    const signature = JSON.stringify({
      summary: results.summary,
      names: results.phones.map((phone) => phone.name),
    });

    if (resultSignatureRef.current === signature) {
      return;
    }

    resultSignatureRef.current = signature;
    const resultMessage = appendMessage(
      createChatMessage({
        role: "assistant",
        stepId: "results",
        text: results.summary,
        kind: "result",
      })
    );

    resultsMessageIdRef.current = resultMessage.id;
    loadingMessageIdRef.current = null;
    errorRef.current = null;
    setCurrentStep("results");
  }, [appendMessage, results]);

  useEffect(() => {
    if (!error) {
      errorRef.current = null;
      return;
    }

    if (errorRef.current === error) {
      return;
    }

    errorRef.current = error;
    loadingMessageIdRef.current = null;

    appendMessage(
      createChatMessage({
        role: "assistant",
        text: `I hit a snag while fetching recommendations: ${error}`,
        kind: "status",
      })
    );
  }, [appendMessage, error]);

  const advanceAfterAnswer = useCallback(
    (stepId: ChatStepId, nextAnswers: GuidedAnswers) => {
      setAnswers(nextAnswers);
      const nextStep = getNextStepId(stepId, nextAnswers);
      if (nextStep) {
        moveToStep(nextStep);
      }
    },
    [moveToStep]
  );

  const handleAnswer = useCallback(
    (stepId: ChatStepId, value: string | string[] | number) => {
      let nextAnswers = answers;
      let responseLabel = "";

      if (stepId === "welcome" && typeof value === "string") {
        nextAnswers = applyQuickStartPreset(value, answers);
        responseLabel = value;
      }

      if (stepId === "budget" && typeof value === "number") {
        nextAnswers = {
          ...answers,
          budget: value,
          budgetRangeLabel: getBudgetRangeLabel(value),
        };
        responseLabel = formatCurrency(value);
      }

      if (stepId === "primary_use" && Array.isArray(value)) {
        nextAnswers = {
          ...answers,
          primaryUse: value,
          cameraPriority: shouldAskCameraPriority({ primaryUse: value })
            ? answers.cameraPriority
            : null,
          gamingPriority: shouldAskGamingPriority({ primaryUse: value })
            ? answers.gamingPriority
            : null,
        };
        responseLabel = formatUserReplyLabel(value, "Skipped");
      }

      if (stepId === "brand" && typeof value === "string") {
        nextAnswers = {
          ...answers,
          brandPreference: value,
        };
        responseLabel = value;
      }

      if (stepId === "upgrade_tier" && typeof value === "string") {
        nextAnswers = {
          ...answers,
          upgradeTier: normalizeSkipValue(value),
        };
        responseLabel = normalizeSkipValue(value) ?? "Skipped";
      }

      if (stepId === "pain_points" && Array.isArray(value)) {
        const normalized = normalizeSkippedArray(value);
        nextAnswers = {
          ...answers,
          currentPainPoints: normalized,
        };
        responseLabel = formatUserReplyLabel(normalized, "Skipped");
      }

      if (stepId === "must_have" && Array.isArray(value)) {
        nextAnswers = {
          ...answers,
          mustHaveFeatures: value,
        };
        responseLabel = formatUserReplyLabel(value, "None selected");
      }

      if (stepId === "camera_priority" && typeof value === "string") {
        nextAnswers = {
          ...answers,
          cameraPriority: normalizeSkipValue(value),
        };
        responseLabel = normalizeSkipValue(value) ?? "Skipped";
      }

      if (stepId === "gaming_priority" && typeof value === "string") {
        nextAnswers = {
          ...answers,
          gamingPriority: normalizeSkipValue(value),
        };
        responseLabel = normalizeSkipValue(value) ?? "Skipped";
      }

      appendMessage(createUserAnswerMessage(stepId, responseLabel));
      advanceAfterAnswer(stepId, nextAnswers);
    },
    [answers, advanceAfterAnswer, appendMessage]
  );

  const handleBack = useCallback(() => {
    const previousStep = getPreviousStepId(currentStep, answers);
    if (!previousStep || previousStep === "results") return;

    setShowCompare(false);
    setYoutubeInsights([]);
    moveToStep(previousStep, "No problem — let’s revise that.");
  }, [answers, currentStep, moveToStep]);

  const handleEditSpecificStep = useCallback(
    (stepId: ChatStepId) => {
      if (results) {
        onStartOver();
      }

      setShowCompare(false);
      setYoutubeInsights([]);
      moveToStep(stepId, "Sure — let’s update that.");
    },
    [moveToStep, onStartOver, results]
  );

  const handleEditAnswers = useCallback(() => {
    if (results) {
      onStartOver();
    }

    setShowCompare(false);
    setYoutubeInsights([]);
    moveToStep("budget", "Let’s refine your answers from the top.");
  }, [moveToStep, onStartOver, results]);

  const handleFinalSubmit = useCallback(async () => {
    appendMessage(createUserAnswerMessage("summary", "Find my best phones"));
    await onSubmitFinal(mapGuidedAnswersToRequest(answers));
  }, [answers, appendMessage, onSubmitFinal]);

  const handleRetry = useCallback(async () => {
    await onSubmitFinal(mapGuidedAnswersToRequest(answers));
  }, [answers, onSubmitFinal]);

  const handleFullReset = useCallback(() => {
    onStartOver();
    resetConversation();
  }, [onStartOver, resetConversation]);

  const handleLocalRefinement = useCallback(
    (intent: "battery" | "camera" | "cheaper") => {
      const labelMap = {
        battery: "Better battery",
        camera: "Better camera",
        cheaper: "Cheaper options",
      } as const;

      appendMessage(
        createChatMessage({
          role: "assistant",
          text: `${labelMap[intent]} refinements are queued for the next iteration. For now, use Edit answers to steer the current guided flow without making another Claude call.`,
          kind: "status",
        })
      );
    },
    [appendMessage]
  );

  const handlePeopleSaying = useCallback(async () => {
    if (!results || !onFetchYoutubeInsights || youtubeLoading) return;
    if (youtubeInsights.length > 0) return;

    setYoutubeLoading(true);
    try {
      const fetchedInsights = await onFetchYoutubeInsights(
        results.phones.map((phone) => phone.name)
      );
      setYoutubeInsights(fetchedInsights);
    } catch (fetchError) {
      appendMessage(
        createChatMessage({
          role: "assistant",
          text:
            fetchError instanceof Error
              ? `I couldn’t load YouTube review signals right now: ${fetchError.message}`
              : "I couldn’t load YouTube review signals right now.",
          kind: "status",
        })
      );
    } finally {
      setYoutubeLoading(false);
    }
  }, [appendMessage, onFetchYoutubeInsights, results, youtubeInsights.length, youtubeLoading]);

  const summaryItems = useMemo(() => {
    const stepMap: Record<string, ChatStepId> = {
      Budget: "budget",
      "Primary use": "primary_use",
      Brand: "brand",
      "Upgrade tier": "upgrade_tier",
      "Pain points": "pain_points",
      "Must-haves": "must_have",
      "Camera priority": "camera_priority",
      "Gaming priority": "gaming_priority",
    };

    return buildSummaryData(answers).map((item) => ({
      ...item,
      stepId: stepMap[item.label],
    }));
  }, [answers]);

  const canContinueMultiSelect =
    currentStep === "primary_use"
      ? draftSelections.length > 0
      : true;

  const activeStepDefinition =
    currentStep !== "results"
      ? CHAT_STEPS[currentStep as Exclude<ChatStepId, "results">]
      : null;

  const renderAccessory = useCallback(
    (message: ChatFlowMessage) => {
      if (loading && message.id === loadingMessageIdRef.current) {
        return <LoadingCards />;
      }

      if (results && message.id === resultsMessageIdRef.current) {
        return (
          <div className="space-y-4">
            <div className="flex flex-col gap-4">
              {results.phones.map((phone) => (
                <PhoneCard key={phone.name} phone={phone} budget={answers.budget} />
              ))}
            </div>
            {showCompare ? <CompareCard results={results} /> : null}
            {(youtubeLoading || youtubeInsights.length > 0) ? (
              <YoutubeInsightCard insights={youtubeInsights} loading={youtubeLoading} />
            ) : null}
          </div>
        );
      }

      return null;
    },
    [answers.budget, loading, results, showCompare, youtubeInsights, youtubeLoading]
  );

  const footerContent = useMemo(() => {
    if (loading) {
      return null;
    }

    if (error && !results) {
      return (
        <FooterCard title="Recommendation issue" subtitle="You can retry the final fetch or adjust your answers locally.">
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={handleRetry}>
              Try again
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleEditAnswers}>
              Edit answers
            </button>
          </div>
        </FooterCard>
      );
    }

    if (results) {
      return (
        <ResultActions
          onCompare={() => setShowCompare((currentValue) => !currentValue)}
          onBatteryRefine={() => handleLocalRefinement("battery")}
          onCameraRefine={() => handleLocalRefinement("camera")}
          onCheaperRefine={() => handleLocalRefinement("cheaper")}
          onPeopleSaying={handlePeopleSaying}
          onStartOver={handleFullReset}
          onEditAnswers={handleEditAnswers}
        />
      );
    }

    if (currentStep === "welcome") {
      return (
        <FooterCard title="Quick start" subtitle="Pick the angle you care about most — you can still refine everything after this.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            onSelect={(option) => handleAnswer("welcome", String(option.value))}
          />
        </FooterCard>
      );
    }

    if (currentStep === "budget") {
      return (
        <FooterCard title="Budget" subtitle="Choose a range, or switch to the slider for an exact budget.">
          <OptionChips
            options={BUDGET_OPTIONS}
            selectedValues={exactBudgetMode ? ["exact-budget"] : []}
            onSelect={(option) => {
              if (option.value === "exact-budget") {
                setExactBudgetMode(true);
                return;
              }

              setExactBudgetMode(false);
              handleAnswer("budget", Number(option.value));
            }}
          />

          {exactBudgetMode ? (
            <div className="space-y-4">
              <BudgetSlider value={draftBudget} onChange={setDraftBudget} />
              <div className="flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary" onClick={() => handleAnswer("budget", draftBudget)}>
                  Continue
                </button>
                <button type="button" className="btn btn-ghost" onClick={handleBack}>
                  Back
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <button type="button" className="btn btn-ghost" onClick={handleBack}>
                Back
              </button>
            </div>
          )}
        </FooterCard>
      );
    }

    if (currentStep === "primary_use") {
      return (
        <FooterCard title="What matters most?" subtitle="Pick up to three priorities. This decides the rest of the flow.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSelections}
            multiSelect
            maxSelect={3}
            onSelect={(option) => {
              const optionValue = String(option.value);
              setDraftSelections((currentValues) =>
                currentValues.includes(optionValue)
                  ? currentValues.filter((value) => value !== optionValue)
                  : [...currentValues, optionValue]
              );
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className={cn("btn btn-primary", !canContinueMultiSelect && "opacity-50")}
              onClick={() => handleAnswer("primary_use", draftSelections)}
              disabled={!canContinueMultiSelect}
            >
              Continue
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "brand") {
      return (
        <FooterCard title="Brand preference" subtitle="Choose one if you already have a favourite ecosystem.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("brand", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "upgrade_tier") {
      return (
        <FooterCard title="Upgrade tier" subtitle="A rough tier is enough — this helps set expectations for the jump in quality.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("upgrade_tier", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "pain_points") {
      return (
        <FooterCard title="Pain points" subtitle="Pick what annoyed you most, or skip if you’re just ready for a clean upgrade.">
          <OptionChips
            options={(activeStepDefinition?.options ?? []).filter((option) => option.value !== "Skip")}
            selectedValues={draftSelections}
            multiSelect
            onSelect={(option) => {
              const optionValue = String(option.value);
              setDraftSelections((currentValues) =>
                currentValues.includes(optionValue)
                  ? currentValues.filter((value) => value !== optionValue)
                  : [...currentValues, optionValue]
              );
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => handleAnswer("pain_points", draftSelections)}>
              Continue
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => handleAnswer("pain_points", [])}>
              Skip
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "must_have") {
      return (
        <FooterCard title="Non-negotiables" subtitle="Select anything you absolutely want in the final shortlist.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSelections}
            multiSelect
            onSelect={(option) => {
              const optionValue = String(option.value);
              setDraftSelections((currentValues) =>
                currentValues.includes(optionValue)
                  ? currentValues.filter((value) => value !== optionValue)
                  : [...currentValues, optionValue]
              );
            }}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary" onClick={() => handleAnswer("must_have", draftSelections)}>
              Continue
            </button>
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "camera_priority") {
      return (
        <FooterCard title="Camera priority" subtitle="This only appears because camera quality is part of your shortlist logic.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("camera_priority", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "gaming_priority") {
      return (
        <FooterCard title="Gaming priority" subtitle="This only appears because you picked gaming as a priority.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("gaming_priority", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <button type="button" className="btn btn-ghost" onClick={handleBack}>
              Back
            </button>
          </div>
        </FooterCard>
      );
    }

    if (currentStep === "summary") {
      return (
        <SummaryCard
          items={summaryItems}
          onConfirm={handleFinalSubmit}
          onEditAnswers={handleEditAnswers}
          onEditStep={(stepId) => handleEditSpecificStep(stepId)}
        />
      );
    }

    return null;
  }, [
    activeStepDefinition?.options,
    canContinueMultiSelect,
    currentStep,
    draftBudget,
    draftSelections,
    draftSingleValue,
    error,
    exactBudgetMode,
    handleAnswer,
    handleBack,
    handleEditAnswers,
    handleEditSpecificStep,
    handleFinalSubmit,
    handleFullReset,
    handleLocalRefinement,
    handlePeopleSaying,
    handleRetry,
    loading,
    results,
    summaryItems,
  ]);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread renderAccessory={renderAccessory} footer={footerContent} />
    </AssistantRuntimeProvider>
  );
}
