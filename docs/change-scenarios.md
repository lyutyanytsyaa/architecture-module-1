# Change scenarios

Використайте ці scenarios як вхідні дані для оцінювання architecture options.

## Scenario A: часті зміни Notifications

Marketing хоче змінювати templates, subject lines та segmentation rules 2-3 рази на тиждень. Більшість змін не змінює checkout rules. Експерименти іноді треба швидко вимикати.

## Scenario B: другий payment provider

Команда розглядає другого provider для іншого регіону й fallback під час outage. Provider має інший error model та підтримує asynchronous confirmation для частини платежів. Остаточне рішення про контракт ще не прийнято.

## Scenario C: зростання Reporting

Reporting traffic може зрости у 8-10 разів протягом наступних 12 місяців. Finance просить довші date ranges, а product analytics хоче частіші запити. Дані з точністю до кількох хвилин прийнятні для більшості reports.

## Scenario D: Inventory idempotency

Inventory rules чутливі до duplicate operations. Повторний reserve або release не має двічі змінювати stock. Бізнес готовий прийняти коротку затримку, але не систематичний overselling.

## Scenario E: Checkout availability

Checkout availability прямо впливає на revenue. Під час пікового навантаження payment provider може відповідати 2-3 секунди або бути недоступним. Confirmation email не визначає успіх платежу, але customer має отримати його згодом.

## Scenario F: нове discount rule

Product team планує discount для певних payment methods і наборів товарів. Очікується, що правила змінюватимуться щомісяця. Finance хоче бачити discount у Reporting, а customer має бачити правильну суму до списання коштів.

Для кожного важливого scenario визначте stimulus, response, affected components і measurable response measure. Не припускайте, що кожен scenario потребує нового service.
