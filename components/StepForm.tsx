"use client";

import { useState } from "react";
import BudgetSlider from "@/components/BudgetSlider";
import SelectChips from "@/components/SelectChips";
import type { FormData } from "@/types";

interface StepFormProps {
  onSubmit: (data: FormData) => void;
}

const PRIMARY_USE_OPTIONS = [
  "Camera",
  "Battery life",
  "Gaming",
  "Business & productivity",
  "Everyday use",
];

const BRAND_OPTIONS = [
  "No preference",
  "Apple",
  "Samsung",
  "OnePlus",
  "Realme",
  "iQOO",
  "Google Pixel",
  "Other",
];

const FEATURE_OPTIONS = [
  "5G",
  "Long battery (5000mAh+)",
  "Fast charging",
  "Great camera",
  "Compact size",
  "Large screen",
  "Water resistant",
  "Headphone jack",
];

const STEP_NAMES = [
  "Budget",
  "Primary Use",
  "Brand Preference",
  "Current Phone",
  "Must-Have Features",
];

export default function StepForm({ onSubmit }: StepFormProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    budget: 25000,
    primaryUse: [],
    brandPreference: "",
    currentPhone: "",
    mustHaveFeatures: [],
  });

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.budget >= 5000;
      case 2:
        return formData.primaryUse.length > 0;
      case 3:
        return formData.brandPreference !== "";
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            Step {step} of 5
          </span>
          <span style={{ fontSize: 11, color: "var(--text-dim)" }}>
            {STEP_NAMES[step - 1]}
          </span>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            height: 2,
            borderRadius: 1,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${(step / 5) * 100}%`,
              height: "100%",
              background: "linear-gradient(90deg, #8b5cf6, #60a5fa)",
              borderRadius: 1,
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      {/* Step content */}
      <div className="glass-card p-6">
        {/* Step 1: Budget */}
        {step === 1 && (
          <div className="space-y-4">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "var(--text-bright)",
              }}
            >
              What&apos;s your budget?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
              Drag the slider to set your maximum budget
            </p>
            <BudgetSlider
              value={formData.budget}
              onChange={(v) => setFormData({ ...formData, budget: v })}
            />
          </div>
        )}

        {/* Step 2: Primary Use */}
        {step === 2 && (
          <div className="space-y-4">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "var(--text-bright)",
              }}
            >
              What will you mainly use it for?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
              Select one or more options
            </p>
            <SelectChips
              options={PRIMARY_USE_OPTIONS}
              selected={formData.primaryUse}
              onChange={(v) => setFormData({ ...formData, primaryUse: v })}
              multiSelect={true}
            />
          </div>
        )}

        {/* Step 3: Brand */}
        {step === 3 && (
          <div className="space-y-4">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "var(--text-bright)",
              }}
            >
              Any brand preference?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
              Pick your favourite brand or choose &quot;No preference&quot;
            </p>
            <SelectChips
              options={BRAND_OPTIONS}
              selected={
                formData.brandPreference ? [formData.brandPreference] : []
              }
              onChange={(v) =>
                setFormData({ ...formData, brandPreference: v[0] || "" })
              }
              multiSelect={false}
            />
          </div>
        )}

        {/* Step 4: Current Phone */}
        {step === 4 && (
          <div className="space-y-4">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "var(--text-bright)",
              }}
            >
              What phone do you currently use?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
              This helps us suggest a meaningful upgrade
            </p>
            <input
              type="text"
              placeholder="e.g. Samsung Galaxy M31, iPhone 12..."
              value={formData.currentPhone}
              onChange={(e) =>
                setFormData({ ...formData, currentPhone: e.target.value })
              }
              className="w-full"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 12,
                padding: "10px 14px",
                color: "#f1f0ff",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              onClick={handleNext}
              style={{
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.3)",
                textDecoration: "underline",
                fontSize: 12,
                cursor: "pointer",
                padding: 0,
              }}
            >
              Skip this step
            </button>
          </div>
        )}

        {/* Step 5: Features */}
        {step === 5 && (
          <div className="space-y-4">
            <h2
              style={{
                fontSize: 20,
                fontWeight: 500,
                color: "var(--text-bright)",
              }}
            >
              Any must-have features?
            </h2>
            <p style={{ fontSize: 13, color: "var(--text-mid)" }}>
              Optional — select features you can&apos;t live without
            </p>
            <SelectChips
              options={FEATURE_OPTIONS}
              selected={formData.mustHaveFeatures}
              onChange={(v) =>
                setFormData({ ...formData, mustHaveFeatures: v })
              }
              multiSelect={true}
            />
          </div>
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        {step > 1 ? (
          <button
            onClick={handleBack}
            className="transition-all duration-200"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.6)",
              borderRadius: 20,
              padding: "8px 20px",
              fontSize: 13,
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
          >
            ← Back
          </button>
        ) : (
          <div />
        )}

        {step < 5 ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="transition-all duration-200"
            style={{
              background: canProceed()
                ? "linear-gradient(135deg, #8b5cf6, #6366f1)"
                : "rgba(255,255,255,0.06)",
              color: canProceed() ? "#fff" : "rgba(255,255,255,0.3)",
              border: "none",
              borderRadius: 20,
              padding: "8px 24px",
              fontSize: 13,
              fontWeight: 500,
              cursor: canProceed() ? "pointer" : "not-allowed",
              opacity: canProceed() ? 1 : 0.5,
            }}
            onMouseOver={(e) => {
              if (canProceed()) {
                e.currentTarget.style.opacity = "0.88";
                e.currentTarget.style.transform = "translateY(-1px)";
              }
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = canProceed() ? "1" : "0.5";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "10px 28px",
              fontSize: 14,
              fontWeight: 500,
              cursor: "pointer",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = "0.88";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = "1";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Find My Phone →
          </button>
        )}
      </div>
    </div>
  );
}
