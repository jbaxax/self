SELF/
├── app/                          ← solo rutas Next.js
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   └── (dashboard)/
│       ├── layout.tsx
│       └── diet/page.tsx
│
├── features/
│   └── diet/
│       ├── domain/
│       │   └── types.ts          ← interfaces TypeScript puras
│       ├── application/
│       │   ├── useDailyLog.ts    ← TanStack Query hooks
│       │   └── useAddMealEntry.ts
│       ├── infrastructure/
│       │   ├── dietService.ts    ← llamadas a Supabase
│       │   └── adapters/
│       │       ├── mealEntryAdapter.ts
│       │       └── foodAdapter.ts
│       └── presentation/
│           ├── components/
│           │   ├── DayOverview.tsx
│           │   ├── MealSection.tsx
│           │   └── FoodSearchModal.tsx
│           └── schemas/
│               └── mealEntrySchema.ts
│
├── components/                   ← componentes globales reutilizables
├── hooks/                        ← hooks globales
└── lib/
└── supabase/
└── client.ts             ← ya creado