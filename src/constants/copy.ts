export const copy = {
  onboarding: {
    welcome: {
      title: 'GlycoCare',
      subtitle: 'Smart tracking for better blood sugar control.',
      cta: 'Get started',
    },
    diabetesType: {
      title: 'What type of diabetes\ndo you have?',
      options: {
        type1: {
          label: 'Type 1',
          description: 'Autoimmune — your body produces little or no insulin.',
        },
        type2: {
          label: 'Type 2',
          description: "Insulin resistance — your body doesn't use insulin effectively.",
        },
        prediabetes: {
          label: 'Prediabetes',
          description: 'Blood sugar is elevated but not yet in the Type 2 range.',
        },
        gestational: {
          label: 'Gestational',
          description: 'Developed during pregnancy, usually resolves after birth.',
        },
      },
      cta: 'Next',
    },
    carbLimit: {
      title: 'Daily carb limit',
      subtitle: 'Net grams of carbohydrates per day.',
      recommendedLabel: 'Recommended for your diabetes type',
      disclaimer: 'Confirm this target with your doctor or dietitian.',
      cta: 'Next',
    },
    complete: {
      title: "You're all set",
      subtitle: "Here's a summary of your profile.",
      diabetesTypeLabel: 'Diabetes type',
      carbLimitLabel: 'Daily carb limit',
      carbLimitUnit: 'g / day',
      cta: 'Start scanning',
    },
  },
  scanner: {
    permissionTitle: 'Camera access needed',
    permissionSubtitle: 'GlycoCare uses your camera to scan food barcodes.',
    permissionCta: 'Allow camera',
    aimingLabel: 'Point at a barcode',
  },
  foodSearch: {
    placeholder: 'Search for a food…',
    emptyState: 'No results found',
    error: 'Something went wrong. Check your connection and try again.',
    carbsLabel: 'per 100g',
  },
  tracker: {
    dayLabel: 'Today',
    netCarbsLabel: 'net carbs today',
    remainingLabel: 'remaining',
    overLimitLabel: 'over limit',
    emptyState: 'Nothing logged yet. Scan a food or search by name to get started.',
    deleteLabel: 'Delete',
  },
  foodResult: {
    loading: 'Looking up product…',
    notFoundTitle: 'Product not found',
    notFoundSubtitle: 'This barcode isn\'t in the Open Food Facts database.',
    errorTitle: 'Could not load product',
    errorSubtitle: 'Check your connection and try again.',
    carbLabel: 'Carbs per 100g',
    servingLabel: 'Serving size',
    logCta: 'Log it',
    dismissCta: 'Not consuming',
    scanAgainCta: 'Scan again',
    retryCta: 'Retry',
    dailyRemainingLabel: 'Daily carb remaining',
    servingSingular: 'serving',
    servingPlural: 'servings',
    netCarbsLabel: 'net carbs',
    servingSizeEstimated: 'serving size estimated at 100g',
  },
} as const;
