# OrderFlow: Architecture under Change

Тижневий модуль з Software Architecture. Ви працюєте з наявною business application, яка успішно працювала кілька років, але тепер повільніше реагує на зміни.

Проаналізуйте надану документацію, оберіть, що варто змінити, визначте, що варто залишити без змін, і обґрунтуйте рішення через trade-offs, risks та metrics.

## Система

OrderFlow є modular monolith з модулями Orders, Payments, Inventory, Notifications і Reporting. Усі модулі працюють в одному process, використовують спільну in-memory database та deploy разом.

Система навмисно має кілька нерівних boundaries. Частина dependencies може бути виправданою, частина збільшує cost of change. Код працює, тому не розглядайте будь-який coupling як помилку автоматично.

Спочатку ознайомтеся з матеріалами:

- [Поточна система](docs/system-overview.md)
- [Business context](docs/business-context.md)
- [Engineering metrics](docs/engineering-metrics.md)
- [Change scenarios](docs/change-scenarios.md)
- [Analysis tools](docs/analysis-tools.md)
- [Architecture proposal](docs/architecture-proposal.md)
- [AI-assisted delivery та Time to Market](docs/ai-time-to-market.md)

`docs/architecture-proposal.md` містить proposal, а не requirement. Його можна прийняти, змінити частково або відхилити.

## Запуск

Потрібен Node.js 20 або новіший. Runtime dependencies відсутні.

```bash
npm test
npm run demo
npm start
```

Після `npm start` API доступний на `http://localhost:3000`.

Приклад checkout:

```bash
curl -X POST http://localhost:3000/checkout \
  -H "content-type: application/json" \
  -d '{"customer":{"name":"Ada","email":"ada@example.com"},"items":[{"sku":"KEYBOARD","quantity":1}],"paymentToken":"tok_demo_4242"}'
```

Fake payment provider має configurable latency та failure rate. Значення environment variables описані у `src/config.js`.

## Architecture decision task

Запропонуйте evolution plan, а не rewrite з нуля. Дайте аргументовані відповіді:

1. Які проблеми справді видно в поточній architecture?
2. Які architectural characteristics мають найвищий пріоритет?
3. Які dependencies найбільше збільшують cost of change?
4. Які boundaries варто залишити без змін?
5. Які boundaries варто змінити?
6. Чи залишається modular monolith доречним?
7. Чи має якийсь module стати independently deployable?
8. Який module, якщо такий є, варто виділити першим?
9. Які trade-offs і нові failure modes створює ваш варіант?
10. Які evidence підтримують рішення?

Не пропонуйте зміни лише тому, що pattern популярний. Пов'яжіть рішення з business context, code, change scenarios та metrics.

## Architectural principles

Оберіть 3-5 принципів, релевантних вашому аналізу:

- Information Hiding
- High Cohesion
- Low Coupling
- Explicit Contracts
- Ownership
- Dependency Direction
- Local Reasoning
- Design for Change
- Fitness Functions
- Trade-offs

Поясніть, де обрані принципи зараз дотримані або порушені та як proposal змінює ситуацію. Не потрібно механічно згадувати весь список.

## Architectural characteristics

Визначте й розставте за пріоритетом характеристики, важливі для OrderFlow. Наприклад: deployability, availability, reliability, maintainability, modifiability, scalability, performance і resilience.

Відповідь, у якій усі характеристики однаково важливі, не показує пріоритетів. Поясніть, чим ви готові поступитися заради важливіших outcomes.

## Risk analysis

Опишіть щонайменше 3 architecture-related risks. Для кожного вкажіть:

```text
Risk
Probability
Business Impact
Expected Risk Cost
Mitigation
```

Використайте формулу з `docs/analysis-tools.md`. Значення можуть бути приблизними, якщо assumptions явні та defendable.

## Change cost analysis

Оберіть хоча б одну типову зміну, наприклад додавання payment rule або нового notification experiment. Для поточної та запропонованої architecture оцініть:

- modules touched;
- engineering hours;
- coordination overhead;
- testing scope;
- deployment scope.

Фінансова точність не потрібна. Покажіть, чому оцінка відрізняється між варіантами.

## Metrics та Fitness Functions

Запропонуйте щонайменше 3 measurable indicators, які покажуть, чи допомагає рішення. Для кожного поясніть, чому metric важлива та в якому напрямі має змінитися.

Можливі metrics:

- Change Lead Time;
- Deployment Frequency;
- Change Failure Rate;
- Mean Time to Restore;
- Rollback Rate;
- Deployment Duration;
- Modules Changed per Feature;
- Average PR Size;
- Production Incidents.

Приклад цілі:

```text
Modules Changed per Feature: 4.3 -> target below 2.5
```

Додайте принаймні одну lightweight architecture fitness function. Це може бути automated test, dependency rule, metric threshold або review rule.

Приклади формату:

```text
Зміна notification template не потребує змін в Orders.
Payment provider implementation доступна лише через Payments boundary.
Checkout p95 latency не перевищує погоджений threshold.
```

## AI та Time to Market, рівень 90+

Stakeholders очікують, що AI coding tools скоротять major-feature Time to Market з 4 місяців до 1 місяця. Виконайте аналіз з `docs/ai-time-to-market.md` і запропонуйте власний реалістичний target або target range:

1. Перевірте assumptions.
2. Покажіть окрему оцінку для кожного delivery stage.
3. Визначте stages, які AI реально може прискорити.
4. Знайдіть remaining bottlenecks.
5. Розділіть architecture constraints і process constraints.
6. Поясніть, чи реалістичний 1 місяць.
7. Запропонуйте інший target, якщо він краще відповідає evidence.
8. Опишіть prerequisites, investments та risks для свого target.
9. Визначте нові risks від більшого implementation throughput.

Прийнятними є різні результати, зокрема 1, 2, 3 місяці або аргументований range. Розгляньте local optimization, end-to-end throughput, uncertainty та migration cost. Наперед визначеної правильної тривалості немає.

## Deliverables

Подайте короткий architecture analysis. Великий звіт не потрібен.

### 1. Current architecture

Одна читабельна diagram.

### 2. Proposed architecture

Друга diagram з major components, dependencies, deployment boundaries, external providers та важливими synchronous або asynchronous interactions.

Можна використати Mermaid, PlantUML, draw.io або інший читабельний формат. UML purity не оцінюється.

### 3. Decision summary

Використайте компактну структуру:

```text
Problem
Evidence
Decision
Trade-offs
How we will measure success
```

### 4. Principles

3-5 принципів з коротким обґрунтуванням.

### 5. Risk analysis

Щонайменше 3 risks з Probability, Impact, Expected Risk Cost і Mitigation.

### 6. Metrics

Щонайменше 3 metrics і одна Fitness Function.

### 7. AI та Time to Market

Обов'язково для оцінки 90 або вище.

## Optional implementation

Можна реалізувати одну невелику architecture improvement як додаткове evidence:

- payment adapter;
- видалення прямого доступу до чужого repository;
- decoupling Notifications;
- dependency test;
- інше невелике покращення boundary.

Повний rewrite не потрібен. Implementation не замінює architecture reasoning.

## Assessment

### 60 балів

- Зрозуміла current architecture.
- Є читабельні current і proposed diagrams.
- Визначені базові проблеми.
- Запропонована coherent architecture change.

### 75 балів

Усе для 60 балів, а також:

- responsibilities та dependencies пояснені;
- architectural characteristics мають пріоритет;
- principles застосовані до конкретних місць;
- зміни пов'язані з requirements і scenarios.

### 90 балів

Усе для 75 балів, а також:

- визначені основні cost-of-change drivers;
- виконано risk analysis;
- використані metrics або cost formulas;
- пояснено хоча б один non-obvious trade-off;
- проаналізовано AI Time to Market scenario;
- розрізнено implementation speed та end-to-end delivery speed;
- запропонований Time to Market target можна захистити через stage estimates та evidence.

### 100 балів

Усе для 90 балів і strong architectural judgment:

- хоча б один правдоподібний proposal явно відхилено або змінено;
- пояснено, що свідомо не змінюється;
- пояснено, чому складніша architecture може бути ще не виправдана;
- визначено risk, який створює власне рішення;
- metrics або Fitness Functions можуть спростувати assumptions;
- названо умови майбутньої architecture evolution;
- пояснено, що має змінитися для реального місячного delivery cycle.

Якість reasoning важливіша за згоду з конкретним proposal.
