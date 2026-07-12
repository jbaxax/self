# Self — Roadmap

App personal de desarrollo integral. Primer módulo: **Diet** (estilo Fitia).

El módulo de dieta se construye en **rebanadas verticales**: cada una toca
`domain → infrastructure → application → presentation` y funciona punta a punta
antes de pasar a la siguiente.

## Estado general

- [x] Auth (login / register)
- [ ] Módulo Diet — en construcción (rebanada 1)

---

## Rebanada 1 — Perfil + meta calórica

Completar el perfil físico del usuario y calcular su meta calórica diaria
(Mifflin-St Jeor → BMR → TDEE → ajuste por objetivo).

- [x] DB: columna `sex` (enum `sex_type`) en `users`
- [x] Dominio: tipos `CalorieInput` / `CalorieResult` (`domain/types.ts`)
- [x] Dominio: cálculo BMR / TDEE / target + orquestadora (`domain/calories.ts`)
- [x] Infra: `updateUser()` en `authService.server.ts` — UPDATE de `public.users`
- [x] Infra: `getProfile()` en `authService.server.ts` — SELECT de `public.users`
- [x] Application: hook `useUpdateProfile` (mutation de TanStack Query)
- [x] Presentation: `profileSchema` con `z.coerce.number()` + `z.enum()`
- [x] Presentation: `ProfileForm` (weight, height, age, sex, activityLevel, goal)
- [x] Onboarding: `dashboard/layout.tsx` redirige a `/profile` si `weight` es null
- [x] Onboarding: `/profile` movido fuera de `(dashboard)` — sin sidebar, sin loop infinito
- [ ] Presentation: mostrar el desglose (bmr / tdee / target) en la UI
- [ ] Tests (vitest) del dominio de cálculo

## Rebanada 2 — Catálogo de alimentos (`foods`)

Leer y buscar alimentos del sistema + propios, y crear alimentos personales.

- [x] Infra: `dietService` — `searchFoods(query)` + `createFood(body)`
- [x] Application: hook `useFoods(query)` (query) + `useCreateFood()` (mutation)
- [x] Dominio: tipo `FoodInput` (`domain/types.ts`)
- [x] Shared: hook `useDebounce<T>(value, delay)` (`hooks/useDebounce.ts`) — genérico, con cleanup vía `clearTimeout`
- [x] Application: `enabled: !!query.trim()` en `useFoods` — evita fetch con búsqueda vacía o solo espacios
- [x] Fix: `dietService.ts` tenía typo `"use serve"` en vez de `"use server"` — las Server Actions no eran invocables desde client, corregido
- [x] Presentation: `FoodSearch` (`features/diet/presentation/components/FoodSearch.tsx`) — `search` (useState) + `useDebounce` + `useFoods(debouncedSearch)`, estados loading/error/vacío/lista con `<ul><li>`
- [ ] Montar `FoodSearch` en una página y probar end-to-end en el browser
- [ ] Presentation: crear alimento personal (insert con `user_id`)

## Rebanada 3 — Registro diario (`meal_entries` + dashboard)

La pantalla principal: registrar comidas por tipo y fecha, ver totales vs meta.

- [ ] Infra: `dietService` — CRUD de `meal_entries` por fecha
- [ ] Application: hooks `useDailyLog`, `useAddMealEntry`
- [ ] Presentation: `DayOverview`, `MealSection`, `FoodSearchModal`
- [ ] Presentation: totales del día vs meta calórica
- [ ] Presentation: selección de fecha (`log_date`)

---

## Transversal / pendientes

- [ ] Setup de testing (vitest)
- [ ] Conocer el trigger que crea la fila en `public.users` al registrarse
- [ ] Migraciones versionadas (`db pull`, requiere Docker)
