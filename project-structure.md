# Структура проєкту test_tech-stack-io

Тести відкривають сайт із `playwright.config.ts`: `https://traineeautomation.azurewebsites.net`.

Папки `node_modules`, `playwright-report` і `test-results` на заліку можна не розповідати: їх створюють `npm install` і сам прогін тестів.

Коротка фраза: тест каже «що перевірити», крок каже «як це зробити», локатор каже «де елемент», DTO каже «якої форми дані».

## Корінь

| Файл або папка | За що відповідає |
|---|---|
| `.git` | Локальна історія Git: коміти, гілки, зв'язок із GitHub. |
| `.github` | Файли, які читає GitHub. У нас це запуск тестів у Actions. |
| `.cursor` | Налаштування Cursor для цього проєкту: правила і навчальні скіли. |
| `automation` | Увесь тестовий код: тести, кроки, локатори, DTO. |
| `package.json` | Назва проєкту, скрипти `npm test`, `npm run lint` і список залежностей. |
| `package-lock.json` | Зафіксовані точні версії пакетів, щоб у всіх стояло те саме. |
| `playwright.config.ts` | Налаштування Playwright: сайт, `data-testid`, скріншот при падінні, проєкти `chromium`, `api`, `mobile`. |
| `tsconfig.json` | Налаштування TypeScript: сувора перевірка типів і модулі для Node. |
| `eslint.config.mjs` | Правила ESLint. Для файлів у `automation` увімкнені правила Playwright. |
| `.prettierrc` | Правила форматування коду Prettier. |
| `.prettierignore` | Файли, які Prettier не чіпає. |
| `.gitignore` | Що Git не комітить: `node_modules`, звіти, `.env`. |
| `.env` | Секрети для локального запуску: `LOGIN`, `PASSWORD` і адмінські дані. У Git не йде. |
| `.env.example` | Зразок `.env` без справжніх паролів, щоб було видно, які змінні потрібні. |
| `README.md` | Коротка інструкція: стек, установка, як запустити тести. |

`chromium` і `mobile` беруть тести з `automation/test`, крім папки `api`. Проєкт `api` запускає лише `automation/test/api`.

## .github/workflows

| Файл | За що відповідає |
|---|---|
| `playwright.yml` | Головний workflow на push і pull request: викликає desktop, mobile і окремо API. |
| `desktop.yml` | Десктопні тести: `npx playwright test --project=chromium --grep @desktop`. |
| `mobile.yml` | Мобільні тести: `--project=mobile --grep @mobile`. |
| `schedule.yml` | Нічний прогін усіх тестів з тегом `@regression`. |

## .cursor

| Файл або папка | За що відповідає |
|---|---|
| `mcp.json` | Підключення MCP-сервера Playwright у Cursor. |
| `rules/automation-qa-mentor.mdc` | Постійне правило: як ментор пояснює код і як у проєкті шукати елементи. |
| `skills/typescript-mentor/SKILL.md` | Навчальний скіл про TypeScript. |
| `skills/oop-mentor/SKILL.md` | Навчальний скіл про класи й об'єкти. |
| `skills/dto-mentor/SKILL.md` | Навчальний скіл про DTO. |
| `skills/api-testing-mentor/SKILL.md` | Навчальний скіл про API-тести. |

Правило локаторів: `identifiers/components` тримає лише `data-testid` для `getByTestId`, `identifiers/pages` тримає лише XPath для `locator`.

## automation

Чотири шари:

- `test` пише, що перевіряємо.
- `steps` робить кілька дій підряд: логін, заповнення форми, перевірка таблиці.
- `identifiers` зберігає, як знайти елемент на сторінці.
- `dto` описує форму даних: поля логіну, користувача, адреси, відповіді API.

```text
automation/
  dto/
  identifiers/
  steps/
  test/
```

### automation/dto

| Файл | За що відповідає |
|---|---|
| `user/user.dto.ts` | Логін і пароль для входу. |
| `user/add.user.dto.ts` | Дані форми створення користувача на UI: ім'я, рік рядком, стать текстом. |
| `user/user.request.dto.ts` | Тіло API-запиту користувача: рік числом, стать як `0`, `1` або `2`. |
| `user/user.response.dto.ts` | Відповідь API про користувача і тип `Gender`. |
| `address/address.dto.ts` | Адреса для форми і для API-запиту: вулиця, місто, штат, індекс. |
| `address/address.response.dto.ts` | Відповідь API про адресу: ті самі поля плюс `id` і `created`. |
| `auth/auth.response.dto.ts` | Відповідь логіну: `accessToken` і `tokenType`. |

### automation/identifiers/components

Спільні `data-testid`. Їх використовують різні екрани.

| Файл | За що відповідає |
|---|---|
| `button.ts` | Кнопки: Home, Logout, Add User, Add Address, Create, Update, Delete, Yes. |
| `header.ts` | Корінь шапки, `data-testid="header"`. |
| `input.ts` | Поля логіну і форми користувача, плюс повідомлення про помилку. |
| `table.ts` | Таблиці Users і Addresses, комірки і лічильники Total. |

### automation/identifiers/pages

XPath сторінок. `login` — екран до входу. `main` — екрани після входу.

| Файл | За що відповідає |
|---|---|
| `login/loginPage.ts` | Заголовок Sign in і кнопка входу. |
| `main/home/homePage.ts` | Головна: заголовок, меню, колонки, рядки Users і Addresses. |
| `main/user/addUserPage.ts` | Форма створення користувача. |
| `main/user/editUserPage.ts` | Форма редагування користувача. |
| `main/user/deleteUserPage.ts` | Підтвердження видалення користувача. |
| `main/address/addAddressPage.ts` | Форма створення адреси. |
| `main/address/deleteAddressPage.ts` | Підтвердження видалення адреси. |

### automation/steps

Крок збирає кілька кліків і перевірок в один метод, щоб тест читався як сценарій.

| Файл | За що відповідає |
|---|---|
| `ui/login/loginSteps.ts` | Відкрити логін, увійти звичайним користувачем або адміном, перевірити помилки порожніх полів. |
| `ui/main/homeSteps.ts` | Головна: заголовок, шапка, таблиці, відкрити форму, вийти. |
| `ui/main/userSteps.ts` | Додати, відредагувати, видалити користувача і перевірити рядок у таблиці. |
| `ui/main/addressSteps.ts` | Додати і видалити адресу і перевірити рядок у таблиці. |
| `api/authApiSteps.ts` | Отримати токен звичайного користувача і адміна. |
| `api/userApiSteps.ts` | Запити користувачів: список, створення, читання, оновлення, видалення. |
| `api/addressApiSteps.ts` | Ті самі дії для адрес. |

### automation/test

| Файл | За що відповідає |
|---|---|
| `ui/login/login.test.ts` | Вхід, вихід і обов'язкові поля логіну. Теги `@desktop`, `@mobile`, `@regression`. |
| `ui/main/home.test.ts` | Головна після входу: заголовок, меню, обидві таблиці, відкриття форм. |
| `ui/main/user.test.ts` | Створення, редагування і видалення користувача в UI під адміном. |
| `ui/main/address.test.ts` | Створення і видалення адреси в UI під адміном. |
| `api/auth.test.ts` | Логін з правильними даними повертає токен. |
| `api/user.test.ts` | Список користувачів, відмова без токена і CRUD. |
| `api/address.test.ts` | Те саме для адрес, включно з відмовою видалити без прав адміна. |
| `hybrid/hybrid.test.ts` | Користувача або адресу створюють через API і перевіряють у UI, або змінюють у UI і перевіряють через API. |
