/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    /* -------------------------------------------------------------------------
     * 1. Circular Dependencies (Zero Tolerance)
     * ------------------------------------------------------------------------- */
    {
      name: "no-circular",
      severity: "error",
      comment: "Circular dependencies cause hard-to-debug initialization bugs and memory leaks.",
      from: {},
      to: {
        circular: true,
      },
    },

    /* -------------------------------------------------------------------------
     * 2. Cross-Tier Boundary Violations (Strict 4-Tier Decoupling)
     * ------------------------------------------------------------------------- */
    {
      name: "no-frontend-cross-tier-imports",
      severity: "error",
      comment: "Frontend code must never directly import from backend, mobile, or hardware tiers.",
      from: {
        path: "^frontend/src",
      },
      to: {
        path: "^(backend|mobile|hardware)",
      },
    },
    {
      name: "no-backend-cross-tier-imports",
      severity: "error",
      comment: "Backend server must never import from frontend, mobile, or hardware tiers.",
      from: {
        path: "^backend",
      },
      to: {
        path: "^(frontend|mobile|hardware)",
      },
    },
    {
      name: "no-mobile-cross-tier-imports",
      severity: "error",
      comment: "Mobile companion app must never directly import backend or frontend tier source code.",
      from: {
        path: "^mobile/src",
      },
      to: {
        path: "^(backend|frontend|hardware)",
      },
    },

    /* -------------------------------------------------------------------------
     * 3. Backend Architectural Layering
     * ------------------------------------------------------------------------- */
    {
      name: "backend-models-isolation",
      severity: "error",
      comment: "Backend models must not depend on routes, controllers, or HTTP middleware.",
      from: {
        path: "^backend/models",
      },
      to: {
        path: "^backend/(routes|controllers|middleware)",
      },
    },
    {
      name: "backend-services-isolation",
      severity: "error",
      comment: "Backend services should not depend on HTTP controllers or routes.",
      from: {
        path: "^backend/services",
      },
      to: {
        path: "^backend/(routes|controllers)",
      },
    },

    /* -------------------------------------------------------------------------
     * 4. Unresolved Modules
     * ------------------------------------------------------------------------- */
    {
      name: "not-to-unresolvable",
      severity: "error",
      comment: "Cannot resolve this module import. Verify module spelling and path.",
      from: {},
      to: {
        couldNotResolve: true,
      },
    },
  ],
  options: {
    doNotFollow: {
      path: "node_modules",
    },
    exclude: {
      path: [
        "(^|/)node_modules",
        "(^|/)dist",
        "(^|/)build",
        "(^|/)\\.git",
        "(^|/)graphify-out",
        "(^|/)hardware/firmware",
      ],
    },
    tsPreCompilationDeps: false,
    enhancedResolveOptions: {
      exportsFields: ["exports"],
      conditionNames: ["import", "require", "node", "default"],
      extensions: [".js", ".jsx", ".mjs", ".cjs", ".json"],
    },
    reporterOptions: {
      dot: {
        collapsePattern: "node_modules/[^/]+",
      },
    },
  },
};
