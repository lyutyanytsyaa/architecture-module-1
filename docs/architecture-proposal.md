# Proposal: перехід до independently deployable services

Статус документа: **proposal для обговорення, не затверджена requirement**.

## Context

OrderFlow має п'ять business modules з різною частотою змін і різними runtime characteristics. Спільний deployment збільшує coordination cost, а failures зовнішніх providers можуть впливати на checkout flow.

## Proposed direction

Пропонується поступово перетворити Orders, Payments, Inventory, Notifications і Reporting на independently deployable services. Кожен service матиме власний API, власний release lifecycle і data ownership. Checkout orchestration залишиться окремою capability або перейде до Orders після уточнення ownership.

Перехід варто виконувати поетапно:

1. Зафіксувати contracts між поточними modules.
2. Визначити data ownership та прибрати прямий доступ до чужих repositories.
3. Додати asynchronous messaging для flows, яким не потрібна негайна відповідь.
4. Виділяти services лише після перевірки operational readiness.

## Очікувані переваги

- Independent deployment для частих змін.
- Окреме scaling для Reporting і checkout workloads.
- Fault isolation для зовнішніх providers.
- Чіткіше ownership між teams.
- Менший deployment blast radius.

## Costs та risks

- Network failures і partial failure scenarios замість in-process calls.
- Складніші observability, testing, deployment та incident response.
- Eventual consistency і потреба в idempotency.
- Вища infrastructure та operational cost.
- Можливе дублювання data й contracts.
- Для малої команди service ownership може стати додатковим coordination burden.

## Open questions

- Які modules справді потребують independent deployment зараз?
- Чи виправдовує Reporting traffic окреме data store?
- Хто відповідає за end-to-end checkout reliability?
- Які consistency guarantees потрібні Orders, Payments та Inventory?
- Чи достатньо спершу покращити boundaries всередині modular monolith?

Цей proposal є одним із варіантів. Його можна прийняти, змінити частково або відхилити на основі evidence та trade-offs.
