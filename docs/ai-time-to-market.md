# AI-assisted delivery та Time to Market

Stakeholder statement:

> Поточний Time to Market для major feature становить приблизно 4 місяці. З AI coding tools developers мають працювати приблизно в 4 рази швидше. Тому major-feature Time to Market має скоротитися з 4 місяців до 1 місяця.

Це припущення треба проаналізувати, а не автоматично прийняти чи відхилити.

## Поточна delivery pipeline model

```text
Analysis:        20 days
Implementation:  40 days
Integration:     25 days
Validation:      25 days
Release:         10 days
Total:          120 days
```

Це спрощені середні значення. Частина роботи може виконуватися паралельно, але historical planning використовує суму як наближення end-to-end Time to Market.

## Hypothetical AI acceleration

Stakeholders пропонують таку зміну:

```text
Implementation: 40 days -> 10 days
```

Для Analysis, Integration, Validation і Release автоматичне скорочення не задано. Команда вже помічає, що більші PR довше чекають на review, а зміни в кількох modules потребують більше integration testing.

## Дані для planning discussion

Команда зібрала попередні оцінки можливих improvements. Це не гарантоване скорочення строків і не затверджений plan.

| Stage | Поточне значення | Можливий improvement | Умова або trade-off |
| --- | ---: | ---: | --- |
| Analysis | 20 days | скорочення на 2-5 days | AI-assisted research, швидший prototype та доступність stakeholders |
| Implementation | 40 days | до 10-20 days | результат залежить від complexity, review capacity та якості generated code |
| Integration | 25 days | скорочення на 4-10 days | explicit contracts, менші changesets, contract tests або кращі module boundaries |
| Validation | 25 days | скорочення на 5-10 days | додатковий test environment, automation та parallel testing |
| Release | 10 days | скорочення на 2-6 days | частіші release windows, менший deployment scope або independent deployment |

Improvements потребують різних investments. Наприклад, новий test environment має infrastructure cost, independent deployment додає operational complexity, а contract tests спершу треба створити й підтримувати. Деякі improvements можуть overlap, тому їх не можна автоматично підсумовувати як незалежні.

Ці ranges навмисно допускають різні прогнози. Student може обґрунтувати conservative target, aggressive target або target range. Сильний прогноз враховує prerequisites, uncertainty, одноразову migration cost і те, коли benefit стане доступним.

## Доступні спостереження

- Developers використовують AI для scaffolding, tests, refactoring suggestions і documentation drafts.
- Security та finance-related changes досі потребують human review.
- Test environment один, черга на integration testing іноді становить 3-5 днів.
- Release відбувається у спільному deployment window двічі на тиждень.
- В одному release знаходяться зміни всіх modules.
- Немає baseline для defect rate коду, створеного з AI assistance.
- Architecture knowledge розподілене нерівномірно, тому review часто чекає на двох senior engineers.

## Завдання для рівня 90+

Проаналізуйте stakeholder expectation і запропонуйте власний реалістичний target або target range для major-feature Time to Market. Це не обов'язково має бути 1 місяць. Покажіть розрахунок для кожного delivery stage та дайте відповідь на питання:

1. Який Time to Market ви прогнозуєте після запропонованих improvements?
2. Які assumptions лежать в основі кожної оцінки stage?
3. Які stages AI реально може прискорити в цьому контексті?
4. Які bottlenecks залишаться або перемістяться?
5. Які architecture constraints обмежують throughput?
6. Які process constraints не вирішуються генерацією коду?
7. Чи реалістична ціль 1 місяць за наявних умов?
8. Що саме має змінитися, щоб ціль стала реалістичною?
9. Які нові risks виникають зі зростанням implementation throughput?
10. Як виміряти фактичний вплив AI, не покладаючись лише на LOC або кількість PR?
11. Які evidence змусять вас переглянути прогноз після першого major feature?

Можна використати модель:

```text
TTM = Analysis + Implementation + Integration + Validation + Release
```

Висновок може підтримати або заперечити ціль 1 місяць та запропонувати інший target. Оцінюється evidence, assumptions, trade-offs і system-wide reasoning, а не збіг з наперед визначеним числом.
