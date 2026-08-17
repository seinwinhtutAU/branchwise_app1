import React from "react";
import { AlertTriangle, Check, ClipboardCheck } from "lucide-react";

import { cn } from "@/lib/cn";
import type { TransportationLeg } from "@/data/types";
import { formatDate } from "@/lib/format";

export type StepState = "complete" | "current" | "upcoming";

export interface ProgressStep {
  label: string;
  state: StepState;
}

export function ProgressSteps({ steps }: { steps: ProgressStep[] }) {
  return (
    <div className="flex items-center">
      {steps.map((step, i) => (
        <React.Fragment key={step.label}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-6 w-6 items-center justify-center rounded-full border-2 text-xs font-semibold",
                step.state === "complete" && "border-primary-600 bg-primary-600 text-white",
                step.state === "current" && "border-primary-600 bg-white text-primary-600",
                step.state === "upcoming" && "border-neutral-200 bg-white text-neutral-300",
              )}
            >
              {step.state === "complete" ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={cn(
                "whitespace-nowrap text-xs font-medium",
                step.state === "upcoming" ? "text-neutral-400" : "text-neutral-700",
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "mx-2 mb-5 h-0.5 flex-1 rounded",
                step.state === "complete" ? "bg-primary-600" : "bg-neutral-200",
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

interface RouteTimelineProps {
  legs: TransportationLeg[];
  finalLabel: string;
  finalReached: boolean;
}

export function RouteTimeline({ legs, finalLabel, finalReached }: RouteTimelineProps) {
  if (legs.length === 0) return null;

  const stops = [legs[0].fromLocation, ...legs.map((l) => l.toLocation)];

  return (
    <div className="pl-1">
      {stops.map((stop, i) => {
        const leg = legs[i];
        const arrivalLeg = legs[i - 1];
        const isLast = i === stops.length - 1;
        const isChecked = arrivalLeg && (arrivalLeg.checkedBy || arrivalLeg.checkedDate);
        const hasMismatch =
          isChecked &&
          arrivalLeg.packagesExpected != null &&
          arrivalLeg.packagesVerified != null &&
          arrivalLeg.packagesVerified !== arrivalLeg.packagesExpected;
        return (
          <div key={`${stop}-${i}`} className="relative pl-6">
            {!isLast && <div className="absolute left-[7px] top-3 h-full w-px bg-neutral-200" />}
            <div className="absolute left-0 top-1 h-4 w-4 rounded-full border-2 border-primary-500 bg-white" />
            <div className="pb-5">
              <p className="text-sm font-medium text-neutral-800">{stop}</p>
              {isChecked && (
                <div
                  className={cn(
                    "mt-1 flex items-center gap-1.5 text-xs",
                    hasMismatch ? "text-warning-600" : "text-neutral-500",
                  )}
                >
                  {hasMismatch ? (
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                  ) : (
                    <ClipboardCheck className="h-3 w-3 shrink-0" />
                  )}
                  <span>
                    Checked{arrivalLeg.checkedBy ? ` by ${arrivalLeg.checkedBy}` : ""}
                    {arrivalLeg.checkedDate ? ` on ${formatDate(arrivalLeg.checkedDate)}` : ""}
                    {arrivalLeg.packagesExpected != null && arrivalLeg.packagesVerified != null
                      ? ` — ${arrivalLeg.packagesVerified}/${arrivalLeg.packagesExpected} packages verified`
                      : ""}
                  </span>
                </div>
              )}
              {isChecked && arrivalLeg.checkNotes && (
                <p className="mt-0.5 text-xs italic text-neutral-400">{arrivalLeg.checkNotes}</p>
              )}
              {leg && (
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-neutral-500">
                  <span>{leg.carrier}</span>
                  {leg.vehicleNo && <span>{leg.vehicleNo}</span>}
                  <span>
                    {leg.departureDate ? formatDate(leg.departureDate) : "—"}
                    {leg.arrivalDate ? ` → ${formatDate(leg.arrivalDate)}` : " → pending"}
                  </span>
                  {leg.transportCost != null && <span>${leg.transportCost.toFixed(0)}</span>}
                </div>
              )}
            </div>
          </div>
        );
      })}
      <div className="relative pl-6">
        <div
          className={cn(
            "absolute left-0 top-1 h-4 w-4 rounded-full border-2 bg-white",
            finalReached ? "border-success-600" : "border-neutral-300",
          )}
        />
        <p className={cn("text-sm font-medium", finalReached ? "text-success-700" : "text-neutral-400")}>
          {finalLabel}
        </p>
      </div>
    </div>
  );
}
