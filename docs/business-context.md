# Business context

OrderFlow працює три роки й обробляє продажі техніки. Checkout прямо впливає на revenue: коли він недоступний або повільний, частина покупців не завершує замовлення.

За останній рік бізнес виріс, а product roadmap став щільнішим:

- Payments змінюється частіше через нові fraud rules, способи оплати та вимоги finance team.
- Marketing і product team запускають 2-3 експерименти з notification templates на тиждень.
- Reporting використовують finance, operations і product analytics. Кількість запитів та обсяг історії зростають.
- Inventory consistency залишається важливою. Duplicate reservation може спричинити overselling або неправильне повернення товару.
- Checkout availability має більший пріоритет, ніж миттєва доставка confirmation email.
- Teams повідомляють, що проста зміна дедалі частіше зачіпає кілька модулів і потребує спільного планування.
- Один deployment calendar для всіх модулів створює чергу, а rollback повертає назад увесь release.

## Обмеження

- Команда має 8 engineers і 2 QA engineers.
- Окремої platform team немає.
- Поточне навантаження обслуговує один application instance з резервним instance.
- Бюджет на infrastructure може зрости, якщо очікуваний результат можна виміряти.
- Повна зупинка feature delivery для rewrite неприйнятна.

Business не вимагає конкретного architecture style. Очікується evolution plan, який зменшить delivery friction і не створить неприйнятного ризику для checkout.
