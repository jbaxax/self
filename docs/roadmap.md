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
- [ ] Infra: `profileService.updateProfile()` — UPDATE de `public.users`
- [ ] Application: hook `useUpdateProfile` (mutation de TanStack Query)
- [ ] Presentation: schema Zod del perfil
- [ ] Presentation: `ProfileForm` (weight, height, age, sex, activityLevel, goal)
- [ ] Presentation: mostrar el desglose (bmr / tdee / target) en la UI
- [ ] Onboarding: forzar completar el perfil antes del dashboard
- [ ] Tests (vitest) del dominio de cálculo

## Rebanada 2 — Catálogo de alimentos (`foods`)

Leer y buscar alimentos del sistema + propios, y crear alimentos personales.

- [ ] Infra: `dietService` — listar / buscar foods (sistema + propios)
- [ ] Application: hook `useFoods` (query)
- [ ] Presentation: búsqueda de alimentos
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
