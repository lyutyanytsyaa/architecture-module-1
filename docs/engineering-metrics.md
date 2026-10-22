# Engineering metrics

Нижче наведено агреговані дані за два шестимісячні періоди.

| Metric | 6 місяців тому | Зараз |
| --- | ---: | ---: |
| Release Frequency | 5 на тиждень | 2 на тиждень |
| Change Lead Time | 2 дні | 6 днів |
| Average PR Size | 180 LOC | 520 LOC |
| Modules Changed per Feature | 1,7 | 4,3 |
| Rollback Rate | 2% | 9% |
| Deployment Duration | 8 min | 27 min |
| Production Incidents | 1 на місяць | 5 на місяць |
| Mean Time to Restore | 35 min | 95 min |

## Додаткові спостереження

- За останній квартал 48% feature PR торкалися Orders і Payments одночасно.
- 37% змін notification templates вимагали повного regression test checkout flow.
- Reporting traffic виріс приблизно втричі за рік.
- Два останні інциденти почалися під час payment provider latency spikes.
- Частина зростання Deployment Duration пов'язана з розширенням test suite та ручними approval кроками.

Це спрощені навчальні дані, а не повний observability dataset. Кореляція не доводить, що причиною кожної зміни є architecture. Під час аналізу відокремлюйте факти, припущення та причинні зв'язки, які ще треба перевірити.
