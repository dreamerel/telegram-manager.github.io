# Telegram Manager

Веб-приложение для управления Telegram аккаунтами.

## Структура проекта

```
├── public/
│   └── assets/
│       └── telegram_icon.svg
├── src/
│   ├── api/
│   │   └── accounts.js
│   ├── components/
│   │   ├── AccountManager.jsx
│   │   ├── Auth.jsx
│   │   ├── ChatList.jsx
│   │   ├── ChatWindow.jsx
│   │   └── MessageManager.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── theme.js
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## Пошаговая инструкция по развертыванию

### 1. Подготовка репозитория

1. Создайте новый репозиторий на GitHub:
   - Перейдите на [GitHub](https://github.com)
   - Нажмите "New repository"
   - Назовите репозиторий "telegram-manager"
   - Выберите "Public"
   - Нажмите "Create repository"

2. Инициализируйте Git в локальном проекте:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[ваш-username]/telegram-manager.git
   git push -u origin main
   ```

### 2. Настройка для production

1. Убедитесь, что в package.json указан правильный homepage:
   ```json
   {
     "homepage": "https://[ваш-username].github.io/telegram-manager"
   }
   ```

2. Создайте production сборку:
   ```bash
   npm run build
   ```

### 3. Настройка GitHub Pages

1. В репозитории перейдите в Settings > Pages
2. В разделе "Source" выберите "Deploy from a branch"
3. Выберите ветку "main" и папку "/docs"
4. Нажмите "Save"

### 4. Проверка развертывания

1. Дождитесь завершения развертывания в разделе Actions вашего репозитория
2. Проверьте доступность сайта по адресу https://[ваш-username].github.io/telegram-manager
3. Если сайт не открывается сразу:
   - Подождите 5-10 минут для обновления настроек GitHub Pages
   - Убедитесь, что GitHub Pages показывает статус "Your site is published"

### Важные замечания

- При изменении кода выполните:
  ```bash
  git add .
  git commit -m "Update"
  git push
  ```
- GitHub Pages автоматически обновит сайт после успешного push в ветку main