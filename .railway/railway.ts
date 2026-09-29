import { defineRailway, github, project, service } from "railway/iac";

// This repo manages only its own service. See .railway/README.md.
export const partial = "index";

export default defineRailway(() => {
  const index = service("index", {
    source: github("marshallhouston/cosmicfarmland-index", { checkSuites: false }),
    healthcheck: "/api/health",
    replicas: { "us-west2": 1 },
    deploy: { sleepApplication: true },
    domains: ["cosmicfarmland.wtf"],
  });

  return project("cosmicfarmland-index", {
    resources: [index],
  });
});
