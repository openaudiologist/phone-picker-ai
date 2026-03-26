"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  BatteryFull,
  Camera,
  Check,
  Cpu,
  IndianRupee,
  MonitorSmartphone,
  PencilLine,
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CHAT_STEPS,
  DEFAULT_GUIDED_ANSWERS,
  BUDGET_OPTIONS,
  getBudgetRangeLabel,
  getNextStepId,
  getPreviousStepId,
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
import {
  trackResultAction,
  trackPhonePagination,
  trackStepComplete,
  trackRecommendationError,
} from "@/lib/tracking";
import type {
  ChatFlowMessage,
  ChatStepId,
  FormData,
  GuidedAnswers,
  RecommendationErrorState,
  RecommendationResponse,
  YoutubeInsightResponse,
} from "@/types";

interface GuidedChatProps {
  loading: boolean;
  results: RecommendationResponse | null;
  error: RecommendationErrorState | null;
  onSubmitFinal: (data: FormData) => Promise<void> | void;
  onStartOver: () => void;
  welcomeHeaderSlot?: ReactNode;
  loadingAccessorySlot?: ReactNode;
  resultsFooterSlot?: ((currentPhoneIndex: number) => ReactNode) | null;
  onFetchYoutubeInsights?: (
    phoneNames: string[]
  ) => Promise<YoutubeInsightResponse[]>;
}

function CompareCard({ results }: { results: RecommendationResponse }) {
  const categories = ["camera", "battery", "performance", "value", "display"] as const;
  const categoryIcons = {
    camera: Camera,
    battery: BatteryFull,
    performance: Cpu,
    value: IndianRupee,
    display: MonitorSmartphone,
  } as const;
  const categoryLabels = {
    camera: "camera",
    battery: "battery",
    performance: "speed",
    value: "value",
    display: "display",
  } as const;

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
    <Card>
      <CardHeader className="gap-1">
        <p className="text-xs font-medium text-muted-foreground">Comparison view</p>
        <CardTitle className="text-base">Score winners at a glance</CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
      <ScrollArea className="w-full whitespace-nowrap rounded-lg">
        <div className="min-w-[620px] space-y-2 pb-2">
          <div className="grid grid-cols-[140px_repeat(3,minmax(140px,1fr))] gap-2 px-1">
            <div className="self-end px-3 pb-2 text-xs font-medium text-muted-foreground">Category</div>
            {results.phones.map((phone) => (
              <div key={phone.name} className="rounded-lg bg-muted px-3 py-3 text-center">
                <div className="text-sm font-medium text-foreground">{phone.name}</div>
              </div>
            ))}
          </div>

          {categories.map((category) => {
            const bestScore = Math.max(...results.phones.map((phone) => phone.scores[category]));

            return (
              <div key={category} className="grid grid-cols-[140px_repeat(3,minmax(140px,1fr))] gap-2 px-1">
                <div className="flex items-center rounded-lg bg-muted px-3 py-3 text-sm capitalize text-muted-foreground">
                  {category}
                </div>
                {results.phones.map((phone) => {
                  const isWinner = phone.scores[category] === bestScore;

                  return (
                    <div
                      key={`${phone.name}-${category}`}
                      className={cn(
                        "rounded-lg px-3 py-3 text-center transition-colors",
                        isWinner
                          ? "bg-primary/10 ring-1 ring-primary/25"
                          : "bg-muted"
                      )}
                    >
                      <div className="text-sm font-medium text-foreground">{phone.scores[category]}</div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {isWinner ? "Best value here" : "Competitive"}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {winners.map(({ category, phone }) => {
          const CategoryIcon = categoryIcons[category];
          const categoryLabel = categoryLabels[category];

          return (
            <div key={category} className="flex h-full min-h-32 flex-col rounded-lg bg-muted p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CategoryIcon className="h-3.5 w-3.5" />
                  <span>Best {categoryLabel}</span>
                </div>
                <h4 className="text-sm font-semibold text-foreground">{phone.name}</h4>
              </div>
              <div className="mt-auto flex items-center gap-2 pt-4">
                <Progress value={phone.scores[category]} className="h-1.5 flex-1" />
                <span className="min-w-7 text-right text-xs font-medium text-foreground">
                  {phone.scores[category]}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      </CardContent>
    </Card>
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

function StepFooter({
  subtitle,
  children,
}: {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      {subtitle ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {subtitle}
        </p>
      ) : null}
      <Separator className="bg-border/50" />
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
  welcomeHeaderSlot,
  loadingAccessorySlot,
  resultsFooterSlot,
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
  const [resultAccessoryOrder, setResultAccessoryOrder] = useState<Array<"compare" | "youtube">>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
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
    setResultAccessoryOrder([]);
    setCurrentResultIndex(0);
    setYoutubeInsights([]);
    setYoutubeLoading(false);
    loadingMessageIdRef.current = null;
    resultsMessageIdRef.current = null;
    resultSignatureRef.current = null;
    errorRef.current = null;
    setMessages([]);
  }, []);

  useEffect(() => {
    if (bootstrappedRef.current) return;
    bootstrappedRef.current = true;
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
        setDraftSingleValue(answers.upgradeTier ?? "Skip");
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
      const hasPresetMatch = BUDGET_OPTIONS.some(
        (option) => typeof option.value === "number" && option.value === answers.budget
      );
      setExactBudgetMode(!hasPresetMatch);
    }
  }, [answers.budget, currentStep]);

  useEffect(() => {
    if (!loading) return;
    if (loadingMessageIdRef.current) return;

    const loadingMessage = appendMessage(
      createChatMessage({
        role: "assistant",
        text: "Perfect — I'm comparing the strongest matches for you now.",
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
    setShowCompare(false);
    setResultAccessoryOrder([]);
    setYoutubeInsights([]);
    setYoutubeLoading(false);
    setCurrentResultIndex(0);
    setCurrentStep("results");
  }, [appendMessage, results]);

  useEffect(() => {
    if (!error) {
      errorRef.current = null;
      return;
    }

    if (errorRef.current === error.message) {
      return;
    }

    errorRef.current = error.message;
    loadingMessageIdRef.current = null;

    appendMessage(
      createChatMessage({
        role: "assistant",
        text: error.message,
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

      trackStepComplete(stepId);
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
    moveToStep(previousStep, "No problem — let's revise that.");
  }, [answers, currentStep, moveToStep]);

  const handleEditSpecificStep = useCallback(
    (stepId: ChatStepId) => {
      if (results || error) {
        onStartOver();
      }

      setShowCompare(false);
      setYoutubeInsights([]);
      moveToStep(stepId, "Sure — let's update that.");
    },
    [error, moveToStep, onStartOver, results]
  );

  const handleEditAnswers = useCallback(() => {
    trackResultAction("edit_answers");
    if (results || error) {
      onStartOver();
    }

    setShowCompare(false);
    setYoutubeInsights([]);
    moveToStep("budget", "Let's refine your answers from the top.");
  }, [error, moveToStep, onStartOver, results]);

  const handleFinalSubmit = useCallback(async () => {
    appendMessage(createUserAnswerMessage("summary", "Find my best phones"));
    await onSubmitFinal(mapGuidedAnswersToRequest(answers));
  }, [answers, appendMessage, onSubmitFinal]);

  const handleRetry = useCallback(async () => {
    await onSubmitFinal(mapGuidedAnswersToRequest(answers));
  }, [answers, onSubmitFinal]);

  const handleFullReset = useCallback(() => {
    trackResultAction("start_over");
    onStartOver();
    resetConversation();
  }, [onStartOver, resetConversation]);

  const handleCompare = useCallback(() => {
    trackResultAction("compare");
    setShowCompare(true);
    setResultAccessoryOrder((currentOrder) =>
      currentOrder.includes("compare") ? currentOrder : [...currentOrder, "compare"]
    );
  }, []);

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

    trackResultAction("youtube_insights");
    setResultAccessoryOrder((currentOrder) =>
      currentOrder.includes("youtube") ? currentOrder : [...currentOrder, "youtube"]
    );
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
              ? `I couldn't load YouTube review signals right now: ${fetchError.message}`
              : "I couldn't load YouTube review signals right now.",
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

  const hasDraftSelections = draftSelections.length > 0;
  const canContinueMultiSelect =
    currentStep === "primary_use"
      ? hasDraftSelections
      : true;
  const canContinuePainPoints =
    currentStep === "pain_points"
      ? hasDraftSelections
      : true;
  const canContinueMustHave =
    currentStep === "must_have"
      ? hasDraftSelections
      : true;

  const activeStepDefinition =
    currentStep !== "results"
      ? CHAT_STEPS[currentStep as Exclude<ChatStepId, "results">]
      : null;

  const lastAssistantMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "assistant") return messages[i].id;
    }
    return null;
  }, [messages]);

  const lastUserMessageId = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === "user") return messages[i].id;
    }
    return null;
  }, [messages]);

  const footerContent = useMemo(() => {
    if (loading) {
      return null;
    }

    if (error && !results) {
      return (
        <StepFooter
          title={error.type === "no-match" ? "Let’s refine your answers" : "Let’s refresh your shortlist"}
          subtitle={
            error.type === "no-match"
              ? "Update your budget, brand, or priorities and I’ll retry with a stronger shortlist."
              : "Try again for a fresh set of matches, or edit your answers if you want to steer the recommendations differently."
          }
        >
          <div className="flex flex-wrap gap-3">
            {error.type === "technical" ? (
              <Button type="button" onClick={handleRetry}>
                Try again
              </Button>
            ) : null}
            <Button type="button" variant="secondary" onClick={handleEditAnswers}>
              Edit answers
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (results) {
      return (
        <ResultActions
          onCompare={handleCompare}
          showCompare={!showCompare}
          onPeopleSaying={handlePeopleSaying}
          showPeopleSaying={!youtubeLoading && youtubeInsights.length === 0}
          onStartOver={handleFullReset}
          onEditAnswers={handleEditAnswers}
        />
      );
    }

    if (currentStep === "welcome") {
      return (
        <StepFooter title="Quick start" subtitle="Tell us what matters most and we'll hunt down the perfect phone for you. Don't worry — you can tweak everything along the way.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            onSelect={(option) => handleAnswer("welcome", String(option.value))}
          />
        </StepFooter>
      );
    }

    if (currentStep === "budget") {
      return (
        <StepFooter title="Budget" subtitle="Choose a range, or switch to the slider for an exact budget.">
          <OptionChips
            options={BUDGET_OPTIONS}
            selectedValues={exactBudgetMode ? ["exact-budget"] : [draftBudget]}
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
                <Button type="button" onClick={() => handleAnswer("budget", draftBudget)}>
                  <Check className="h-4 w-4" />
                  Continue
                </Button>
                <Button type="button" variant="secondary" onClick={handleBack}>
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </div>
          )}
        </StepFooter>
      );
    }

    if (currentStep === "primary_use") {
      return (
        <StepFooter title="What matters most?" subtitle="Pick up to three priorities. This decides the rest of the flow.">
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
            <Button
              type="button"
              onClick={() => handleAnswer("primary_use", draftSelections)}
              disabled={!canContinueMultiSelect}
             
            >
              <Check className="h-4 w-4" />
              Continue
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (currentStep === "brand") {
      return (
        <StepFooter title="Brand preference" subtitle="Choose one if you already have a favourite ecosystem.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("brand", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => handleAnswer("brand", "No preference")}>
              Skip
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (currentStep === "upgrade_tier") {
      return (
        <StepFooter title="Upgrade tier" subtitle="A rough tier is enough — this helps set expectations for the jump in quality.">
          <OptionChips
            options={(activeStepDefinition?.options ?? []).filter((option) => option.value !== "Skip")}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("upgrade_tier", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => handleAnswer("upgrade_tier", "Skip")}>
              Skip
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (currentStep === "pain_points") {
      return (
        <StepFooter title="Pain points" subtitle="Pick what annoyed you most, or skip if you're just ready for a clean upgrade.">
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
            <Button
              type="button"
              onClick={() => handleAnswer("pain_points", draftSelections)}
              disabled={!canContinuePainPoints}
            >
              <Check className="h-4 w-4" />
              Continue
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleAnswer("pain_points", [])}>
              Skip
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (currentStep === "must_have") {
      return (
        <StepFooter title="Non-negotiables" subtitle="Select anything you absolutely want in the final shortlist.">
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
            <Button
              type="button"
              onClick={() => handleAnswer("must_have", draftSelections)}
              disabled={!canContinueMustHave}
            >
              <Check className="h-4 w-4" />
              Continue
            </Button>
            <Button type="button" variant="secondary" onClick={() => handleAnswer("must_have", [])}>
              Skip
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (currentStep === "camera_priority") {
      return (
        <StepFooter title="Camera priority" subtitle="This only appears because camera quality is part of your shortlist logic.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("camera_priority", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => handleAnswer("camera_priority", "Skip")}>
              Skip
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
      );
    }

    if (currentStep === "gaming_priority") {
      return (
        <StepFooter title="Gaming priority" subtitle="This only appears because you picked gaming as a priority.">
          <OptionChips
            options={activeStepDefinition?.options ?? []}
            selectedValues={draftSingleValue ? [draftSingleValue] : []}
            onSelect={(option) => handleAnswer("gaming_priority", String(option.value))}
          />
          <div className="flex flex-wrap gap-3">
            <Button type="button" variant="secondary" onClick={() => handleAnswer("gaming_priority", "Skip")}>
              Skip
            </Button>
            <Button type="button" variant="secondary" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        </StepFooter>
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
    canContinueMustHave,
    canContinuePainPoints,
    canContinueMultiSelect,
    currentStep,
    draftBudget,
    draftSelections,
    draftSingleValue,
    error,
    exactBudgetMode,
    handleAnswer,
    handleBack,
    handleCompare,
    handleEditAnswers,
    handleEditSpecificStep,
    handleFinalSubmit,
    handleFullReset,
    handleLocalRefinement,
    handlePeopleSaying,
    handleRetry,
    loading,
    results,
    showCompare,
    summaryItems,
    youtubeInsights.length,
    youtubeLoading,
  ]);

  const renderAccessory = useCallback(
    (message: ChatFlowMessage) => {
      const isLastAssistant = message.id === lastAssistantMessageId;

      if (loading && message.id === loadingMessageIdRef.current) {
        return (
          <div className="space-y-4">
            <LoadingCards />
            {loadingAccessorySlot ? <div className="pt-1">{loadingAccessorySlot}</div> : null}
          </div>
        );
      }

      if (results && message.id === resultsMessageIdRef.current) {
        const currentPhone = results.phones[currentResultIndex] ?? results.phones[0];

        return (
          <div className="space-y-4">
            <PhoneCard
              phone={currentPhone}
              budget={answers.budget}
              pagination={{
                currentIndex: currentResultIndex,
                total: results.phones.length,
                onPrevious: () =>
                  setCurrentResultIndex((value) => {
                    const next = Math.max(value - 1, 0);
                    trackPhonePagination(results.phones[next].name, next);
                    return next;
                  }),
                onNext: () =>
                  setCurrentResultIndex((value) => {
                    const next = Math.min(value + 1, results.phones.length - 1);
                    trackPhonePagination(results.phones[next].name, next);
                    return next;
                  }),
              }}
            />
            {resultAccessoryOrder.map((panel) => {
              if (panel === "compare") {
                return showCompare ? <CompareCard key="compare" results={results} /> : null;
              }

              if (panel === "youtube") {
                return youtubeLoading || youtubeInsights.length > 0 ? (
                  <YoutubeInsightCard
                    key="youtube"
                    insights={youtubeInsights}
                    loading={youtubeLoading}
                    bestMatchPhoneName={results.phones.find((phone) => phone.isBestPick)?.name}
                  />
                ) : null;
              }

              return null;
            })}
            {isLastAssistant && (footerContent || resultsFooterSlot) ? (
              <div className="space-y-3 pt-1">
                {footerContent}
                {typeof resultsFooterSlot === "function" ? resultsFooterSlot(currentResultIndex) : resultsFooterSlot}
              </div>
            ) : null}
          </div>
        );
      }

      if (isLastAssistant && footerContent) {
        return footerContent;
      }

      return null;
    },
    [answers.budget, currentResultIndex, footerContent, lastAssistantMessageId, loading, loadingAccessorySlot, resultAccessoryOrder, results, resultsFooterSlot, showCompare, youtubeInsights, youtubeLoading]
  );

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <Thread
        renderAccessory={renderAccessory}
        welcomeHeader={welcomeHeaderSlot}
        welcomeFooter={footerContent}
        scrollAnchorMessageId={lastUserMessageId}
        scrollAnchorTurnKey={lastAssistantMessageId}
      />
    </AssistantRuntimeProvider>
  );
}
