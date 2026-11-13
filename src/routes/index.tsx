import { createFileRoute } from "@tanstack/react-router";

import { BeetiCommandCenter } from "@/components/beeti/beeti-command-center";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Beeti — Your Egyptian household, in good hands" },
      {
        name: "description",
        content: "A calm household command center for Cairo: keep documents, bills, renewals and approvals in view with Beeti.",
      },
      { property: "og:title", content: "Beeti — Your household, in good hands" },
      {
        property: "og:description",
        content: "Household renewals, documents and approvals, thoughtfully organized for life in Egypt.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BeetiCommandCenter,
});