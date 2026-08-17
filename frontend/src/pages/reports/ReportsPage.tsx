import React from "react";
import { BarChart3 } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

export function ReportsPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Reports</h1>
        <p className="text-sm text-neutral-500">Trends across orders, purchasing, and fulfillment.</p>
      </div>

      <Section>
        <EmptyState
          icon={BarChart3}
          title="Reports aren't connected yet"
          description="Once the backend's reporting endpoints are wired up, you'll see order volume, fulfillment lead time, and on-time delivery trends here."
        />
      </Section>
    </div>
  );
}
