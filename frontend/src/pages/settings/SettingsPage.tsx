import React from "react";
import { Settings } from "lucide-react";

import { EmptyState } from "@/components/ui/EmptyState";
import { Section } from "@/components/ui/Section";

export function SettingsPage() {
  return (
    <div>
      <div className="mb-4">
        <h1 className="text-lg font-semibold text-neutral-900">Settings</h1>
        <p className="text-sm text-neutral-500">Workspace, team, and account preferences.</p>
      </div>

      <Section>
        <EmptyState
          icon={Settings}
          title="Nothing to configure yet"
          description="Team management, notification preferences, and workspace settings will live here as those features are built."
        />
      </Section>
    </div>
  );
}
