# Інструменти оцінювання

Ці формули допомагають зробити припущення явними. Вони не є точними accounting models.

## Change Cost

```text
Change Cost = Engineering Hours × Hourly Cost
```

За потреби окремо оцініть implementation, coordination, testing і release work. Для порівняння варіантів можна використати однакову умовну Hourly Cost.

## Expected Risk Cost

```text
Expected Risk Cost = Probability of Failure × Business Impact
```

Probability має стосуватися визначеного періоду або події. Business Impact може враховувати втрачений revenue, recovery work, support cost та reputation impact.

## Architecture Tax

```text
Architecture Tax = Current Change Cost - Baseline Change Cost
```

Baseline треба назвати. Ним може бути попередній період, схожий change у кращій boundary або обґрунтована ціль.

## Приклад формату

```text
Change: додати payment rule
Current Change Cost: 40 h × $50 = $2,000
Baseline Change Cost: 24 h × $50 = $1,200
Architecture Tax: $800
```

Числа можуть бути приблизними. Сильний аналіз пояснює джерело оцінки, uncertainty і те, як рішення можна перевірити після впровадження.
